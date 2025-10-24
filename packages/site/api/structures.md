# 结构组件 API

结构组件定义了数据项的组织和布局方式。每个结构组件都有特定的配置参数（Props）。

## 使用方式

```typescript
design: {
  structure: {
    type: 'list-column',  // 结构组件 ID
    gap: 30,              // 组件特定的 Props
    width: 400
  }
}
```

## 列表结构 (list-*)

信息项并列排布，无明显方向性或层级关系。

### list-column

纵向列表结构，数据项垂直排列。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 自动 | 内容宽度（像素） |
| gap | number | 20 | 数据项间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'list-column',
    gap: 30,
    width: 400
  }
}
```

**适用场景：**
- 产品特性列表
- 步骤说明
- 服务项目展示

---

### list-row

横向列表结构，数据项水平排列。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| gap | number | 20 | 数据项间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'list-row',
    gap: 40
  }
}
```

**适用场景：**
- 横向时间轴
- 并列功能展示
- 流程步骤

---

### list-grid

网格列表结构，数据项按行列排列。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | number | 3 | 列数 |
| gap | number | 24 | 数据项间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'list-grid',
    columns: 4,
    gap: 20
  }
}
```

**适用场景：**
- 产品目录
- 功能模块展示
- 团队成员介绍

---

### list-waterfall

瀑布流列表结构，数据项以瀑布流方式排列。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | number | 2 | 列数 |
| gap | number | 20 | 数据项间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'list-waterfall',
    columns: 3,
    gap: 16
  }
}
```

**适用场景：**
- 高度不一的内容展示
- 图文混合列表
- 作品集展示

---

### list-sector

扇形列表结构，数据项以扇形方式排列。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| radius | number | 200 | 扇形半径（像素） |
| gap | number | 20 | 数据项间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'list-sector',
    radius: 250,
    gap: 15
  }
}
```

**适用场景：**
- 创意展示
- 环形导航
- 特色功能展示

---

## 对比结构 (compare-*)

明确的二元或多元对比布局。

### compare-left-right

左右对比结构，奇数项在左侧，偶数项在右侧。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| gap | number | 20 | 同侧数据项间距（像素） |
| groupGap | number | 80 | 左右两组间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'compare-left-right',
    gap: 30,
    groupGap: 100
  }
}
```

**适用场景：**
- 产品版本对比
- 优劣势对比
- 前后对比

---

### compare-mirror

镜像对比结构，左右对称布局。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| gap | number | 20 | 数据项间距（像素） |
| centerGap | number | 80 | 中轴间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'compare-mirror',
    gap: 25,
    centerGap: 60
  }
}
```

**适用场景：**
- 对称对比
- AB 测试结果
- 双方案对比

---

### compare-hierarchy-row

层级横向对比结构，支持子项对比。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| gap | number | 20 | 数据项间距（像素） |
| levelGap | number | 40 | 层级间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'compare-hierarchy-row',
    gap: 20,
    levelGap: 50
  }
}
```

**适用场景：**
- 多层级对比
- 组织架构对比
- 分类对比

---

### compare-hierarchy-left-right

层级左右对比结构，支持子项对比。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| gap | number | 20 | 数据项间距（像素） |
| groupGap | number | 80 | 左右间距（像素） |
| levelGap | number | 40 | 层级间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'compare-hierarchy-left-right',
    gap: 20,
    groupGap: 100,
    levelGap: 50
  }
}
```

**适用场景：**
- 复杂层级对比
- 多维度对比

---

## 顺序结构 (sequence-*)

具有明确方向性和顺序性的信息流。

### sequence-timeline

时间轴结构，数据项按时间顺序排列。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| gap | number | 40 | 数据项间距（像素） |
| orientation | 'vertical' \| 'horizontal' | 'vertical' | 方向 |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'sequence-timeline',
    gap: 50,
    orientation: 'vertical'
  }
}
```

**适用场景：**
- 发展历程
- 项目进度
- 事件时间线

---

### sequence-steps

步骤流程结构，数据项以步骤方式呈现。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| gap | number | 30 | 数据项间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'sequence-steps',
    gap: 40
  }
}
```

**适用场景：**
- 操作步骤
- 流程说明
- 教程指引

---

### sequence-ascending-steps

上升步骤结构，数据项呈上升趋势排列。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| gap | number | 30 | 数据项间距（像素） |
| stepHeight | number | 40 | 每步高度差（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'sequence-ascending-steps',
    gap: 35,
    stepHeight: 50
  }
}
```

**适用场景：**
- 进阶流程
- 升级路径
- 成长阶段

---

### sequence-snake-steps

