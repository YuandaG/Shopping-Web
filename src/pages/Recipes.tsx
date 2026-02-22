import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, X, Heart, ChefHat } from 'lucide-react';
import { useStore } from '../store/useStore';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeForm } from '../components/RecipeForm';
import type { Recipe, CreateRecipeInput } from '../types';

export function Recipes() {
  const navigate = useNavigate();
  const { recipes, addRecipe, updateRecipe, deleteRecipe, toggleFavorite, currentListId, addIngredientsToList } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
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
      alert('请先创建购物清单');
      navigate('/shopping');
      return;
    }
    addIngredientsToList({ recipeId: recipe.id, recipeName: recipe.name, ingredients: recipe.ingredients });
    alert(`已添加 "${recipe.name}" 的食材`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">我的菜谱</h1>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              新建
            </button>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索菜谱..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`p-2.5 rounded-xl transition-colors ${
                showFavorites ? 'bg-red-100 text-red-500 dark:bg-red-900/30' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
              }`}
            >
              <Heart className={`w-5 h-5 ${showFavorites ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery || showFavorites ? '没有找到匹配的菜谱' : '还没有菜谱'}
            </p>
            {!searchQuery && !showFavorites && (
              <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
                创建第一个菜谱
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
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

      {/* Form Modal */}
      {(showForm || editingRecipe) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
          <div className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-xl">
            <div className="sticky top-0 bg-white dark:bg-gray-900 px-4 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingRecipe ? '编辑菜谱' : '新建菜谱'}
              </h2>
              <button
                onClick={() => { setShowForm(false); setEditingRecipe(null); }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <RecipeForm
                recipe={editingRecipe || undefined}
                onSubmit={editingRecipe ? handleUpdateRecipe : handleCreateRecipe}
                onCancel={() => { setShowForm(false); setEditingRecipe(null); }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">删除菜谱？</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">此操作无法撤销</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl">
                取消
              </button>
              <button onClick={() => handleDeleteRecipe(deleteConfirm)} className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600">
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
