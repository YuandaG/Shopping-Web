import { RefreshCw, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useLanguage } from '../i18n';

export function UpdateNotification() {
  const { language } = useLanguage();

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Check for updates every hour
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleClose = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-blue-500 text-white px-4 py-3 shadow-lg">
      <div className="max-w-lg lg:max-w-2xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          <span className="text-sm font-medium">
            {language === 'zh' ? '有新版本可用' : 'New version available'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpdate}
            className="px-4 py-1.5 bg-white text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            {language === 'zh' ? '立即更新' : 'Update now'}
          </button>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
