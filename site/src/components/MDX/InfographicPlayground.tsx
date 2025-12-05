'use client';

import * as InfographicContext from '@antv/infographic';
import {InfographicOptions} from '@antv/infographic';
import cn from 'classnames';
import {ReactNode, useEffect, useMemo, useRef, useState} from 'react';

import {Infographic as InfographicView} from '../Infographic';
import {CodeEditor} from './CodeEditor';

type PlaygroundBaseProps = {
  className?: string;
  height?: number;
  showPreview?: boolean;
};

type PlaygroundLayoutProps = PlaygroundBaseProps & {
  code: string;
  editorAriaLabel: string;
  language: 'json' | 'javascript';
  onCodeChange: (code: string) => void;
  preview: ReactNode;
};

const DEFAULT_JS_CODE = `import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  data: {
    title: '季度营收概览',
    desc: '按季度拆分的业务营收数据',
    items: [
      { label: 'Q1', value: 68 },
      { label: 'Q2', value: 82 },
      { label: 'Q3', value: 91 },
      { label: 'Q4', value: 105 },
    ],
  },
  themeConfig: { palette: 'antv' },
});

infographic.render();
`;

const parseConfig = (code: string) => {
  return new Function(`return ${code}`)();
};

function PlaygroundErrorBadge({
  message,
  title,
}: {
  message: string;
  title: string;
}) {
  return (
    <div className="absolute left-4 top-4 z-10">
      <div className="relative group">
        <div className="inline-flex h-8 w-8 items-center justify-center text-red-600 dark:text-red-200">
          <svg
            className="text-red-500 dark:text-red-300 drop-shadow-sm"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="absolute left-0 top-full mt-2 hidden group-hover:block">
          <div className="relative w-72 rounded-xl bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-xs shadow-xl p-3">
            <div className="font-semibold mb-1">{title}</div>
            <div className="font-mono text-[11px] leading-relaxed break-words whitespace-pre-wrap">
              {message}
            </div>
            <div className="absolute left-4 -top-1 w-2 h-2 rotate-45 bg-gray-900 dark:bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

const extractCodeFromChildren = (children: ReactNode): string => {
  if (typeof children === 'string') {
    return children.trim();
  }
  if (Array.isArray(children)) {
    return children.map(extractCodeFromChildren).join('\n').trim();
  }
  if (
    children &&
    typeof children === 'object' &&
    'props' in children &&
    (children as any).props
  ) {
    return extractCodeFromChildren((children as any).props.children);
  }
  return '';
};

function useSyncedCode(initialCode: string) {
  const normalizedCode = useMemo(() => initialCode.trim(), [initialCode]);
  const [code, setCode] = useState(normalizedCode);

  useEffect(() => {
    setCode(normalizedCode);
  }, [normalizedCode]);

  return {code, setCode};
}

function PlaygroundLayout({
  className,
  code,
  editorAriaLabel,
  language,
  onCodeChange,
  preview,
}: PlaygroundLayoutProps) {
  return (
    <div className={cn('sandpack sandpack--mdx-playground my-8', className)}>
      <div className="rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 divide-y divide-border dark:divide-border-dark md:divide-y-0 md:divide-x">
          <div className="bg-wash dark:bg-gray-950/70">
            <div className="max-h-[480px] overflow-auto bg-transparent [&_.cm-editor]:h-full [&_.cm-scroller]:h-full">
              <CodeEditor
                ariaLabel={editorAriaLabel}
                className="bg-transparent"
                language={language}
                onChange={onCodeChange}
                value={code}
              />
            </div>
          </div>
          {preview}
        </div>
      </div>
    </div>
  );
}

function ConfigPreview({
  fallbackConfig,
  className,
  code,
}: {
  fallbackConfig: Partial<InfographicOptions>;
  className?: string;
  code: string;
}) {
  const [lastValidConfig, setLastValidConfig] =
    useState<Partial<InfographicOptions>>(fallbackConfig);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parsed = parseConfig(code);
      setLastValidConfig(parsed);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [code]);

  useEffect(() => {
    setLastValidConfig(fallbackConfig);
  }, [fallbackConfig]);

  return (
    <div
      className={cn(
        'relative flex flex-col bg-white dark:bg-gray-950',
        className
      )}>
      {error ? (
        <PlaygroundErrorBadge message={error} title="JSON 解析失败" />
      ) : null}
      <div className="flex-1 bg-transparent overflow-hidden">
        <InfographicView options={{padding: 20, ...lastValidConfig}} />
      </div>
    </div>
  );
}

/**
 * 基于 JSON 配置的 Infographic 交互编辑器，用于文档页内嵌示例。
 */
export function InfographicConfigPlayground({
  className,
  initialOptions = {},
  initialCode: initialCodeProp,
}: PlaygroundBaseProps & {
  initialOptions?: Partial<InfographicOptions>;
  initialCode?: string;
}) {
  const normalizedInitialCode = useMemo(() => {
    if (initialCodeProp) return initialCodeProp.trim();
    return JSON.stringify(initialOptions, null, 2);
  }, [initialCodeProp, initialOptions]);
  const {code, setCode} = useSyncedCode(normalizedInitialCode);

  return (
    <PlaygroundLayout
      className={className}
      code={code}
      editorAriaLabel="Infographic JSON configuration editor"
      language="json"
      onCodeChange={setCode}
      preview={
        <ConfigPreview
          fallbackConfig={initialOptions}
          className="bg-white dark:bg-gray-950"
          code={code}
        />
      }
    />
  );
}

/**
 * 原样运行用户编写的 JS 代码，只内置 @antv/infographic 依赖。
 */
function JsCodeRunnerPreview({code}: {code: string}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    setError(null);

    const cleaned = (code || '')
      // remove import lines
      .replace(/^\s*import[^;]*;?\s*$/gm, '')
      // remove export default keywords
      .replace(/^\s*export\s+default\s+/gm, '');

    try {
      const runner = new Function(
        ...Object.keys(InfographicContext),
        'container',
        cleaned
      );
      runner(...Object.values(InfographicContext), containerRef.current);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [code]);

  return (
    <div className="relative h-full bg-white dark:bg-gray-950">
      {error ? <PlaygroundErrorBadge message={error} title="运行出错" /> : null}
      <div className="h-full min-h-[280px] w-full overflow-hidden">
        <div
          id="container"
          ref={containerRef}
          className="h-full w-full bg-white dark:bg-gray-950"
        />
      </div>
    </div>
  );
}

export function InfographicJsPlayground({
  className,
  initialCode = DEFAULT_JS_CODE,
  showPreview = true,
}: PlaygroundBaseProps & {
  initialCode?: string;
}) {
  const {code, setCode} = useSyncedCode(initialCode);

  return (
    <PlaygroundLayout
      className={className}
      code={code}
      editorAriaLabel="Infographic JavaScript editor"
      language="javascript"
      onCodeChange={setCode}
      preview={
        showPreview ? (
          <div className="bg-white dark:bg-gray-950">
            <JsCodeRunnerPreview code={code} />
          </div>
        ) : null
      }
    />
  );
}

/**
 * 便捷写法：<Infographic> 包裹 JSON 代码块即可渲染。
 */
export function InfographicBlock({
  children,
  className,
}: PlaygroundBaseProps & {children?: ReactNode}) {
  const code = extractCodeFromChildren(children);
  let parsed: Partial<InfographicOptions> = {};
  try {
    parsed = JSON.parse(code);
  } catch (e) {
    console.error('Invalid JSON for <Infographic />', e);
  }

  return (
    <InfographicConfigPlayground
      className={className}
      initialOptions={parsed}
      initialCode={code || undefined}
    />
  );
}

/**
 * 便捷写法：<CodeRunner> 包裹 JS 代码块即可运行（内置 div#container）。
 */
export function CodeRunner({
  children,
  className,
}: PlaygroundBaseProps & {children?: ReactNode}) {
  const code = extractCodeFromChildren(children);

  return <InfographicJsPlayground className={className} initialCode={code} />;
}
