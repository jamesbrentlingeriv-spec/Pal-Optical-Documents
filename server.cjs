const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  const decodedPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(__dirname, decodedPath === '/' ? 'index.html' : decodedPath);
  
  // 1. Helper function to read and serve file
  const serveFile = (pathToSend) => {
    const ext = path.extname(pathToSend).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    fs.readFile(pathToSend, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  };

  // 2. Route dispatcher with public folder fallback
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If file not found in root, check in public directory
      const publicFilePath = path.join(__dirname, 'public', decodedPath === '/' ? 'index.html' : decodedPath);
      fs.access(publicFilePath, fs.constants.F_OK, (pubErr) => {
        if (pubErr) {
          // File not found in root or public folder
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 File Not Found', 'utf-8');
        } else {
          serveFile(publicFilePath);
        }
      });
    } else {
      serveFile(filePath);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`Pal Optical Forms Web App is running in Dev Mode!`);
  console.log(`Open your browser at: http://localhost:${PORT}`);
  console.log(`Press Ctrl + C to stop the server.`);
  console.log(`==================================================\n`);
});
