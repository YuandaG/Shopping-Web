import { X, Check, ListChecks, AlertCircle } from 'lucide-react';

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
              创建后可一键导出，每个物品变成单独的可勾选提醒项
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-green-500" />
              创建步骤
            </h3>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
              <Step number={1} title="打开快捷指令 App" />
              <Step number={2} title="点击右上角「+」" />
              <Step number={3} title="点击「添加操作」" />
              <Step number={4} title="搜索「提醒事项」，选择「将输入添加到提醒事项」" />
              <Step number={5} title="点击操作中的「提醒事项」，选择要添加到的清单" />
              <Step number={6} title="点击顶部「新建快捷指令」，改名为「购物清单」" />
              <Step number={7} title="点击右上角「完成」" />
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                <strong>重要：</strong>快捷指令名称必须是「购物清单」才能正常工作
              </p>
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

function Step({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-medium">
        {number}
      </span>
      <span className="text-sm text-gray-700 dark:text-gray-300 pt-0.5">{title}</span>
    </div>
  );
}
