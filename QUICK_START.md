# 🚀 Quick Start Guide — Onyxry Agency

## ⚡ Instant Preview (No Installation Required)

**The preview.html file should have opened in your browser!**

If not, simply double-click `preview.html` or drag it into your browser.

---

## 📋 What You Have

### ✅ Complete Next.js Application
- Modern React 18 + Next.js 14 setup
- TypeScript for type safety
- Tailwind CSS with custom monochrome theme
- Mathematical canvas animations
- Fully responsive design
- Contact form with validation
- SEO optimized

### ✅ Standalone HTML Preview
- `preview.html` — Works without any installation
- Same design and animations
- Perfect for quick demos

### ✅ Documentation
- `README.md` — Main documentation
- `SETUP.md` — Node.js installation guide
- `PROJECT_OVERVIEW.md` — Complete project details
- `QUICK_START.md` — This file

---

## 🎯 Next Steps

### Option 1: View Preview (Immediate)
```bash
# Already opened! Or open manually:
open preview.html
```

### Option 2: Run Full Next.js App (Requires Node.js)

#### Step 1: Install Node.js
Choose one method:

**A. Using Homebrew** (Recommended)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
```

**B. Download from nodejs.org**
Visit https://nodejs.org/ and download the LTS version

**C. Using NVM**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
```

#### Step 2: Install Dependencies
```bash
cd /Users/preeti/Desktop/BrandBna
npm install
```

#### Step 3: Run Development Server
```bash
npm run dev
```

#### Step 4: Open Browser
Navigate to: **http://localhost:3000**

---

## 🎨 Customization Quick Tips

### Change Agency Name
1. Edit `app/layout.tsx` — Update metadata title
2. Edit `components/Hero.tsx` — Change "ONYXRY" text
3. Edit `README.md` — Update all references

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  chalk: {
    white: '#FAFAFA',  // Change this
    gray: '#A0A0A0',   // And this
    dark: '#0A0A0A',   // And this
    black: '#000000',  // And this
  },
}
```

### Add New Service
Edit `components/Services.tsx`:
```typescript
{
  id: '05',
  title: 'Your New Service',
  description: 'Description here',
  icon: (/* SVG icon */)
}
```

### Change Contact Email
Edit `components/Contact.tsx`:
```typescript
hello@monolith.agency → your@email.com
```

---

## 📁 File Structure Overview

```
BrandBna/
├── preview.html           ← Open this for instant preview!
├── QUICK_START.md         ← You are here
├── SETUP.md               ← Node.js installation help
├── README.md              ← Main documentation
├── PROJECT_OVERVIEW.md    ← Detailed project info
│
├── app/
│   ├── page.tsx           ← Main landing page
│   ├── layout.tsx         ← Root layout
│   └── globals.css        ← Global styles
│
├── components/
│   ├── Hero.tsx           ← Hero section
│   ├── Services.tsx       ← Services grid
│   ├── Philosophy.tsx     ← Core principles
│   ├── Contact.tsx        ← Contact form
│   └── MathBackground.tsx ← Animated background
│
└── [config files]         ← TypeScript, Tailwind, Next.js
```

---

## 🎬 Features Included

### ✨ Visual Features
- [x] Animated mathematical background (parametric curves)
- [x] Letter-by-letter title animation
- [x] Floating logo with SVG animations
- [x] Hover effects on service cards
- [x] Smooth scroll indicators
- [x] Interactive contact form
- [x] Responsive design (mobile, tablet, desktop)

### 🔧 Technical Features
- [x] TypeScript for type safety
- [x] Tailwind CSS for styling
- [x] Canvas API for animations
- [x] SVG path animations
- [x] Intersection Observer for scroll effects
- [x] Form validation
- [x] SEO optimization
- [x] Accessibility (ARIA labels, semantic HTML)

---

## 🚀 Deployment (When Ready)

### Vercel (Easiest)
```bash
npm install -g vercel
vercel
```
Follow prompts → Your site is live!

### Netlify
1. Push code to GitHub
2. Connect repository on Netlify
3. Deploy automatically

### Other Options
- AWS Amplify
- DigitalOcean
- Self-hosted VPS

---

## 💡 Pro Tips

### 1. Test Locally First
Always run `npm run dev` and test thoroughly before deploying.

### 2. Optimize Images
Place images in `/public` folder and use Next.js `<Image>` component.

### 3. Add Analytics
Consider adding Google Analytics or Plausible for tracking.

### 4. Set Up Email
Use services like:
- SendGrid (email API)
- Formspree (form handling)
- Netlify Forms (if using Netlify)

### 5. Custom Domain
After deployment, connect your custom domain in hosting settings.

---

## 🐛 Troubleshooting

### Preview doesn't show animations?
- Try a different browser (Chrome recommended)
- Check browser console for errors (F12)

### npm install fails?
```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Port 3000 already in use?
```bash
# Use different port
npm run dev -- -p 3001
```

### Styles not loading?
```bash
# Rebuild Tailwind
npm run build
```

---

## 📞 Need Help?

### Documentation
- Read `README.md` for detailed info
- Check `SETUP.md` for installation help
- Review `PROJECT_OVERVIEW.md` for architecture

### Resources
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs

### Contact
Email: hello@onyxry.agency

---

## 🎉 You're All Set!

Your Onyxry agency website is ready to go!

**Current Status**:
- ✅ Preview is viewable in browser
- ⏳ Full app requires Node.js installation
- 📝 All documentation complete
- 🎨 Fully customizable

**Next Actions**:
1. View the preview (already open!)
2. Install Node.js (see SETUP.md)
3. Run `npm install` and `npm run dev`
4. Customize to your needs
5. Deploy to production

---

**Built with precision. Designed with care.**  
**Onyxry — Technology that elevates humanity.**
