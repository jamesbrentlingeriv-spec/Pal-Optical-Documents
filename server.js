const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

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

const server = app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`Pal Optical Forms Web App is running!`);
  console.log(`Open your browser at: http://localhost:${PORT}`);
  console.log(`Press Ctrl + C to stop the server.`);
  console.log(`==================================================\n`);
});
