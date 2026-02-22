import { useState } from 'react';
import { Share2, Copy, Check, ExternalLink } from 'lucide-react';
import type { ShoppingItem } from '../types';
import { generateTextList, copyToClipboard, openRemindersApp } from '../utils/exportToReminders';

interface ExportButtonProps {
  listName: string;
  items: ShoppingItem[];
}

export function ExportButton({ listName, items }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAndOpenReminders = async () => {
    // 先复制清单到剪贴板
    const text = generateTextList(listName, items);
    const success = await copyToClipboard(text);

    if (success) {
      setCopied(true);
      // 延迟打开 Reminders，让用户看到复制成功的提示
      setTimeout(() => {
        openRemindersApp();
        setCopied(false);
      }, 500);
    }
    setShowMenu(false);
  };

  const handleCopyToClipboard = async () => {
    const text = generateTextList(listName, items);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowMenu(false);
  };

  const uncheckedItems = items.filter((item) => !item.checked);
  const hasItems = uncheckedItems.length > 0;

  if (!hasItems) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
      >
        <Share2 className="w-5 h-5" />
        导出清单
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-20 overflow-hidden">
            <button
              onClick={handleCopyAndOpenReminders}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 border-b dark:border-gray-700"
            >
              <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  复制并打开 Reminders
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  复制清单后打开提醒事项
                </div>
              </div>
            </button>
            <button
              onClick={handleCopyToClipboard}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {copied ? '已复制！' : '复制到剪贴板'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  手动粘贴到任意应用
                </div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
