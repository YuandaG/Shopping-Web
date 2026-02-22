import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, ShoppingCart, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useLanguage } from '../i18n';

export function Navigation() {
  const location = useLocation();
  const { shoppingLists, currentListId } = useStore();
  const { t } = useLanguage();

  const currentList = shoppingLists.find((l) => l.id === currentListId);
  const uncheckedCount = currentList?.items.filter((i) => !i.checked).length || 0;

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

  if (location.pathname === '/') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 z-40 safe-area-bottom">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-4 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-blue-500'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="absolute top-0.5 right-2 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
