import express, { Express, Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON payloads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Enable CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Price List multi-computer sync endpoints
const rootDir = process.env.NODE_ENV === "production" ? path.join(__dirname, "..") : __dirname;
const dataDir = path.join(rootDir, "data");
const priceListFile = path.join(dataDir, "price-list-data.json");

app.get("/api/price-list", (req: Request, res: Response) => {
  try {
    if (fs.existsSync(priceListFile)) {
      const content = fs.readFileSync(priceListFile, "utf-8");
      return res.json({ success: true, data: JSON.parse(content) });
    }
    return res.json({ success: true, data: null });
  } catch (err: any) {
    console.error("Error reading price list file:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/price-list", (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    let payload = req.body;
    if (payload && payload.data) payload = payload.data;
    const updatedAt = new Date().toISOString();
    if (payload && typeof payload === "object") {
      if (!payload.meta) payload.meta = {};
      payload.meta.lastSyncedAt = updatedAt;
    }
    fs.writeFileSync(priceListFile, JSON.stringify(payload, null, 2), "utf-8");
    return res.json({ success: true, updatedAt, cloudPersisted: true });
  } catch (err: any) {
    console.error("Error saving price list file:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Middleware for static files - serve from dist when in production
const publicDir =
  process.env.NODE_ENV === "production"
    ? __dirname
    : path.join(__dirname, "..");

app.use(
  express.static(publicDir, {
    maxAge: process.env.NODE_ENV === "production" ? "1h" : "0",
    etag: false,
  }),
);

// SPA routing - redirect non-file requests to index.html
app.get("*", (req: Request, res: Response) => {
  const filePath = path.join(publicDir, req.path);
  const ext = path.extname(filePath);

  // If it looks like a file request, try to serve it
  if (ext) {
    fs.stat(filePath, (err) => {
      if (!err && !req.path.startsWith("..")) {
        return res.sendFile(filePath);
      }
      // File not found, serve index.html for SPA routing
      const indexPath = path.join(publicDir, "index.html");
      res.sendFile(indexPath, (error) => {
        if (error) {
          res.status(404).send("404 - Page not found");
        }
      });
    });
  } else {
    // No extension, serve index.html for SPA routing
    const indexPath = path.join(publicDir, "index.html");
    res.sendFile(indexPath, (error) => {
      if (error) {
        res.status(404).send("404 - Page not found");
      }
    });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).send("Internal Server Error");
});

// Start server in standalone mode (not when imported as a module)
const isStandalone =
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith("server.js");

if (isStandalone) {
  const server = app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`Pal Optical Forms Web App is running!`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Open your browser at: http://localhost:${PORT}`);
    console.log(`Press Ctrl + C to stop the server.`);
    console.log(`==================================================\n`);
  });
}

// Export app for Vercel serverless and production deployment
export default app;
