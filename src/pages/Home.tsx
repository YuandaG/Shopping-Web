import { useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, Settings, ChevronRight, Cloud } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useLanguage } from '../i18n';

export function Home() {
  const navigate = useNavigate();
  const { recipes, shoppingLists, currentListId, settings } = useStore();
  const { t } = useLanguage();

  const currentList = shoppingLists.find((l) => l.id === currentListId);
  const totalItems = currentList?.items.length || 0;
  const checkedItems = currentList?.items.filter((i) => i.checked).length || 0;
  const isConfigured = settings.gistId && settings.gistToken;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-lg mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">{t.home.title}</h1>
          <p className="text-gray-400">{t.home.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6 -mt-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => navigate('/recipes')}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-left hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{recipes.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t.home.recipes}</div>
          </button>

          <button
            onClick={() => navigate('/shopping')}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-left hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-3">
              <ShoppingCart className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{checkedItems}/{totalItems}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t.home.shoppingList}</div>
          </button>
        </div>

        {/* Sync Status */}
        <button
          onClick={() => navigate('/settings')}
          className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow mb-6"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isConfigured ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <Cloud className={`w-5 h-5 ${isConfigured ? 'text-green-500' : 'text-gray-400'}`} />
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium text-gray-900 dark:text-white">{t.home.cloudSync}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isConfigured ? t.home.configured : t.home.notConfigured}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Settings */}
        <button
          onClick={() => navigate('/settings')}
          className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium text-gray-900 dark:text-white">{t.nav.settings}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t.settings.backup}, {t.settings.import}</div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Tips */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t.home.tips}</h3>
          <div className="space-y-3">
            {[
              { num: 1, text: t.home.tip1 },
              { num: 2, text: t.home.tip2 },
              { num: 3, text: t.home.tip3 },
              { num: 4, text: t.home.tip4 },
            ].map((item) => (
              <div key={item.num} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-500">
                  {item.num}
                </span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
