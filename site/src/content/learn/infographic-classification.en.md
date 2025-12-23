---
title: Infographic Classification
---

A rational classification system can guide design and recommendations, bringing the following benefits:

- **Guide Design Creation**: Help designers choose appropriate structural forms based on content characteristics
- **Optimize Recommendation Algorithms**: Recommend templates that best match users' content needs
- **Improve Data Extraction Efficiency**: Different structural types correspond to different data organization methods
- **Establish Knowledge System**: Form a systematic infographic theory framework

## Overview of Industry Classification Methods {#industry-classification-overview}

Common classification types in mainstream platforms (Piktochart, Venngage, Visme, etc.) and research include:

| Classification Type | Frequency | Description |
| --- | --- | --- |
| Timeline | ⭐⭐⭐⭐⭐ | Display chronological order or historical progression |
| List | ⭐⭐⭐⭐⭐ | Display multiple information items in parallel |
| Comparison | ⭐⭐⭐⭐⭐ | Compare two or more objects |
| Process | ⭐⭐⭐⭐ | Display steps or processes |
| Statistical | ⭐⭐⭐⭐ | Display data in chart form |
| Geographic/Map | ⭐⭐⭐⭐ | Display information based on geographic location |
| Hierarchical | ⭐⭐⭐ | Display hierarchy or tree structure |
| Interactive | ⭐⭐ | Support user interaction |

### Problems with Existing Classification Systems {#existing-classification-problems}

Common problems with existing classification systems:

1. **Chaotic Classification Dimensions**: Some classify by structural form (timeline, map), some by content purpose (resume, how-to), some by technical attributes (interactive, animated), lacking unified standards
2. **Category Overlap and Ambiguity**: Terms like "process type", "flowchart", "step type" are similar; "map", "geographic type", "location type" have unclear boundaries
3. **Inconsistent Granularity**: "Information type" is too broad, encompassing almost all graphics; "anatomy type" is too narrow
4. **Confusion Between Display and Content**: Mixing display technology (interactive, animation) with content structure

## AntV Infographic Classification {#antv-infographic-classification}

Based on the above problems, AntV adopts a **classification by structural form** approach, which is more suitable for practical application scenarios such as visual design, infographic recommendation, and data extraction.

### Classification System {#classification-system}

