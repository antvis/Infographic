# 数据项组件 API

数据项组件定义了单个数据项的展示样式。每个数据项组件都有特定的配置参数（Props）。

## 使用方式

```typescript
design: {
  item: {
    type: 'badge-card',  // 数据项组件 ID
    width: 300,          // 组件特定的 Props
    iconSize: 32
  }
}
```

## 卡片类 (card-*)

适合展示完整信息，包含标题、描述、图标等元素。

### badge-card

带徽章的卡片，适合展示带数值的功能特性。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 240 | 卡片宽度（像素） |
| height | number | 140 | 卡片高度（像素） |
| iconSize | number | 24 | 图标尺寸（像素） |
| badgeSize | number | 48 | 徽章尺寸（像素） |
| gap | number | 12 | 内部间距（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'badge-card',
    width: 300,
    height: 160,
    iconSize: 32
  }
}
```

**适用场景：**
- 产品功能展示
- 数据统计卡片
- 特性说明

---

### compact-card

紧凑型卡片，适合信息密集的场景。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 200 | 卡片宽度（像素） |
| height | number | 120 | 卡片高度（像素） |
| iconSize | number | 20 | 图标尺寸（像素） |
| gap | number | 8 | 内部间距（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'compact-card',
    width: 220,
    iconSize: 24
  }
}
```

**适用场景：**
- 列表式展示
- 空间受限场景
- 简洁信息展示

---

### progress-card

进度卡片，展示带进度条的信息。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 240 | 卡片宽度（像素） |
| height | number | 140 | 卡片高度（像素） |
| gap | number | 12 | 内部间距（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'progress-card',
    width: 280,
    height: 150
  }
}
```

**适用场景：**
- 任务完成度
- 项目进度
- 目标达成率

---

### ribbon-card

彩带卡片，顶部带装饰彩带的卡片样式。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 240 | 卡片宽度（像素） |
| height | number | 140 | 卡片高度（像素） |
| iconSize | number | 24 | 图标尺寸（像素） |
| gap | number | 12 | 内部间距（像素） |
| ribbonHeight | number | 32 | 彩带高度（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'ribbon-card',
    width: 250,
    ribbonHeight: 40
  }
}
```

**适用场景：**
- 重点强调
- 获奖展示
- 特殊标记

---

### rounded-rect-node

圆角矩形节点，简洁的矩形样式。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 300 | 节点宽度（像素） |
| height | number | 40 | 节点高度（像素） |
| padding | number | 4 | 内边距（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'rounded-rect-node',
    width: 320,
    height: 50
  }
}
```

**适用场景：**
- 流程图节点
- 组织架构图
- 树形结构节点

---

### candy-card-lite

糖果卡片，带装饰区域的轻量卡片。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 280 | 卡片宽度（像素） |
| height | number | 140 | 卡片高度（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'candy-card-lite',
    width: 300,
    height: 160
  }
}
```

**适用场景：**
- 创意展示
- 品牌宣传
- 视觉吸引

---

### l-corner-card

L 角卡片，带 L 形装饰线的卡片。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 120 | 卡片宽度（像素） |
| iconSize | number | 24 | 图标尺寸（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'l-corner-card',
    width: 140,
    iconSize: 28
  }
}
```

**适用场景：**
- 流程步骤
- 连接展示
- 导航指引

---

### letter-card

字母卡片，展示大字母和标题。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| showStripe | boolean | true | 是否显示斜纹 |
| showGradient | boolean | true | 是否显示渐变 |
| showBottomShade | boolean | true | 是否显示底部阴影 |

**使用示例：**

```typescript
design: {
  item: {
    type: 'letter-card',
    showStripe: true,
    showGradient: true
  }
}
```

**适用场景：**
- 字母导航
- 分类标题
- 索引展示

---

### quarter-simple-card

四分之一卡片，三个圆角一个直角的卡片样式。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 150 | 卡片宽度（像素） |
| height | number | 150 | 卡片高度（像素） |
| iconSize | number | 30 | 图标尺寸（像素） |
| padding | number | 20 | 内边距（像素） |
| borderRadius | number | 16 | 圆角半径（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'quarter-simple-card',
    width: 160,
    height: 160,
    borderRadius: 20
  }
}
```

**适用场景：**
- 网格布局
- 对称排列
- 创意展示

