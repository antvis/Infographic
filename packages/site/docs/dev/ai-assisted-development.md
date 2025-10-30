# AI 辅助开发设计资产

Infographic 项目为 **结构（Structure）** 和 **数据项（Item）** 的开发提供了专门的 AI 提示词（Prompt），你可以使用大语言模型（如 Claude、GPT-4 等）快速生成高质量的设计资产代码。

## 概述

设计资产是 Infographic 的核心扩展点，包括：

- **数据项（Items）**：信息单元的可视化组件（卡片、图表、箭头、文本等）
- **结构（Structures）**：数据项的组织和布局方式（列表、对比、顺序、层级、关系等）

传统开发方式需要深入理解框架 API、布局计算、组件规范等，而使用 AI 辅助开发，你只需：

1. **描述需求**：告诉 AI 你想要什么样的数据项或结构
2. **AI 生成代码**：基于规范自动生成完整的 TypeScript/JSX 代码
3. **测试调优**：在 Dev 环境预览和调整

## AI 提示词位置

项目中提供了两个详细的 AI 提示词文档：

### 1. 结构开发提示词

**位置**：`packages/infographic/src/designs/structures/prompt.md`

**内容**：

- 结构分类体系（列表、对比、顺序、层级、关系、地理、统计图）
- 技术规范（类型定义、可用组件、工具函数）
- 代码模板（简单结构、层级结构）
- 布局计算要点
- 按钮布局原则
- 命名规范
- 生成流程
- 示例代码

**适用场景**：开发新的布局结构，如时间轴、流程图、组织架构图等。

### 2. 数据项开发提示词

**位置**：`packages/infographic/src/designs/items/prompt.md`

**内容**：

- 数据项核心概念
- 设计要求（完整性、自适应、数值处理）
- 技术规范（类型定义、可用组件、工具函数）
- 代码模板
- 主题色彩使用
- 渐变定义
- positionH/V 处理
- 常见问题和最佳实践

**适用场景**：开发新的数据展示组件，如统计卡片、进度条、节点样式等。

## 使用方法

### 方法一：在 AI 对话中使用

1. **打开提示词文件**：

```bash
# 结构开发
cat packages/infographic/src/designs/structures/prompt.md

# 数据项开发
cat packages/infographic/src/designs/items/prompt.md
```

2. **复制提示词内容**到 AI 对话框（如 Claude、ChatGPT）

3. **描述你的需求**，例如：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="structure" label="结构开发示例">
```text
我想开发一个循环流程结构，数据项围成一个圆形排列，
相邻项之间有箭头连接，形成闭环。每个数据项可以添加、删除。
```
  </TabItem>
  <TabItem value="dataitem" label="数据项开发示例">
```text
我想开发一个进度卡片数据项，显示：
- 左侧：圆形图标
- 中间：标题和描述文本
- 右侧：百分比数值
- 底部：进度条（渐变色）
支持主题色和水平翻转布局。
```
  </TabItem>
</Tabs>

4. **AI 生成代码**，包括：
   - 完整的 TypeScript 类型定义
   - JSX 组件实现
   - 注册语句
   - 所有必需的导入

5. **复制代码**到项目中：

```bash
# 结构
packages/infographic/src/designs/structures/MyStructure.tsx

# 数据项
packages/infographic/src/designs/items/MyItem.tsx
```

6. **添加到导出**：

<Tabs>
  <TabItem value="structures" label="structures/index.ts">
```typescript
export * from './MyStructure';
```
  </TabItem>
  <TabItem value="items" label="items/index.ts">
```typescript
export * from './MyItem';
```
  </TabItem>
</Tabs>

7. **在 Dev 环境测试**

### 方法二：使用 Claude Code（推荐）

如果你使用 Claude Code 或类似的 AI 编程助手：

1. **直接引用提示词文件**：

```bash
# 让 AI 读取提示词
请阅读 packages/infographic/src/designs/structures/prompt.md，
然后帮我开发一个循环流程结构。
```

2. **AI 自动读取提示词并生成代码**

3. **AI 可以直接创建文件并添加到导出**

### 方法三：CLI 命令（未来支持）

```bash
# 未来可能提供的命令行工具
npm run generate:structure -- --type=sequence --name=CircleFlow
npm run generate:item -- --type=card --name=ProgressCard
```

## 开发流程示例

### 示例 1：开发循环流程结构

**需求**：数据项围成圆形排列，箭头连接形成闭环。

