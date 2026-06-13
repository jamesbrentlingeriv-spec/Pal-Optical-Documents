# Pal Optical Forms - TypeScript + Vite + Tailwind CSS + Node.js

## Project Setup

This project is now configured as a modern web application with:

- **Vite** for fast HMR (Hot Module Replacement) during development
- **TypeScript** for type safety
- **Tailwind CSS** for utility-first styling
- **Express.js** for production server
- **Node.js** for both development and production environments

## Installation

```bash
npm install
```

## Development

Start the Vite dev server with hot module replacement:

```bash
npm run dev
```

This will start the dev server at `http://localhost:5173` with fast refresh
enabled.

In another terminal, optionally start the Express server (for testing
server-side routing):

```bash
npm run server:dev
```

## Building for Production

Build the static assets:

```bash
npm run build
```

This creates a `dist/` folder with optimized, minified assets.

## Running in Production

```bash
npm start
```

Or manually:

```bash
npm run build
npm run server:prod
```

The app will run on `http://localhost:3000` by default.

## Deploying to Vercel

This project is optimized for Vercel deployment. To deploy:

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Vercel will automatically detect the Node.js framework
   - Click "Deploy"

3. **Automatic Deployments**:
   - Every push to `main` branch will automatically redeploy
   - The build script will handle frontend + backend compilation

**Build Configuration:**

- Build Command: `npm run build` (runs Vite + TypeScript compilation)
- Output Directory: `dist/`
- Install Command: `npm install`

## Type Checking

Check for TypeScript errors without building:

```bash
npm run type-check
```

## Project Structure

```
.
├── public/                    # Static assets served from root
│   ├── manifest.json         # PWA manifest
│   ├── favicon.ico           # Browser favicon
│   ├── favicon-16x16.png     # 16px favicon
│   ├── favicon-32x32.png     # 32px favicon
│   ├── apple-touch-icon.png  # iOS icon (180x180)
│   ├── android-chrome-192x192.png  # Android icon (192x192)
│   ├── android-chrome-512x512.png  # Android splash (512x512)
│   ├── icon.svg              # Scalable SVG icon
│   └── README.md             # Public folder documentation
├── src/
│   ├── index.css              # Entry CSS with Tailwind directives
│   ├── app.ts                 # Main application (to be converted to TS)
│   ├── styles/                # Additional CSS modules
│   ├── components/            # React-like component classes
│   └── forms/                 # Form definitions (JSON + JS)
├── dist/                      # Build output (generated)
├── index.html                 # HTML entry point
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── server.ts                 # Express server
├── build.js                  # Custom build script
└── *.pdf, *.png              # Form PDFs and images (root level)
```

## Next Steps

1. **Convert components to TypeScript** - Rename `.js` files to `.ts` in
   `src/components/` and `src/forms/`
2. **Add type definitions** - Create interfaces for form states and component
   props
3. **Enhance Tailwind** - Replace inline CSS with Tailwind utility classes
4. **Deploy** - The `dist/` folder can be deployed to any Node.js hosting
   platform

## PDF Assets

All PDF files remain in the root directory and are served as static assets. They
are not modified by the build process.

## Environment Variables

Create a `.env` file based on `.env.example` for local configuration.
