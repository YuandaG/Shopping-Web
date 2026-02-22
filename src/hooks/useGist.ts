import { useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import type { GistData } from '../types';

const GIST_API_URL = 'https://api.github.com/gists';
const GIST_FILENAME = 'shopping-web-data.json';

interface UseGistReturn {
  isLoading: boolean;
  error: string | null;
  createGist: (token: string) => Promise<string | null>;
  loadFromGist: (gistId: string, token: string) => Promise<boolean>;
  saveToGist: () => Promise<boolean>;
}

export function useGist(): UseGistReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { settings, exportData, importData, updateSettings } = useStore();

  const createGist = useCallback(async (token: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = exportData();
      const response = await fetch(GIST_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: 'Shopping Web - 菜谱与购物清单数据',
          public: false,
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(data, null, 2),
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '创建 Gist 失败');
      }

      const gist = await response.json();
      updateSettings({ gistId: gist.id, gistToken: token, lastSync: Date.now() });

      return gist.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : '创建 Gist 失败';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [exportData, updateSettings]);

  const loadFromGist = useCallback(async (gistId: string, token: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${GIST_API_URL}/${gistId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '加载 Gist 失败');
      }

      const gist = await response.json();
      const file = gist.files[GIST_FILENAME];

      if (!file) {
        throw new Error('Gist 中找不到数据文件');
      }

      const data: GistData = JSON.parse(file.content);

      // 先保存当前 token，再导入数据
      const savedToken = token;
      importData(data);
      // 导入后重新设置 token（确保不被覆盖）
      updateSettings({ gistId, gistToken: savedToken, lastSync: Date.now() });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载 Gist 失败';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [importData, updateSettings]);

  const saveToGist = useCallback(async (): Promise<boolean> => {
    if (!settings.gistId || !settings.gistToken) {
      setError('未配置 Gist');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = exportData();
      const response = await fetch(`${GIST_API_URL}/${settings.gistId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${settings.gistToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(data, null, 2),
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '保存 Gist 失败');
      }

      updateSettings({ lastSync: Date.now() });
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '保存 Gist 失败';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [settings.gistId, settings.gistToken, exportData, updateSettings]);

  return {
    isLoading,
    error,
    createGist,
    loadFromGist,
    saveToGist,
  };
}
