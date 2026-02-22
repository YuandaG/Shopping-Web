import { useState } from 'react';
import { X, ChevronRight, Check, ExternalLink, Github } from 'lucide-react';

interface GitHubGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (token: string, gistId?: string) => void;
}

export function GitHubGuide({ isOpen, onClose, onComplete }: GitHubGuideProps) {
  const [step, setStep] = useState(0);
  const [token, setToken] = useState('');
  const [gistId, setGistId] = useState('');

  if (!isOpen) return null;

  const steps = [
    { title: '欢迎', icon: '👋' },
    { title: '创建 Token', icon: '🔑' },
    { title: '复制 Token', icon: '📋' },
    { title: '创建 Gist', icon: '📦' },
    { title: '完成', icon: '✅' },
  ];

  const handleComplete = () => {
    onComplete(token, gistId || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Github className="w-6 h-6 text-white" />
              <h2 className="text-lg font-semibold text-white">GitHub 设置指南</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  i <= step ? 'bg-green-500' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center">
              <div className="text-6xl mb-4">👋</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                欢迎使用数据同步功能
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                通过 GitHub Gist，你可以和朋友共享菜谱和购物清单
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">你需要准备：</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    一个 GitHub 账号（免费）
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    5 分钟时间
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                开始设置
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 1: Create Token */}
          {step === 1 && (
            <div>
              <div className="text-4xl mb-4 text-center">🔑</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                创建 Personal Access Token
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
                Token 就像一把钥匙，让应用可以访问你的 GitHub
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    点击下方按钮，会打开 GitHub 页面：
                  </p>
                  <a
                    href="https://github.com/settings/tokens/new?description=Shopping%20Web&scopes=gist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    打开 GitHub Token 页面
                  </a>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">在页面中确认：</p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">1</div>
                      <span>Note 显示 <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Shopping Web</code></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">2</div>
                      <span><strong>gist</strong> 权限已勾选 ✓</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">3</div>
                      <span>点击绿色按钮「Generate token」</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  上一步
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors"
                >
                  下一步
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Copy Token */}
          {step === 2 && (
            <div>
              <div className="text-4xl mb-4 text-center">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                复制你的 Token
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
                粘贴到下方输入框（只有你能看到）
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    ⚠️ Token 以 <code className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">ghp_</code> 开头，只显示一次！
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    粘贴 Token
                  </label>
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  上一步
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!token.trim()}
                  className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  下一步
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Create Gist */}
          {step === 3 && (
            <div>
              <div className="text-4xl mb-4 text-center">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                创建 Gist（可选）
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
                如果要加入朋友已有的清单，输入他们的 Gist ID
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>新用户：</strong> 留空，点击完成会自动创建新 Gist
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>加入朋友：</strong> 让朋友分享 Gist ID 给你
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gist ID（可选）
                  </label>
                  <input
                    type="text"
                    value={gistId}
                    onChange={(e) => setGistId(e.target.value)}
                    placeholder="留空则创建新 Gist"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  上一步
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors"
                >
                  下一步
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 4 && (
            <div>
              <div className="text-6xl mb-4 text-center">✅</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                设置完成！
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
                你已经准备好同步数据了
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">日常使用：</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">↓</span>
                    点击「加载数据」获取最新内容
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">↑</span>
                    点击「保存数据」上传你的更改
                  </li>
                </ul>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-5 h-5" />
                完成
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
