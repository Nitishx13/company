# Setup Instructions

## Prerequisites

You need to install Node.js to run this Next.js application.

### Install Node.js on macOS

#### Option 1: Using Homebrew (Recommended)

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

#### Option 2: Download from Official Website

1. Visit https://nodejs.org/
2. Download the LTS version for macOS
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### Option 3: Using NVM (Node Version Manager)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then install Node
nvm install --lts
nvm use --lts
```

## After Installing Node.js

Once Node.js is installed, run these commands in the project directory:

```bash
# Navigate to project directory
cd /Users/preeti/Desktop/BrandBna

# Install dependencies
npm install

# Run development server
npm run dev
```

The site will be available at: **http://localhost:3000**

## Quick Preview

If you want to see a preview without installing Node.js, open `preview.html` in your browser.

## Troubleshooting

### Port 3000 already in use

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Permission errors

```bash
# Fix npm permissions
sudo chown -R $USER:$(id -gn $USER) ~/.npm
```

### Clear cache and reinstall

```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. Install Node.js using one of the methods above
2. Run `npm install` in the project directory
3. Run `npm run dev` to start the development server
4. Open http://localhost:3000 in your browser
5. Start customizing the site!

## Production Deployment

### Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Follow the prompts to deploy your site. Vercel is the recommended platform for Next.js applications.

### Other Deployment Options

- **Netlify**: Connect your Git repository
- **AWS Amplify**: Deploy via AWS console
- **DigitalOcean App Platform**: Deploy from GitHub
- **Self-hosted**: Build with `npm run build` and deploy the `.next` folder

---

Need help? Check the main README.md for more information.
