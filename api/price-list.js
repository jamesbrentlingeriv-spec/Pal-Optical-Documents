import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to determine local data file path
function getDataFilePath() {
  // In serverless / Vercel, try /tmp or project data folder
  const projectDataPath = path.join(__dirname, "..", "data", "price-list-data.json");
  if (fs.existsSync(path.dirname(projectDataPath))) {
    return projectDataPath;
  }
  return path.join("/tmp", "pal_optical_price_list.json");
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const firebaseUrl = process.env.FIREBASE_DATABASE_URL;

  // GET: Retrieve latest Price List data
  if (req.method === "GET") {
    try {
      // 1. Try Upstash / Vercel KV if configured
      if (redisUrl && redisToken) {
        const kvRes = await fetch(`${redisUrl}/get/pal_optical_price_list`, {
          headers: { Authorization: `Bearer ${redisToken}` },
        });
        if (kvRes.ok) {
          const kvData = await kvRes.json();
          if (kvData.result) {
            const parsed = typeof kvData.result === "string" ? JSON.parse(kvData.result) : kvData.result;
            return res.status(200).json({ success: true, source: "kv", data: parsed });
          }
        }
      }

      // 2. Try Firebase if configured
      if (firebaseUrl) {
        const cleanFireUrl = firebaseUrl.replace(/\/$/, "");
        const fRes = await fetch(`${cleanFireUrl}/pal_optical_price_list.json`);
        if (fRes.ok) {
          const fData = await fRes.json();
          if (fData) {
            return res.status(200).json({ success: true, source: "firebase", data: fData });
          }
        }
      }

      // 3. Fallback to local file
      const filePath = getDataFilePath();
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(fileContent);
        return res.status(200).json({ success: true, source: "file", data: parsed });
      }

      // No saved custom data yet; client will use built-in defaults
      return res.status(200).json({ success: true, source: "default", data: null });
    } catch (err) {
      console.error("Error reading price list:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST: Save updated Price List data
  if (req.method === "POST") {
    try {
      let bodyData = req.body;
      if (typeof bodyData === "string") {
        try {
          bodyData = JSON.parse(bodyData);
        } catch (e) {}
      }

      const payload = bodyData.data || bodyData;
      const updatedAt = new Date().toISOString();

      if (payload && typeof payload === "object") {
        if (!payload.meta) payload.meta = {};
        payload.meta.lastSyncedAt = updatedAt;
      }

      let savedInCloud = false;

      // 1. Save to Upstash / Vercel KV if available
      if (redisUrl && redisToken) {
        try {
          const kvRes = await fetch(`${redisUrl}/set/pal_optical_price_list`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${redisToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          if (kvRes.ok) savedInCloud = true;
        } catch (kvErr) {
          console.warn("Upstash save warning:", kvErr);
        }
      }

      // 2. Save to Firebase if available
      if (firebaseUrl) {
        try {
          const cleanFireUrl = firebaseUrl.replace(/\/$/, "");
          const fRes = await fetch(`${cleanFireUrl}/pal_optical_price_list.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (fRes.ok) savedInCloud = true;
        } catch (fErr) {
          console.warn("Firebase save warning:", fErr);
        }
      }

      // 3. Also save to local / tmp file
      try {
        const filePath = getDataFilePath();
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
      } catch (fileErr) {
        console.warn("Local file save notice:", fileErr);
      }

      return res.status(200).json({
        success: true,
        updatedAt: updatedAt,
        cloudPersisted: savedInCloud,
      });
    } catch (err) {
      console.error("Error saving price list:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  res.status(405).json({ success: false, error: "Method not allowed" });
}
