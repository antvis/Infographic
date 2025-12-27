import {Infographic, InfographicHandle} from 'components/Infographic';
import {useEffect, useRef, useState} from 'react';
import {useLocaleBundle} from 'hooks/useTranslation';

const TRANSLATIONS = {
  'zh-CN': {
    title: '实时预览',
    copyButton: '复制图片',
  },
  'en-US': {
    title: 'Live Preview',
    copyButton: 'Copy Image',
  },
};

export function PreviewPanel({
  syntax,
  onError,
  error,
  onCopySuccess,
}: {
  syntax: string;
  onError: (error: string | null) => void;
  error: string | null;
  onCopySuccess: () => void;
}) {
  const texts = useLocaleBundle(TRANSLATIONS);
  const [displaySyntax, setDisplaySyntax] = useState(syntax);
  const debounceTimerRef = useRef<number>(0);
  const infographicRef = useRef<InfographicHandle>(null);

  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce updates for better performance
    debounceTimerRef.current = window.setTimeout(() => {
      setDisplaySyntax(syntax);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [syntax]);

  const handleError = (err: Error | null) => {
    onError(err ? err.message : null);
  };

  const handleCopy = async () => {
    const success = await infographicRef.current?.copyToClipboard();
    if (success) {
      onCopySuccess();
    }
  };

  return (
    <div className="bg-card dark:bg-card-dark rounded-lg shadow-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary dark:text-primary-dark">
          {texts.title}
        </h2>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-sm bg-link hover:bg-link-dark text-white rounded transition-colors">
          {texts.copyButton}
        </button>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}
      <div className="flex-1 w-full flex items-center justify-center border border-border dark:border-border-dark rounded overflow-auto">
        <Infographic
          ref={infographicRef}
          options={displaySyntax}
          onError={handleError}
          enableEditor={true}
        />
      </div>
    </div>
  );
}
