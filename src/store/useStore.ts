import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  Recipe,
  ShoppingList,
  ShoppingItem,
  AppSettings,
  CreateRecipeInput,
  UpdateRecipeInput,
  CreateShoppingListInput,
  AddIngredientsToListInput,
  GistData,
  CategoryId,
} from '../types';

interface AppState {
  // 菜谱数据
  recipes: Recipe[];

  // 购物清单数据
  shoppingLists: ShoppingList[];
  currentListId: string | null;

  // 设置
  settings: AppSettings;

  // 菜谱操作
  addRecipe: (input: CreateRecipeInput) => Recipe;
  updateRecipe: (id: string, input: UpdateRecipeInput) => void;
  deleteRecipe: (id: string) => void;
  toggleFavorite: (id: string) => void;

  // 购物清单操作
  createShoppingList: (input: CreateShoppingListInput) => ShoppingList;
  updateShoppingList: (id: string, updates: Partial<ShoppingList>) => void;
  deleteShoppingList: (id: string) => void;
  setCurrentList: (id: string | null) => void;

  // 购物清单项操作
  addIngredientsToList: (input: AddIngredientsToListInput) => void;
  addCustomItem: (listId: string, item: Omit<ShoppingItem, 'id'>) => void;
  updateItem: (listId: string, itemId: string, updates: Partial<ShoppingItem>) => void;
  deleteItem: (listId: string, itemId: string) => void;
  toggleItemChecked: (listId: string, itemId: string) => void;
  clearCheckedItems: (listId: string) => void;

  // 数据同步
  importData: (data: GistData) => void;
  exportData: () => GistData;

  // 设置操作
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      recipes: [],
      shoppingLists: [],
      currentListId: null,
      settings: {
        ingredientMerges: [],
      },

