# Public Assets Folder

This folder contains all static assets that are served directly from the root of
the application.

## Contents

### PWA Icons

These icons are used by the Progressive Web App when installed on devices:

- `favicon.ico` - Standard browser favicon
- `favicon-16x16.png` - Small favicon for browser tab
- `favicon-32x32.png` - Medium favicon
- `apple-touch-icon.png` - iOS home screen icon (180x180)
- `android-chrome-192x192.png` - Android home screen icon (192x192)
- `android-chrome-512x512.png` - Android splash screen icon (512x512)
- `icon.svg` - Scalable SVG icon with maskable purpose support

### Manifest

- `manifest.json` - PWA web app manifest defining app metadata and icons

## Adding Files

To add files to the public folder:

1. **During development**: Simply add files to this directory. Vite will
   automatically serve them at the root path (e.g., `/favicon.ico`)

2. **Build process**: The `build.js` script automatically copies:
   - All PDF files from the root
   - PNG images from the root
   - Everything in this public folder

## File References in HTML

Reference files from the public folder using absolute paths from the root:

```html
<!-- ✅ Correct -->
<link rel="icon" href="/favicon.ico" />
<img src="/cms1500print.png" alt="Form" />

<!-- ❌ Incorrect -->
<link rel="icon" href="public/favicon.ico" />
<img src="public/cms1500print.png" alt="Form" />
```

## Build Output

During production build, all assets in this folder are copied to the `dist/`
folder at the root level, maintaining this directory structure.
