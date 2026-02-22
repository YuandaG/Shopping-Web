import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  ChevronDown,
  List,
  ShoppingCart,
  ChevronLeft,
  History,
} from 'lucide-react';
import { useStore, groupItemsByCategory } from '../store/useStore';
import { ShoppingItemComponent } from '../components/ShoppingItem';
import { ExportButton } from '../components/ExportButton';
import type { ShoppingItem, CategoryId } from '../types';
import { INGREDIENT_CATEGORIES } from '../types';

export function ShoppingListPage() {
  const navigate = useNavigate();
  const {
    shoppingLists,
    currentListId,
    setCurrentList,
    createShoppingList,
    deleteShoppingList,
    addCustomItem,
    updateItem,
    deleteItem,
    toggleItemChecked,
    clearCheckedItems,
  } = useStore();

  const [showAddItem, setShowAddItem] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    category: 'other' as CategoryId,
  });
  const [expandedCategories, setExpandedCategories] = useState<Set<CategoryId>>(
    new Set(INGREDIENT_CATEGORIES.map((c) => c.id))
  );

  const currentList = shoppingLists.find((l) => l.id === currentListId);

  // 按类别分组购物清单项
  const groupedItems = currentList
    ? groupItemsByCategory(currentList.items)
    : new Map();

  // 统计
  const totalItems = currentList?.items.length || 0;
  const checkedItems = currentList?.items.filter((i) => i.checked).length || 0;

  const handleCreateList = () => {
    if (!newListName.trim()) return;

    createShoppingList({ name: newListName.trim() });
    setNewListName('');
    setShowNewListForm(false);
  };

  const handleAddItem = () => {
    if (!currentListId || !newItem.name.trim()) return;

    addCustomItem(currentListId, {
      name: newItem.name.trim(),
      quantity: newItem.quantity.trim(),
      category: newItem.category,
      checked: false,
    });

    setNewItem({ name: '', quantity: '', category: 'other' });
    setShowAddItem(false);
  };

  const toggleCategory = (categoryId: CategoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 头部 */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {showHistory ? (
                <>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    历史清单
                  </h1>
                </>
              ) : (
                <>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    购物清单
                  </h1>
                </>
              )}
            </div>

            {!showHistory && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistory(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
                  title="历史清单"
                >
                  <History className="w-5 h-5" />
                </button>
                {currentList && (
                  <ExportButton
                    listName={currentList.name}
                    items={currentList.items}
                  />
                )}
              </div>
            )}
          </div>

          {!showHistory && (
            <div className="flex items-center justify-between">
              {/* 当前清单选择 */}
              <div className="relative">
                <button
                  onClick={() => setShowListMenu(!showListMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <List className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentList?.name || '选择清单'}
                  </span>
                  {totalItems > 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({checkedItems}/{totalItems})
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showListMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowListMenu(false)}
                    />
                    <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-20">
                      <div className="max-h-64 overflow-y-auto">
                        {shoppingLists.map((list) => (
                          <button
                            key={list.id}
                            onClick={() => {
                              setCurrentList(list.id);
                              setShowListMenu(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                              list.id === currentListId
                                ? 'bg-blue-50 dark:bg-blue-900/30'
                                : ''
                            }`}
                          >
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {list.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {list.items.length} 项
                              </div>
                            </div>
                            {list.id === currentListId && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="border-t dark:border-gray-700">
                        <button
                          onClick={() => {
                            setShowNewListForm(true);
                            setShowListMenu(false);
                          }}
                          className="w-full px-4 py-3 text-left text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          新建清单
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 清除已购买 */}
              {checkedItems > 0 && (
                <button
                  onClick={() => {
                    if (currentListId && confirm('确定要清除所有已购买的项目吗？')) {
                      clearCheckedItems(currentListId);
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  清除已购买
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {showHistory ? (
          /* 历史清单 */
          <div className="space-y-3">
            {shoppingLists.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                还没有购物清单记录
              </div>
            ) : (
              shoppingLists.map((list) => (
                <div
                  key={list.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {list.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {list.items.filter((i) => i.checked).length}/
                        {list.items.length} 已购买
                      </span>
                      <button
                        onClick={() => {
                          setCurrentList(list.id);
                          setShowHistory(false);
                        }}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        查看
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('确定要删除这个清单吗？')) {
                            deleteShoppingList(list.id);
                          }
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    创建于 {new Date(list.createdAt).toLocaleString('zh-CN')}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : currentList ? (
          /* 当前清单 */
          <div className="space-y-4">
            {/* 添加项目 */}
            {showAddItem ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-12 gap-2 mb-3">
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    placeholder="物品名称"
                    className="col-span-5 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity: e.target.value })
                    }
                    placeholder="数量"
                    className="col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        category: e.target.value as CategoryId,
                      })
                    }
                    className="col-span-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {INGREDIENT_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddItem(false)}
                    className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAddItem}
                    disabled={!newItem.name.trim()}
                    className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    添加
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddItem(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                添加物品
              </button>
            )}

            {/* 按类别显示清单项 */}
            {INGREDIENT_CATEGORIES.map((category) => {
              const categoryItems: ShoppingItem[] = groupedItems.get(category.id) || [];
              if (categoryItems.length === 0) return null;

              const isExpanded = expandedCategories.has(category.id);

              return (
                <div
                  key={category.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({categoryItems.filter((i) => i.checked).length}/
                        {categoryItems.length})
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isExpanded ? '' : '-rotate-90'
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2">
                      {categoryItems.map((item) => (
                        <ShoppingItemComponent
                          key={item.id}
                          item={item}
                          onToggle={() =>
                            toggleItemChecked(currentList.id, item.id)
                          }
                          onUpdate={(updates) =>
                            updateItem(currentList.id, item.id, updates)
                          }
                          onDelete={() => deleteItem(currentList.id, item.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 空状态 */}
            {currentList.items.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  清单是空的
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  从菜谱添加食材，或手动添加物品
                </p>
                <button
                  onClick={() => navigate('/recipes')}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  浏览菜谱
                </button>
              </div>
            )}
          </div>
        ) : (
          /* 无清单状态 */
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              还没有购物清单
            </p>
            <button
              onClick={() => setShowNewListForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              创建第一个清单
            </button>
          </div>
        )}
      </div>

      {/* 新建清单弹窗 */}
      {showNewListForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              新建购物清单
            </h3>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="清单名称，如：周末采购"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateList();
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewListForm(false);
                  setNewListName('');
                }}
                className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                取消
              </button>
              <button
                onClick={handleCreateList}
                disabled={!newListName.trim()}
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
