# Onyxry — Digital Agency

> **Technology that elevates humanity**

A world-class digital agency focused on creating meaningful technology and businesses through design, logic, and deep care.

## 🎯 Mission

We build technology and businesses that elevate human potential — through design, logic, and deep care.

## 🧠 Core Principles

1. **Human-First Tech** — All solutions serve real human needs, improve well-being, or solve meaningful problems
2. **Mathematics + Art** — Using mathematical elegance to design smooth, dynamic, and intelligent experiences
3. **Monochrome Aesthetic** — Clarity, focus, and contrast — like chalk on a blackboard
4. **World-Class Experience** — Every pixel, interaction, and flow must feel inevitable, clear, and designed
5. **Technology with Purpose** — We build meaningful systems that help people

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom monochrome theme)
- **Animations**: GSAP, Framer Motion, Canvas API
- **3D Graphics**: Three.js, React Three Fiber
- **Fonts**: Inter, JetBrains Mono

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎨 Design System

### Color Palette

```css
--chalk-white: #FAFAFA   /* Primary text, borders */
--chalk-gray: #A0A0A0    /* Secondary text */
--chalk-dark: #0A0A0A    /* Background */
--chalk-black: #000000   /* Deep black */
```

### Typography

- **Headings**: Inter (Bold, 48-96px)
- **Body**: Inter (Regular, 16-20px)
- **Code/Labels**: JetBrains Mono (Regular, 12-14px)

### Animation Principles

- Mathematical curves (parametric equations, Bézier curves)
- Geometric transformations
- SVG path animations with stroke-dasharray
- Canvas-based generative patterns
- Smooth easing functions (ease-out, cubic-bezier)

## 📁 Project Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Hero.tsx            # Hero section with animated logo
│   ├── Services.tsx        # Services grid
│   ├── Philosophy.tsx      # Core principles
│   ├── Contact.tsx         # Contact form
│   └── MathBackground.tsx  # Animated mathematical background
├── public/                 # Static assets
└── tailwind.config.ts      # Tailwind configuration
```

## 🎭 Services

1. **Ethical AI Development** — Building AI systems that serve humanity
2. **Advanced UX/UI Design** — Logic-first design frameworks
3. **Mathematical Animations** — Parametric curves and geometry-driven motion
4. **Systems Architecture** — Holistic business and technical architecture

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Platforms

Build the static site:

```bash
npm run build
```

Deploy the `.next` folder to your hosting provider.

## 🔧 Customization

### Changing Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  chalk: {
    white: '#FAFAFA',
    gray: '#A0A0A0',
    dark: '#0A0A0A',
    black: '#000000',
  },
}
```

### Adding New Animations

Use the Canvas API in components or add GSAP animations:

```typescript
import { gsap } from 'gsap';

gsap.to('.element', {
  x: 100,
  duration: 1,
  ease: 'power2.out',
});
```

## 📝 License

© 2025 Onyxry. All rights reserved.

## 🤝 Contact

- **Email**: hello@onyxry.agency
- **Location**: Global — Remote First

---

**Built with precision, designed with care.**
