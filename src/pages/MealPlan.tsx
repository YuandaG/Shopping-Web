import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, X, ShoppingCart, Utensils, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useLanguage } from '../i18n';
import { v4 as uuidv4 } from 'uuid';
import type { MealItem, MealType, DayMealPlan, Ingredient, CategoryId } from '../types';
import { MEAL_TYPES } from '../types';

// Get Monday of the week containing the given date
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  return new Date(d.setDate(diff));
}

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get week days starting from Monday
function getWeekDays(weekStart: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    days.push(day);
  }
  return days;
}

export function MealPlanPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { recipes, mealPlan, updateMealPlan, addRecipe, addIngredientsToList, currentListId, createShoppingList, setCurrentList } = useStore();

  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date()));
  const [showRecipeSelector, setShowRecipeSelector] = useState<{ date: string; mealType: MealType } | null>(null);
  const [showCustomDish, setShowCustomDish] = useState<{ date: string; mealType: MealType } | null>(null);
  const [customDishName, setCustomDishName] = useState('');
  const [customIngredients, setCustomIngredients] = useState<Omit<Ingredient, 'id'>[]>([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '', category: 'other' as CategoryId });
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const weekDays = useMemo(() => getWeekDays(currentWeekStart), [currentWeekStart]);

  // Get or create day plan for a specific date
  const getDayPlan = (date: string): DayMealPlan => {
    const existing = mealPlan?.days.find(d => d.date === date);
    if (existing) return existing;
    return {
      date,
      meals: { breakfast: [], lunch: [], dinner: [] }
    };
  };

  // Update a specific meal slot
  const updateMealSlot = (date: string, mealType: MealType, items: MealItem[]) => {
    const currentDays = mealPlan?.days || [];
    const dayIndex = currentDays.findIndex(d => d.date === date);

    let newDays: DayMealPlan[];
    if (dayIndex >= 0) {
      newDays = currentDays.map((day, i) =>
        i === dayIndex
          ? { ...day, meals: { ...day.meals, [mealType]: items } }
          : day
      );
    } else {
      const newDay: DayMealPlan = {
        date,
        meals: { breakfast: [], lunch: [], dinner: [] }
      };
      newDay.meals[mealType] = items;
      newDays = [...currentDays, newDay];
    }

    updateMealPlan({
      weekStartDate: formatDate(currentWeekStart),
      days: newDays,
    });
  };

  // Add recipe to meal slot
  const addRecipeToMeal = (recipeId: string) => {
    if (!showRecipeSelector) return;
    const { date, mealType } = showRecipeSelector;
    const dayPlan = getDayPlan(date);
    const newItem: MealItem = {
      id: uuidv4(),
      type: 'recipe',
      recipeId,
    };
    updateMealSlot(date, mealType, [...dayPlan.meals[mealType], newItem]);
    setShowRecipeSelector(null);
  };

  // Add custom dish to meal slot
  const addCustomDishToMeal = (saveAsRecipe: boolean) => {
    if (!showCustomDish || !customDishName.trim()) return;
    const { date, mealType } = showCustomDish;
    const dayPlan = getDayPlan(date);

    const newItem: MealItem = {
      id: uuidv4(),
      type: 'custom',
      customName: customDishName.trim(),
      customIngredients: customIngredients.length > 0 ? customIngredients : undefined,
    };

    updateMealSlot(date, mealType, [...dayPlan.meals[mealType], newItem]);

    // Optionally save as recipe
    if (saveAsRecipe && customIngredients.length > 0) {
      addRecipe({
        name: customDishName.trim(),
        ingredients: customIngredients,
        tags: [],
      });
      setShowSuccess(language === 'zh' ? '已保存到菜谱' : 'Saved to recipes');
      setTimeout(() => setShowSuccess(null), 2000);
    }

    setShowCustomDish(null);
    setCustomDishName('');
    setCustomIngredients([]);
  };

  // Remove item from meal slot
  const removeMealItem = (date: string, mealType: MealType, itemId: string) => {
    const dayPlan = getDayPlan(date);
    updateMealSlot(date, mealType, dayPlan.meals[mealType].filter(item => item.id !== itemId));
  };

  // Get recipe by ID
  const getRecipe = (id: string) => recipes.find(r => r.id === id);

  // Generate shopping list from meal plan
  const generateShoppingList = () => {
    const allIngredients: { recipeId: string; recipeName: string; ingredients: Ingredient[] }[] = [];

    weekDays.forEach(day => {
      const dayPlan = getDayPlan(formatDate(day));
      (['breakfast', 'lunch', 'dinner'] as MealType[]).forEach(mealType => {
        dayPlan.meals[mealType].forEach(item => {
          if (item.type === 'recipe' && item.recipeId) {
            const recipe = getRecipe(item.recipeId);
            if (recipe) {
              allIngredients.push({
                recipeId: recipe.id,
                recipeName: recipe.name,
                ingredients: recipe.ingredients,
              });
            }
          } else if (item.type === 'custom' && item.customIngredients) {
            allIngredients.push({
              recipeId: '',
              recipeName: item.customName || 'Custom',
              ingredients: item.customIngredients.map((ing, idx) => ({
                ...ing,
                id: `custom-${idx}`,
              })),
            });
          }
        });
      });
    });

    if (allIngredients.length === 0) {
      setShowSuccess(language === 'zh' ? '请先添加一些菜品' : 'Add some dishes first');
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }

    // Create list if needed
    if (!currentListId) {
      const list = createShoppingList({
        name: language === 'zh' ? '本周购物清单' : 'Weekly Shopping List',
      });
      setCurrentList(list.id);
    }

    // Add all ingredients
    let count = 0;
    allIngredients.forEach(({ recipeId, recipeName, ingredients }) => {
      addIngredientsToList({ recipeId, recipeName, ingredients });
      count += ingredients.length;
    });

    setShowSuccess(language === 'zh'
      ? `已添加 ${count} 种食材到购物清单`
      : `Added ${count} ingredients to shopping list`);
    setTimeout(() => setShowSuccess(null), 2000);
  };

  // Navigate weeks
  const goToPrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const goToToday = () => {
    setCurrentWeekStart(getWeekStart(new Date()));
  };

  // Get day name
  const getDayName = (date: Date, index: number) => {
    const dayNames = [t.mealPlan.mon, t.mealPlan.tue, t.mealPlan.wed, t.mealPlan.thu, t.mealPlan.fri, t.mealPlan.sat, t.mealPlan.sun];
    const today = formatDate(new Date());
    const isToday = formatDate(date) === today;
    return isToday ? t.mealPlan.today : dayNames[index];
  };

  // Format week range
  const weekRange = () => {
    const end = new Date(currentWeekStart);
    end.setDate(end.getDate() + 6);
    const startStr = currentWeekStart.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  // Add ingredient to custom dish
  const addIngredientToCustom = () => {
    if (!newIngredient.name.trim()) return;
    setCustomIngredients([...customIngredients, { name: newIngredient.name, quantity: newIngredient.quantity, category: newIngredient.category }]);
    setNewIngredient({ name: '', quantity: '', category: 'other' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 lg:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors lg:hidden"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{t.mealPlan.title}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.mealPlan.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-4 bg-green-500 text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            {showSuccess}
          </div>
        )}

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
          <button
            onClick={goToPrevWeek}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-white">{weekRange()}</div>
            <button
              onClick={goToToday}
              className="text-xs text-blue-500 hover:text-blue-600"
            >
              {t.mealPlan.today}
            </button>
          </div>
          <button
            onClick={goToNextWeek}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Generate Shopping List Button */}
        <button
          onClick={generateShoppingList}
          className="w-full mb-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          {t.mealPlan.generateList}
        </button>

        {/* Week Grid */}
        <div className="space-y-3">
          {weekDays.map((day, dayIndex) => {
            const dateStr = formatDate(day);
            const dayPlan = getDayPlan(dateStr);
            const isToday = formatDate(new Date()) === dateStr;

            return (
              <div
                key={dateStr}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm ${isToday ? 'ring-2 ring-blue-500' : ''}`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {getDayName(day, dayIndex)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {day.getDate()}
                    </span>
                  </div>
                </div>

                {/* Meals */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {MEAL_TYPES.map(mealType => {
                    const items = dayPlan.meals[mealType.id];
                    const mealLabel = mealType.id === 'breakfast' ? t.mealPlan.breakfast
                      : mealType.id === 'lunch' ? t.mealPlan.lunch
                      : t.mealPlan.dinner;

                    return (
                      <div key={mealType.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="flex items-center gap-1 mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                          <span>{mealType.icon}</span>
                          <span>{mealLabel}</span>
                        </div>

                        {/* Meal Items */}
                        <div className="space-y-2">
                          {items.map(item => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between bg-white dark:bg-gray-600 rounded-lg px-2 py-1.5 text-sm"
                            >
                              <span className="truncate text-gray-900 dark:text-white">
                                {item.type === 'recipe' && item.recipeId
                                  ? getRecipe(item.recipeId)?.name || 'Unknown'
                                  : item.customName || 'Custom'}
                              </span>
                              <button
                                onClick={() => removeMealItem(dateStr, mealType.id, item.id)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}

                          {/* Add Button */}
                          <button
                            onClick={() => setShowRecipeSelector({ date: dateStr, mealType: mealType.id })}
                            className="w-full flex items-center justify-center gap-1 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            {t.mealPlan.noMeal}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recipe Selector Modal */}
      {showRecipeSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md max-h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.mealPlan.selectRecipe}</h2>
              <button
                onClick={() => setShowRecipeSelector(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {recipes.map(recipe => (
                <button
                  key={recipe.id}
                  onClick={() => addRecipeToMeal(recipe.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors text-left"
                >
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">{recipe.name}</span>
                </button>
              ))}

              {recipes.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  {language === 'zh' ? '还没有菜谱，请先创建' : 'No recipes yet, create some first'}
                </p>
              )}
            </div>

            {/* Add Custom Dish Button */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowRecipeSelector(null);
                  setShowCustomDish(showRecipeSelector);
                }}
                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl font-medium hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {t.mealPlan.addCustom}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Dish Modal */}
      {showCustomDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md max-h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.mealPlan.addCustom}</h2>
              <button
                onClick={() => {
                  setShowCustomDish(null);
                  setCustomDishName('');
                  setCustomIngredients([]);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Dish Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.mealPlan.customDishName}
                </label>
                <input
                  type="text"
                  value={customDishName}
                  onChange={(e) => setCustomDishName(e.target.value)}
                  placeholder={t.mealPlan.customDishNamePlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Ingredients (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.recipeForm.ingredients}
                </label>

                {/* Existing Ingredients */}
                {customIngredients.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {customIngredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                      >
                        {ing.name}
                        {ing.quantity && ` (${ing.quantity})`}
                        <button
                          onClick={() => setCustomIngredients(customIngredients.filter((_, i) => i !== idx))}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add Ingredient */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                    placeholder={t.recipeForm.ingredientName}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                  />
                  <input
                    type="text"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                    placeholder={t.recipeForm.quantity}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                  />
                  <button
                    onClick={addIngredientToCustom}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
              <button
                onClick={() => addCustomDishToMeal(false)}
                disabled={!customDishName.trim()}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors"
              >
                {language === 'zh' ? '添加' : 'Add'}
              </button>
              <button
                onClick={() => addCustomDishToMeal(true)}
                disabled={!customDishName.trim() || customIngredients.length === 0}
                className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {t.mealPlan.saveToRecipes}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