蛇形步骤结构，数据项呈 S 形排列。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| gap | number | 30 | 数据项间距（像素） |
| columns | number | 3 | 每行数量 |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'sequence-snake-steps',
    gap: 25,
    columns: 4
  }
}
```

**适用场景：**
- 多步骤流程
- 游戏关卡
- 学习路径

---

### sequence-color-snake-steps

彩色蛇形步骤结构，支持颜色渐变。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| gap | number | 30 | 数据项间距（像素） |
| columns | number | 3 | 每行数量 |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'sequence-color-snake-steps',
    gap: 25,
    columns: 3
  }
}
```

**适用场景：**
- 彩色流程展示
- 游戏进度
- 阶段性任务

---

### sequence-roadmap-vertical

垂直路线图结构，数据项以路线图形式呈现。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| gap | number | 40 | 数据项间距（像素） |
| roadWidth | number | 60 | 路线宽度（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'sequence-roadmap-vertical',
    gap: 50,
    roadWidth: 80
  }
}
```

**适用场景：**
- 产品路线图
- 发展规划
- 项目计划

---

### sequence-horizontal-zigzag

水平之字形结构，数据项呈 Z 字形排列。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| gap | number | 30 | 数据项间距（像素） |
| verticalGap | number | 50 | 垂直间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'sequence-horizontal-zigzag',
    gap: 40,
    verticalGap: 60
  }
}
```

**适用场景：**
- 创意流程展示
- 交替说明
- 对话式流程

---

## 层级结构 (hierarchy-*)

树状、嵌套或明显的主次关系布局。

### hierarchy-tree

树形结构，数据项以树形方式组织。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| levelGap | number | 80 | 层级间距（像素） |
| nodeGap | number | 60 | 节点间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'hierarchy-tree',
    levelGap: 100,
    nodeGap: 80
  }
}
```

**适用场景：**
- 组织架构
- 分类体系
- 决策树

**数据格式：**

```typescript
data: {
  items: [
    {
      label: '根节点',
      children: [
        {
          label: '子节点 1',
          children: [
            { label: '孙节点 1' },
            { label: '孙节点 2' }
          ]
        },
        { label: '子节点 2' }
      ]
    }
  ]
}
```

---

### hierarchy-pyramid

金字塔结构，数据项以金字塔形式排列。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| gap | number | 20 | 数据项间距（像素） |
| levelGap | number | 40 | 层级间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'hierarchy-pyramid',
    gap: 25,
    levelGap: 50
  }
}
```

**适用场景：**
- 层级关系展示
- 优先级排序
- 数量递减展示

---

## 关系结构 (relation-*)

展示元素间的连接、依赖或相互作用关系。

### relation-circle

圆形关系图，数据项环形排列。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| radius | number | 200 | 圆形半径（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'relation-circle',
    radius: 250
  }
}
```

**适用场景：**
- 关系网络
- 循环流程
- 生态系统展示

---

### relation-network

网络图结构，数据项以网络形式连接。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| nodeGap | number | 60 | 节点间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'relation-network',
    nodeGap: 80
  }
}
```

**适用场景：**
- 复杂关系展示
- 依赖关系
- 网络拓扑

---

## 统计图 (chart-*)

以图表形式展示定量数据关系。

### quadrant

四象限图，数据项分布在四个象限中。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 400 | 象限宽度（像素） |
| height | number | 400 | 象限高度（像素） |
| gap | number | 20 | 数据项间距（像素） |

**使用示例：**

```typescript
design: {
  structure: {
    type: 'quadrant',
    width: 500,
    height: 500,
    gap: 15
  }
}
```

**适用场景：**
- 优先级矩阵
- SWOT 分析
- 象限分布分析

**数据格式：**

```typescript
data: {
  items: [
    {
      label: 'Strengths',
      children: [
        { label: '优势 1' },
        { label: '优势 2' }
      ]
    },
    {
      label: 'Weaknesses',
      children: [
        { label: '劣势 1' }
      ]
    },
    // ... Opportunities, Threats
  ]
}
```

---

## 通用 Props

所有结构组件都继承 `BaseStructureProps`，包含以下基础属性：

| 参数 | 类型 | 说明 |
|------|------|------|
| Title | ComponentType | 标题组件 |
| Item | ComponentType | 数据项组件 |
| Items | ComponentType[] | 多级数据项组件（用于层级结构） |
| data | Data | 数据 |
| options | ParsedInfographicOptions | 信息图配置 |

这些参数由框架自动传递，无需手动配置。

## 相关链接

- [数据项组件 API](/api/items) - 查看所有数据项组件
- [配置选项](/api/options) - 了解如何配置结构
- [核心概念](/guide/concepts) - 理解结构的作用
