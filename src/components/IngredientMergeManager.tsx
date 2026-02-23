import { useState, useMemo } from 'react';
import { Plus, X, Merge, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useLanguage } from '../i18n';
import {
  findSimilarIngredients,
  createMerge,
} from '../utils/ingredientMerge';

interface IngredientMergeManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IngredientMergeManager({ isOpen, onClose }: IngredientMergeManagerProps) {
  const { t, language } = useLanguage();
  const { recipes, settings, updateSettings } = useStore();
  const [newCanonical, setNewCanonical] = useState('');
  const [newSourceInput, setNewSourceInput] = useState('');
  const [newSourceNames, setNewSourceNames] = useState<string[]>([]);

  // Get all ingredient names from recipes
  const allIngredientNames = useMemo(() => {
    const names: string[] = [];
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ing) => {
        names.push(ing.name);
      });
    });
    return names;
  }, [recipes]);

  // Find similar ingredients
  const similarPairs = useMemo(() => {
    return findSimilarIngredients(allIngredientNames, settings.ingredientMerges);
  }, [allIngredientNames, settings.ingredientMerges]);

  const addSourceName = () => {
    const trimmed = newSourceInput.trim();
    if (trimmed && !newSourceNames.includes(trimmed) && trimmed !== newCanonical) {
      setNewSourceNames([...newSourceNames, trimmed]);
      setNewSourceInput('');
    }
  };

  const removeSourceName = (name: string) => {
    setNewSourceNames(newSourceNames.filter((n) => n !== name));
  };

  const handleCreateMerge = () => {
    if (!newCanonical.trim()) return;

    const merge = createMerge(newCanonical.trim(), newSourceNames);
    updateSettings({
      ingredientMerges: [...settings.ingredientMerges, merge],
    });

    setNewCanonical('');
    setNewSourceNames([]);
  };

  const handleQuickMerge = (name1: string, name2: string) => {
    // Use the longer name as canonical
    const canonical = name1.length >= name2.length ? name1 : name2;
    const source = name1.length >= name2.length ? name2 : name1;

    const merge = createMerge(canonical, [source]);
    updateSettings({
      ingredientMerges: [...settings.ingredientMerges, merge],
    });
  };

  const deleteMerge = (index: number) => {
    const newMerges = settings.ingredientMerges.filter((_, i) => i !== index);
    updateSettings({ ingredientMerges: newMerges });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg max-h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
              <Merge className="w-5 h-5 text-teal-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.ingredientMerge.title}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.ingredientMerge.desc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Suggested Merges */}
          {similarPairs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {t.ingredientMerge.suggestedMerges}
                </h3>
              </div>
              <div className="space-y-2">
                {similarPairs.slice(0, 5).map((pair, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{pair.name1}</span>
                      <span className="text-gray-400">+</span>
                      <span className="text-gray-700 dark:text-gray-300">{pair.name2}</span>
                      <span className="text-xs text-yellow-600 dark:text-yellow-400 ml-2">
                        {Math.round(pair.similarity * 100)}% {t.ingredientMerge.similarity}
                      </span>
                    </div>
                    <button
                      onClick={() => handleQuickMerge(pair.name1, pair.name2)}
                      className="px-3 py-1 text-xs bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      <Merge className="w-3 h-3 inline mr-1" />
                      {language === 'zh' ? '合并' : 'Merge'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Existing Merges */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              {language === 'zh' ? '现有合并规则' : 'Existing merge rules'}
            </h3>
            {settings.ingredientMerges.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                {t.ingredientMerge.noMerges}
              </p>
            ) : (
              <div className="space-y-2">
                {settings.ingredientMerges.map((merge, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {merge.canonicalName}
                      </div>
                      {merge.sourceNames.length > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          ← {merge.sourceNames.join(', ')}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteMerge(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Merge */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              {t.ingredientMerge.addMerge}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t.ingredientMerge.canonicalName}
                </label>
                <input
                  type="text"
                  value={newCanonical}
                  onChange={(e) => setNewCanonical(e.target.value)}
                  placeholder={language === 'zh' ? '例如：鸡腿' : 'e.g., Chicken leg'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t.ingredientMerge.sourceNames}
                </label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {newSourceNames.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => removeSourceName(name)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSourceInput}
                    onChange={(e) => setNewSourceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSourceName();
                      }
                    }}
                    placeholder={t.ingredientMerge.sourceNamesPlaceholder}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addSourceName}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleCreateMerge}
                disabled={!newCanonical.trim()}
                className="w-full py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                {t.ingredientMerge.createMerge}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
