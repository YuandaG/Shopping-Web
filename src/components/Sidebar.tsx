import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, ShoppingCart, Settings, ChefHat } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useLanguage } from '../i18n';

export function Sidebar() {
  const location = useLocation();
  const { shoppingLists, currentListId, settings } = useStore();
  const { t, language } = useLanguage();

  const currentList = shoppingLists.find((l) => l.id === currentListId);
  const uncheckedCount = currentList?.items.filter((i) => !i.checked).length || 0;
  const isConfigured = settings.gistId && settings.gistToken;

  const navItems = [
    { path: '/', icon: Home, label: t.nav.home },
    { path: '/recipes', icon: BookOpen, label: t.nav.recipes },
    {
      path: '/shopping',
      icon: ShoppingCart,
      label: t.nav.list,
      badge: uncheckedCount > 0 ? uncheckedCount : undefined,
    },
    { path: '/settings', icon: Settings, label: t.nav.settings },
  ];

  // Don't show sidebar on home page
  if (location.pathname === '/') return null;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white">
              {language === 'zh' ? '购物清单' : 'Shopping List'}
            </h1>
            <p className="text-xs text-gray-400">
              {isConfigured ? (language === 'zh' ? '已同步' : 'Synced') : (language === 'zh' ? '离线' : 'Offline')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto min-w-[24px] h-6 px-2 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="text-xs text-gray-400 text-center">
          Shopping List Assistant · v1.4.0
        </div>
      </div>
    </aside>
  );
}
