import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Dynamic import of express
let expressModule;
let app;
try {
  expressModule = await import("express");
  const express = expressModule.default;
  app = express();

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Enable CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Price List multi-computer sync endpoints
  const dataDir = path.join(__dirname, "data");
  const priceListFile = path.join(dataDir, "price-list-data.json");

  app.get("/api/price-list", (req, res) => {
    try {
      if (fs.existsSync(priceListFile)) {
        const content = fs.readFileSync(priceListFile, "utf-8");
        return res.json({ success: true, data: JSON.parse(content) });
      }
      return res.json({ success: true, data: null });
    } catch (err) {
      console.error("Error reading price list file:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/price-list", (req, res) => {
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
    } catch (err) {
      console.error("Error saving price list file:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Serve static files from the root directory
  app.use(
    express.static(".", {
      maxAge: "1d",
      etag: false,
    }),
  );

  // SPA routing - redirect non-file requests to index.html
  app.get("*", (req, res) => {
    const filePath = path.join(__dirname, req.path);
    const ext = path.extname(filePath);

    // If it looks like a file request, try to serve it
    if (ext) {
      fs.stat(filePath, (err) => {
        if (!err) {
          return res.sendFile(filePath);
        }
        // File not found, serve index.html
        res.sendFile(path.join(__dirname, "index.html"));
      });
    } else {
      // No extension, serve index.html for SPA routing
      res.sendFile(path.join(__dirname, "index.html"));
    }
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`Pal Optical Forms Web App is running (Express)!`);
    console.log(`Open your browser at: http://localhost:${PORT}`);
    console.log(`Press Ctrl + C to stop the server.`);
    console.log(`==================================================\n`);
  });

} catch (e) {
  console.log("⚠️ Express not found. Falling back to zero-dependency HTTP server...");

  const MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".pdf": "application/pdf"
  };

  const server = http.createServer((req, res) => {
    // Translate URL path to file system path
    let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url.split("?")[0]);
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    
    // Set default content type
    let contentType = MIME_TYPES[ext] || "application/octet-stream";
    
    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === "ENOENT") {
          // Page/file not found
          if (!ext) {
            // Serve index.html for SPA routing
            fs.readFile(path.join(__dirname, "index.html"), (err2, content2) => {
              if (err2) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 File Not Found", "utf-8");
              } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(content2, "utf-8");
              }
            });
          } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 File Not Found", "utf-8");
          }
        } else {
          // Some server error
          res.writeHead(500);
          res.end(`Server Error: ${err.code}`);
        }
      } else {
        // Success
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  });

  server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`Pal Optical Forms Web App is running (Zero-Dependency fallback)!`);
    console.log(`Open your browser at: http://localhost:${PORT}`);
    console.log(`Press Ctrl + C to stop the server.`);
    console.log(`==================================================\n`);
  });
}

export default app;
