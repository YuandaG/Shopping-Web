// 食材分类
export const INGREDIENT_CATEGORIES = [
  { id: 'meat', name: '肉类', icon: '🥩' },
  { id: 'vegetable', name: '蔬菜', icon: '🥬' },
  { id: 'seafood', name: '海鲜', icon: '🦐' },
  { id: 'condiment', name: '调味料', icon: '🧂' },
  { id: 'grain', name: '主食', icon: '🍚' },
  { id: 'dairy', name: '乳制品', icon: '🥛' },
  { id: 'drink', name: '饮品', icon: '🥤' },
  { id: 'fruit', name: '水果', icon: '🍎' },
  { id: 'frozen', name: '冷冻食品', icon: '🧊' },
  { id: 'snack', name: '零食', icon: '🍿' },
  { id: 'other', name: '其他', icon: '📦' }
] as const;

export type CategoryId = typeof INGREDIENT_CATEGORIES[number]['id'];

// 食材
export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  category: CategoryId;
}

// 菜谱
export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  tags: string[];
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

// 购物清单项
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
  category: CategoryId;
  fromRecipe?: string; // 来源菜谱名称
  fromRecipeId?: string; // 来源菜谱 ID
}

// 购物清单
export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: number;
  updatedAt: number;
}

// 食材合并映射
export interface IngredientMerge {
  canonicalName: string;
  sourceNames: string[];
}

// 应用设置
export interface AppSettings {
  gistId?: string;
  gistToken?: string;
  lastSync?: number;
  ingredientMerges: IngredientMerge[];
}

// Gist 数据结构
export interface GistData {
  recipes: Recipe[];
  shoppingLists: ShoppingList[];
  currentListId: string | null;
  settings: AppSettings;
}

// 创建菜谱的输入类型
export interface CreateRecipeInput {
  name: string;
  description?: string;
  ingredients: Omit<Ingredient, 'id'>[];
  tags?: string[];
}

// 更新菜谱的输入类型
export interface UpdateRecipeInput extends Partial<CreateRecipeInput> {
  isFavorite?: boolean;
}

// 创建购物清单的输入类型
export interface CreateShoppingListInput {
  name: string;
  items?: Omit<ShoppingItem, 'id'>[];
}

// 添加食材到购物清单的输入
export interface AddIngredientsToListInput {
  recipeId: string;
  recipeName: string;
  ingredients: Ingredient[];
}
