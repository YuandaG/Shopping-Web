import { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { useLanguage } from '../i18n';

export function UpdateNotification() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
      });

      // Check for updates
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setNeedRefresh(true);
                }
              });
            }
          });
        }
      });

      // Listen for controller change (when update is activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      // Send message to the waiting service worker to activate
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
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
