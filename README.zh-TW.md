<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [簡體中文](./README.zh-CN.md) | 繁體中文 | [English](./README.md)

<div align="center">

# Infographic, bring words to life!

🦋 新一代資訊圖可視化引擎，讓文字資訊栩栩如生！

<a href="https://trendshift.io/repositories/15838" target="_blank"><img src="https://trendshift.io/api/badge/repositories/15838" alt="antvis%2FInfographic | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>

[![npm version](https://img.shields.io/npm/v/@antv/infographic.svg)](https://www.npmjs.com/package/@antv/infographic)
[![build status](https://img.shields.io/github/actions/workflow/status/antvis/infographic/build.yml)](https://github.com/antvis/infographic/actions)
![Visitors](https://hitscounter.dev/api/hit?url=https://github.com/antvis/infographic&label=Visitors&icon=graph-up&color=%23dc3545&message=&style=flat&tz=UTC)
[![license](https://img.shields.io/npm/l/@antv/infographic.svg)](./LICENSE)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*EdkXSojOxqsAAAAAQHAAAAgAemJ7AQ/original" width="256">

</div>

**AntV Infographic** 是 AntV 推出的新一代**聲明式資訊圖可視化引擎**，通過精心設計的資訊圖語法，能夠快速、靈活地渲染出高品質的資訊圖，讓資訊表達更高效，讓數據敘事更簡單。

<div align="center">

<p align="center">
  <a href="https://infographic.antv.vision">
    <img src="https://img.shields.io/badge/%E5%AE%98%E7%B6%B2-2F54EB?style=for-the-badge" alt="官網" />
  </a>
  <a href="https://github.com/antvis/infographic">
    <img src="https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://infographic.antv.vision/learn">
    <img src="https://img.shields.io/badge/%E6%96%87%E4%BB%B6-722ED1?style=for-the-badge" alt="文件" />
  </a>
  <a href="https://infographic.antv.vision/gallery">
    <img src="https://img.shields.io/badge/%E7%AF%84%E4%BE%8B-13C2C2?style=for-the-badge" alt="範例" />
  </a>
  <a href="./prompt.zh-TW.md">
    <img src="https://img.shields.io/badge/Prompt-FA8C16?style=for-the-badge" alt="Prompt" />
  </a>
  <a href="https://infographic.antv.vision/ai">
    <img src="https://img.shields.io/badge/AI%20Agent-EB2F96?style=for-the-badge" alt="AI Agent" />
  </a>
</p>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ZdeISZWHuyIAAAAAbEAAAAgAemJ7AQ/fmt.webp" width="768" alt="AntV Infographic 預覽">

</div>

## ✨ 特性

- 🤖 **AI 友好**：配置和語法更適合 AI 生成，提供簡潔有效的 Prompt，支持 AI 流式輸出和渲染
- 📦 **開箱即用**：內建 ~200 資訊圖模板、數據項組件與布局，快速構建專業資訊圖
- 🎨 **主題系統**：支持手繪、漸變、圖案、多套預設主題，允許深度自訂
- 🧑🏻‍💻 **內建編輯器**：內建資訊圖的編輯器，讓 AI 生成之後可以二次編輯
- 📐 **高品質 SVG 輸出**：默認基於 SVG 渲染，保證視覺品質與可編輯性

## 🚀 安裝

```bash
npm install @antv/infographic
```

## 📝 快速開始

[![](https://img.shields.io/badge/%E5%85%A5%E9%96%80%E6%8C%87%E5%8D%97-2F54EB)](https://infographic.antv.vision/learn/getting-started)
[![](https://img.shields.io/badge/%E8%B3%87%E8%A8%8A%E5%9C%96%E8%AA%9E%E6%B3%95-13C2C2)](https://infographic.antv.vision/learn/infographic-syntax)
[![](https://img.shields.io/badge/%E9%85%8D%E7%BD%AE%E9%A0%85-722ED1)](https://infographic.antv.vision/reference/infographic-options)

```ts
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  width: '100%',
  height: '100%',
  editable: true,
});

infographic.render(`
infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Step 1
      desc: Start
    - label: Step 2
      desc: In Progress
    - label: Step 3
      desc: Complete
`);
```

渲染結果如下：

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*uvj8Qb26F1MAAAAARAAAAAgAemJ7AQ/fmt.webp" width="480" alt="AntV Infographic DEMO">

## 流式渲染

[![](https://img.shields.io/badge/Demo-D46A6A)](https://infographic.antv.vision/learn/infographic-syntax)

使用具有高容錯性的資訊圖語法能夠即時接收 AI 流式輸出並逐步渲染資訊圖。

```ts
let buffer = '';
for (const chunk of chunks) {
  buffer += chunk;
  infographic.render(buffer);
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*e_PFSZrR9AQAAAAASdAAAAgAemJ7AQ/original" width="480" alt="AntV Infographic 流式渲染">

## 💬 社區與交流

- 在 GitHub 提交你的問題或建議
- 參與 [GitHub Discussions](https://github.com/antvis/infographic/discussions) 與社區交流
- 歡迎參與貢獻，一起完善 AntV Infographic！

如有任何建議，歡迎在 GitHub 上與我們交流！歡迎 Star ⭐ 支持我們。

- [AntV 官網](https://antv.antgroup.com/)
- [GitHub 倉庫](https://github.com/antvis/infographic)
- [問題回饋](https://github.com/antvis/infographic/issues)

## 📄 許可證

本項目基於 **MIT** 許可開源，詳見 [LICENSE](./LICENSE)。
