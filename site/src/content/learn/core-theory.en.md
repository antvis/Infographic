---
title: Core Theory
---

Infographic design is built at the intersection of visual communication, information visualization, and cognitive psychology. Mastering these theories makes design decisions more grounded and outputs clearer and more efficient.

## Theoretical Foundation Framework {#architecture}

Infographic design primarily falls within these theoretical domains:

<img
  src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Yx8OQoZRLH4AAAAAQdAAAAgAemJ7AQ/original"
  width="500"
  alt="field"
/>

## Gestalt Visual Perception Principles {#gestalt}

Gestalt psychology explains how humans automatically organize and group visual information, forming the foundation of infographic layout.

### Core Principles {#principles}

#### 1. Proximity {#proximity}

**Key Point**: Elements close to each other are perceived as a group. Use appropriate whitespace and spacing (commonly 16-24px) to differentiate modules.

---

#### 2. Similarity {#similarity}

**Key Point**: Elements with similar appearance are understood as the same type. Maintain consistency in color, font size, and icon style for elements at the same hierarchy level.

---

#### 3. Continuity {#continuity}

**Key Point**: The eye moves along continuous paths. Use arrows, connecting lines, or Z/F-type reading flows to guide vision.

---

#### 4. Closure {#closure}

**Key Point**: The brain automatically completes incomplete shapes. Borders, background blocks, or whitespace can all form visual containers.

---

#### 5. Figure-Ground {#figure-ground}

**Key Point**: Foreground and background need clear contrast. Control decorative weight to prevent it from overshadowing the main content.

## Cognitive Load Theory {#cognitive-load-theory}

Cognitive Load Theory emphasizes that working memory has limited capacity (about 7±2 information units, lasting 15-30 seconds). The goal of design is to reduce extraneous load and enhance germane load, allowing information to smoothly enter long-term memory.

### Three Types of Cognitive Load {#three-loads}

| Load Type | Definition | Manifestation in Infographics | Design Strategy |
| --- | --- | --- | --- |
| **Intrinsic Load** | Complexity of the content itself | • Too much specialized terminology<br/>• Abstract concepts<br/>• Complex data relationships | • Layer content progressively<br/>• Use analogies and metaphors<br/>• Gradually unfold complex concepts<br/>❌ Cannot be eliminated, only split and adjusted |
| **Extraneous Load** | Extra burden from presentation | • Useless decoration<br/>• Chaotic layout<br/>• Too many colors/fonts<br/>• Excessive information density | • Simplify interface<br/>• Unify style<br/>• Remove ineffective decoration<br/>✅ Controllable, should **minimize** |
| **Germane Load** | Investment in understanding and constructing knowledge | • Establishing information connections<br/>• Guiding reasoning<br/>• Promoting conceptual understanding | • Use connecting lines to express relationships<br/>• Design clear hierarchy<br/>• Provide appropriate guidance<br/>✅ Controllable, should **appropriately enhance** |

### Decorative Elements Trade-offs {#decoration}

- ❌ Purely decorative patterns, irrelevant animations, excessive effects, and dazzling color schemes increase extraneous load.
- ✅ Reasonable metaphors (like funnels expressing conversion), semantic icons, whitespace, and contrasting colors can transform into germane load.

Judgment criterion: Does the decoration reduce understanding cost, strengthen attention, or maintain reading rhythm?

## Data-Ink Ratio Principle {#data-ink-ratio}

Edward Tufte's "Data-Ink Ratio" emphasizes: let every drop of ink serve information, compressing irrelevant elements.

### Core Idea {#core-idea}

<Math>Data-Ink Ratio = Ink used to represent actual data / Total ink used in the chart</Math>

**Should retain**: Data graphics, necessary labels, lines guiding relationships, reasonable whitespace.  
**Should question**: Heavy grids, 3D effects, decoration unrelated to content.

AntV's practice focuses on balance: infographics allow moderate decoration, but it must be semantic, controllable, and not overshadow the main information. A common ratio is about 60% graphics, 40% text.

## Information Organization Framework: L.A.T.C.H {#latch}

Richard Saul Wurman's L.A.T.C.H framework, the father of information architecture, provides five organizational dimensions to help choose the appropriate structure.

| Organization Dimension | Description | Applicable Infographic Types | Typical Scenarios |
| --- | --- | --- | --- |
| **Location** | Organize information based on spatial relationships | Geographical structure | Maps, floor plans, regional distribution, route maps |
| **Alphabet** | Arrange in alphabetical order | List structure | Directories, indexes, contact lists, glossaries |
| **Time** | Organize chronologically | Sequential structure (temporal) | Timelines, historical events, project plans, development history |
| **Category** | Group by theme or nature | List structure, Comparison structure | Product categorization, knowledge systems, subject divisions |
| **Hierarchy** | Order by importance or rank | Hierarchical structure | Organizational charts, priority ranking, pyramid models |

### Choosing the Right Organization Method {#organization-choice}

Choose by prioritizing content characteristics: use Time for time series, Location for geographic space, Category for classified information, Hierarchy for hierarchical relationships, and Alphabet for indexes. An infographic can mix multiple dimensions, for example, development history has both time and category.

## Color and Semiotics Theory {#color-semiotics}

### Color Psychology {#color-psychology}

Color can guide attention, establish classification, and express hierarchy. It's recommended to follow neutral design, use systematic color palettes, and consider color-blind friendliness (avoid purely red-green contrasts).

### Semiotic Principles {#semiotics}

Graphic symbols in infographics should:

- **Clear semantics**: Use universal semantic symbols as much as possible
- **Cognitive consistency**: Align with target audience's cognitive habits
- **Visual clarity**: Appropriate size (24x24 / 36x36 / 48x48)
- **Unified style**: Maintain unified icon style within the same graphic

## Theory in Practice {#practice}

### Design Checklist {#design-checklist}

Use this checklist for self-examination during design:

- **Gestalt**: Are related information elements close enough? Are similar elements consistent? Is the reading path continuous?
- **Cognitive Load**: Has irrelevant decoration been cleaned up? Has complex content been split and layered? Are associative relationships clear?
- **Data-Ink Ratio**: Is every element necessary? Have redundant grids, borders, and shadows been eliminated?
- **Information Organization**: Does the organizational dimension match the content? Is the hierarchy clear?
