import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cloud, Download, Upload, Database, FileDown, Github, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useGist } from '../hooks/useGist';
import { GitHubGuide } from '../components/GitHubGuide';
import { ShortcutGuide } from '../components/ShortcutGuide';
import type { GistData } from '../types';
import { useRef } from 'react';

export function Settings() {
  const navigate = useNavigate();
  const { settings, exportData, recipes, shoppingLists, importData, updateSettings } = useStore();
  const { isLoading, error, createGist, loadFromGist, saveToGist } = useGist();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showGitHubGuide, setShowGitHubGuide] = useState(false);
  const [showShortcutGuide, setShowShortcutGuide] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirmSync, setShowConfirmSync] = useState<'load' | 'save' | null>(null);

  const isConfigured = settings.gistId && settings.gistToken;

  const handleGuideComplete = async (token: string, gistId?: string) => {
    updateSettings({ gistToken: token });
    if (gistId) {
      updateSettings({ gistId });
      const success = await loadFromGist(gistId, token);
      if (success) {
        setSuccessMessage('数据加载成功！');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } else {
      const newGistId = await createGist(token);
      if (newGistId) {
        setSuccessMessage('Gist 创建成功！可以把 ID 分享给朋友');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const handleLoadData = async () => {
    if (!settings.gistId || !settings.gistToken) return;
    const success = await loadFromGist(settings.gistId, settings.gistToken);
    setShowConfirmSync(null);
    if (success) {
      setSuccessMessage('数据已更新');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleSaveData = async () => {
    const success = await saveToGist();
    setShowConfirmSync(null);
    if (success) {
      setSuccessMessage('数据已保存');
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
          alert('文件格式不正确');
          return;
        }
        importData(data);
        setSuccessMessage(`导入成功！${data.recipes.length} 个菜谱，${data.shoppingLists.length} 个购物清单`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch {
        alert('文件解析失败');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">设置</h1>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
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
              <h2 className="font-semibold text-gray-900 dark:text-white">数据状态</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">当前本地存储的内容</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{recipes.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">菜谱</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{shoppingLists.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">购物清单</div>
            </div>
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
              <h2 className="font-semibold text-gray-900 dark:text-white">快捷指令设置</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">导出到提醒事项，逐项勾选</p>
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
              <h2 className="font-semibold text-gray-900 dark:text-white">云端同步</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isConfigured ? '已连接 GitHub' : '未配置'}
              </p>
            </div>
          </div>

          {!isConfigured ? (
            <button
              onClick={() => setShowGitHubGuide(true)}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <Github className="w-5 h-5" />
              开始设置
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Gist ID</span>
                  <code className="text-sm text-gray-900 dark:text-white font-mono">{settings.gistId?.slice(0, 12)}...</code>
                </div>
                {settings.lastSync && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">上次同步</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(settings.lastSync).toLocaleString('zh-CN')}
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
                  加载
                </button>
                <button
                  onClick={() => setShowConfirmSync('save')}
                  disabled={isLoading}
                  className="py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  保存
                </button>
              </div>

              <button
                onClick={() => setShowGitHubGuide(true)}
                className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center gap-1"
              >
                查看设置指南
              </button>
            </div>
          )}
        </div>

        {/* Confirm Dialog */}
        {showConfirmSync && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {showConfirmSync === 'load' ? '加载数据？' : '保存数据？'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                {showConfirmSync === 'load'
                  ? '会用云端数据覆盖本地数据'
                  : '会上传本地数据到云端，覆盖云端数据'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmSync(null)}
                  className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={showConfirmSync === 'load' ? handleLoadData : handleSaveData}
                  className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  确认
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
              <h2 className="font-semibold text-gray-900 dark:text-white">本地备份</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">导出或导入 JSON 文件</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportLocal}
              className="py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              导出
            </button>
            <label className="py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportLocal}
                className="hidden"
              />
              导入
            </label>
          </div>
        </div>

        {/* Version */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-4">
          购物清单助手 · v1.2.0
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
    </div>
  );
}
