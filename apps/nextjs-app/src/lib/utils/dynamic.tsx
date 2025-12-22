import { lazy, Suspense, type ComponentType } from 'react';

type DynamicOptions = {
  loading?: () => JSX.Element | null;
  ssr?: boolean;
};

type DynamicImport<T = ComponentType<any>> = () => Promise<{ default: T } | T>;

/**
 * Custom dynamic import function that mimics next/dynamic API
 * Uses React.lazy() and Suspense internally for code splitting
 */
export default function dynamic<T = ComponentType<any>>(
  importFn: DynamicImport<T>,
  options?: DynamicOptions
): ComponentType<any> {
  // Wrap the import function to ensure it returns { default: Component }
  // React.lazy requires the promise to resolve to { default: Component }
  const wrappedImportFn = () =>
    importFn().then((module) => {
      // If module already has default, return as is
      if (module && typeof module === 'object' && 'default' in module) {
        return module as { default: T };
      }
      // Otherwise, wrap the component in { default: ... }
      return { default: module as T };
    });

  const LazyComponent = lazy(wrappedImportFn);

  const DynamicComponent = (props: any) => {
    return (
      <Suspense fallback={options?.loading?.() || null}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };

  // Set display name for better debugging
  DynamicComponent.displayName = 'DynamicComponent';

  return DynamicComponent;
}

