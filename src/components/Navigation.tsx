import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, ShoppingCart, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Navigation() {
  const location = useLocation();
  const { shoppingLists, currentListId } = useStore();

  const currentList = shoppingLists.find((l) => l.id === currentListId);
  const uncheckedCount = currentList?.items.filter((i) => !i.checked).length || 0;

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/recipes', icon: BookOpen, label: '菜谱' },
    {
      path: '/shopping',
      icon: ShoppingCart,
      label: '清单',
      badge: uncheckedCount > 0 ? uncheckedCount : undefined,
    },
    { path: '/settings', icon: Settings, label: '设置' },
  ];

  // 在首页不显示导航栏
  if (location.pathname === '/') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-4 rounded-lg transition-colors relative ${
                  isActive
                    ? 'text-blue-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
              {item.badge && (
                <span className="absolute -top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
