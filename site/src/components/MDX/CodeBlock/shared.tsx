import cn from 'classnames';
import {IconCopy} from 'components/Icon/IconCopy';
import {useCallback, useEffect, useMemo, useState} from 'react';

export function useLanguageLabel(languageClassName?: string) {
  return useMemo(
    () => getLanguageLabel(languageClassName),
    [languageClassName]
  );
}

export function useCopyableCode(code: string) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = useCallback(() => {
    window.navigator.clipboard.writeText(code);
    setCopied(true);
  }, [code]);

  return {copied, handleCopy};
}

export function CodeBlockHeader({
  className,
  languageLabel,
  copied,
  onCopy,
}: {
  className?: string;
  languageLabel: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between w-full px-4 py-2 text-sm border-b border-border dark:border-border-dark',
        'bg-wash text-secondary dark:bg-gray-80 dark:text-primary-dark',
        className
      )}>
      <span className="font-mono text-xs uppercase tracking-wide opacity-80">
        {languageLabel}
      </span>
      <button
        className={cn(
          'inline-flex items-center gap-2 text-xs font-medium rounded-md px-3 py-1 transition-colors',
          'bg-gray-10 text-secondary hover:bg-gray-20 dark:bg-gray-70 dark:text-primary-dark dark:hover:bg-gray-60'
        )}
        onClick={onCopy}>
        <IconCopy className="h-3.5 w-3.5" />
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

function getLanguageLabel(languageClassName?: string) {
  if (!languageClassName) return 'Code';
  return languageClassName.replace('language-', '').toUpperCase();
}
