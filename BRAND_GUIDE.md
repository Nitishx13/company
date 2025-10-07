# Onyxry — Brand Identity Guide

## 🎯 Brand Essence

**Name**: Onyxry  
**Meaning**: Inspired by onyx (strength, elegance) — symbolizing timelessness, clarity, and sophistication

**Tagline**: Technology that elevates humanity

**Voice**: Intelligent, focused, human, precise, purposeful

---

## 🎨 Visual Identity

### Logo Concept

The Onyxry logo is a geometric composition representing:
- **Rectangle**: The monolith itself — solid, timeless, foundational
- **Horizontal Line**: Connection between ideas, balance
- **Circle**: Completeness, human-centered design, infinite potential

```
┌─────────┐
│         │
│    ─    │  ← Horizontal line (balance)
│         │
└─────────┘
    ◯        ← Circle (humanity)
```

### Symbol Variations

**Primary Mark** (Full logo with circle):
```svg
<rect x="40" y="20" width="40" height="80" />
<line x1="40" y1="60" x2="80" y2="60" />
<circle cx="60" cy="60" r="35" />
```

**Secondary Mark** (Simplified):
```svg
<rect x="40" y="20" width="40" height="80" />
<line x1="40" y1="60" x2="80" y2="60" />
```

**Icon Mark** (Minimal):
```svg
<rect width="40" height="80" />
```

---

## 🎨 Color System

### Primary Palette

```
Chalk White
HEX: #FAFAFA
RGB: 250, 250, 250
Use: Primary text, borders, highlights, key elements

Chalk Gray
HEX: #A0A0A0
RGB: 160, 160, 160
Use: Secondary text, subtle elements, hover states

Chalk Dark
HEX: #0A0A0A
RGB: 10, 10, 10
Use: Background, primary surface

Chalk Black
HEX: #000000
RGB: 0, 0, 0
Use: Deep shadows, maximum contrast
```

### Color Usage Rules

