import cn from 'classnames';
import {lazy, memo, Suspense} from 'react';
import type {CodeBlockProps} from './CodeBlock';
import {
  CodeBlockHeader,
  shouldShowCopyButton,
  useCopyableCode,
  useLanguageLabel,
} from './shared';
const CodeBlock = lazy<(typeof import('./CodeBlock'))['default']>(
  () => import('./CodeBlock')
);

export type {CodeBlockProps};

export default memo(function CodeBlockWrapper(props: CodeBlockProps): any {
  const {children, isFromPackageImport = false, label, className} = props;
  const languageClassName = children?.props?.className ?? '';
  const codeText = (children?.props?.children ?? '').trimEnd();
  const defaultLanguageLabel = useLanguageLabel(languageClassName);
  const languageLabel = label || defaultLanguageLabel;
  const {copied, handleCopy} = useCopyableCode(codeText);
  const showCopyButton =
    props.showCopy ?? shouldShowCopyButton(children?.props?.meta);
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            'rounded-lg leading-6 h-full w-full overflow-x-auto flex flex-col bg-wash dark:bg-gray-95 shadow-lg text-[13.6px] overflow-hidden',
            !props.noMargin && !isFromPackageImport && 'my-8',
            className
          )}>
          <CodeBlockHeader
            languageLabel={languageLabel}
            copied={copied}
            onCopy={handleCopy}
            showCopy={showCopyButton}
          />
          <pre
            translate="no"
            dir="ltr"
            className="py-[18px] ps-5 font-normal flex-1 min-h-0">
            <div className="sp-pre-placeholder overflow-hidden">{children}</div>
          </pre>
        </div>
      }>
      <CodeBlock {...props} />
    </Suspense>
  );
});
