# My Documentation Site

基于 React.dev 构建的自定义文档网站。

## 快速开始

### 环境要求

1. Git
2. Node.js: v16.8.0 或更高版本

### 安装

1. `cd react.dev` 进入项目根目录
2. 安装依赖：

```bash
npm install
```

### 本地开发

启动开发服务器（基于 [Next.js](https://nextjs.org/)）：

```bash
# npm
npm run dev
```

然后打开浏览器访问 `http://localhost:3000`

## 项目结构

- `/src/content` - Markdown 文档内容
- `/src/components` - React 组件
- `/src/pages` - Next.js 页面路由
- `/public` - 静态资源

## 开发

### 代码检查

执行 Prettier、ESLint 和类型检查：

```bash
npm run check-all
```

### 构建

构建生产版本：

```bash
npm run build
```

## License

MIT
