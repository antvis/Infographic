import {Page} from 'components/Layout/Page';

export default function Examples() {
  return (
    <Page
      toc={[]}
      routeTree={{title: '示例', path: '/examples', routes: []}}
      meta={{title: '示例'}}
      section="examples">
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <h1 className="text-5xl font-bold mb-6">信息图示例</h1>
        <p className="text-xl text-secondary dark:text-secondary-dark text-center max-w-3xl mb-8">
          探索各种信息图示例，学习如何使用我们的工具创建精美的可视化内容。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {/* 示例卡片占位符 */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="border border-border dark:border-border-dark rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-gray-100 dark:bg-gray-800 h-48 rounded-md mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">示例 {item}</h3>
              <p className="text-sm text-secondary dark:text-secondary-dark">
                这是一个信息图示例的描述。
              </p>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}
