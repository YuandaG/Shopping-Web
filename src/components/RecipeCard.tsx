import { useState } from 'react';
import { Heart, MoreVertical, Edit, Trash2, ShoppingCart } from 'lucide-react';
import type { Recipe } from '../types';
import { INGREDIENT_CATEGORIES } from '../types';
import { useLanguage } from '../i18n';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
  onAddToList: () => void;
  onToggleFavorite: () => void;
}

export function RecipeCard({
  recipe,
  onEdit,
  onDelete,
  onAddToList,
  onToggleFavorite,
}: RecipeCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { t, language } = useLanguage();

  const categoryIcons = new Map(
    INGREDIENT_CATEGORIES.map((c) => [c.id, c.icon])
  );

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.02] border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 cursor-pointer">
      {/* Recipe Image */}
      {recipe.image && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {recipe.name}
            </h3>
            {recipe.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {recipe.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  recipe.isFavorite
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-400'
                }`}
              />
            </button>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-20">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEdit();
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      {language === 'zh' ? '编辑' : 'Edit'}
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete();
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                      {language === 'zh' ? '删除' : 'Delete'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 食材列表 */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-1.5">
            {recipe.ingredients.slice(0, 5).map((ing) => (
              <span
                key={ing.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full"
              >
                <span>{categoryIcons.get(ing.category) || '📦'}</span>
                <span className="text-gray-700 dark:text-gray-300">{ing.name}</span>
              </span>
            ))}
            {recipe.ingredients.length > 5 && (
              <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                +{recipe.ingredients.length - 5} {language === 'zh' ? '更多' : 'more'}
              </span>
            )}
          </div>
        </div>

        {/* 标签 */}
        {recipe.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 添加到购物清单按钮 */}
        <button
          onClick={onAddToList}
          className="mt-4 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          {t.recipes.addToCart}
        </button>
      </div>
    </div>
  );
}
