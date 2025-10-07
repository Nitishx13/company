# Onyxry Digital Agency — Project Overview

## 🎯 Vision Summary

**Agency Name**: Onyxry  
**Tagline**: Technology that elevates humanity

**Mission Statement**:  
"We build technology and businesses that elevate human potential — through design, logic, and deep care."

---

## 🎨 Design Philosophy

### Visual Identity

- **Aesthetic**: Minimalist monochrome, inspired by blackboard aesthetics
- **Color Palette**: Deep matte black backgrounds with sharp white line art
- **Style**: Chalk on blackboard, vector diagrams, blueprint-like precision
- **Typography**: Bold, geometric, clean (Bauhaus meets tech)

### Core Principles

1. **Human-First Tech** — All solutions serve real human needs
2. **Mathematics + Art** — Mathematical elegance drives design
3. **Monochrome Aesthetic** — Clarity, focus, and contrast
4. **World-Class Experience** — Every detail feels inevitable
5. **Technology with Purpose** — Meaningful systems over hype

---

## 🛠 Technical Implementation

### Tech Stack

#### Frontend
- **Framework**: Next.js 14 (React, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom monochrome theme)
- **Animations**: 
  - GSAP (timeline animations)
  - Framer Motion (component animations)
  - Canvas API (mathematical visualizations)
  - SVG path animations

#### 3D & Advanced Graphics
- **Three.js**: 3D mathematical visualizations
- **React Three Fiber**: React integration for Three.js
- **@react-three/drei**: Helper components

#### Development Tools
- **ESLint**: Code quality
- **TypeScript**: Type safety
- **PostCSS**: CSS processing
- **Autoprefixer**: Browser compatibility

### Animation Techniques

1. **Parametric Curves**: Using mathematical equations for smooth motion
2. **SVG Path Animations**: Stroke-dasharray/offset for drawing effects
3. **Canvas Generative Art**: Real-time mathematical pattern generation
4. **Geometric Transformations**: Rotation, scaling, translation
5. **Easing Functions**: Cubic-bezier for natural motion

---

## 📁 Project Structure

```
BrandBna/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles and utilities
│
├── components/
│   ├── Hero.tsx            # Hero section with animated logo
│   ├── Services.tsx        # Services grid with hover effects
│   ├── Philosophy.tsx      # Core principles section
│   ├── Contact.tsx         # Contact form and info
│   └── MathBackground.tsx  # Animated mathematical background
│
├── public/                 # Static assets (images, fonts, etc.)
│
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── next.config.mjs         # Next.js configuration
├── postcss.config.mjs      # PostCSS configuration
│
├── README.md               # Main documentation
├── SETUP.md                # Installation instructions
├── PROJECT_OVERVIEW.md     # This file
└── preview.html            # Standalone HTML preview
```

---

## 🎭 Services Offered

### 1. Ethical AI Development
Building AI systems that serve humanity with transparency, fairness, and purpose.

**Deliverables**:
- AI product strategy
- Model development and training
- Ethical AI frameworks
- Bias detection and mitigation

### 2. Advanced UX/UI Design
Logic-first design frameworks that create intuitive, inevitable user experiences.

**Deliverables**:
- User research and personas
- Information architecture
- High-fidelity prototypes
- Design systems

### 3. Mathematical Animations
Parametric curves, fractals, and geometry-driven motion that feels intelligent.

**Deliverables**:
- Custom animation libraries
- Interactive visualizations
- Motion design systems
- WebGL experiences

### 4. Systems Architecture
Holistic business and technical architecture that scales with purpose.

**Deliverables**:
- Technical architecture
- Scalability planning
- API design
- Infrastructure setup

---

## 🎨 Design System

### Colors

```css
Primary Palette:
- Chalk White:  #FAFAFA  (text, borders, highlights)
- Chalk Gray:   #A0A0A0  (secondary text, subtle elements)
- Chalk Dark:   #0A0A0A  (background)
- Chalk Black:  #000000  (deep shadows, contrast)
```

### Typography Scale

