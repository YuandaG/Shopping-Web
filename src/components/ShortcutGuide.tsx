import { X, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../i18n';

interface ShortcutGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutGuide({ isOpen, onClose }: ShortcutGuideProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const { t, shortcutName } = useLanguage();

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: t.shortcutGuide.step1,
      description: t.shortcutGuide.step1Desc,
      detail: t.shortcutGuide.step1Detail,
    },
    {
      num: 2,
      title: t.shortcutGuide.step2,
      description: t.shortcutGuide.step2Desc,
      detail: null,
    },
    {
      num: 3,
      title: t.shortcutGuide.step3,
      description: t.shortcutGuide.step3Desc,
      detail: t.shortcutGuide.step3Detail,
    },
    {
      num: 4,
      title: t.shortcutGuide.step4,
      description: t.shortcutGuide.step4Desc,
      detail: t.shortcutGuide.step4Detail,
    },
    {
      num: 5,
      title: t.shortcutGuide.step5,
      description: t.shortcutGuide.step5Desc,
      detail: t.shortcutGuide.step5Detail,
    },
    {
      num: 6,
      title: t.shortcutGuide.step6,
      description: t.shortcutGuide.step6Desc,
      detail: t.shortcutGuide.step6Detail,
    },
    {
      num: 7,
      title: t.shortcutGuide.step7,
      description: t.shortcutGuide.step7Desc,
      detail: t.shortcutGuide.step7Detail,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <h2 className="text-lg font-semibold text-white">{t.shortcutGuide.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>
          <p className="text-sm text-white/80 mt-2">
            {t.shortcutGuide.desc}
          </p>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Info Box */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-purple-700 dark:text-purple-400">
                <p className="font-medium mb-1">{t.shortcutGuide.howItWorks}</p>
                <p>{t.shortcutGuide.howItWorksDesc}</p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedStep(expandedStep === step.num ? null : step.num)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="w-7 h-7 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-medium">
                    {step.num}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{step.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                  </div>
                  {expandedStep === step.num ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {expandedStep === step.num && step.detail && (
                  <div className="px-4 pb-3 pt-0">
                    <div className="ml-10 pl-3 border-l-2 border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{step.detail}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Visual Guide */}
          <div className="mt-5 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">{t.shortcutGuide.orderPreview}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded flex items-center justify-center text-xs">1</span>
                📋 {t.shortcutGuide.getClipboard}
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded flex items-center justify-center text-xs">2</span>
                ✂️ {t.shortcutGuide.splitText}
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 rounded flex items-center justify-center text-xs">3</span>
                🔄 {t.shortcutGuide.repeatEach}
              </div>
              <div className="ml-8 flex items-center gap-2 text-gray-500 dark:text-gray-500">
                <span className="w-5 h-5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded flex items-center justify-center text-xs">↳</span>
                ✅ {t.shortcutGuide.addReminder}
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="mt-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              <strong>{t.shortcutGuide.important}</strong>{t.shortcutGuide.importantDesc.replace('{name}', shortcutName)}
            </p>
          </div>

          {/* Complete Button */}
          <button
            onClick={onClose}
            className="w-full mt-5 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Check className="w-5 h-5" />
            {t.shortcutGuide.completed}
          </button>
        </div>
      </div>
    </div>
  );
}
