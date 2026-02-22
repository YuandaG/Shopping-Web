import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  ChevronDown,
  ShoppingCart,
  ChevronLeft,
  History,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useStore, groupItemsByCategory } from '../store/useStore';
import { ExportButton } from '../components/ExportButton';
import { useLanguage } from '../i18n';
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
    deleteItem,
    toggleItemChecked,
    clearCheckedItems,
  } = useStore();
  const { t, language } = useLanguage();

  const [showAddItem, setShowAddItem] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<'checked' | 'all' | null>(null);
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
  const groupedItems = currentList ? groupItemsByCategory(currentList.items) : new Map();

  const totalItems = currentList?.items.length || 0;
  const checkedItems = currentList?.items.filter((i) => i.checked).length || 0;

  // Get category name based on language
  const getCategoryName = (categoryId: string) => {
    const categoryMap: Record<string, keyof typeof t.categories> = {
      meat: 'meat',
      vegetable: 'vegetable',
      seafood: 'seafood',
      condiment: 'condiment',
      grain: 'grain',
      dairy: 'dairy',
      drink: 'drink',
      fruit: 'fruit',
      frozen: 'frozen',
      snack: 'snack',
      other: 'other',
    };
    return t.categories[categoryMap[categoryId] || 'other'];
  };

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

  const handleClearChecked = () => {
    if (currentListId) {
      clearCheckedItems(currentListId);
      setShowDeleteConfirm(null);
    }
  };

  const handleClearAll = () => {
    if (currentListId) {
      // 先删除所有项目
      currentList?.items.forEach(item => deleteItem(currentListId, item.id));
      setShowDeleteConfirm(null);
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showHistory ? (
                <>
                  <button onClick={() => setShowHistory(false)} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.shopping.history}</h1>
                </>
              ) : (
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.shopping.title}</h1>
              )}
            </div>

            {!showHistory && (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowHistory(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500">
                  <History className="w-5 h-5" />
                </button>
                {currentList && <ExportButton listName={currentList.name} items={currentList.items} />}
              </div>
            )}
          </div>

          {!showHistory && currentList && (
            <div className="flex items-center justify-between mt-4">
              {/* List Selector */}
              <button
                onClick={() => setShowListMenu(!showListMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="font-medium text-gray-900 dark:text-white">{currentList.name}</span>
                <span className="text-sm text-gray-500">
                  {checkedItems}/{totalItems} ✓
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Quick Actions */}
              <button
                onClick={() => setShowDeleteConfirm('checked')}
                disabled={checkedItems === 0}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl disabled:opacity-30 transition-colors"
                title={t.shopping.clearPurchased}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* List Menu Dropdown */}
          {showListMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowListMenu(false)} />
              <div className="absolute left-4 right-4 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-20 overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  {shoppingLists.map((list) => (
                    <button
                      key={list.id}
                      onClick={() => { setCurrentList(list.id); setShowListMenu(false); }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-between ${
                        list.id === currentListId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{list.name}</div>
                        <div className="text-xs text-gray-500">{list.items.length} {language === 'zh' ? '项' : 'items'}</div>
                      </div>
                      {list.id === currentListId && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { setShowNewListForm(true); setShowListMenu(false); }}
                  className="w-full px-4 py-3 text-left text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 border-t border-gray-100 dark:border-gray-700"
                >
                  <Plus className="w-5 h-5" /> {t.shopping.createList}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {showHistory ? (
          /* History View */
          <div className="space-y-3">
            {shoppingLists.length === 0 ? (
              <div className="text-center py-12 text-gray-400">{t.shopping.noHistory}</div>
            ) : (
              shoppingLists.map((list) => (
                <div key={list.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{list.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {list.items.filter(i => i.checked).length}/{list.items.length} {t.shopping.purchased} · {new Date(list.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setCurrentList(list.id); setShowHistory(false); }}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        {t.shopping.view}
                      </button>
                      <button
                        onClick={() => { if (confirm(t.shopping.deleteConfirm)) deleteShoppingList(list.id); }}
                        className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : currentList ? (
          /* Current List */
          <div className="space-y-4">
            {/* Add Item */}
            {showAddItem ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-12 gap-2 mb-3">
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder={t.shopping.itemName}
                    className="col-span-5 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    placeholder={language === 'zh' ? '数量' : 'Qty'}
                    className="col-span-3 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as CategoryId })}
                    className="col-span-4 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {INGREDIENT_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {getCategoryName(cat.id)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAddItem(false)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">
                    {t.settings.cancel}
                  </button>
                  <button onClick={handleAddItem} disabled={!newItem.name.trim()} className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50">
                    {language === 'zh' ? '添加' : 'Add'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddItem(true)}
                className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> {t.shopping.addItem}
              </button>
            )}

            {/* Items by Category */}
            {INGREDIENT_CATEGORIES.map((category) => {
              const categoryItems: ShoppingItem[] = groupedItems.get(category.id) || [];
              if (categoryItems.length === 0) return null;

              const isExpanded = expandedCategories.has(category.id);
              const categoryChecked = categoryItems.filter(i => i.checked).length;

              return (
                <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{getCategoryName(category.id)}</span>
                      <span className="text-sm text-gray-400">({categoryChecked}/{categoryItems.length})</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2">
                      {categoryItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                          <button
                            onClick={() => toggleItemChecked(currentList.id, item.id)}
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                            }`}
                          >
                            {item.checked && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <span className={`text-gray-900 dark:text-white ${item.checked ? 'line-through text-gray-400' : ''}`}>
                              {item.name}
                            </span>
                            {item.quantity && <span className="text-sm text-gray-400 ml-1">{item.quantity}</span>}
                          </div>

                          <button
                            onClick={() => deleteItem(currentList.id, item.id)}
                            className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Empty State */}
            {totalItems === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">{t.shopping.empty}</p>
                <p className="text-sm text-gray-400 mb-4">{t.shopping.emptyDesc}</p>
                <button onClick={() => navigate('/recipes')} className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
                  {t.shopping.browseRecipes}
                </button>
              </div>
            )}

            {/* Quick Actions Bar */}
            {totalItems > 0 && (
              <div className="flex justify-center gap-4 pt-4">
                {checkedItems > 0 && (
                  <button
                    onClick={() => setShowDeleteConfirm('checked')}
                    className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" /> {t.shopping.clearPurchased} ({checkedItems})
                  </button>
                )}
                {totalItems > 0 && (
                  <button
                    onClick={() => setShowDeleteConfirm('all')}
                    className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> {t.shopping.clearAll}
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* No List State */
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t.shopping.noList}</p>
            <button onClick={() => setShowNewListForm(true)} className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
              {t.shopping.createFirstList}
            </button>
          </div>
        )}
      </div>

      {/* New List Modal */}
      {showNewListForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.shopping.createList}</h3>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder={t.shopping.newListPlaceholder}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent dark:text-white mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreateList(); }}
            />
            <div className="flex gap-3">
              <button onClick={() => { setShowNewListForm(false); setNewListName(''); }} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl">
                {t.settings.cancel}
              </button>
              <button onClick={handleCreateList} disabled={!newListName.trim()} className="flex-1 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50">
                {language === 'zh' ? '创建' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {showDeleteConfirm === 'checked' ? t.shopping.confirmClearPurchased : t.shopping.confirmClearAll}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              {showDeleteConfirm === 'checked' ? `${checkedItems} ${t.shopping.itemsRemoved}` : t.shopping.allItemsRemoved}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl">
                {t.settings.cancel}
              </button>
              <button
                onClick={showDeleteConfirm === 'checked' ? handleClearChecked : handleClearAll}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                {t.settings.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
