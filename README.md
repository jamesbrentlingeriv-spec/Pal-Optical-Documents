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

## Type Checking

Check for TypeScript errors without building:

```bash
npm run type-check
```

## Project Structure

```
.
├── src/
│   ├── index.css              # Entry CSS with Tailwind directives
│   ├── app.ts                 # Main application (to be converted to TS)
│   ├── styles/                # Additional CSS modules
│   ├── components/            # React-like component classes
│   └── forms/                 # Form definitions (JSON + JS)
├── public/                    # Static assets (favicons, PDFs)
├── dist/                      # Build output (generated)
├── index.html                 # HTML entry point
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
└── server.ts                 # Express server
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
