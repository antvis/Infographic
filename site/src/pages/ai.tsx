import {Page} from 'components/Layout/Page';
import * as React from 'react';

export default function AIPlayground() {
  const [prompt, setPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: 实现 AI 生成逻辑
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Page
      toc={[]}
      routeTree={{title: 'AI', path: '/ai', routes: []}}
      meta={{title: 'AI 在线体验'}}
      section="ai">
      <div className="flex flex-col min-h-[80vh] p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">AI 生成信息图</h1>
          <p className="text-xl text-secondary dark:text-secondary-dark max-w-3xl mx-auto">
            使用 AI 技术，通过自然语言描述自动生成精美的信息图。
          </p>
        </div>

        <div className="mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入区域 */}
          <div className="flex flex-col space-y-4">
            <div>
              <label
                htmlFor="prompt"
                className="block text-sm font-semibold mb-2">
                描述你想要的信息图
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：创建一个展示2023年全球气候变化趋势的信息图..."
                className="w-full h-64 p-4 border border-border dark:border-border-dark rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark bg-wash dark:bg-wash-dark"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt || isGenerating}
              className="w-full py-3 px-6 bg-primary dark:bg-primary-dark text-white rounded-lg font-semibold hover:bg-primary-dark dark:hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isGenerating ? '生成中...' : '生成信息图'}
            </button>

            <div className="border-t border-border dark:border-border-dark pt-4">
              <h3 className="font-semibold mb-2">提示</h3>
              <ul className="text-sm text-secondary dark:text-secondary-dark space-y-2 list-disc list-inside">
                <li>尽可能详细地描述你的需求</li>
                <li>指定信息图的类型（如：时间线、对比图、流程图等）</li>
                <li>提供具体的数据或数据来源</li>
                <li>说明目标受众和使用场景</li>
              </ul>
            </div>
          </div>

          {/* 右侧：预览区域 */}
          <div className="flex flex-col">
            <div className="mb-2">
              <label className="block text-sm font-semibold">预览</label>
            </div>
            <div className="flex-1 border border-border dark:border-border-dark rounded-lg p-8 bg-wash dark:bg-wash-dark flex items-center justify-center min-h-[400px]">
              {isGenerating ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-primary-dark mx-auto mb-4"></div>
                  <p className="text-secondary dark:text-secondary-dark">
                    正在生成信息图...
                  </p>
                </div>
              ) : (
                <p className="text-secondary dark:text-secondary-dark text-center">
                  生成的信息图将显示在这里
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
