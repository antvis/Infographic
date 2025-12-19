import { Data } from '@antv/infographic';

export const LIST_DATA: Data = {
  title: '产业布局',
  desc: '整合数据资产，构建标签画像体系，赋能数字化运营之路',
  items: [
    {
      icon: 'company-021_v1_lineal',
      label: '企业形象优势',
      desc: '产品优势详细说明产品优势详细说明',
      value: 80,
      time: '2018',
      illus: 'illus:english-teacher-bro-8693',
    },
    {
      icon: 'antenna-bars-5_v1_lineal',
      label: '综合实力优势',
      desc: '产品优势详细说明产品优势详细说明',
      value: 70,
      time: '2019',
      illus: 'illus:teacher-student-rafiki-9049',
    },
    {
      icon: 'achievment-050_v1_lineal',
      label: '企业营销优势',
      desc: '产品优势详细说明产品优势详细说明',
      value: 90,
      time: '2020',
      illus: 'illus:mathematics-cuate-7503',
    },
    {
      icon: '3d-file-015_v1_lineal',
      label: '产品定位优势',
      desc: '产品优势详细说明产品优势详细说明',
      value: 60,
      time: '2021',
      illus: 'illus:teacher-student-rafiki-9049',
    },
    {
      icon: 'activities-037_v1_lineal',
      label: '产品体验优势',
      desc: '产品优势详细说明产品优势详细说明',
      value: 80,
      time: '2022',
      illus: 'illus:english-teacher-bro-8693',
    },
    {
      icon: 'account-book-025_v1_lineal',
      label: '制造成本优势',
      desc: '产品优势详细说明产品优势详细说明',
      value: 90,
      time: '2023',
      illus: 'illus:mathematics-cuate-7503',
    },
    {
      icon: 'account-book-025_v1_lineal',
      label: '制造成本优势',
      desc: '产品优势详细说明产品优势详细说明',
      value: 97,
      time: '2024',
      illus: 'illus:english-teacher-bro-8693',
    },
  ],
};

export const HIERARCHY_DATA: Data = {
  title: '用户调研',
  desc: '通过用户调研，了解用户需求和痛点，指导产品设计和优化',
  items: [
    {
      label: '用户调研',
      // desc: '通过用户调研，了解用户需求和痛点，指导产品设计和优化',
      icon: '3d-file-015_v1_lineal',
      children: [
        {
          label: '用户为什么要使用某个音乐平台',
          desc: '用户为什么要使用某个音乐平台',
          icon: 'company-021_v1_lineal',
          children: [
            {
              label: '用户从哪些渠道了解到这个平台',
              icon: 'activities-037_v1_lineal',
            },
            {
              label: '这个平台是哪些方面吸引了用户',
              icon: 'activities-037_v1_lineal',
            },
          ],
        },
        {
          label: '用户在什么场景下使用这个平台',
          desc: '用户在什么场景下使用这个平台',
          icon: 'antenna-bars-5_v1_lineal',
          children: [
            {
              label: '用户从什么事件什么场景下使用',
              icon: 'account-book-025_v1_lineal',
            },
            {
              label: '用户在某个场景下用到哪些功能',
              icon: 'account-book-025_v1_lineal',
            },
          ],
        },
        {
          label: '用户什么原因下会离开这个平台',
          desc: '用户什么原因下会离开这个平台',
          icon: 'achievment-050_v1_lineal',
          children: [
            {
              label: '用户无法接受这个平台的原因',
              icon: 'account-book-025_v1_lineal',
            },
            {
              label: '用户觉得这个平台有哪些不足',
              icon: 'account-book-025_v1_lineal',
            },
          ],
        },
      ],
    },
  ],
};

