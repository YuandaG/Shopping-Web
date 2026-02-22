import { useState } from 'react';
import { X, ChevronRight, Check, ExternalLink, Github } from 'lucide-react';
import { useLanguage } from '../i18n';

interface GitHubGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (token: string, gistId?: string) => void;
}

export function GitHubGuide({ isOpen, onClose, onComplete }: GitHubGuideProps) {
  const [step, setStep] = useState(0);
  const [token, setToken] = useState('');
  const [gistId, setGistId] = useState('');
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  const steps = [
    { title: language === 'zh' ? '欢迎' : 'Welcome', icon: '👋' },
    { title: language === 'zh' ? '创建 Token' : 'Create Token', icon: '🔑' },
    { title: language === 'zh' ? '复制 Token' : 'Copy Token', icon: '📋' },
    { title: language === 'zh' ? '创建 Gist' : 'Create Gist', icon: '📦' },
    { title: language === 'zh' ? '完成' : 'Done', icon: '✅' },
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
              <h2 className="text-lg font-semibold text-white">{t.githubGuide.title}</h2>
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
                {t.githubGuide.welcome}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {t.githubGuide.welcomeDesc}
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t.githubGuide.need}</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    {t.githubGuide.githubAccount}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    {t.githubGuide.time}
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {t.githubGuide.startSetup}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 1: Create Token */}
          {step === 1 && (
            <div>
              <div className="text-4xl mb-4 text-center">🔑</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                {t.githubGuide.step1Title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
                {t.githubGuide.step1Desc}
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {language === 'zh' ? '点击下方按钮，会打开 GitHub 页面：' : 'Click the button below to open GitHub page:'}
                  </p>
                  <a
                    href="https://github.com/settings/tokens/new?description=Shopping%20Web&scopes=gist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {language === 'zh' ? '打开 GitHub Token 页面' : 'Open GitHub Token Page'}
                  </a>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {language === 'zh' ? '在页面中确认：' : 'Confirm on the page:'}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">1</div>
                      <span>{t.githubGuide.step1Note} <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Shopping Web</code></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">2</div>
                      <span>{t.githubGuide.step1Gist}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">3</div>
                      <span>{t.githubGuide.step1Generate}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {language === 'zh' ? '上一步' : 'Back'}
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors"
                >
                  {language === 'zh' ? '下一步' : 'Next'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Copy Token */}
          {step === 2 && (
            <div>
              <div className="text-4xl mb-4 text-center">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                {t.githubGuide.step2Title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
                {t.githubGuide.step2Desc}
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    {t.githubGuide.step2Warning}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.githubGuide.pasteToken}
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
                  {language === 'zh' ? '上一步' : 'Back'}
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!token.trim()}
                  className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {language === 'zh' ? '下一步' : 'Next'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Create Gist */}
          {step === 3 && (
            <div>
              <div className="text-4xl mb-4 text-center">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                {t.githubGuide.step3Title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
                {t.githubGuide.step3Desc}
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>{t.githubGuide.newUser}</strong> {t.githubGuide.newUserDesc}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>{t.githubGuide.joinFriend}</strong> {t.githubGuide.joinFriendDesc}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.githubGuide.gistIdOptional}
                  </label>
                  <input
                    type="text"
                    value={gistId}
                    onChange={(e) => setGistId(e.target.value)}
                    placeholder={t.githubGuide.gistIdPlaceholder}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {language === 'zh' ? '上一步' : 'Back'}
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors"
                >
                  {language === 'zh' ? '下一步' : 'Next'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 4 && (
            <div>
              <div className="text-6xl mb-4 text-center">✅</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                {t.githubGuide.complete}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
                {t.githubGuide.completeDesc}
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t.githubGuide.dailyUse}</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">↓</span>
                    {t.githubGuide.loadData}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">↑</span>
                    {t.githubGuide.saveData}
                  </li>
                </ul>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-5 h-5" />
                {t.githubGuide.done}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
