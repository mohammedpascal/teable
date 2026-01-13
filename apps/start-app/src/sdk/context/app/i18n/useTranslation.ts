import get from 'lodash/get';
import { useCallback, useContext } from 'react';
import { AppContext } from '../AppContext';
import type { TKey, TValue } from './types';

/**
 * CSP-safe string interpolation function.
 * Replaces {{variableName}} patterns with values from options object.
 * Does not use eval() or Function() constructor, making it CSP-compliant.
 */
function interpolate(template: string, options: Record<string, unknown>): string {
  return template.replace(/\{\{([\s\S]+?)\}\}/g, (match, variableName) => {
    const key = variableName.trim();
    const value = options[key];
    
    // Handle null/undefined values
    if (value == null) {
      return match; // Return original placeholder if value not found
    }
    
    // Convert value to string
    return String(value);
  });
}

export const useTranslation = () => {
  const { locale, lang } = useContext(AppContext);
  const t = useCallback(
    (key: TKey, options?: Record<string, unknown>): TValue => {
      const translation = get(locale, key) as unknown as TValue;
      if (!translation) {
        console.warn(`Translation for '${key}' not found.`);
      }
      if (options && typeof translation === 'string') {
        return interpolate(translation, options) as TValue;
      }
      return translation;
    },
    [locale]
  );
  return {
    t,
    lang,
  };
};
