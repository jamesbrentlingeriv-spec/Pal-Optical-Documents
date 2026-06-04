#!/bin/bash

# Build frontend with Vite
echo "Building frontend..."
npm run vite build

# Compile TypeScript server
echo "Compiling server..."
npx tsc server.ts --outDir dist --module esnext --target es2020 --moduleResolution node --declaration

# Copy public files to dist
echo "Copying public assets..."
cp -r public/* dist/ 2>/dev/null || true

# Copy static assets
echo "Copying PDFs and static files..."
find . -maxdepth 1 -type f \( -name "*.pdf" -o -name "*.png" -o -name "*.ico" -o -name "*.svg" \) -exec cp {} dist/ \;

echo "Build complete!"
