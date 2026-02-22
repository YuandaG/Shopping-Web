import { useState } from 'react';
import { Share2, Copy, Check, Zap, ExternalLink, Settings } from 'lucide-react';
import type { ShoppingItem } from '../types';
import { generateTextList, generateRemindersText, copyToClipboard, openRemindersApp } from '../utils/exportToReminders';
import { ShortcutGuide } from './ShortcutGuide';
import { useLanguage } from '../i18n';

interface ExportButtonProps {
  listName: string;
  items: ShoppingItem[];
}

const SHORTCUT_INSTALLED_KEY = 'shortcut-installed';

export function ExportButton({ listName, items }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const { t, shortcutName, language } = useLanguage();

  // 检查是否已安装快捷指令
  const [shortcutInstalled, setShortcutInstalled] = useState(() => {
    return localStorage.getItem(SHORTCUT_INSTALLED_KEY) === 'true';
  });

  const handleShortcutExport = async () => {
    // 先复制到剪贴板
    const text = generateRemindersText(items);
    await copyToClipboard(text);

    // 运行快捷指令
    const shortcutUrl = `shortcuts://run-shortcut?name=${encodeURIComponent(shortcutName)}&input=clipboard`;
    window.location.href = shortcutUrl;
    setShowMenu(false);
  };

  const handleCopyAndOpenReminders = async () => {
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

  const handleSetupShortcut = () => {
    setShowGuide(true);
    setShowMenu(false);
  };

  const handleShortcutInstalled = () => {
    localStorage.setItem(SHORTCUT_INSTALLED_KEY, 'true');
    setShortcutInstalled(true);
  };

  const uncheckedItems = items.filter((item) => !item.checked);
  const hasItems = uncheckedItems.length > 0;

  if (!hasItems) return null;

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <Share2 className="w-5 h-5" />
          {t.export.export}
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-20 overflow-hidden">

              {/* 快捷指令方案（如果已安装） */}
              {shortcutInstalled ? (
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border-b dark:border-gray-700">
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-2">
                    ⚡ {t.export.oneClickExport}
                  </div>
                  <button
                    onClick={handleShortcutExport}
                    className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    {language === 'zh' ? '导出到提醒事项' : 'Export to Reminders'}
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {t.export.oneClickDesc}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border-b dark:border-gray-700">
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-2">
                    ⚡ {t.export.betterOption}
                  </div>
                  <button
                    onClick={handleSetupShortcut}
                    className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    {t.export.setupShortcut}
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {t.export.setupShortcutDesc}
                  </p>
                </div>
              )}

              {/* 复制并打开 Reminders */}
              <button
                onClick={handleCopyAndOpenReminders}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 border-b dark:border-gray-700"
              >
                <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {t.export.copyAndOpen}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t.export.copyAndOpenDesc}
                  </div>
                </div>
              </button>

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
                    {copied ? t.export.copied : t.export.copyToClipboard}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t.export.copyDesc}
                  </div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      <ShortcutGuide
        isOpen={showGuide}
        onClose={() => {
          setShowGuide(false);
          handleShortcutInstalled();
        }}
      />
    </>
  );
}
