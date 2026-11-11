<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [简体中文](./README.zh-CN.md) | [English](./README.md) | 日本語

<div align="center">

# Infographic, bring words to life!

🦋 インフォグラフィックの生成・レンダリングフレームワーク。言葉に命を吹き込みます！

<a href="https://trendshift.io/repositories/15838" target="_blank"><img src="https://trendshift.io/api/badge/repositories/15838" alt="antvis%2FInfographic | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>

[![npm version](https://img.shields.io/npm/v/@antv/infographic.svg)](https://www.npmjs.com/package/@antv/infographic)
[![build status](https://img.shields.io/github/actions/workflow/status/antvis/infographic/build.yml)](https://github.com/antvis/infographic/actions)
![Visitors](https://hitscounter.dev/api/hit?url=https://github.com/antvis/infographic&label=Visitors&icon=graph-up&color=%23dc3545&message=&style=flat&tz=UTC)
[![license](https://img.shields.io/npm/l/@antv/infographic.svg)](./LICENSE)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*EdkXSojOxqsAAAAAQHAAAAgAemJ7AQ/original" width="256">

</div>

**AntV Infographic** は、AntV の次世代の**宣言型インフォグラフィック可視化エンジン**です。丁寧に設計されたインフォグラフィック構文により、高品質なインフォグラフィックを素早く柔軟にレンダリングでき、情報の提示をより効率的に、データストーリーテリングをよりシンプルにします。

<div align="center">

<p align="center">
  <a href="https://infographic.antv.vision">
    <img src="https://img.shields.io/badge/Website-2F54EB?style=for-the-badge" alt="Website" />
  </a>
  <a href="https://github.com/antvis/infographic">
    <img src="https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://infographic.antv.vision/learn">
    <img src="https://img.shields.io/badge/Docs-722ED1?style=for-the-badge" alt="Docs" />
  </a>
  <a href="https://infographic.antv.vision/gallery">
    <img src="https://img.shields.io/badge/Gallery-13C2C2?style=for-the-badge" alt="Gallery" />
  </a>
  <a href="https://github.com/antvis/Infographic/tree/main/skills">
    <img src="https://img.shields.io/badge/Skills-FA8C16?style=for-the-badge" alt="Skills" />
  </a>
  <a href="https://infographic.antv.vision/ai">
    <img src="https://img.shields.io/badge/AI%20Agent-EB2F96?style=for-the-badge" alt="AI Agent" />
  </a>
</p>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ZdeISZWHuyIAAAAAbEAAAAgAemJ7AQ/fmt.webp" width="768" alt="AntV Infographic のプレビュー">

</div>

## ✨ 特長

- 🤖 **AI フレンドリー**：設定と構文は AI による生成に合わせて調整されており、簡潔なプロンプトを提供し、AI のストリーミング出力とレンダリングに対応しています
- 📦 **すぐに使える**：約 200 種類の組み込みインフォグラフィックテンプレート、データ項目コンポーネント、レイアウトにより、プロフェッショナルなインフォグラフィックを数分で作成できます
- 🎨 **テーマシステム**：手描き風、グラデーション、パターン、複数のプリセットテーマに加え、深いカスタマイズが可能です
- 🧑🏻‍💻 **エディタ内蔵**：インフォグラフィック用のエディタを備えており、AI が生成した結果をさらに編集できます
- 📐 **高品質な SVG 出力**：デフォルトで SVG によりレンダリングし、見た目の忠実さと編集のしやすさを確保します

## 🚀 インストール

```bash
npm install @antv/infographic
```

## 📝 クイックスタート

[![](https://img.shields.io/badge/Getting%20Started-2F54EB)](https://infographic.antv.vision/learn/getting-started)
[![](https://img.shields.io/badge/Infographic%20Syntax-13C2C2)](https://infographic.antv.vision/learn/infographic-syntax)
[![](https://img.shields.io/badge/Configuration-722ED1)](https://infographic.antv.vision/reference/infographic-options)

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
  lists
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete
`);
```

レンダリング結果は次のようになります。

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*uvj8Qb26F1MAAAAARAAAAAgAemJ7AQ/fmt.webp" width="480" alt="AntV Infographic のデモ">

## ストリーミングレンダリング

[![](https://img.shields.io/badge/Demo-D46A6A)](https://infographic.antv.vision/learn/infographic-syntax)

耐障害性の高いインフォグラフィック構文により、AI の出力をリアルタイムにストリーミングし、インフォグラフィックを段階的にレンダリングできます。

```ts
let buffer = '';
for (const chunk of chunks) {
  buffer += chunk;
  infographic.render(buffer);
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*e_PFSZrR9AQAAAAASdAAAAgAemJ7AQ/original" width="480" alt="AntV Infographic のストリーミングレンダリング">

## 🔧 スキルの統合

AntV Infographic は、AI エージェントと連携するためのスキルを提供しています。

- **infographic-creator**：インフォグラフィックをレンダリングする HTML ファイルを作成します
- **infographic-syntax-creator**：説明文からインフォグラフィック構文を生成します
- **infographic-structure-creator**：カスタムの構造デザインを生成します
- **infographic-item-creator**：カスタムの項目デザインを生成します
- **infographic-template-updater**：（開発者向け）テンプレートライブラリを更新します

### Claude Code

> Claude マーケットプレイスが利用可能になりました。マーケットプレイスからインストールすることも、引き続き手動でインストールすることもできます。

```bash
/plugin marketplace add https://github.com/antvis/Infographic.git
/plugin install antv-infographic-skills@antv-infographic
```

手動インストール：

```bash
set -e

VERSION=0.2.4 # Replace with the latest tag, e.g. 0.2.14
BASE_URL=https://github.com/antvis/Infographic/releases/download
mkdir -p .claude/skills

curl -L --fail -o skills.zip "$BASE_URL/$VERSION/skills.zip"
unzip -q -o skills.zip -d .claude/skills
rm -f skills.zip
```

### Codex

> codex に入ります

```codex
# Replace <SKILL> with the skill name, e.g. infographic-creator
# https://github.com/antvis/Infographic/tree/main/skills/<SKILL>
$skill-installer install https://github.com/antvis/Infographic/tree/main/skills/infographic-creator
```

## 🌐 エコシステム

AntV Infographic を活用したコミュニティのプロジェクトとプロダクトです。

- 💼 **プロダクト**
  - [Alma](https://alma.now/) — Infographic を組み込んだ、デスクトップ向けの AI プロバイダーオーケストレーションアプリ
  - [Markdown Viewer](https://docu.md) — Infographic に対応した Markdown ビューア。Word へのエクスポートと、Chrome / VS Code / Firefox 向けの拡張機能を提供
  - [InfographicAI](https://infographic-ai.tuntun.site/) — Infographic を活用して PPT スライドを生成
  - [LangChat Slides](https://github.com/TyCoding/langchat-slides) — @antv/infographic を使った次世代の AI スライドジェネレーター
  - [Nowledge Mem](https://mem.nowledge.co/) — Infographic に対応したプレゼンテーション作成機能を備えた AI メモリバンク
  - [WeChat Markdown Editor](https://md.doocs.org/) — Infographic に対応した、Markdown から WeChat 記事を作成するエディタ
  - [Welight](https://waer.ltd/) — Infographic に対応した WeChat 記事の作成プラットフォーム
  - [Zojo](https://zojo.ai/infographic) — シンプルな構文でプロフェッショナルなインフォグラフィックを生成
- 📦 **ライブラリ**
  - [astro-koharu](https://github.com/cosZone/astro-koharu) — Infographic に対応した、アニメ風ブログテーマ（Astro）
  - [docsify-infographic](https://github.com/bulexu/docsify-infographic) — Docsify で Infographic の図をレンダリングするプラグイン
  - [dsh-antv-infographic](https://github.com/HellowVirgil/dsh-antv-infographic) — Infographic の図をストリーミング、編集、エクスポートするための DeepSeek Harness プラグイン
  - [feffery-infographic](https://github.com/HogaStack/feffery-infographic) — Plotly Dash を使って Python でインフォグラフィックを作成
  - [infographic-cli](https://github.com/lyw405/infographic-cli) — SVG のインフォグラフィックを生成する CLI ツール
  - [infographic-for-react](https://github.com/lyw405/infographic-for-react) — @antv/infographic の React コンポーネントラッパー
  - [markdown-it-infographic](https://github.com/hcg1023/markdown-it-infographic) — @antv/infographic 用の markdown-it プラグイン
  - [markstream-vue](https://github.com/Simon-He95/markstream-vue) — Infographic に対応した、Vue 3 向けのストリーミング Markdown レンダリング
  - [obsidian-infographic](https://github.com/hcg1023/obsidian-infographic) — @antv/infographic 用の Obsidian プラグイン
  - [slidev-addon-infographic](https://github.com/fxss5201/slidev-addon-infographic) — Slidev 用の @antv/infographic コンポーネント
  - [VSCode Extension](https://github.com/liwx2000/infographic-vscode-extension) — VSCode の Markdown ファイルで Infographic をプレビュー

> 💡 AntV Infographic を使ったプロジェクトをお持ちですか？ [Issue #99](https://github.com/antvis/Infographic/issues/99) で共有してください！

## 💬 コミュニティとコミュニケーション

- ご質問やご提案は GitHub で送ってください
- [GitHub Discussions](https://github.com/antvis/infographic/discussions) に参加して、コミュニティと交流しましょう
- コントリビューションを歓迎します！ AntV Infographic を一緒に良くしていきましょう！

ご提案があれば、GitHub で気軽にお知らせください！ Star ⭐ で応援していただけると励みになります。

- [AntV 公式サイト](https://antv.antgroup.com/)
- [GitHub リポジトリ](https://github.com/antvis/infographic)
- [Issue トラッカー](https://github.com/antvis/infographic/issues)

## 📄 ライセンス

このプロジェクトは **MIT** ライセンスのもとでオープンソースとして公開されています。詳細は [LICENSE](./LICENSE) を参照してください。
