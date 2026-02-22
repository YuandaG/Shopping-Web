import { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import type { Recipe, CategoryId, CreateRecipeInput } from '../types';
import { INGREDIENT_CATEGORIES } from '../types';
import { useLanguage } from '../i18n';
import { v4 as uuidv4 } from 'uuid';

interface RecipeFormProps {
  recipe?: Recipe;
  onSubmit: (input: CreateRecipeInput) => void;
  onCancel: () => void;
}

interface IngredientInput {
  id: string;
  name: string;
  quantity: string;
  category: CategoryId;
}

export function RecipeForm({ recipe, onSubmit, onCancel }: RecipeFormProps) {
  const { t, language } = useLanguage();
  const [name, setName] = useState(recipe?.name || '');
  const [description, setDescription] = useState(recipe?.description || '');
  const [ingredients, setIngredients] = useState<IngredientInput[]>(
    recipe?.ingredients.map((ing) => ({ ...ing })) || [
      { id: uuidv4(), name: '', quantity: '', category: 'other' },
    ]
  );
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(recipe?.tags || []);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: uuidv4(), name: '', quantity: '', category: 'other' },
    ]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    }
  };

  const updateIngredient = (id: string, updates: Partial<IngredientInput>) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, ...updates } : ing
      )
    );
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validIngredients = ingredients.filter((ing) => ing.name.trim());

    if (!name.trim()) {
      alert(t.recipeForm.nameRequired);
      return;
    }

    if (validIngredients.length === 0) {
      alert(t.recipeForm.ingredientRequired);
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      ingredients: validIngredients.map((ing) => ({
        name: ing.name.trim(),
        quantity: ing.quantity.trim(),
        category: ing.category,
      })),
      tags,
    });
  };

  // Get category name based on language
  const getCategoryName = (categoryId: string) => {
    const categoryMap: Record<string, keyof typeof t.categories> = {
      meat: 'meat',
      vegetable: 'vegetable',
      seafood: 'seafood',
      condiment: 'condiment',
      grain: 'grain',
      dairy: 'dairy',
      drink: 'drink',
      fruit: 'fruit',
      frozen: 'frozen',
      snack: 'snack',
      other: 'other',
    };
    return t.categories[categoryMap[categoryId] || 'other'];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 基本信息 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t.recipeForm.name} *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.recipeForm.namePlaceholder}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t.recipeForm.description}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.recipeForm.descriptionPlaceholder}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
        />
      </div>

      {/* 食材列表 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t.recipeForm.ingredients} *
        </label>
        <div className="space-y-3">
          {ingredients.map((ing) => (
            <div key={ing.id} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-12 gap-2">
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => updateIngredient(ing.id, { name: e.target.value })}
                  placeholder={t.recipeForm.ingredientName}
                  className="col-span-5 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />
                <input
                  type="text"
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(ing.id, { quantity: e.target.value })}
                  placeholder={t.recipeForm.quantity}
                  className="col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />
                <div className="col-span-4 relative">
                  <select
                    value={ing.category}
                    onChange={(e) => updateIngredient(ing.id, { category: e.target.value as CategoryId })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm appearance-none"
                  >
                    {INGREDIENT_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {getCategoryName(cat.id)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeIngredient(ing.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                disabled={ingredients.length === 1}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addIngredient}
          className="mt-3 flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
        >
          <Plus className="w-4 h-4" />
          {t.recipeForm.addIngredient}
        </button>
      </div>

      {/* 标签 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t.recipeForm.tags}
        </label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-blue-800 dark:hover:text-blue-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder={t.recipeForm.tagPlaceholder}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            {language === 'zh' ? '添加' : 'Add'}
          </button>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {t.recipeForm.cancel}
        </button>
        <button
          type="submit"
          className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          {recipe ? t.recipeForm.save : t.recipeForm.createBtn}
        </button>
      </div>
    </form>
  );
}