**DO**:
- Use white (#FAFAFA) for all primary text
- Use gray (#A0A0A0) for secondary information
- Maintain high contrast ratios (WCAG AA minimum)
- Use opacity for subtle effects (e.g., rgba(250, 250, 250, 0.1))

**DON'T**:
- Never use colors outside the monochrome palette
- Avoid pure white (#FFFFFF) — use #FAFAFA instead
- Don't use gray for important CTAs
- Never compromise readability for aesthetics

---

## 📝 Typography

### Font Families

**Primary**: Inter
- Use: Headings, body text, UI elements
- Weights: 400 (Regular), 700 (Bold)
- Characteristics: Geometric, modern, highly legible

**Secondary**: JetBrains Mono
- Use: Code snippets, labels, technical elements
- Weights: 400 (Regular)
- Characteristics: Monospace, technical, precise

### Type Scale

```
Display:    96px / 6rem    (Hero titles)
H1:         80px / 5rem    (Section titles)
H2:         48px / 3rem    (Subsection titles)
H3:         32px / 2rem    (Card titles)
H4:         24px / 1.5rem  (Small headings)

Body Large: 20px / 1.25rem (Introductions)
Body:       18px / 1.125rem (Standard text)
Body Small: 16px / 1rem    (Secondary text)

Label:      14px / 0.875rem (Form labels)
Caption:    12px / 0.75rem  (Captions, metadata)
```

### Typography Rules

**Headings**:
- Font: Inter Bold (700)
- Letter-spacing: -0.02em (tight)
- Line-height: 1.1-1.2
- Transform: None (use sentence case)

**Body Text**:
- Font: Inter Regular (400)
- Letter-spacing: 0
- Line-height: 1.6-1.8
- Max-width: 70ch (for readability)

**Labels/Code**:
- Font: JetBrains Mono Regular (400)
- Letter-spacing: 0.1-0.2em (wide)
- Transform: UPPERCASE for labels
- Line-height: 1.5

---

## 🎭 Design Principles

### 1. Monochrome Mastery

**Philosophy**: Like chalk on a blackboard — clarity through contrast

**Application**:
- Use only black, white, and shades of gray
- Create depth through opacity, not color
- Let contrast guide the eye
- Embrace negative space

### 2. Mathematical Elegance

**Philosophy**: Beauty through logic and precision

**Application**:
- Use parametric curves for animations
- Apply golden ratio (1.618) for proportions
- Create patterns with mathematical functions
- Design with grid systems (8px base unit)

### 3. Inevitable Design

**Philosophy**: Every element feels necessary and obvious

**Application**:
- Remove anything that doesn't serve a purpose
- Make interactions predictable
- Use consistent patterns
- Design for clarity, not cleverness

### 4. Human-Centered

**Philosophy**: Technology serves people, not the other way around

**Application**:
- Prioritize accessibility
- Use clear, jargon-free language
- Design for all skill levels
- Test with real users

---

## ✨ Animation Principles

### Timing

```
Micro:      150-200ms  (Button hover, input focus)
Standard:   300-500ms  (Transitions, reveals)
Emphasis:   700-1000ms (Important reveals, draws)
Ambient:    2-6s       (Background animations)
```

### Easing

```
ease-out:           Most transitions (snappy start, smooth end)
ease-in-out:        Loops, oscillations (smooth both ends)
cubic-bezier:       Custom curves for unique feel
```

### Animation Types

**1. Draw Animations** (SVG paths):
```css
stroke-dasharray: 1000;
stroke-dashoffset: 1000;
animation: draw 2s ease-out forwards;
```

**2. Fade & Slide**:
```css
opacity: 0;
transform: translateY(20px);
transition: all 0.7s ease-out;
```

**3. Mathematical Motion** (Canvas):
```javascript
y = amplitude * sin(frequency * x + phase + time)
```

**4. Hover Effects**:
```css
transform: scale(1.02);
box-shadow: 0 0 20px rgba(250, 250, 250, 0.1);
```

---

## 📐 Layout System

### Grid

**Base Unit**: 8px (0.5rem)

**Columns**:
- Mobile: 4 columns
- Tablet: 8 columns
- Desktop: 12 columns

**Gutters**:
- Mobile: 16px
- Tablet: 24px
- Desktop: 32px

**Max Width**: 1400px (87.5rem)

### Spacing Scale

```
4px   (0.25rem)  xs
8px   (0.5rem)   sm
16px  (1rem)     md
24px  (1.5rem)   lg
32px  (2rem)     xl
48px  (3rem)     2xl
64px  (4rem)     3xl
96px  (6rem)     4xl
128px (8rem)     5xl
```

### Breakpoints

```
sm:  640px   (Mobile landscape)
md:  768px   (Tablet)
lg:  1024px  (Desktop)
xl:  1280px  (Large desktop)
2xl: 1536px  (Extra large)
```

---

## 🖼 Imagery Guidelines

### Photography

**Style**:
- Black and white only
- High contrast
- Minimal, focused compositions
- Human subjects when possible

**Treatment**:
- Convert to grayscale
- Increase contrast
- Apply subtle grain for texture
- Avoid busy backgrounds

### Illustrations

**Style**:
- Line art (vector)
- Geometric shapes
- Mathematical diagrams
- Blueprint aesthetic

**Execution**:
- White lines on dark background
- 1-2px stroke width
- No fills (outline only)
- Clean, precise paths

### Icons

**Style**:
- Outline style (not filled)
- 24x24px base size
- 2px stroke width
- Rounded corners (2px radius)

**Library**: Use custom SVG icons or:
- Lucide Icons (recommended)
- Feather Icons
- Heroicons (outline variant)

---

## 💬 Voice & Tone

### Brand Voice

**Intelligent**: We understand complex systems and explain them clearly

**Focused**: We cut through noise and get to what matters

**Human**: We care about people, not just technology

**Precise**: We choose words carefully and mean what we say

**Purposeful**: Everything we do serves a meaningful goal

### Writing Guidelines

**DO**:
- Use active voice
- Write short, clear sentences
- Explain technical concepts simply
- Show, don't just tell
- Be honest and direct

**DON'T**:
- Use jargon without explanation
- Make empty promises
- Follow trends blindly
- Overcomplicate simple ideas
- Use corporate speak

### Tone Examples

**Website Copy**:
> "We build technology and businesses that elevate human potential — through design, logic, and deep care."

**Service Description**:
> "Building AI systems that serve humanity with transparency, fairness, and purpose."

**Call to Action**:
> "Let's build together" (not "Contact us today!")

**Error Message**:
> "Something went wrong. Let's try that again." (not "Error 404")

---

## 📋 Component Library

### Buttons

**Primary**:
```css
border: 1px solid #FAFAFA
background: transparent
color: #FAFAFA
hover: background #FAFAFA, color #0A0A0A
```

**Secondary**:
```css
border: none
background: transparent
color: #A0A0A0
hover: color #FAFAFA
```

### Forms

**Input Fields**:
```css
background: transparent
border-bottom: 1px solid rgba(160, 160, 160, 0.3)
focus: border-bottom #FAFAFA
```

**Labels**:
```css
font: JetBrains Mono
size: 12px
transform: uppercase
letter-spacing: 0.1em
color: #A0A0A0
```

### Cards

**Service Cards**:
```css
border: 1px solid rgba(160, 160, 160, 0.3)
padding: 2rem
hover: border #FAFAFA, background rgba(250, 250, 250, 0.05)
```

---

## 🎯 Brand Applications

### Website
- Use full logo in hero
- Maintain monochrome palette strictly
- Implement mathematical animations
- Ensure accessibility (WCAG AA)

### Social Media
- Profile: Icon mark (simplified logo)
- Posts: Monochrome images with white text
- Stories: Vertical format, high contrast

### Presentations
- Dark background (#0A0A0A)
- White text (#FAFAFA)
- Minimal slides (one idea per slide)
- Use diagrams over text

### Business Cards
- Black card stock
- White foil or letterpress
- Minimal information
- Logo on front, contact on back

---

## ✅ Brand Checklist

Before publishing any branded material, verify:

- [ ] Uses only monochrome palette (#FAFAFA, #A0A0A0, #0A0A0A, #000000)
- [ ] Typography is Inter (body) or JetBrains Mono (code/labels)
- [ ] Animations use mathematical principles
- [ ] Design is minimal and purposeful
- [ ] Copy is clear, human, and precise
- [ ] Accessibility standards met (WCAG AA)
- [ ] Logo is properly sized and placed
- [ ] Spacing follows 8px grid system
- [ ] Contrast ratios are sufficient
- [ ] Mobile responsive design works

---

## 🚫 Brand Don'ts

**Never**:
- Add colors outside the monochrome palette
- Use gradients or shadows (except subtle opacity)
- Distort or rotate the logo
- Use decorative fonts
- Add unnecessary animations
- Compromise accessibility for aesthetics
- Use stock photos without grayscale treatment
- Write in corporate jargon
- Follow design trends blindly
- Sacrifice clarity for creativity

---

**This is Onyxry.**  
**Timeless. Clear. Strong.**  
**Technology that elevates humanity.**
