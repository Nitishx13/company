# Navigation Structure — Onyxry Agency

## 🗺️ Site Map

```
Onyxry Agency
├── Home (/)
│   ├── Hero Section
│   ├── Services Overview
│   ├── Core Principles
│   └── CTA Section
│
├── About (/about)
│   ├── Mission Statement
│   ├── Our Values
│   ├── Team Information
│   └── CTA Section
│
├── Services (/services)
│   ├── Service Overview
│   ├── AI Development (#ai)
│   ├── UX/UI Design (#design)
│   ├── Mathematical Animations (#animation)
│   ├── Systems Architecture (#architecture)
│   └── CTA Section
│
├── Work (/work)
│   ├── Portfolio Overview
│   ├── Project Filter
│   ├── Project Grid
│   └── CTA Section
│
└── Contact (/contact)
    ├── Contact Form
    ├── Contact Information
    └── Social Links
```

## 🧭 Header Navigation

The header component includes:

### Desktop Navigation
- **Logo**: Links to home page
- **Menu Items**: Home, About, Services, Work, Contact
- **Active State**: Underline animation on current page
- **Hover State**: Underline animation on hover
- **Scroll Effect**: Background blur when scrolled

### Mobile Navigation
- **Hamburger Menu**: Animated three-line icon
- **Slide-down Menu**: Smooth height transition
- **Auto-close**: Menu closes when link is clicked

## 📍 Footer Navigation

The footer includes:

### Four Columns
1. **Brand Column**
   - Logo and tagline
   - Social media links

2. **Company Links**
   - About
   - Services
   - Work
   - Contact

3. **Services Links**
   - AI Development
   - UX/UI Design
   - Animations
   - Architecture

4. **Contact Info**
   - Email address
   - Location
   - Response time

### Bottom Bar
- Copyright notice
- Privacy Policy link
- Terms of Service link

## 🎨 Navigation Styling

### Colors
- **Active Link**: `#FAFAFA` (chalk-white)
- **Inactive Link**: `#A0A0A0` (chalk-gray)
- **Hover State**: `#FAFAFA` (chalk-white)
- **Underline**: `#FAFAFA` (chalk-white)

### Typography
- **Font**: JetBrains Mono (monospace)
- **Size**: 14px (0.875rem)
- **Weight**: 400 (Regular)
- **Letter Spacing**: 0.1em (wider)
- **Transform**: None

### Animations
- **Underline**: 300ms ease
- **Color**: 300ms ease
- **Mobile Menu**: 300ms ease
- **Hamburger**: 300ms ease

## 🔗 Internal Links

### Home Page
- `/` - Main landing page
- `/#services` - Services section (scroll)
- `/#philosophy` - Philosophy section (scroll)

### About Page
- `/about` - About page

### Services Page
- `/services` - Services overview
- `/services#ai` - AI Development section
- `/services#design` - UX/UI Design section
- `/services#animation` - Animations section
- `/services#architecture` - Architecture section

### Work Page
- `/work` - Portfolio page

### Contact Page
- `/contact` - Contact form

## 📱 Responsive Behavior

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile (< 768px)
- Hamburger menu visible
- Desktop nav hidden
- Slide-down menu on toggle
- Full-width layout

### Tablet (768px - 1024px)
- Desktop nav visible
- Responsive grid layouts
- Adjusted spacing

### Desktop (> 1024px)
- Full desktop nav
- Multi-column layouts
- Maximum width: 1400px

## 🎯 User Flows

### Primary Flow
1. Land on Home page
2. Explore Services overview
3. Navigate to Services page for details
4. View Work portfolio
5. Contact via form

### Alternative Flow
1. Land on Home page
2. Learn more on About page
3. Navigate to specific Service
4. Contact via form

### Quick Contact Flow
1. Any page
2. Click Contact in header
3. Fill form
4. Submit

## ⚡ Performance Notes

### Navigation Features
- **Client-side routing**: Fast page transitions
- **Prefetching**: Next.js automatically prefetches links
- **Smooth scrolling**: CSS scroll-behavior: smooth
- **No page reload**: SPA-like experience

### Optimization
- Header is fixed and optimized for scroll
- Mobile menu uses CSS transitions (GPU accelerated)
- Links use Next.js `<Link>` component for optimization
- Active state uses `usePathname` hook

## 🔧 Customization

### Adding New Pages

1. **Create page file**:
   ```bash
   /app/new-page/page.tsx
   ```

2. **Add to Header navigation**:
   ```typescript
   const navLinks = [
     // ... existing links
     { href: '/new-page', label: 'New Page' },
   ];
   ```

3. **Add to Footer** (optional):
   ```typescript
   company: [
     // ... existing links
     { label: 'New Page', href: '/new-page' },
   ]
   ```

### Changing Navigation Order

Edit `/components/Header.tsx`:
```typescript
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  // Reorder as needed
];
```

### Styling Navigation

Edit colors in `/tailwind.config.ts`:
```typescript
colors: {
  chalk: {
    white: '#FAFAFA',  // Active/hover color
    gray: '#A0A0A0',   // Inactive color
  },
}
```

## 📊 Navigation Analytics

### Recommended Tracking

Track these events:
- **Page views**: All page navigations
- **CTA clicks**: "Start a Project" buttons
- **Form submissions**: Contact form
- **External links**: Social media clicks
- **Mobile menu**: Open/close events

### Implementation

Add analytics in `/app/layout.tsx`:
```typescript
// Google Analytics, Plausible, etc.
```

---

**Navigation is complete and functional!**  
All pages are connected with smooth transitions and responsive design.