---

## 徽章类 (badge-*)

紧凑的标识样式，适合标签和小型信息展示。

### icon-badge

图标徽章，圆形图标加标签。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 200 | 徽章宽度（像素） |
| height | number | 80 | 徽章高度（像素） |
| iconSize | number | 32 | 图标尺寸（像素） |
| gap | number | 8 | 内部间距（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'icon-badge',
    iconSize: 40,
    gap: 12
  }
}
```

**适用场景：**
- 功能标识
- 服务项目
- 特性列表

---

### pill-badge

药丸徽章，胶囊形状的徽章。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 300 | 组件宽度（像素） |
| pillWidth | number | 120 | 药丸宽度（像素） |
| pillHeight | number | 36 | 药丸高度（像素） |
| gap | number | 16 | 药丸与描述间距（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'pill-badge',
    pillWidth: 140,
    pillHeight: 40
  }
}
```

**适用场景：**
- 标签展示
- 分类标识
- 状态指示

---

## 图表类 (chart-*)

数据可视化样式，适合数值展示。

### chart-column

柱状图，展示垂直柱形。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 120 | 图表宽度（像素） |
| height | number | 200 | 图表高度（像素） |
| gap | number | 8 | 内部间距（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'chart-column',
    width: 140,
    height: 220
  }
}
```

**适用场景：**
- 数据对比
- 统计展示
- 排名显示

---

### circular-progress

环形进度，圆环形进度条。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| radius | number | 60 | 圆环半径（像素） |
| strokeWidth | number | 8 | 线条宽度（像素） |
| showValue | boolean | true | 是否显示数值 |

**使用示例：**

```typescript
design: {
  item: {
    type: 'circular-progress',
    radius: 70,
    strokeWidth: 10
  }
}
```

**适用场景：**
- 完成度展示
- 百分比指示
- 进度跟踪

---

### quarter-circular

四分之一圆形，带装饰线的四分之一圆。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 280 | 组件宽度（像素） |
| height | number | 120 | 组件高度（像素） |
| iconSize | number | 30 | 图标尺寸（像素） |
| circleRadius | number | 80 | 圆形半径（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'quarter-circular',
    width: 300,
    circleRadius: 90
  }
}
```

**适用场景：**
- 编号展示
- 步骤指示
- 序列说明

---

## 箭头类 (arrow-*)

方向性展示，适合流程和步骤。

### horizontal-icon-arrow

横向图标箭头，水平箭头带图标。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 200 | 箭头宽度（像素） |
| height | number | 80 | 箭头高度（像素） |
| iconSize | number | 24 | 图标尺寸（像素） |
| gap | number | 8 | 内部间距（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'horizontal-icon-arrow',
    width: 220,
    iconSize: 28
  }
}
```

**适用场景：**
- 横向流程
- 步骤说明
- 方向指引

---

### vertical-icon-arrow

纵向图标箭头，垂直箭头带图标。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 80 | 箭头宽度（像素） |
| height | number | 200 | 箭头高度（像素） |
| iconSize | number | 24 | 图标尺寸（像素） |
| gap | number | 8 | 内部间距（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'vertical-icon-arrow',
    height: 220,
    iconSize: 28
  }
}
```

**适用场景：**
- 纵向流程
- 下钻导航
- 层级展示

---

### simple-horizontal-arrow

简单横向箭头，带序号的横向箭头。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 140 | 箭头宽度（像素） |
| flipped | boolean | false | 是否翻转方向 |

**使用示例：**

```typescript
design: {
  item: {
    type: 'simple-horizontal-arrow',
    width: 160
  }
}
```

**适用场景：**
- 流程步骤
- 操作顺序
- 之字形布局

---

### simple-vertical-arrow

简单纵向箭头，带序号的纵向箭头。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| height | number | 140 | 箭头高度（像素） |
| flipped | boolean | false | 是否翻转方向 |

**使用示例：**

```typescript
design: {
  item: {
    type: 'simple-vertical-arrow',
    height: 160
  }
}
```

**适用场景：**
- 垂直流程
- 步骤引导
- 时间轴

---

### horizontal-icon-line

