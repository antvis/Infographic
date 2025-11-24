import cn from 'classnames';
import {IconCopy} from 'components/Icon/IconCopy';
import * as React from 'react';
import {lazy, memo, Suspense, useEffect, useMemo, useState} from 'react';
const CodeBlock = lazy(() => import('./CodeBlock'));

export default memo(function CodeBlockWrapper(props: {
  children: React.ReactNode & {
    props: {
      className: string;
      children: string;
      meta?: string;
    };
  };
  isFromPackageImport: boolean;
  noMargin?: boolean;
  noMarkers?: boolean;
}): any {
  const {children, isFromPackageImport} = props;
  const languageClassName = children?.props?.className ?? '';
  const languageLabel = useMemo(() => {
    if (!languageClassName) return 'Code';
    const clean = languageClassName.replace('language-', '');
    return clean.toUpperCase();
  }, [languageClassName]);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);
  const handleCopy = () => {
    window.navigator.clipboard.writeText(children?.props?.children ?? '');
    setCopied(true);
  };
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            'rounded-lg leading-6 h-full w-full overflow-x-auto flex flex-col bg-wash dark:bg-gray-95 shadow-lg text-[13.6px] overflow-hidden',
            !isFromPackageImport && 'my-8'
          )}>
          <div
            className={cn(
              'flex items-center justify-between w-full px-4 py-2 text-sm border-b border-border dark:border-border-dark',
              'bg-wash text-secondary dark:bg-gray-80 dark:text-primary-dark'
            )}>
            <span className="font-mono text-xs uppercase tracking-wide opacity-80">
              {languageLabel}
            </span>
            <button
              className={cn(
                'inline-flex items-center gap-2 text-xs font-medium rounded-md px-3 py-1 transition-colors',
                'bg-gray-10 text-secondary hover:bg-gray-20 dark:bg-gray-70 dark:text-primary-dark dark:hover:bg-gray-60'
              )}
              onClick={handleCopy}>
              <IconCopy className="h-3.5 w-3.5" />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre translate="no" dir="ltr" className="py-[18px] ps-5 font-normal">
            <p className="sp-pre-placeholder overflow-hidden">{children}</p>
          </pre>
        </div>
      }>
      <CodeBlock {...props} />
    </Suspense>
  );
});
