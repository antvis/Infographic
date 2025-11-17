const path = require('path');

module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-dev-config',
    configureWebpack(config, isServer, utils) {
      const isDev = process.env.NODE_ENV === 'development';

      return {
        devtool: isDev ? 'eval-source-map' : 'source-map',
        resolve: {
          symlinks: true,
          // 在开发模式下，直接使用 infographic 的源码
          alias: isDev ? {
            '@antv/infographic': path.resolve(__dirname, '../infographic/src'),
            '@antv/infographic/jsx-runtime': path.resolve(__dirname, '../infographic/src/jsx-runtime'),
          } : {},
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              resolve: {
                fullySpecified: false,
              },
            },
            // 处理 workspace 包的 TypeScript 源码
            isDev && {
              test: /\.tsx?$/,
              include: [
                path.resolve(__dirname, '../infographic/src'),
                path.resolve(__dirname, '../jsx/src'),
              ],
              use: [
                {
                  loader: require.resolve('ts-loader'),
                  options: {
                    transpileOnly: true,
                    configFile: path.resolve(__dirname, '../infographic/tsconfig.json'),
                  },
                },
              ],
            },
          ].filter(Boolean),
        },
        optimization: {
          ...config.optimization,
          moduleIds: 'named',
        },
      };
    },
  };
};
