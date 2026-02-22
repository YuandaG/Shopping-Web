import { X, Check, AlertCircle } from 'lucide-react';

interface ShortcutGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutGuide({ isOpen, onClose }: ShortcutGuideProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl">
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            创建快捷指令
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-400">
              这个快捷指令会为每个物品创建单独的提醒项，可以逐个勾选
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">
              📱 在 iPhone 上创建快捷指令
            </h3>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
              <Step number={1} title="打开「快捷指令」App" />
              <Step number={2} title="点击右上角「+」新建" />
              <Step number={3} title="添加操作：搜索「剪贴板」→ 选择「获取剪贴板内容」" />
              <Step number={4} title="再添加：搜索「拆分」→ 选择「拆分文本」" subtitle="（默认按换行符拆分）" />
              <Step number={5} title="再添加：搜索「重复」→ 选择「重复每一项」" />
              <Step number={6} title="在循环内添加：搜索「提醒事项」→ 选择「添加新提醒事项」" />
              <Step number={7} title="在「名称」位置，选择「重复项目」" />
              <Step number={8} title="点击顶部命名「购物清单」→ 完成" />
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-1">
                ✅ 正确的操作顺序：
              </p>
              <code className="text-xs text-green-600 dark:text-green-400 block">
                获取剪贴板 → 拆分文本 → 重复每一项 → 添加新提醒事项
              </code>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            已创建，开始使用
          </button>
        </div>
      </div>
    </div>
  );
}

function Step({ number, title, subtitle }: { number: number; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-medium">
        {number}
      </span>
      <div>
        <span className="text-sm text-gray-700 dark:text-gray-300">{title}</span>
        {subtitle && (
          <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