      // 菜谱操作
      addRecipe: (input) => {
        const now = Date.now();
        const recipe: Recipe = {
          id: uuidv4(),
          name: input.name,
          description: input.description,
          ingredients: input.ingredients.map((ing) => ({
            ...ing,
            id: uuidv4(),
          })),
          tags: input.tags || [],
          isFavorite: false,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ recipes: [...state.recipes, recipe] }));
        return recipe;
      },

      updateRecipe: (id, input) => {
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === id
              ? {
                  ...recipe,
                  ...input,
                  ingredients: input.ingredients
                    ? input.ingredients.map((ing) => ({
                        ...ing,
                        id: uuidv4(),
                      }))
                    : recipe.ingredients,
                  updatedAt: Date.now(),
                }
              : recipe
          ),
        }));
      },

      deleteRecipe: (id) => {
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== id),
        }));
      },

      toggleFavorite: (id) => {
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === id
              ? { ...recipe, isFavorite: !recipe.isFavorite, updatedAt: Date.now() }
              : recipe
          ),
        }));
      },

      // 购物清单操作
      createShoppingList: (input) => {
        const now = Date.now();
        const list: ShoppingList = {
          id: uuidv4(),
          name: input.name,
          items: input.items?.map((item) => ({ ...item, id: uuidv4() })) || [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          shoppingLists: [...state.shoppingLists, list],
          currentListId: list.id,
        }));
        return list;
      },

      updateShoppingList: (id, updates) => {
        set((state) => ({
          shoppingLists: state.shoppingLists.map((list) =>
            list.id === id ? { ...list, ...updates, updatedAt: Date.now() } : list
          ),
        }));
      },

      deleteShoppingList: (id) => {
        set((state) => {
          const newLists = state.shoppingLists.filter((list) => list.id !== id);
          return {
            shoppingLists: newLists,
            currentListId: state.currentListId === id
              ? newLists[0]?.id || null
              : state.currentListId,
          };
        });
      },

      setCurrentList: (id) => {
        set({ currentListId: id });
      },

      // 购物清单项操作
      addIngredientsToList: (input) => {
        const { recipeId, recipeName, ingredients } = input;
        set((state) => {
          const listId = state.currentListId;
          if (!listId) return state;

          const currentList = state.shoppingLists.find((l) => l.id === listId);
          if (!currentList) return state;

          // 创建新项目的 Map，用于聚合
          const itemMap = new Map<string, ShoppingItem>();

          // 先添加现有项目
          currentList.items.forEach((item) => {
            itemMap.set(item.name.toLowerCase(), item);
          });

          // 添加或合并新食材
          ingredients.forEach((ing) => {
            const key = ing.name.toLowerCase();
            const existing = itemMap.get(key);

            if (existing) {
              // 尝试合并数量
              existing.quantity = mergeQuantities(existing.quantity, ing.quantity);
              if (!existing.fromRecipe?.includes(recipeName)) {
                existing.fromRecipe = existing.fromRecipe
                  ? `${existing.fromRecipe}, ${recipeName}`
                  : recipeName;
              }
            } else {
              itemMap.set(key, {
                id: uuidv4(),
                name: ing.name,
                quantity: ing.quantity,
                checked: false,
                category: ing.category,
                fromRecipe: recipeName,
                fromRecipeId: recipeId,
              });
            }
          });

          return {
            shoppingLists: state.shoppingLists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    items: Array.from(itemMap.values()),
                    updatedAt: Date.now(),
                  }
                : list
            ),
          };
        });
      },

      addCustomItem: (listId, item) => {
        set((state) => ({
          shoppingLists: state.shoppingLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: [...list.items, { ...item, id: uuidv4() }],
                  updatedAt: Date.now(),
                }
              : list
          ),
        }));
      },

      updateItem: (listId, itemId, updates) => {
        set((state) => ({
          shoppingLists: state.shoppingLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.map((item) =>
                    item.id === itemId ? { ...item, ...updates } : item
                  ),
                  updatedAt: Date.now(),
                }
              : list
          ),
        }));
      },

      deleteItem: (listId, itemId) => {
        set((state) => ({
          shoppingLists: state.shoppingLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.filter((item) => item.id !== itemId),
                  updatedAt: Date.now(),
                }
              : list
          ),
        }));
      },

      toggleItemChecked: (listId, itemId) => {
        set((state) => ({
          shoppingLists: state.shoppingLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.map((item) =>
                    item.id === itemId ? { ...item, checked: !item.checked } : item
                  ),
                  updatedAt: Date.now(),
                }
              : list
          ),
        }));
      },

      clearCheckedItems: (listId) => {
        set((state) => ({
          shoppingLists: state.shoppingLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.filter((item) => !item.checked),
                  updatedAt: Date.now(),
                }
              : list
          ),
        }));
      },

      // 数据同步
      importData: (data) => {
        const currentSettings = get().settings;
        set({
          recipes: data.recipes,
          shoppingLists: data.shoppingLists,
          currentListId: data.currentListId,
          // 完全保留本地的 gistId 和 gistToken，不覆盖
          settings: {
            ingredientMerges: data.settings?.ingredientMerges || [],
            gistId: currentSettings.gistId,
            gistToken: currentSettings.gistToken,
            lastSync: Date.now(),
          },
        });
      },

      exportData: () => {
        const state = get();
        return {
          recipes: state.recipes,
          shoppingLists: state.shoppingLists,
          currentListId: state.currentListId,
          // 不要共享 gistToken，每个用户使用自己的 token
          settings: {
            ingredientMerges: state.settings.ingredientMerges,
            gistId: state.settings.gistId,
            // 不包含 gistToken
            lastSync: state.settings.lastSync,
          },
        };
      },

      // 设置操作
      updateSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }));
      },
    }),
    {
      name: 'shopping-web-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// 数量合并辅助函数
function mergeQuantities(q1: string, q2: string): string {
  // 尝试解析数字和单位
  const parseQuantity = (q: string): { value: number; unit: string } | null => {
    const match = q.trim().match(/^([\d.]+)\s*(.*)$/);
    if (match) {
      return { value: parseFloat(match[1]), unit: match[2].trim() };
    }
    return null;
  };

  const parsed1 = parseQuantity(q1);
  const parsed2 = parseQuantity(q2);

  // 如果都能解析且单位相同，则合并
  if (parsed1 && parsed2 && parsed1.unit === parsed2.unit) {
    const total = parsed1.value + parsed2.value;
    return parsed1.unit ? `${total}${parsed1.unit}` : `${total}`;
  }

  // 无法合并时保留原文
  return `${q1}, ${q2}`;
}

// 按类别分组购物清单项
export function groupItemsByCategory(items: ShoppingItem[]): Map<CategoryId, ShoppingItem[]> {
  const grouped = new Map<CategoryId, ShoppingItem[]>();
  items.forEach((item) => {
    const categoryItems = grouped.get(item.category) || [];
    categoryItems.push(item);
    grouped.set(item.category, categoryItems);
  });
  return grouped;
}
