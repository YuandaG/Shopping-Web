import { useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, Settings, Cloud, ChefHat } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useLanguage } from '../i18n';

export function Home() {
  const navigate = useNavigate();
  const { recipes, shoppingLists, currentListId, settings } = useStore();
  const { t, language } = useLanguage();

  const currentList = shoppingLists.find((l) => l.id === currentListId);
  const totalItems = currentList?.items.length || 0;
  const checkedItems = currentList?.items.filter((i) => i.checked).length || 0;
  const isConfigured = settings.gistId && settings.gistToken;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero - Full width on desktop */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-lg lg:max-w-4xl mx-auto px-4 py-12 lg:py-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <ChefHat className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">{t.home.title}</h1>
              <p className="text-gray-400 lg:text-lg">{t.home.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg lg:max-w-4xl mx-auto px-4 py-6 lg:py-8">
        {/* Quick Stats - 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-6 lg:mb-8">
          <button
            onClick={() => navigate('/recipes')}
            className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-left hover:shadow-lg hover:scale-[1.02] hover:border-blue-200 dark:hover:border-blue-800 border-2 border-transparent transition-all duration-200 cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{recipes.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t.home.recipes}</div>
          </button>

          <button
            onClick={() => navigate('/shopping')}
            className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-left hover:shadow-lg hover:scale-[1.02] hover:border-green-200 dark:hover:border-green-800 border-2 border-transparent transition-all duration-200 cursor-pointer"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{checkedItems}/{totalItems}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t.home.shoppingList}</div>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-left hover:shadow-lg hover:scale-[1.02] hover:border-emerald-200 dark:hover:border-emerald-800 border-2 border-transparent transition-all duration-200 cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${
              isConfigured ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <Cloud className={`w-6 h-6 ${isConfigured ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white mt-3">
              {isConfigured ? (language === 'zh' ? '已连接' : 'Connected') : (language === 'zh' ? '未连接' : 'Not connected')}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t.home.cloudSync}</div>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-left hover:shadow-lg hover:scale-[1.02] hover:border-purple-200 dark:hover:border-purple-800 border-2 border-transparent transition-all duration-200 cursor-pointer"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white mt-3">{t.nav.settings}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{t.settings.backup}</div>
          </button>
        </div>

        {/* Tips - 2 columns on desktop */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
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

          {/* Quick Actions on Desktop */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {language === 'zh' ? '快速操作' : 'Quick Actions'}
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/recipes')}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {language === 'zh' ? '浏览菜谱' : 'Browse Recipes'}
              </button>
              <button
                onClick={() => navigate('/shopping')}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {language === 'zh' ? '查看清单' : 'View List'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
