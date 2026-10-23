import { defineConfig } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: ".",
  publicDir: "public",
  plugins: [
    {
      name: "api-price-list-dev",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith("/api/price-list")) {
            const dataDir = path.join(__dirname, "data");
            const priceListFile = path.join(dataDir, "price-list-data.json");
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");

            if (req.method === "OPTIONS") {
              res.statusCode = 200;
              return res.end();
            }

            if (req.method === "GET") {
              try {
                if (fs.existsSync(priceListFile)) {
                  const content = fs.readFileSync(priceListFile, "utf-8");
                  return res.end(JSON.stringify({ success: true, data: JSON.parse(content) }));
                }
                return res.end(JSON.stringify({ success: true, data: null }));
              } catch (e: any) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ success: false, error: e.message }));
              }
            }

            if (req.method === "POST") {
              let body = "";
              req.on("data", (chunk: any) => { body += chunk; });
              req.on("end", () => {
                try {
                  if (!fs.existsSync(dataDir)) {
                    fs.mkdirSync(dataDir, { recursive: true });
                  }
                  const parsed = JSON.parse(body || "{}");
                  let payload = parsed.data || parsed;
                  const updatedAt = new Date().toISOString();
                  if (payload && typeof payload === "object") {
                    if (!payload.meta) payload.meta = {};
                    payload.meta.lastSyncedAt = updatedAt;
                  }
                  fs.writeFileSync(priceListFile, JSON.stringify(payload, null, 2), "utf-8");
                  res.statusCode = 200;
                  return res.end(JSON.stringify({ success: true, updatedAt, cloudPersisted: true }));
                } catch (err: any) {
                  res.statusCode = 500;
                  return res.end(JSON.stringify({ success: false, error: err.message }));
                }
              });
              return;
            }
          }
          next();
        });
      },
    },
  ],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        entryFileNames: "[name].[hash].js",
        chunkFileNames: "[name].[hash].js",
        assetFileNames: "[name].[hash][extname]",
      },
    },
  },
  server: {
    middlewareMode: false,
    port: 5173,
    strictPort: false,
  },
});
