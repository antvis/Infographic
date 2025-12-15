import {InfographicOptions} from '@antv/infographic';
import {motion} from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  Maximize2,
  RotateCcw,
} from 'lucide-react';
import {useRouter} from 'next/router';
import {useEffect, useRef, useState} from 'react';
import {CodeEditor} from '../MDX/CodeEditor';
import {TEMPLATES} from './templates';

const generateJavaScriptCode = async (config: Partial<InfographicOptions>) => {
  const options = {
    container: '#container',
    ...config,
  };
  const code = `import { Infographic } from '@antv/infographic';

const infographic = new Infographic(${JSON.stringify(options, null, 2)});

infographic.render();`;

  try {
    const prettier = await import('prettier/standalone');
    const parserBabel = await import('prettier/plugins/babel');

    return await prettier.format(code, {
      parser: 'babel',
      plugins: [parserBabel],
      semi: true,
      singleQuote: true,
      tabWidth: 2,
    });
  } catch (error) {
    console.error('Format error:', error);
    return code;
  }
};

const parseConfigFromCode = (code: string) => {
  try {
    const match = code.match(/new\s+Infographic\s*\(\s*\{([\s\S]*?)\}\s*\)/);

    if (!match || !match[1]) {
      return null;
    }

    let configStr = match[1].trim();
    const lines = configStr.split('\n');
    const filteredLines = lines.filter((line) => {
      const trimmed = line.trim();
      return (
        !trimmed.startsWith('container:') &&
        !trimmed.startsWith('"container":') &&
        !trimmed.startsWith("'container':")
      );
    });

    configStr = filteredLines.join('\n');
    const jsonStr = `{${configStr}}`;
    const config = new Function(`return ${jsonStr}`)();

    return config;
  } catch (e) {
    console.error('Parse error:', e);
    return null;
  }
};

