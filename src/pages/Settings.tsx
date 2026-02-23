import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cloud, Download, Upload, Database, FileDown, Github, Zap, Globe, Sun, Moon, Monitor, Merge } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useGist } from '../hooks/useGist';
import { GitHubGuide } from '../components/GitHubGuide';
import { ShortcutGuide } from '../components/ShortcutGuide';
import { IngredientMergeManager } from '../components/IngredientMergeManager';
import { useLanguage } from '../i18n';
import { useTheme } from '../theme';
import { APP_VERSION } from '../constants';
import type { GistData } from '../types';
import { useRef } from 'react';

export function Settings() {
  const navigate = useNavigate();
  const { t, language, setLanguage, shortcutName } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { settings, exportData, recipes, shoppingLists, importData, updateSettings } = useStore();
  const { isLoading, error, createGist, loadFromGist, saveToGist } = useGist();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showGitHubGuide, setShowGitHubGuide] = useState(false);
  const [showShortcutGuide, setShowShortcutGuide] = useState(false);
  const [showMergeManager, setShowMergeManager] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirmSync, setShowConfirmSync] = useState<'load' | 'save' | null>(null);

  const isConfigured = settings.gistId && settings.gistToken;

  const handleGuideComplete = async (token: string, gistId?: string) => {
    updateSettings({ gistToken: token });
    if (gistId) {
      updateSettings({ gistId });
      const success = await loadFromGist(gistId, token);
      if (success) {
        setSuccessMessage(language === 'zh' ? '数据加载成功！' : 'Data loaded successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } else {
      const newGistId = await createGist(token);
      if (newGistId) {
        setSuccessMessage(language === 'zh' ? 'Gist 创建成功！可以把 ID 分享给朋友' : 'Gist created! Share the ID with friends');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const handleLoadData = async () => {
    if (!settings.gistId || !settings.gistToken) return;
    const success = await loadFromGist(settings.gistId, settings.gistToken);
    setShowConfirmSync(null);
    if (success) {
      setSuccessMessage(language === 'zh' ? '数据已更新' : 'Data updated');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleSaveData = async () => {
    const success = await saveToGist();
    setShowConfirmSync(null);
    if (success) {
      setSuccessMessage(language === 'zh' ? '数据已保存' : 'Data saved');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleExportLocal = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping-web-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportLocal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data: GistData = JSON.parse(content);
        if (!data.recipes || !data.shoppingLists) {
          alert(language === 'zh' ? '文件格式不正确' : 'Invalid file format');
          return;
        }
        importData(data);
        setSuccessMessage(
          language === 'zh'
            ? `导入成功！${data.recipes.length} 个菜谱，${data.shoppingLists.length} 个购物清单`
            : `Imported! ${data.recipes.length} recipes, ${data.shoppingLists.length} shopping lists`
        );
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch {
        alert(language === 'zh' ? '文件解析失败' : 'Failed to parse file');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 lg:pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-lg lg:max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors lg:hidden"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{t.settings.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-lg lg:max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-500 text-white px-4 py-3 rounded-xl text-sm font-medium">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 text-white px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Data Status */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">{t.settings.dataStatus}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.settings.dataStatusDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{recipes.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{t.home.recipes}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{shoppingLists.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{t.home.shoppingList}</div>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">{t.settings.language}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.settings.languageDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLanguage('zh')}
              className={`py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                language === 'zh'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              🇨🇳 中文
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                language === 'en'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              🇺🇸 English
            </button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
            {language === 'zh' ? '快捷指令名称' : 'Shortcut name'}: <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{shortcutName}</code>
          </p>
        </div>

        {/* Theme */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-yellow-500" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">{t.settings.theme}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.settings.themeDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                theme === 'light'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Sun className="w-4 h-4" />
              {t.settings.themeLight}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Moon className="w-4 h-4" />
              {t.settings.themeDark}
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                theme === 'system'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Monitor className="w-4 h-4" />
              {t.settings.themeSystem}
            </button>
          </div>
        </div>

        {/* Shortcuts Setup */}
        <button
          onClick={() => setShowShortcutGuide(true)}
          className="w-full bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-left hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 dark:text-white">{t.settings.shortcuts}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.settings.shortcutsDesc}</p>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </div>
        </button>

        {/* Ingredient Merge */}
        <button
          onClick={() => setShowMergeManager(true)}
          className="w-full bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-left hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
              <Merge className="w-5 h-5 text-teal-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 dark:text-white">{t.ingredientMerge.title}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.ingredientMerge.desc}</p>
            </div>
            <div className="text-xs text-gray-400 mr-2">
              {settings.ingredientMerges.length} {language === 'zh' ? '条规则' : 'rules'}
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </div>
        </button>

        {/* Cloud Sync */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Cloud className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 dark:text-white">{t.settings.cloudSync}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isConfigured ? t.settings.connected : t.settings.notConfigured}
              </p>
            </div>
          </div>

          {!isConfigured ? (
            <button
              onClick={() => setShowGitHubGuide(true)}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <Github className="w-5 h-5" />
              {t.settings.startSetup}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t.settings.gistId}</span>
                  <code className="text-sm text-gray-900 dark:text-white font-mono">{settings.gistId?.slice(0, 12)}...</code>
                </div>
                {settings.lastSync && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t.settings.lastSync}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(settings.lastSync).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowConfirmSync('load')}
                  disabled={isLoading}
                  className="py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  {t.settings.load}
                </button>
                <button
                  onClick={() => setShowConfirmSync('save')}
                  disabled={isLoading}
                  className="py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  {t.settings.save}
                </button>
              </div>

              <button
                onClick={() => setShowGitHubGuide(true)}
                className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center gap-1"
              >
                {t.settings.viewGuide}
              </button>
            </div>
          )}
        </div>

        {/* Confirm Dialog */}
        {showConfirmSync && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {showConfirmSync === 'load' ? t.settings.loadConfirm : t.settings.saveConfirm}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                {showConfirmSync === 'load' ? t.settings.loadConfirmDesc : t.settings.saveConfirmDesc}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmSync(null)}
                  className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t.settings.cancel}
                </button>
                <button
                  onClick={showConfirmSync === 'load' ? handleLoadData : handleSaveData}
                  className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  {t.settings.confirm}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Backup */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <FileDown className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">{t.settings.backup}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.settings.backupDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportLocal}
              className="py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {t.settings.export}
            </button>
            <label className="py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportLocal}
                className="hidden"
              />
              {t.settings.import}
            </label>
          </div>
        </div>

        {/* Version */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-4">
          Shopping List Assistant · v{APP_VERSION}
        </div>
      </div>

      <GitHubGuide
        isOpen={showGitHubGuide}
        onClose={() => setShowGitHubGuide(false)}
        onComplete={handleGuideComplete}
      />

      <ShortcutGuide
        isOpen={showShortcutGuide}
        onClose={() => setShowShortcutGuide(false)}
      />

      <IngredientMergeManager
        isOpen={showMergeManager}
        onClose={() => setShowMergeManager(false)}
      />
    </div>
  );
}