横向图标线，带圆形图标和连接线。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 160 | 组件宽度（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'horizontal-icon-line',
    width: 180
  }
}
```

**适用场景：**
- 时间轴
- 里程碑
- 进度展示

---

## 形状类 (shape-*)

几何形状样式，适合特殊视觉效果。

### circle-node

圆形节点，渐变圆形样式。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 240 | 圆形宽度（像素） |
| height | number | width | 圆形高度（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'circle-node',
    width: 200
  }
}
```

**适用场景：**
- 关系图节点
- 网络拓扑
- 循环展示

---

### pyramid

金字塔，梯形金字塔样式。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| gap | number | 5 | 数据项间距（像素） |
| width | number | 300 | 组件宽度（像素） |
| height | number | 60 | 组件高度（像素） |
| iconSize | number | 30 | 图标尺寸（像素） |
| pyramidWidth | number | width * 0.6 | 金字塔宽度（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'pyramid',
    width: 320,
    height: 70,
    pyramidWidth: 200
  }
}
```

**适用场景：**
- 层级展示
- 优先级排序
- 递进关系

---

## 文本类 (text-*)

纯文本或简单装饰文本。

### plain-text

纯文本，简单的文本展示。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 200 | 文本宽度（像素） |
| fontSize | number | 14 | 字体大小（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'plain-text',
    width: 250,
    fontSize: 16
  }
}
```

**适用场景：**
- 简单列表
- 文本内容
- 说明文字

---

### bullet-text

项目符号文本，带圆点的文本列表。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 300 | 文本宽度（像素） |
| bulletSize | number | 5 | 圆点尺寸（像素） |
| bulletType | 'circle' \| 'none' | 'circle' | 圆点类型 |
| fontSize | number | 14 | 字体大小（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'bullet-text',
    width: 320,
    bulletSize: 6,
    fontSize: 15
  }
}
```

**适用场景：**
- 列表项
- 要点说明
- 清单展示

---

### done-list

完成列表，带勾选标记的列表。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 300 | 列表宽度（像素） |
| checkSize | number | 18 | 勾选框尺寸（像素） |
| gap | number | 8 | 内部间距（像素） |
| fontSize | number | 14 | 字体大小（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'done-list',
    width: 320,
    checkSize: 20
  }
}
```

**适用场景：**
- 任务清单
- 完成事项
- 检查列表

---

## 其他 (other)

通用或组合样式的数据项。

### simple-item

简单项，灵活的通用数据项。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 200 | 组件宽度（像素） |
| gap | number | 4 | 内部间距（像素） |
| showIcon | boolean | true | 是否显示图标 |
| iconSize | number | 30 | 图标尺寸（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'simple-item',
    width: 220,
    showIcon: true,
    iconSize: 32
  }
}
```

**适用场景：**
- 通用展示
- 灵活布局
- 自定义样式

---

### simple-illus-item

简单插图项，图片加文字说明。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 180 | 组件宽度（像素） |
| illusSize | number | width | 插图尺寸（像素） |
| gap | number | 8 | 内部间距（像素） |

**使用示例：**

```typescript
design: {
  item: {
    type: 'simple-illus-item',
    width: 200,
    illusSize: 180
  }
}
```

**适用场景：**
- 插图展示
- 图文说明
- 视觉引导

---

## 通用 Props

所有数据项组件都继承 `BaseItemProps`，包含以下基础属性：

| 参数 | 类型 | 说明 |
|------|------|------|
| datum | Item | 当前数据项 |
| data | Data | 完整数据 |
| indexes | number[] | 数据项索引路径 |
| themeColors | ThemeColors | 主题颜色配置 |
| valueFormatter | (value: number) => string | 数值格式化函数 |
| positionH | 'normal' \| 'center' \| 'flipped' | 水平位置 |
| positionV | 'normal' \| 'center' \| 'flipped' | 垂直位置 |

这些参数由框架自动传递，无需手动配置。

## 数值格式化

可以为数据项提供自定义的数值格式化函数：

```typescript
design: {
  item: {
    type: 'badge-card',
    valueFormatter: (value: number) => {
      if (value >= 10000) {
        return (value / 10000).toFixed(1) + '万';
      }
      return value.toString();
    }
  }
}
```

## 相关链接

- [结构组件 API](/api/structures) - 查看所有结构组件
- [配置选项](/api/options) - 了解如何配置数据项
- [核心概念](/guide/concepts) - 理解数据项的作用
