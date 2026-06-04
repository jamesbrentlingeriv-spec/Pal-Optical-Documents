import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("🔨 Building Pal Optical Forms for Vercel...\n");

// Step 1: Build frontend with Vite
console.log("📦 Building frontend with Vite...");
let result = spawnSync("npx", ["vite", "build"], {
  cwd: __dirname,
  stdio: "inherit",
});
if (result.status !== 0) {
  console.error("❌ Frontend build failed");
  process.exit(1);
}

// Step 2: Compile TypeScript server
console.log("\n🔧 Compiling TypeScript server...");
result = spawnSync(
  "npx",
  [
    "tsc",
    "server.ts",
    "--outDir",
    "dist",
    "--module",
    "esnext",
    "--target",
    "es2020",
    "--moduleResolution",
    "node",
    "--skipLibCheck",
    "--strict",
    "--declaration",
  ],
  {
    cwd: __dirname,
    stdio: "inherit",
  },
);
if (result.status !== 0) {
  console.error("❌ Server compilation failed");
  process.exit(1);
}

// Step 3: Copy PDF files from root to dist
console.log("\n📄 Copying PDF files...");
const pdfFiles = [
  "cms1500-form.pdf",
  "quote.pdf",
  "safety_order_form.pdf",
  "fee slip.pdf",
  "Printable Patient Form.pdf",
];

pdfFiles.forEach((file) => {
  const src = path.join(__dirname, file);
  const dst = path.join(__dirname, "dist", file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`  ✓ ${file}`);
  }
});

// Step 4: Copy image files from root to dist
console.log("\n🖼️  Copying image files...");
const imageFiles = ["cms1500print.png", "default_signature.png"];

imageFiles.forEach((file) => {
  const src = path.join(__dirname, file);
  const dst = path.join(__dirname, "dist", file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`  ✓ ${file}`);
  }
});

console.log("\n✅ Build complete! Ready for Vercel deployment.\n");
console.log("📂 Dist folder structure:");
console.log("   - index.html");
console.log("   - *.js (bundled assets)");
console.log("   - *.css (optimized styles)");
console.log("   - *.pdf (all forms)");
console.log("   - *.png (images)");
