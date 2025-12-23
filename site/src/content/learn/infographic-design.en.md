---
title: Infographic Design
---

Infographic design directly determines readability and communication effectiveness. This article outlines practical principles from the dimensions of design style, layout, specifications, density, and interaction.

## Design Style {#design-style}

### Color Strategy {#color-strategy}

Color is used to establish visual hierarchy:

- **Solid + Transparent**: Use solid colors to establish focus, low transparency for transitions, maintaining lightness
- **Hierarchy Distinction**: Distinguish primary from secondary through saturation and transparency, avoiding monotony or clutter
- **Color Balance**: Pair dark heavy elements with light elements to maintain stability

### Graphic Language {#graphic-language}

Graphic design recommendations:

- **Rounded Corners Priority**: Soften harshness, enhance approachability
- **Clear Semantics**: Use universal symbols, avoid cultural or emotional bias
- **Neutral Tone**: Minimize anthropomorphic or emotional elements
- **Moderate Decoration**: Enrich the picture with semantically clear icons, balancing density

### Style Taboos {#style-taboos}

To maintain professionalism and universality, avoid:

- **Emotional Graphics**: Shapes with strong emotions or metaphors
- **Culturally Sensitive Elements**: Religious, ethnic symbols or controversial patterns
- **Excessive Effects**: Overuse of shadows, gradients, and blurs

## Layout Principles {#layout-principles}

### Visual Hierarchy Construction {#visual-hierarchy-construction}

Establish clear information hierarchy through the following means:

- **Differentiated Design**: Use color depth, graphic size, and shape variations to distinguish information importance
- **Visual Guidance**: Use arrows, lines, or layouts conforming to visual flow (Z-type/F-type reading patterns) to guide viewing order

### Compositional Balance {#compositional-balance}

Choose appropriate balance methods based on information type:

- **Symmetrical Balance**: Suitable for comparison and balance-type infographics, creating stability through left-right or top-bottom symmetrical layouts
- **Asymmetrical Balance**: Achieve balance through visual weight (color, size, density) rather than symmetrical position, for example, pairing "small and heavy" dark blocks with "large and light" light graphics, avoiding a "one-sided" picture

### Spatial Handling {#spatial-handling}

- **Moderate Whitespace**: Reserve sufficient breathing space around titles, main visuals, and between different information groups, avoiding visual crowding
- **Rule of Thirds**: Divide the canvas into a 3×3 grid, placing key elements (title, main visual) at intersections or grid lines to enhance compositional aesthetics
- **Golden Ratio**: In timelines and story-type infographics, spiral layouts can guide vision, creating a natural and comfortable visual rhythm

### Common Layout Types {#common-layout-types}

Infographic layout types can be divided into path-oriented and structure-oriented:

**Path-Oriented Layouts**:

| Layout Type | Applicable Scenarios |
| --- | --- |
| Z-type/Linear Layout | Sequential information such as processes, routes, timelines |
| Curve/Diagonal Layout | Display of dynamic processes or trend changes |
| Circular/Spiral Layout | Cyclical, periodic, or hierarchical expansion of information |

**Structure-Oriented Layouts**:

| Layout Type | Applicable Scenarios |
| --- | --- |
| Modular Layout | List-type information |
| Center Radial | Theme divergence, causal relationships, or convergence/divergence information |
| Triangle Layering | Weight, hierarchy, funnel, or pyramid structures |
| Column/Mirror | Comparison, pillars, or pros-cons analysis |
| Main Body + Labels | Explanatory notes or structural analysis |
| Tree Layering | Organizational structure or causal analysis |

## Design Specifications {#design-specifications}

### Size Standards {#size-standards}

- **Overall Width**: Around 800px is appropriate, can be adjusted based on the number of data items
- **Base Unit**: Use 4px as the base unit, all spacing, margins, and whitespace are multiples of 4

### Text Specifications {#text-specifications}

**Font Size and Color**:

> <span style={{fontSize: '24px', fontWeight: 'bold', color: '#222'}}>
>   Title
> </span>
> <br />
> <span style={{fontSize: '16px', color: '#666'}}>Title Description</span>
> <br />
> <span style={{fontSize: '18px', fontWeight: 'bold', color: '#222'}}>
>   Item Label
> </span>
> <br />
> <span style={{fontSize: '14px', color: '#666'}}>Item Description</span>

- `Title`: 24pt, bold, #222
- `Title Description (desc)`: 16pt, regular, #666
- `Item Label`: 18pt, bold
- `Item Description (item-desc)`: 14pt, regular, #666

