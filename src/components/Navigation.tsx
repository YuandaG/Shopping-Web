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
    <nav className="lg:hidden fixed left-4 right-4 z-40" style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-[1.5rem] shadow-lg shadow-black/5 dark:shadow-black/20 border border-gray-200/30 dark:border-gray-700/30 p-2 max-w-md mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/40'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 active:scale-90'
                }`
              }
              title={item.label}
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 1.75} />
                  {item.badge && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center shadow-sm">
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
