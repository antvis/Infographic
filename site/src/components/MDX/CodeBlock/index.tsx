import cn from 'classnames';
import * as React from 'react';
import {lazy, memo, Suspense} from 'react';
import {CodeBlockHeader, useCopyableCode, useLanguageLabel} from './shared';
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
  const codeText = (children?.props?.children ?? '').trimEnd();
  const languageLabel = useLanguageLabel(languageClassName);
  const {copied, handleCopy} = useCopyableCode(codeText);
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            'rounded-lg leading-6 h-full w-full overflow-x-auto flex flex-col bg-wash dark:bg-gray-95 shadow-lg text-[13.6px] overflow-hidden',
            !isFromPackageImport && 'my-8'
          )}>
          <CodeBlockHeader
            languageLabel={languageLabel}
            copied={copied}
            onCopy={handleCopy}
          />
          <pre translate="no" dir="ltr" className="py-[18px] ps-5 font-normal">
            <p className="sp-pre-placeholder overflow-hidden">{children}</p>
          </pre>
        </div>
      }>
      <CodeBlock {...props} />
    </Suspense>
  );
});