```
Headings:
- H1: 48-96px (clamp: 3rem to 8rem)
- H2: 40-80px (clamp: 2.5rem to 5rem)
- H3: 24-32px

Body:
- Large: 20px
- Regular: 16-18px
- Small: 14px

Code/Labels:
- Regular: 12-14px
- Uppercase with letter-spacing: 0.1-0.2em
```

### Spacing System

```
Base unit: 4px (0.25rem)

Scale:
- xs:  8px  (0.5rem)
- sm:  16px (1rem)
- md:  24px (1.5rem)
- lg:  32px (2rem)
- xl:  48px (3rem)
- 2xl: 64px (4rem)
- 3xl: 96px (6rem)
```

### Animation Timing

```
Fast:     150-200ms  (micro-interactions)
Medium:   300-500ms  (transitions)
Slow:     700-1000ms (reveals, draws)
Very Slow: 2-6s      (ambient animations)

Easing:
- ease-out: Most transitions
- ease-in-out: Loops, oscillations
- cubic-bezier(0.4, 0, 0.6, 1): Custom smooth
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)

### Quick Start

```bash
# 1. Install Node.js (if not installed)
# See SETUP.md for detailed instructions

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

### Instant Preview (No Installation)

Open `preview.html` in any modern browser to see a standalone version.

---

## 📦 Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
1. Connect Git repository
2. Build command: `npm run build`
3. Publish directory: `.next`

### Other Platforms
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted (Docker, VPS)

---

## 🎯 Target Audience

### Primary
- Future-oriented startups
- Ethical AI builders
- Product visionaries
- Research institutions

### Secondary
- Enterprise innovation teams
- Design-forward companies
- Tech-enabled businesses
- Social impact organizations

---

## 💡 Unique Selling Points

1. **Mathematical Elegance**: Animations driven by real mathematical equations
2. **Monochrome Mastery**: Sophisticated black-and-white aesthetic
3. **Purpose-Driven**: Technology that serves humanity, not just trends
4. **Design + Logic**: Perfect balance of art and engineering
5. **World-Class Quality**: Every detail meticulously crafted

---

## 🔮 Future Enhancements

### Phase 2 (Short-term)
- [ ] Case studies section
- [ ] Team/About page
- [ ] Blog with technical articles
- [ ] Interactive portfolio pieces
- [ ] Advanced 3D visualizations

### Phase 3 (Medium-term)
- [ ] Client portal
- [ ] Project estimation tool
- [ ] Real-time collaboration features
- [ ] AI-powered design assistant
- [ ] Custom animation builder

### Phase 4 (Long-term)
- [ ] Open-source design system
- [ ] Educational content platform
- [ ] Community forum
- [ ] Plugin marketplace
- [ ] API for developers

---

## 📊 Success Metrics

### Website Performance
- Lighthouse score: 90+ (all categories)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Accessibility: WCAG 2.1 AA compliant

### Business Goals
- Lead generation: 10+ qualified leads/month
- Conversion rate: 5%+ (contact form)
- Brand awareness: 1000+ unique visitors/month
- Social engagement: 100+ followers/platform

---

## 🤝 Contributing

This is a proprietary project for Monolith Digital Agency.

For internal team members:
1. Create feature branch from `main`
2. Follow code style guidelines
3. Write tests for new features
4. Submit PR with detailed description
5. Request review from lead developer

---

## 📄 License

© 2025 Onyxry Digital Agency. All rights reserved.

---

## 📞 Contact

**Email**: hello@onyxry.agency  
**Location**: Global — Remote First  
**Website**: (to be deployed)

**Social**:
- Twitter: @onyxry_agency
- LinkedIn: /company/onyxry-agency
- GitHub: @onyxry-agency

---

## 🙏 Acknowledgments

**Inspiration**:
- Bauhaus design movement
- Mathematical art (M.C. Escher, Bridget Riley)
- Minimalist architecture
- Swiss design principles
- Blackboard teaching aesthetics

**Technical References**:
- Next.js documentation
- Three.js examples
- GSAP animation library
- Tailwind CSS patterns

---

**Built with precision. Designed with care.**  
**Onyxry — Technology that elevates humanity.**
