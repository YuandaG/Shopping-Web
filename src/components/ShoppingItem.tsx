import { useState } from 'react';
import { Check, MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { ShoppingItem as ShoppingItemType } from '../types';
import { INGREDIENT_CATEGORIES } from '../types';

interface ShoppingItemProps {
  item: ShoppingItemType;
  onToggle: () => void;
  onUpdate: (updates: Partial<ShoppingItemType>) => void;
  onDelete: () => void;
}

export function ShoppingItemComponent({
  item,
  onToggle,
  onUpdate,
  onDelete,
}: ShoppingItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQuantity, setEditQuantity] = useState(item.quantity);

  const category = INGREDIENT_CATEGORIES.find((c) => c.id === item.category);

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onUpdate({
        name: editName.trim(),
        quantity: editQuantity.trim(),
      });
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-500">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          autoFocus
        />
        <input
          type="text"
          value={editQuantity}
          onChange={(e) => setEditQuantity(e.target.value)}
          placeholder="数量"
          className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
        />
        <button
          onClick={handleSaveEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          保存
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          取消
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border transition-colors ${
        item.checked
          ? 'border-gray-200 dark:border-gray-700 opacity-60'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* 勾选按钮 */}
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          item.checked
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
        }`}
      >
        {item.checked && <Check className="w-4 h-4 text-white" />}
      </button>

      {/* 项目内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-gray-900 dark:text-white ${
              item.checked ? 'line-through text-gray-400' : ''
            }`}
          >
            {item.name}
          </span>
          {item.quantity && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {item.quantity}
            </span>
          )}
        </div>
        {item.fromRecipe && (
          <span className="text-xs text-blue-500 dark:text-blue-400">
            来自: {item.fromRecipe}
          </span>
        )}
      </div>

      {/* 类别图标 */}
      <span className="flex-shrink-0 text-lg" title={category?.name}>
        {category?.icon || '📦'}
      </span>

      {/* 操作菜单 */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-20">
              <button
                onClick={() => {
                  setShowMenu(false);
                  setIsEditing(true);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                编辑
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete();
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-500"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
