import { X, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ShortcutGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutGuide({ isOpen, onClose }: ShortcutGuideProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: '打开快捷指令 App',
      description: '在 iPhone 或 iPad 上找到「快捷指令」App 并打开',
      detail: '如果找不到，可以从 App Store 免费下载',
    },
    {
      num: 2,
      title: '创建新快捷指令',
      description: '点击右上角「+」按钮',
      detail: null,
    },
    {
      num: 3,
      title: '添加「获取剪贴板内容」',
      description: '点击「添加操作」，搜索「剪贴板」',
      detail: '选择「获取剪贴板内容」操作',
    },
    {
      num: 4,
      title: '添加「拆分文本」',
      description: '点击底部「+」添加新操作',
      detail: '搜索「拆分文本」并添加，默认按换行符拆分',
    },
    {
      num: 5,
      title: '添加「重复每一项」',
      description: '继续添加「重复每一项」操作',
      detail: '这个操作会对每一行文本重复执行后面的操作',
    },
    {
      num: 6,
      title: '添加「添加新提醒事项」',
      description: '在「重复」内部添加此操作',
      detail: '点击「名称」参数，选择「重复项目」（不是手动输入）',
    },
    {
      num: 7,
      title: '命名并保存',
      description: '点击顶部「新建快捷指令」，改名为「购物清单」',
      detail: '点击「完成」保存',
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
              <h2 className="text-lg font-semibold text-white">快捷指令设置</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>
          <p className="text-sm text-white/80 mt-2">
            设置后可将购物清单导出到提醒事项，每个物品单独一行可勾选
          </p>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Info Box */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-purple-700 dark:text-purple-400">
                <p className="font-medium mb-1">工作原理</p>
                <p>网站复制清单到剪贴板 → 快捷指令读取剪贴板 → 拆分每行 → 创建单独的提醒项</p>
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
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">操作顺序预览</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded flex items-center justify-center text-xs">1</span>
                📋 获取剪贴板内容
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded flex items-center justify-center text-xs">2</span>
                ✂️ 拆分文本
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 rounded flex items-center justify-center text-xs">3</span>
                🔄 重复每一项
              </div>
              <div className="ml-8 flex items-center gap-2 text-gray-500 dark:text-gray-500">
                <span className="w-5 h-5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded flex items-center justify-center text-xs">↳</span>
                ✅ 添加新提醒事项
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="mt-5 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              <strong>⚠️ 重要：</strong>快捷指令名称必须是「购物清单」，否则无法正常工作
            </p>
          </div>

          {/* Complete Button */}
          <button
            onClick={onClose}
            className="w-full mt-5 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Check className="w-5 h-5" />
            我已完成设置
          </button>
        </div>
      </div>
    </div>
  );
}
