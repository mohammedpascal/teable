import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

/**
 * Hook to load all translation namespaces on app start (client-side only).
 * This ensures all translations are available to all pages 
 */
export const useLoadAllTranslations = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (typeof window === 'undefined') return; // Only run on client

    const loadAll = async () => {
      // Wait for i18n to be initialized
      if (!i18n.isInitialized) {
        await new Promise<void>((resolve) => {
          if (i18n.isInitialized) {
            resolve();
          } else {
            i18n.on('initialized', () => resolve());
          }
        });
      }

      // Load all translation namespaces
      const allNamespaces = [
        'auth',
        'common',
        'system',
        'sdk',
        'share',
        'table',
        'token',
        'setting',
        'oauth',
        'zod',
        'developer',
        'plugin',
        'dashboard',
      ];

      try {
        await i18n.loadNamespaces(allNamespaces);
      } catch (error) {
        console.error('Error loading translation namespaces:', error);
      }
    };

    loadAll();
  }, [i18n]);
};

