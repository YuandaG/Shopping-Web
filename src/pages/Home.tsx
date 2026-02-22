import { useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, Settings, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Home() {
  const navigate = useNavigate();
  const { recipes, shoppingLists, currentListId } = useStore();

  const currentList = shoppingLists.find((l) => l.id === currentListId);
  const totalItems = currentList?.items.length || 0;
  const checkedItems = currentList?.items.filter((i) => i.checked).length || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">购物清单助手</h1>
          <p className="text-blue-100">
            管理菜谱，生成购物清单，轻松采购
          </p>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="max-w-4xl mx-auto px-4 py-6 -mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* 菜谱入口 */}
          <button
            onClick={() => navigate('/recipes')}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center"
              >
                <BookOpen className="w-6 h-6 text-orange-500" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              我的菜谱
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {recipes.length} 个菜谱
            </p>
          </button>

          {/* 购物清单入口 */}
          <button
            onClick={() => navigate('/shopping')}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="flex items-start justify-between">
              <div
                className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center"
              >
                <ShoppingCart className="w-6 h-6 text-green-500" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              购物清单
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {currentList ? `${currentList.name} (${checkedItems}/${totalItems})` : '暂无清单'}
            </p>
          </button>
        </div>

        {/* 设置入口 */}
        <button
          onClick={() => navigate('/settings')}
          className="mt-4 w-full bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4"
        >
          <div
            className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-gray-500" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white">
            设置
          </span>
          <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
        </button>

        {/* 使用说明 */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            如何使用
          </h3>
          <ol className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </span>
              <span>创建菜谱并添加所需食材</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </span>
              <span>选择菜谱，将食材添加到购物清单</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </span>
              <span>导出到 Apple Reminders，在超市轻松勾选</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </span>
              <span>通过 GitHub Gist 与家人朋友共享数据</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
