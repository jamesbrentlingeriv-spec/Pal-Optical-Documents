import express, { Express, Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware for static files
app.use(express.static("public"));

// In production, serve the Vite build output
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
}

// SPA routing - redirect non-file requests to index.html
app.get("*", (req: Request, res: Response) => {
  const filePath = path.join(__dirname, req.path);
  const ext = path.extname(filePath);

  // If it looks like a file request, try to serve it
  if (ext) {
    fs.stat(filePath, (err) => {
      if (!err && !req.path.startsWith("..")) {
        return res.sendFile(filePath);
      }
      // File not found, serve index.html for SPA routing
      const indexPath =
        process.env.NODE_ENV === "production"
          ? path.join(__dirname, "dist", "index.html")
          : path.join(__dirname, "index.html");
      res.sendFile(indexPath);
    });
  } else {
    // No extension, serve index.html for SPA routing
    const indexPath =
      process.env.NODE_ENV === "production"
        ? path.join(__dirname, "dist", "index.html")
        : path.join(__dirname, "index.html");
    res.sendFile(indexPath);
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).send("Internal Server Error");
});

// Start server only in development/standalone mode
if (
  require.main === module ||
  import.meta.url === `file://${process.argv[1]}`
) {
  const server = app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`Pal Optical Forms Web App is running!`);
    console.log(`Open your browser at: http://localhost:${PORT}`);
    console.log(`Press Ctrl + C to stop the server.`);
    console.log(`==================================================\n`);
  });
}

// Export app for production deployment
export default app;
