import { NavLink } from 'react-router-dom';
import { Home, BookOpen, ShoppingCart, Calendar, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useLanguage } from '../i18n';

export function Navigation() {
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
    { path: '/meal-plan', icon: Calendar, label: t.nav.mealPlan },
    { path: '/settings', icon: Settings, label: t.nav.settings },
  ];

  return (
    // Hidden on desktop (lg+), shown on mobile - floating pill style
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 px-2 py-2 max-w-md mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center justify-center w-12 h-10 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 active:scale-90'
                }`
              }
              title={item.label}
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
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