### Icon Specifications {#icon-specifications}

- Small icons: 24×24px
- Medium icons: 36×36px
- Large icons: 48×48px
- Specially designed icon sizes can be adjusted according to actual conditions

### Spacing Specifications {#spacing-specifications}

- **Between data items**: 16-24px (recommended 16px/20px/24px), can exceed 24px in special cases
- **Card inner spacing**: Fixed 8px on all sides, 8px between content areas, 6px border-radius
- **Title to body**: 24px
- **Data items to graphics**: 16-32px (recommended 16px/20px/24px/32px), irregular graphics can be handled flexibly

### Alignment Principles {#alignment-principles}

**Vertical Alignment**:

- In associated element groups, top text should be bottom-aligned, bottom text should be top-aligned to ensure consistent spacing
- For example: `Title` bottom-aligned, `Title Description` top-aligned

**Horizontal Alignment**:

- Prioritize left alignment, conforming to left-to-right reading habits with highest reading efficiency
- Follow the "visual consistency" principle, using the same alignment method for content at the same hierarchy level
- Try to avoid using more than 2 different text alignment methods in one graphic

### Graphic Specifications {#graphic-specifications}

- **Avoid Complex Stacking**: Try to avoid overlapping between data item graphics to prevent inability to distinguish after recoloring
- **Avoid Excessive Detail**: Don't use overly detailed graphics, which may blur together due to strokes during rendering
- **Boolean Operation Optimization**: For compound graphics, use boolean operations to merge into a single graphic, avoid using masks

## Information Density {#information-density}

The essence of infographics is to convey information through visualization, so the ratio of graphics to text needs careful control:

### Regular Layout {#regular-layout}

- **Graphics Ratio**: About 60%, constructing the visual skeleton, conveying visualization value
- **Text Ratio**: About 40%, serving as information connection and detail supplement
- **Balance Principle**: Ensure information completeness without disrupting the visualization rhythm, balancing visual impact with information delivery

### Special Layout {#special-layout}

- **Integrated Graphics and Text**: In designs emphasizing overall feel and picture sense, graphics ratio can reach up to 80%
- **Precautions**: Need to ensure coordinated picture style, avoid destroying overall feel due to ratio imbalance

## Interaction Design {#interaction-design}

### Button Placement {#button-placement}

Infographics need to provide interactive capability to edit data items, button placement needs to consider interaction friendliness:

- **Add Button**: Place at the midpoint between two data items, or at the very beginning/end
- **Delete Button**: Place at the edge of data items
- **Button Size**: 20×20px

### Button Quantity {#button-quantity}

- Add button quantity = Number of data items + 1
- Delete button quantity = Number of data items
- If data items cannot be reduced, delete button quantity is 0
- If data items cannot be increased, add button quantity is 0

## Graphics and Text Association {#graphics-and-text-association}

The mapping relationship between graphics and text in infographics needs to be clear and explicit:

### Spatial Position Binding {#spatial-position-binding}

- **Adjacent Layout**: Distance between text and corresponding graphic edge ≤ 32px, forming a "graphics → text" sight line flow
- **Container Association**: Wrap graphics and text as independent modules using unified background color or borders, such as card-style layout

### Visual Echo {#visual-echo}

- **Color Consistency**: Colors in graphics unified with corresponding data item icon colors
- **Symbol Association**: Key elements in graphics reappear as icons in data items, establishing visual association

### Information Delivery {#information-delivery}

- **Avoid Redundancy**: Prohibit graphics and text from repeatedly expressing the same content (if graphics already show order, text doesn't need to list numbers again)
- **Reading Logic**: In left-to-right/top-to-bottom layouts, graphics take priority over text, conforming to the "visual → cognitive" information reception process
- **Numbering Assistance**: Complex process graphics need to be paired with text numbering (such as ①②③) to strengthen logical coherence

## Color Strategy {#color-strategy-section}

### Same-Level Color Usage {#same-level-color-usage}

Graphics under the same data item should maintain consistent colors, distinguishable through transparency or decorative elements (such as with or without backgrounds) to differentiate hierarchy.

## Summary {#summary}

Infographic design is a combination of visual communication and information architecture, requiring balance between aesthetics and functionality. By following the above design principles, you can create excellent infographic works that are both visually attractive and efficiently convey information. In actual design processes, flexibly adjust according to specific information types and target audiences, exercising creativity while ensuring standardization.