**Step 1：准备提示词**

打开 `packages/infographic/src/designs/structures/prompt.md`，复制内容到 AI。

**Step 2：描述需求**

```text
请帮我开发一个循环流程结构（relation-circle-flow），要求：
1. 数据项围成圆形排列
2. 相邻数据项之间有箭头连接，形成闭环
3. 圆的半径可配置，默认 200
4. 支持标题显示
5. 每个数据项可以添加和删除（需要按钮）
```

**Step 3：AI 生成代码**

AI 会生成类似以下的完整代码：

```tsx
/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import { getElementBounds, Group } from '@antv/infographic-jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { SimpleArrow } from '../decorations';
import { FlexLayout } from '../layouts';
import { getColorPrimary } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface RelationCircleFlowProps extends BaseStructureProps {
  radius?: number;
}

export const RelationCircleFlow: ComponentType<RelationCircleFlowProps> = (
  props,
) => {
  const { Title, Item, data, radius = 200, options } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0] || {}} />,
  );

  const centerX = radius;
  const centerY = radius;
  const colorPrimary = getColorPrimary(options);

  const itemElements: JSXElement[] = [];
  const btnElements: JSXElement[] = [];
  const decorElements: JSXElement[] = [];

  items.forEach((item, index) => {
    const angle = (index * 2 * Math.PI) / items.length - Math.PI / 2;
    const itemX = centerX + radius * Math.cos(angle) - itemBounds.width / 2;
    const itemY = centerY + radius * Math.sin(angle) - itemBounds.height / 2;

    itemElements.push(
      <Item indexes={[index]} datum={item} data={data} x={itemX} y={itemY} />,
    );

    btnElements.push(
      <BtnRemove indexes={[index]} x={itemX + itemBounds.width} y={itemY} />,
    );

    // 箭头连接
    if (index < items.length - 1 || items.length > 0) {
      const nextIndex = (index + 1) % items.length;
      const nextAngle = (nextIndex * 2 * Math.PI) / items.length - Math.PI / 2;
      const arrowX =
        centerX + radius * 0.7 * Math.cos(angle + Math.PI / items.length);
      const arrowY =
        centerY + radius * 0.7 * Math.sin(angle + Math.PI / items.length);

      decorElements.push(
        <SimpleArrow
          x={arrowX}
          y={arrowY}
          width={25}
          height={25}
          colorPrimary={colorPrimary}
          rotation={((angle + Math.PI / items.length) * 180) / Math.PI + 90}
        />,
      );
    }
  });

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group>
        <Group>{decorElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('relation-circle-flow', { component: RelationCircleFlow });
```

**Step 4：保存并测试**

```bash
# 保存文件
packages/infographic/src/designs/structures/RelationCircleFlow.tsx

# 添加到导出
# packages/infographic/src/designs/structures/index.ts
export * from './RelationCircleFlow';

# 启动 Dev 环境测试
npm run dev
```

**Step 5：在 Dev 环境预览**

1. 打开 `http://localhost:5173`
2. 选择"灵活组合" Tab
3. 结构选择 `relation-circle-flow`
4. 选择合适的数据项
5. 查看效果并调整参数

### 示例 2：开发进度卡片数据项

**需求**：显示图标、标题、描述、数值和进度条。

**Step 1：准备提示词**

打开 `packages/infographic/src/designs/items/prompt.md`，复制到 AI。

**Step 2：描述需求**

```text
请帮我开发一个进度卡片数据项（progress-card-v2），要求：
1. 布局：
   - 左侧：圆形图标（可选）
   - 右侧：标题、描述、数值、进度条垂直排列
2. 进度条：
   - 高度 8px，圆角 4px
   - 背景色：浅色
   - 进度色：主题色渐变
3. 支持 positionH 翻转（图标在右侧）
4. 卡片背景色，圆角 8px，有投影
5. 数值显示为百分比
```

**Step 3：AI 生成代码**（省略，类似上例）

**Step 4：测试优化**

在 Dev 环境中：

- 测试不同数据（有/无图标、有/无数值）
- 测试主题色适配
- 测试 positionH 翻转

## AI 辅助开发的优势

### 1. 快速原型

传统方式可能需要几小时，AI 辅助只需几分钟：