export default function DetailPage() {
  const router = useRouter();
  const {template} = router.query;

  const initialTemplate =
    TEMPLATES.find((t) => t.template === template) || TEMPLATES[0];

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const infographicRef = useRef<any>(null);

  // 初始化代码模版
  useEffect(() => {
    const initialize = async () => {
      const initialCode = await generateJavaScriptCode(initialTemplate);
      setCode(initialCode);
    };
    initialize();
  }, [initialTemplate]);

  useEffect(() => {
    if (!containerRef.current || !code) return;

    try {
      containerRef.current.innerHTML = '';

      if (infographicRef.current) {
        infographicRef.current.destroy?.();
        infographicRef.current = null;
      }
      const config = parseConfigFromCode(code);

      if (!config) {
        setError('Syntax Error: Invalid configuration object');
        return;
      }

      import('@antv/infographic')
        .then(({Infographic}) => {
          const infographic = new Infographic({
            container: containerRef.current,
            ...config,
            width: '100%',
            height: '100%',
          });

          infographic.render();
          infographicRef.current = infographic;
          setError(null);
        })
        .catch((err) => {
          console.error('Render error:', err);
          setError(`Render Error: ${err.message}`);
        });
    } catch (err: any) {
      console.error('Execution error:', err);
      setError(`Execution Error: ${err.message}`);
    }

    return () => {
      if (infographicRef.current) {
        infographicRef.current.destroy?.();
        infographicRef.current = null;
      }
    };
  }, [code]);

  const handleCodeChange = (e: string) => {
    setCode(e);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-wash dark:bg-gray-95 flex overflow-hidden text-primary dark:text-primary-dark">
      {/* Left Panel: Canvas */}
      <div className="flex-1 relative bg-gray-10/60 dark:bg-gray-95 flex flex-col overflow-hidden">
        <motion.button
          initial={{opacity: 0, x: -20}}
          animate={{opacity: 1, x: 0}}
          onClick={handleBack}
          className="absolute top-6 left-6 z-30 p-3 bg-card dark:bg-card-dark rounded-full shadow-nav dark:shadow-nav-dark border border-primary/10 dark:border-primary-dark/10 text-secondary dark:text-secondary-dark hover:text-link hover:dark:text-link-dark hover:scale-105 transition-all group"
          title="Back to Gallery">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </motion.button>

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.4] z-0 dark:hidden"
          style={{
            backgroundImage:
              'radial-gradient(var(--tw-prose-bullets, #cbd5e1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}></div>

        <div className="flex-1 overflow-auto flex items-center justify-center p-8 custom-scrollbar relative z-10">
          <div
            className="relative bg-card dark:bg-card-dark rounded-2xl shadow-nav dark:shadow-nav-dark border border-primary/10 dark:border-primary-dark/10 overflow-hidden transition-all duration-300"
            style={{width: '100%', maxWidth: '1000px', minHeight: '640px'}}>
            <div className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity z-20">
              <button className="p-2 bg-card/90 dark:bg-card-dark/90 backdrop-blur rounded-lg shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark border border-primary/10 dark:border-primary-dark/10 text-secondary dark:text-secondary-dark hover:text-primary hover:dark:text-primary-dark">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* 直接渲染容器 */}
            <div
              id="container"
              ref={containerRef}
              className="w-full h-full p-8 flex items-center justify-center"
              style={{minHeight: '600px'}}></div>

            {/* 错误提示 */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/95 dark:bg-card-dark/95 backdrop-blur">
                <div className="text-center p-6 max-w-md">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-sm text-red-600 font-mono">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: Code Editor */}
      <div className="w-[480px] bg-card dark:bg-card-dark border-l border-primary/10 dark:border-primary-dark/10 flex flex-col z-20 shadow-[-10px_0_40px_rgba(0,0,0,0.08)] dark:shadow-nav-dark">
        <div className="h-14 border-b border-primary/10 dark:border-primary-dark/10 flex items-center justify-between px-4 bg-card dark:bg-card-dark shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-10 dark:bg-gray-90 rounded border border-primary/10 dark:border-primary-dark/15">
              <span className="text-[10px] font-semibold text-tertiary dark:text-tertiary-dark uppercase">
                Template
              </span>
              <span className="text-xs font-mono text-primary dark:text-primary-dark font-semibold">
                index.js
              </span>
            </div>
            {error && (
              <span className="text-[11px] text-red-500 flex items-center gap-1 font-medium animate-pulse">
                <AlertCircle className="w-3 h-3" /> Error
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () =>
                setCode(await generateJavaScriptCode(initialTemplate))
              }
              className="p-2 text-tertiary dark:text-tertiary-dark hover:text-primary hover:dark:text-primary-dark hover:bg-gray-40/5 dark:hover:bg-gray-60/5 rounded-md transition-colors"
              title="Reset Code">
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-primary/10 dark:bg-primary-dark/15 mx-1" />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-primary dark:text-primary-dark hover:text-link hover:dark:text-link-dark hover:bg-gray-40/5 dark:hover:bg-gray-60/5 rounded-md text-xs font-semibold transition-colors">
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              Copy
            </button>
          </div>
        </div>

        <div className="flex-1 relative bg-gray-10/30 dark:bg-gray-90/30 overflow-hidden">
          <div className="h-full overflow-auto custom-scrollbar">
            <CodeEditor
              className="w-full resize-none font-mono text-sm lg:text-[15px] text-secondary dark:text-secondary-dark bg-transparent focus:outline-none selection:bg-link/20 dark:selection:bg-link-dark/20"
              language={'javascript'}
              onChange={handleCodeChange}
              value={code}
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-card/80 dark:bg-card-dark/80 backdrop-blur border-t border-primary/10 dark:border-primary-dark/10 text-[10px] text-tertiary dark:text-tertiary-dark flex justify-between items-center">
            <span>Line {code.split('\n').length}, Col 1</span>
            <span>UTF-8 • JavaScript</span>
          </div>
        </div>
      </div>
    </div>
  );
}
