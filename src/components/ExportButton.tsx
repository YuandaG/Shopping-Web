import { useState } from 'react';
import { Share2, Copy, Check, ExternalLink, Share } from 'lucide-react';
import type { ShoppingItem } from '../types';
import { generateTextList, generateRemindersText, copyToClipboard, openRemindersApp, shareToReminders } from '../utils/exportToReminders';

interface ExportButtonProps {
  listName: string;
  items: ShoppingItem[];
}

export function ExportButton({ listName, items }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAndOpenReminders = async () => {
    // 复制纯物品列表（每行一个）
    const text = generateRemindersText(items);
    const success = await copyToClipboard(text);

    if (success) {
      setCopied(true);
      setTimeout(() => {
        openRemindersApp();
        setCopied(false);
      }, 500);
    }
    setShowMenu(false);
  };

  const handleCopyFullList = async () => {
    const text = generateTextList(listName, items);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowMenu(false);
  };

  const handleShare = async () => {
    const success = await shareToReminders(listName, items);
    if (!success) {
      // 如果分享失败或不支持，回退到复制
      handleCopyFullList();
    }
    setShowMenu(false);
  };

  const uncheckedItems = items.filter((item) => !item.checked);
  const hasItems = uncheckedItems.length > 0;

  // 检查是否支持 Web Share API
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

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
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-20 overflow-hidden">
            {/* 推荐方案：复制并打开 Reminders */}
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border-b dark:border-gray-700">
              <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-2">
                ✨ 推荐方案
              </div>
              <button
                onClick={handleCopyAndOpenReminders}
                className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                复制清单 → 打开 Reminders
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                复制后打开 Reminders，新建清单，粘贴即可逐项勾选
              </p>
            </div>

            {/* iOS 分享 */}
            {canShare && (
              <button
                onClick={handleShare}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 border-b dark:border-gray-700"
              >
                <Share className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    系统分享
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    分享到其他应用
                  </div>
                </div>
              </button>
            )}

            {/* 复制到剪贴板 */}
            <button
              onClick={handleCopyFullList}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {copied ? '已复制！' : '复制完整清单'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  包含分类信息
                </div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