| Type | Illustration | Core Characteristics | Typical Visual Elements | Applicable Scenarios |
| --- | --- | --- | --- | --- |
| **List** | ![List](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*s1HUQopWJvoAAAAAMZAAAAgAemJ7AQ/original) | Information items arranged in parallel, no obvious directionality or hierarchical relationship | • Numeric labels (1, 2, 3...)<br/>• Bullet points<br/>• Block icons<br/>• Card-style layout | • Key points (summary of key points)<br/>• Checklist (to-do items, checklists)<br/>• Summary (information compilation, knowledge organization)<br/>• Display (product features, service introduction)<br/>• Ranking (lists, rankings) |
| **Comparison** | ![Comparison](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*BywsTpmZe5gAAAAAQCAAAAgAemJ7AQ/original) | Clear binary or multi-element comparison layout | • Left-right column layout<br/>• VS identifier<br/>• Comparison table<br/>• Mirror symmetry layout | • Binary comparison (pros-cons, old-new versions, AB plans)<br/>• Multi-element comparison (horizontal comparison of multiple products/services/plans)<br/>• Matrix comparison (four-quadrant chart, nine-grid analysis) |
| **Sequential** | ![Sequential](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*hOnMQpxqNYcAAAAAQDAAAAgAemJ7AQ/original) | Information flow with clear directionality and order, **order cannot be arbitrarily changed** | • Arrow connections<br/>• Process connecting lines<br/>• Timeline<br/>• Path guidance | • Linear (operation steps, production process)<br/>• Circular (life cycle, closed-loop process)<br/>• Temporal (historical events, project milestones)<br/>• Causal (cause-process-result) |
| **Hierarchical** | ![Hierarchical](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Uiq8SK2ZYpwAAAAAQCAAAAgAemJ7AQ/original) | Tree-like, nested, or obvious primary-secondary relationship layout | • Branch connecting lines<br/>• Size hierarchy<br/>• Nested framework<br/>• Indented layout | • Organizational (company structure, management hierarchy)<br/>• Classification (knowledge system, directory structure, classification tree)<br/>• Tree-like (decision tree, mind map)<br/>• Subordinate (total-sub relationship, containment relationship) |
| **Relational** | ![Relational](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*jK_-Q7JwmrUAAAAAQFAAAAgAemJ7AQ/original) | Display connections, dependencies, or interaction relationships between elements | • Bidirectional arrows<br/>• Network lines<br/>• Node circles<br/>• Relationship connectors | • Process (workflow, data flow, information flow)<br/>• Network (interpersonal relationships, social networks)<br/>• Conceptual (mind map, knowledge graph)<br/>• Interactive (system architecture, component dependencies) |
| **Geographical** | ![Geographical](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*eM1KSYpVkeoAAAAAQXAAAAgAemJ7AQ/original) | Information organization based on geographic space or physical location | • Map outline<br/>• Location markers (pins)<br/>• Regional blocks<br/>• Coordinate system | • Map type (world map, country map, city map)<br/>• Route type (travel routes, transportation paths)<br/>• Regional type (administrative regions, sales areas)<br/>• Location type (facility distribution, store locations, building floor plans) |
| **Statistical** | ![Statistical](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*eqj3SLjD7HgAAAAAQDAAAAgAemJ7AQ/original) | Display quantitative data relationships in standard chart form | • Coordinate axes<br/>• Data bars<br/>• Percentage rings<br/>• Statistical symbols | • Bar charts<br/>• Line charts<br/>• Pie charts<br/>• Scatter plots<br/>• Radar charts |

## How to Determine Infographic Classification {#how-to-determine-classification}

In practical applications, the same visual framework template may belong to different structural types when filled with different content. Mastering the correct judgment method can help you accurately identify and select infographic types.

### Judgment Process {#judgment-process}

#### Step 1: Identify Core Visual Characteristics {#step-1-identify-core-visual-characteristics}

Judge in the following priority order; once matched, classification can be determined:

```
1. Has map/spatial elements? → Geographical structure
   ↓
2. Has standard charts (coordinate axes, data bars, etc.)? → Statistical
   ↓
3. Has clear comparison layout (left-right columns, VS, etc.)? → Comparison structure
   ↓
4. Has obvious hierarchy/tree structure? → Hierarchical structure
   ↓
5. Has network/circular connections? → Relational structure
   ↓
6. Has directional process (arrows, connecting lines)? → Sequential structure
   ↓
7. Other cases → List structure (default category)
```

#### Step 2: Apply Core Principles {#step-2-apply-core-principles}

**Structure First, Semantics Second**

- Prioritize the template's **structural intent**: How visual elements guide users to organize information
- Then consider **designer's intended use**: The template's typical application scenarios

> 💡 **Example**: A numbered card layout, if it has no arrows or connecting lines, should be classified as "List structure" rather than "Sequential structure", because its structural intent is parallel display, not emphasizing sequential relationships.

### Common Confusion Points {#common-confusion-points}

#### 1. List Structure vs Sequential Structure {#1-list-vs-sequential}

This is the **most easily confused** pair, key judgment standards:

| Comparison Dimension | List Structure | Sequential Structure |
| --- | --- | --- |
| **Numbering** | Can have numbering (1, 2, 3...) | Usually has numbering or step identifiers |
| **Connecting Elements** | ❌ No arrows or connecting lines | ✅ Has arrows, connecting lines, timeline |
| **Sequentiality** | Order can be arbitrarily adjusted | Order cannot be arbitrarily changed |
| **Semantic Relationship** | Information items have equal status | Information items have sequential logical relationships |

