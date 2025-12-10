import {motion} from 'framer-motion';
import {PadView} from '../Layout/HomePage/PadView';
import {Page} from '../Layout/Page';

export function IconPageContent() {
  return (
    <Page
      toc={[]}
      routeTree={{title: 'Icon', path: '/icon', routes: []}}
      meta={{title: 'Icon 智能推荐'}}
      section="icon">
      <div className="relative isolate overflow-hidden min-h-screen bg-wash dark:bg-wash-dark text-primary dark:text-primary-dark selection:bg-link/20 selection:dark:bg-link-dark/20">
        {/* Background decorations */}
        <div className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-gradient-to-br from-link/20 via-link/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-40/15 via-transparent to-link/5 blur-3xl" />

        {/* Header Area */}
        <div className="pt-20 pb-12 px-5 sm:px-12 max-w-7xl mx-auto text-center md:text-left relative z-10">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-primary dark:text-primary-dark select-none">
              Infographic{' '}
              <span className="bg-gradient-to-r from-link to-purple-40 bg-clip-text text-transparent">
                Icon
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-secondary dark:text-secondary-dark max-w-3xl leading-relaxed select-none">
              描述你需要的图标，我们将从 100,000+ 图标库中为你推荐最佳匹配。
            </p>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="px-5 sm:px-12 pb-24 max-w-[90rem] mx-auto relative z-10">
          <div className="flex flex-col xl:flex-row gap-12 xl:gap-8 items-start">
            {/* Left Column: Fixed Pad */}
            <div className="w-full xl:w-[55%] xl:sticky xl:top-24 xl:max-h-[calc(100vh-8rem)] flex-shrink-0 flex items-center justify-center">
              <motion.div
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.6, delay: 0.2}}
                className="w-full max-w-3xl">
                <PadView enableIconSearch={true} />
              </motion.div>
            </div>

            {/* Right Column: Scrollable API Documentation */}
            <motion.div
              initial={{opacity: 0, x: 20}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.6, delay: 0.4}}
              className="w-full xl:w-[40%] pt-8 xl:pt-0 flex-shrink-0">
              <section className="border-t xl:border-t-0 border-gray-10 dark:border-gray-80 pt-16 xl:pt-0">
                <h2 className="text-2xl font-bold mb-6 text-primary dark:text-primary-dark flex items-center gap-2">
                  <div className="w-1 h-6 bg-link rounded-full" />
                  OpenAPI
                </h2>

                <div className="space-y-8">
                  {/* Endpoint */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary dark:text-primary-dark">
                      Endpoint
                    </h3>
                    <div className="bg-gray-5 dark:bg-gray-90 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-10 dark:border-gray-80 text-secondary dark:text-secondary-dark">
                      <span className="text-green-600 dark:text-green-400 font-bold mr-2">
                        POST
                      </span>
                      https://www.weavefox.cn/api/open/v1/icon
                    </div>
                  </div>

                  {/* Request */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary dark:text-primary-dark">
                      Request
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-card-dark p-4 rounded-lg border border-gray-10 dark:border-gray-80">
                        <div className="flex items-baseline gap-2 mb-2">
                          <code className="text-base font-mono text-secondary dark:text-secondary-dark">
                            text
                          </code>
                          <span className="text-sm font-mono text-pink-500">
                            string
                          </span>
                          <span className="text-sm text-red-500">*</span>
                        </div>
                        <p className="text-sm text-secondary dark:text-secondary-dark">
                          图标描述文本，例如 "数据分析"
                        </p>
                      </div>
                      <div className="bg-white dark:bg-card-dark p-4 rounded-lg border border-gray-10 dark:border-gray-80">
                        <div className="flex items-baseline gap-2 mb-2">
                          <code className="text-base font-mono text-secondary dark:text-secondary-dark">
                            topK
                          </code>
                          <span className="text-sm font-mono text-pink-500">
                            number
                          </span>
                          <span className="text-sm text-gray-40 dark:text-gray-60">
                            default: 5
                          </span>
                        </div>
                        <p className="text-sm text-secondary dark:text-secondary-dark">
                          返回结果数量 (1-20)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Response */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary dark:text-primary-dark">
                      Response
                    </h3>
                    <div className="bg-gray-5 dark:bg-gray-90 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-10 dark:border-gray-80">
                      <pre className="text-secondary dark:text-secondary-dark">
                        {`{
  "status": true,
  "message": "success",
  "data": {
    "success": true,
    "data": [
      "https://example.com/icon1.svg",
      "https://example.com/icon2.svg"
    ]
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          </div>
        </div>

        {/* Optional: Noise Texture Overlay for modern feel */}
        <div
          className="fixed inset-0 opacity-[0.02] pointer-events-none z-0 dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}></div>
      </div>
    </Page>
  );
}
