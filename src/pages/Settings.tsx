import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, RefreshCw, Check, AlertCircle, ExternalLink, Database, Upload } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useGist } from '../hooks/useGist';
import type { GistData } from '../types';
import { useRef } from 'react';

export function Settings() {
  const navigate = useNavigate();
  const { settings, exportData, recipes, shoppingLists, currentListId, importData } = useStore();
  const { isLoading, error, createGist, loadFromGist, saveToGist } = useGist();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [gistIdInput, setGistIdInput] = useState(settings.gistId || '');
  const [tokenInput, setTokenInput] = useState(settings.gistToken || '');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateGist = async () => {
    if (!tokenInput.trim()) {
      alert('请输入 GitHub Token');
      return;
    }

    const gistId = await createGist(tokenInput.trim());
    if (gistId) {
      setGistIdInput(gistId);
      setSuccessMessage('Gist 创建成功！请把 Gist ID 分享给朋友');
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const handleLoadFromGist = async () => {
    if (!gistIdInput.trim() || !tokenInput.trim()) {
      alert('请输入 Gist ID 和 Token');
      return;
    }

    const success = await loadFromGist(gistIdInput.trim(), tokenInput.trim());
    if (success) {
      // 确保 tokenInput 和 gistIdInput 保持同步
      setTokenInput(tokenInput.trim());
      setGistIdInput(gistIdInput.trim());
      setSuccessMessage('数据加载成功！请检查菜谱和购物清单');
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const handleSaveToGist = async () => {
    const success = await saveToGist();
    if (success) {
      setSuccessMessage('数据同步成功！包含 ' + recipes.length + ' 个菜谱和 ' + shoppingLists.length + ' 个购物清单');
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const handleExportLocal = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
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

        // 验证数据格式
        if (!data.recipes || !data.shoppingLists) {
          alert('文件格式不正确');
          return;
        }

        importData(data);
        setSuccessMessage(`导入成功！${data.recipes.length} 个菜谱，${data.shoppingLists.length} 个购物清单`);
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch {
        alert('文件解析失败，请确保是有效的 JSON 文件');
      }
    };
    reader.readAsText(file);

    // 清空 input 以便重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentList = shoppingLists.find(l => l.id === currentListId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 头部 */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              设置
            </h1>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 成功提示 */}
        {successMessage && (
          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
            <Check className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* 当前数据状态 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              当前数据状态
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {recipes.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">菜谱</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {shoppingLists.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">购物清单</div>
            </div>
          </div>

          {currentList && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                当前清单: <span className="font-medium text-gray-900 dark:text-white">{currentList.name}</span>
                <span className="ml-2">({currentList.items.length} 项)</span>
              </div>
            </div>
          )}
        </div>

        {/* GitHub 同步 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              GitHub 数据同步
            </h2>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            通过 GitHub Gist 同步数据，实现多人协作。需要具有 Gist 权限的 GitHub Token。
          </p>

          {/* 同步说明 */}
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-yellow-700 dark:text-yellow-400">
            <strong>使用说明：</strong><br />
            1. 修改数据后，点击「同步到 Gist」上传<br />
            2. 获取数据时，点击「从 Gist 加载」下载<br />
            3. 同步包含菜谱和购物清单两部分
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GitHub Personal Access Token
              </label>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <a
                href="https://github.com/settings/tokens/new?description=Shopping%20Web&scopes=gist"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1 text-sm text-blue-500 hover:text-blue-600"
              >
                创建 Token <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gist ID（可选，用于加入已有的共享清单）
              </label>
              <input
                type="text"
                value={gistIdInput}
                onChange={(e) => setGistIdInput(e.target.value)}
                placeholder="留空则创建新 Gist"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCreateGist}
                disabled={isLoading || !tokenInput.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                <Github className="w-4 h-4" />
                创建新 Gist
              </button>

              <button
                onClick={handleLoadFromGist}
                disabled={isLoading || !gistIdInput.trim() || !tokenInput.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                从 Gist 加载
              </button>

              <button
                onClick={handleSaveToGist}
                disabled={isLoading || !settings.gistId}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                同步到 Gist
              </button>
            </div>

            {settings.gistId && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  当前 Gist ID: <code className="text-blue-500 select-all">{settings.gistId}</code>
                </p>
                {settings.lastSync && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    上次同步: {new Date(settings.lastSync).toLocaleString('zh-CN')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 本地备份 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            本地备份
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            导出或导入数据文件。适合没有 GitHub 的朋友使用。
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleExportLocal}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              导出数据
            </button>
            <label className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportLocal}
                className="hidden"
              />
              <Upload className="w-4 h-4 inline mr-1" />
              导入数据
            </label>
          </div>
        </div>

        {/* 关于 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            关于
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            购物清单助手 - 管理菜谱与购物清单的工具
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            版本 1.0.3 - 修复 Token 同步问题
          </p>
        </div>
      </div>
    </div>
  );
}