**Judgment Mnemonic**: Having numbers ≠ Sequential structure, key is connections!

**Example Comparison**:

- ✅ List structure: "5 Major Features of the Product" (has numbering, no connecting lines, order can be adjusted)
- ✅ Sequential structure: "5 Steps of User Registration" (has numbering, has arrow connections, must be executed in order)

#### 2. Sequential Structure vs Relational Structure {#2-sequential-vs-relational}

| Comparison Dimension | Sequential Structure | Relational Structure |
| --- | --- | --- |
| **Flow Direction** | Unidirectional linear flow | Can be bidirectional or multi-directional connections |
| **Start and End Points** | Has clear start and end points | Can have multiple start and end points |
| **Emphasis** | Emphasizes progressive relationships | Emphasizes relationship networks |
| **Typical Scenarios** | Process, timeline, steps | Workflow, system architecture, knowledge graph |

**Example Comparison**:

- ✅ Sequential structure: "Product Development Process" (Requirements → Design → Development → Testing → Launch)
- ✅ Relational structure: "Product Team Collaboration Diagram" (each role has complex mutual dependencies and communication relationships)

#### 3. Hierarchical Structure vs Relational Structure {#3-hierarchical-vs-relational}

| Comparison Dimension | Hierarchical Structure | Relational Structure |
| --- | --- | --- |
| **Organizational Form** | Tree-like, top-down | Network-like, multi-directional connections |
| **Relationship Type** | Master-subordinate relationship, containment relationship | Equal relationship, mutual action |
| **Visual Presentation** | Obvious hierarchical size differences | Node sizes relatively equal |

### Special Situation Handling {#special-situation-handling}

#### Multiple Features Coexist {#multiple-features-coexist}

When an infographic has multiple structural features simultaneously:

1. **Choose main classification by priority**: Refer to the priority order in the judgment process
2. **Add secondary classification**: Supplement classification based on design's semantic tendency
3. **Use tag system**: Mark the multiple structure types the template can adapt to

**Example**: A four-quadrant chart may have both "Comparison structure" features (comparing four quadrants) and "Relational structure" features (relationships between quadrants). In this case, use the most obvious "Comparison structure" as the main classification, "Relational structure" as secondary classification.

#### Unclear Features {#unclear-features}

When visual features are not obvious enough and difficult to judge:

- **Default Classification**: Classify as "List structure" as the default category
- **Inquire About Design Intent**: Consult the designer's intended use
- **Observe Usage Scenarios**: See what type of content is most commonly filled in during actual use

#### Consistency Principle {#consistency-principle}

- **Similar Templates Classified Consistently**: Templates with similar visual structures must be classified in the same category
- **Series Templates Maintain Unity**: Different variants of the same series should maintain consistent main classification
- **Avoid Subjective Arbitrariness**: Judge based on objective visual features, not personal preference

## Practical Application of Classification {#practical-application}

### Design Guidance {#design-guidance}

Quickly locate appropriate structural forms based on content type, improving design efficiency.

### Template Recommendation {#template-recommendation}

Based on users' content needs, recommend the most matching infographic templates.

### Data Mapping {#data-mapping}

Different structural types correspond to different data organization methods, facilitating automated data filling and generation.

### Intelligent Optimization {#intelligent-optimization}

Continuously optimize classification system and recommendation algorithms through user usage data and feedback.

## Summary {#summary}

AntV's infographic classification system takes **structural form** as the core dimension, establishing clear and practical classification standards. This system:

- ✅ Unified dimension: Focuses on the single dimension of structural form
- ✅ Clear boundaries: Reduces classification ambiguity through priority judgment
- ✅ Strong practicality: Directly serves application scenarios such as design, recommendation, and data extraction
- ✅ Extensible: Supports multiple classification and tag systems, adapting to complex scenarios

By understanding this classification system, you can more accurately select and use infographic templates, creating infographic works with clear structure and accurate expression.