export const COMPARE_DATA: Data = {
  title: '竞品分析',
  desc: '通过对比分析，找出差距，明确改进方向',
  items: [
    {
      label: '产品分析',
      children: [
        {
          icon: 'company-021_v1_lineal',
          label: '架构升级',
          desc: '品牌营销策略就是以品牌输出为核心的营销策略',
        },
        {
          icon: 'company-021_v1_lineal',
          label: '架构升级',
          desc: '品牌营销策略就是以品牌输出为核心的营销策略',
        },
        {
          icon: 'company-021_v1_lineal',
          label: '架构升级',
          desc: '品牌营销策略就是以品牌输出为核心的营销策略',
        },
      ],
    },
    {
      label: '竞品分析',
      children: [
        {
          icon: 'achievment-050_v1_lineal',
          label: '架构升级',
          desc: '品牌营销策略就是以品牌输出为核心的营销策略',
        },
        {
          icon: 'achievment-050_v1_lineal',
          label: '架构升级',
          desc: '品牌营销策略就是以品牌输出为核心的营销策略',
        },
        {
          icon: 'achievment-050_v1_lineal',
          label: '架构升级',
          desc: '品牌营销策略就是以品牌输出为核心的营销策略',
        },
      ],
    },
  ],
};

export const SWOT_DATA: Data = {
  title: 'SWOT分析',
  desc: '通过对比分析，找出差距，明确改进方向',
  items: [
    {
      // S
      label: 'Strengths',
      children: [
        { label: '强大的品牌影响力强大的品牌影响力' },
        { label: '丰富的产品线和服务' },
      ],
    },
    {
      // W
      label: 'Weaknesses',
      children: [
        { label: '市场份额有限' },
        { label: '品牌知名度较低' },
        { label: '技术创新能力不足' },
      ],
    },
    {
      // O
      label: 'Opportunities',
      children: [
        { label: '新兴市场的增长机会' },
        { label: '数字化转型的趋势' },
        { label: '战略合作伙伴关系的建立' },
      ],
    },
    {
      // T
      label: 'Threats',
      children: [
        { label: '激烈的市场竞争' },
        { label: '快速变化的消费者需求' },
        { label: '经济环境的不确定性' },
        { label: '技术进步带来的挑战' },
      ],
    },
  ],
};

export const WORD_CLOUD_DATA: Data = {
  items:
    '数据分析:100|人工智能:96|数据可视化:92|大数据:90|机器学习:88|深度学习:84|数据工程:82|数据仓库:80|数据挖掘:78|商业智能:76|统计学:74|预测分析:72|特征工程:70|模型训练:69|模型评估:68|模型部署:67|MLOps:66|A/B测试:65|因果推断:64|实验平台:63|推荐系统:62|搜索排序:61|用户画像:60|实时计算:59|离线计算:58|流式处理:57|批处理:56|ETL:55|ELT:54|数据治理:53|数据质量:52|数据血缘:51|元数据管理:50|指标体系:49|指标平台:48|埋点分析:47|日志分析:46|漏斗分析:45|留存分析:44|增长分析:43|用户行为:42|客户分群:41|数据建模:40|维度建模:39|星型模型:38|雪花模型:37|湖仓一体:36|数据湖:35|OLAP:34|OLTP:33|SQL:32|NoSQL:31|图数据库:30|向量数据库:29|分布式系统:28|并行计算:27|容器化:26|微服务:25|云原生:24|数据安全:23|权限管理:22|隐私计算:21|差分隐私:20|联邦学习:19|风控模型:18|异常检测:17|反欺诈:16|知识图谱:15|自然语言处理:14|计算机视觉:13|文本分类:12|情感分析:11|实体识别:10|关系抽取:9|对话系统:8|提示工程:7|大模型:6|向量检索:5|RAG:4|数据标注:3|监控告警:22|可观测性:24|性能优化:26|成本优化:28|任务调度:30|工作流编排:32|容灾备份:34|高可用:36|可扩展性:38|数据产品:40'
      .split('|')
      .filter(Boolean)
      .map((seg) => {
        const i = seg.lastIndexOf(':');
        const label = seg.slice(0, i).trim();
        const value = Number(seg.slice(i + 1));
        return { label, value: Number.isFinite(value) ? value : 0 };
      }),
};