| 任务     | 传统开发       | AI 辅助             |
| -------- | -------------- | ------------------- |
| 理解规范 | 30 分钟        | 0 分钟（AI 已理解） |
| 编写代码 | 2-3 小时       | 2-5 分钟            |
| 调试测试 | 1 小时         | 10-20 分钟          |
| **总计** | **3-4.5 小时** | **15-25 分钟**      |

### 2. 高质量代码

- ✅ 符合项目规范
- ✅ 完整的类型定义
- ✅ 正确的导入和注册
- ✅ 遵循最佳实践
- ✅ 边界情况处理

### 3. 降低学习成本

- 不需要完全理解所有 API
- 不需要记忆所有组件和工具函数
- 通过生成的代码学习框架用法

### 4. 设计探索

快速尝试多种设计方案：

```text
帮我生成3个不同风格的进度卡片：
1. 简约风格
2. 卡通风格
3. 科技风格
```

### 5. 迭代优化

```text
基于上面的代码，帮我：
1. 添加悬浮效果
2. 支持自定义图标大小
3. 优化小屏幕显示
```

## 最佳实践

### 1. 明确需求

提供清晰、具体的需求描述：

<Tabs>
  <TabItem value="bad" label="不够明确">
```text
帮我做一个卡片
```
  </TabItem>
  <TabItem value="good" label="清晰具体">
```text
帮我开发一个统计卡片数据项，要求：
- 左上角：图标（40x40）
- 右上角：标签文本
- 中间：大号数值（主题色）
- 底部：描述文本
- 卡片有圆角和阴影
- 支持水平翻转布局
```
  </TabItem>
</Tabs>

### 2. 参考现有组件

在描述需求时，可以参考现有组件：

```text
请参考 BadgeCard 组件的风格，帮我开发一个类似的卡片，
但增加进度条显示。
```

### 3. 迭代优化

不要期望一次生成完美代码，通过对话迭代：

```text
1. 生成基础版本
2. 测试后反馈："进度条太细了，改为 10px"
3. AI 调整代码
4. 继续测试和优化
```

### 4. 理解生成的代码

不要盲目使用，理解关键部分：

- 类型定义的作用
- 布局计算的逻辑
- 主题色的应用方式
- 边界情况的处理

### 5. 测试多种场景

在 Dev 环境中测试：

- 有/无 icon
- 有/无 value
- 长文本 / 短文本
- 不同主题色
- positionH/V 变化

## 常见问题

### Q: AI 生成的代码有错误怎么办？

A:

1. 检查是否提供了完整的提示词
2. 描述具体的错误信息，让 AI 修正
3. 参考现有组件的实现
4. 在 Dev 环境中逐步调试

### Q: 如何让生成的代码更符合项目风格？

A:

1. 在提示词中引用现有组件："参考 BadgeCard 的实现"
2. 明确指定使用的组件和工具函数
3. 要求遵循命名规范

### Q: AI 能生成复杂的布局吗？

A: 可以，但建议：

1. 先生成基础版本
2. 测试效果
3. 逐步添加复杂特性
4. 对于特别复杂的布局（如力导向图），提示 AI 使用 d3 布局算法

### Q: 生成的组件性能如何？

A: 按照提示词生成的代码已经遵循最佳实践：

- 使用 `getElementBounds` 缓存
- 使用 `forEach` 而非 `map`
- 避免不必要的计算

### Q: 可以用 AI 生成其他类型的组件吗？

A: 目前提供的提示词专注于：

- 数据项（Items）
- 结构（Structures）

其他类型（如布局、装饰元素）也可以让 AI 帮助，但需要：

1. 提供相关的技术规范
2. 参考现有实现
3. 更多手动调整

## 提示词维护

### 保持提示词更新

当框架升级时，提示词也需要更新：

1. **API 变更**：更新可用组件和工具函数列表
2. **最佳实践**：添加新的设计模式
3. **示例代码**：增加更多参考示例

### 贡献提示词改进

如果你发现提示词的问题或有改进建议：

1. 在 GitHub 提 Issue
2. 提交 PR 更新提示词
3. 分享你的成功案例

## 下一步

- [设计资产开发](./design-assets.md) - 深入了解设计资产的开发规范
- [Dev 环境使用](./dev-environment.md) - 学习如何使用开发工具测试组件
- [框架内部原理](./framework-internals.md) - 了解框架如何处理这些组件
- [查看结构提示词](../../infographic/src/designs/structures/prompt.md) - 完整的结构开发提示词
- [查看数据项提示词](../../infographic/src/designs/items/prompt.md) - 完整的数据项开发提示词
