import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, X, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeForm } from '../components/RecipeForm';
import type { Recipe, CreateRecipeInput } from '../types';

export function Recipes() {
  const navigate = useNavigate();
  const {
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
    currentListId,
    addIngredientsToList,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // 筛选菜谱
  const filteredRecipes = recipes
    .filter((recipe) => {
      if (showFavorites && !recipe.isFavorite) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          recipe.name.toLowerCase().includes(query) ||
          recipe.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      // 收藏的排在前面
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      // 按更新时间排序
      return b.updatedAt - a.updatedAt;
    });

  const handleCreateRecipe = (input: CreateRecipeInput) => {
    addRecipe(input);
    setShowForm(false);
  };

  const handleUpdateRecipe = (input: CreateRecipeInput) => {
    if (editingRecipe) {
      updateRecipe(editingRecipe.id, input);
      setEditingRecipe(null);
    }
  };

  const handleDeleteRecipe = (id: string) => {
    deleteRecipe(id);
    setDeleteConfirm(null);
  };

  const handleAddToList = (recipe: Recipe) => {
    if (!currentListId) {
      alert('请先创建或选择一个购物清单');
      navigate('/shopping');
      return;
    }

    addIngredientsToList({
      recipeId: recipe.id,
      recipeName: recipe.name,
      ingredients: recipe.ingredients,
    });

    // 显示提示
    alert(`已将 "${recipe.name}" 的食材添加到购物清单`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              我的菜谱
            </h1>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              新建菜谱
            </button>
          </div>

          {/* 搜索和筛选 */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索菜谱、食材或标签..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`p-2 rounded-lg transition-colors ${
                showFavorites
                  ? 'bg-red-100 text-red-500 dark:bg-red-900/50'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${showFavorites ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 菜谱列表 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery || showFavorites
                ? '没有找到匹配的菜谱'
                : '还没有菜谱，点击上方按钮创建第一个吧'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onEdit={() => setEditingRecipe(recipe)}
                onDelete={() => setDeleteConfirm(recipe.id)}
                onAddToList={() => handleAddToList(recipe)}
                onToggleFavorite={() => toggleFavorite(recipe.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 新建/编辑菜谱弹窗 */}
      {(showForm || editingRecipe) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl">
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingRecipe ? '编辑菜谱' : '新建菜谱'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingRecipe(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <RecipeForm
                recipe={editingRecipe || undefined}
                onSubmit={editingRecipe ? handleUpdateRecipe : handleCreateRecipe}
                onCancel={() => {
                  setShowForm(false);
                  setEditingRecipe(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              确认删除
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              确定要删除这个菜谱吗？此操作无法撤销。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDeleteRecipe(deleteConfirm)}
                className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
