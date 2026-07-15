import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Crop } from './models/Crop.js';
import { WeatherAlert } from './models/WeatherAlert.js';

// Get current directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple manual .env parser to maintain zero dependencies
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const index = trimmed.indexOf('=');
        if (index > -1) {
          const key = trimmed.slice(0, index).trim();
          const value = trimmed.slice(index + 1).trim();
          // Remove potential wrapping quotes
          const cleanValue = value.replace(/^["']|["']$/g, '');
          process.env[key] = cleanValue;
        }
      }
    });
  }
}

loadEnv();

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '127.0.0.1';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crop_advisory';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log(`Connected to MongoDB at ${MONGO_URI}`))
  .catch(err => console.error('MongoDB connection error:', err));

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];

// Helper to write JSON responses
function sendJSON(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

// Helper to read request body stream
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', err => {
      reject(err);
    });
  });
}

// Create native HTTP server
const server = http.createServer(async (req, res) => {
  // Set CORS Headers
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // For direct curl or postman requests
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // Handle preflight options requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse requested URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  try {
    // Endpoint: GET /
    if (pathname === '/' && req.method === 'GET') {
      return sendJSON(res, 200, {
        "status": "online",
        "message": "Welcome to the AI-Powered Crop Advisory Backend for Uttarakhand Farmers!"
      });
    }

    // Endpoint: GET /api/weather
    if (pathname === '/api/weather' && req.method === 'GET') {
      const alerts = await WeatherAlert.find({});
      return sendJSON(res, 200, alerts);
    }

    // Endpoint: GET /api/crops/search
    if (pathname === '/api/crops/search' && req.method === 'GET') {
      const q = parsedUrl.searchParams.get('q');
      if (!q) {
        return sendJSON(res, 400, { detail: "Search query parameter 'q' is required." });
      }
      const qRegex = new RegExp(q, 'i');
      const results = await Crop.find({
        $or: [
          { name: qRegex },
          { category: qRegex },
          { advisory_notes: qRegex },
          { recommended_action: qRegex }
        ]
      });
      return sendJSON(res, 200, results);
    }

    // Endpoint: GET /api/crops
    if (pathname === '/api/crops' && req.method === 'GET') {
      const category = parsedUrl.searchParams.get('category');
      const healthStatus = parsedUrl.searchParams.get('health_status');
      
      let filter = {};
      if (category) {
        filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (healthStatus) {
        filter.health_status = { $regex: new RegExp(`^${healthStatus}$`, 'i') };
      }
      const results = await Crop.find(filter);
      return sendJSON(res, 200, results);
    }

    // Endpoint: GET /api/crops/:id
    const cropGetMatch = pathname.match(/^\/api\/crops\/([^/]+)$/);
    if (cropGetMatch && req.method === 'GET') {
      const cropId = cropGetMatch[1];
      let crop = null;
      if (mongoose.Types.ObjectId.isValid(cropId)) {
        crop = await Crop.findById(cropId);
      }
      if (crop) {
        return sendJSON(res, 200, crop);
      } else {
        return sendJSON(res, 404, { detail: `Crop with ID ${cropId} not found.` });
      }
    }

    // Endpoint: POST /api/crops
    if (pathname === '/api/crops' && req.method === 'POST') {
      const bodyText = await getRequestBody(req);
      let payload;
      try {
        payload = JSON.parse(bodyText);
      } catch (err) {
        return sendJSON(res, 400, { detail: "Invalid JSON body format." });
      }

      // Input Validation matching Pydantic / requirements
      if (!payload.name || !payload.category || !payload.health_status) {
        return sendJSON(res, 400, { detail: "Name, Category, and Health Status are required fields." });
      }

      const newCrop = new Crop({
        name: payload.name,
        category: payload.category,
        altitude_range: payload.altitude_range || "1000m - 2500m",
        soil_type: payload.soil_type || "Sandy Loam",
        watering_frequency: payload.watering_frequency || "Moderate",
        growth_stage: payload.growth_stage || "Vegetative",
        health_status: payload.health_status,
        recommended_action: payload.recommended_action || "",
        advisory_notes: payload.advisory_notes || ""
      });

      await newCrop.save();
      return sendJSON(res, 201, newCrop);
    }

    // Endpoint: PUT /api/crops/:id
    const cropPutMatch = pathname.match(/^\/api\/crops\/([^/]+)$/);
    if (cropPutMatch && req.method === 'PUT') {
      const cropId = cropPutMatch[1];
      if (!mongoose.Types.ObjectId.isValid(cropId)) {
        return sendJSON(res, 400, { detail: `Invalid ID format.` });
      }

      const bodyText = await getRequestBody(req);
      let payload;
      try {
        payload = JSON.parse(bodyText);
      } catch (err) {
        return sendJSON(res, 400, { detail: "Invalid JSON body format." });
      }

      const updatedCrop = await Crop.findByIdAndUpdate(cropId, payload, { returnDocument: 'after' });
      if (updatedCrop) {
        return sendJSON(res, 200, updatedCrop);
      } else {
        return sendJSON(res, 404, { detail: `Crop with ID ${cropId} not found.` });
      }
    }

    // Endpoint: DELETE /api/crops/:id
    const cropDeleteMatch = pathname.match(/^\/api\/crops\/([^/]+)$/);
    if (cropDeleteMatch && req.method === 'DELETE') {
      const cropId = cropDeleteMatch[1];
      if (!mongoose.Types.ObjectId.isValid(cropId)) {
        return sendJSON(res, 400, { detail: `Invalid ID format.` });
      }

      const deletedCrop = await Crop.findByIdAndDelete(cropId);
      if (deletedCrop) {
        res.writeHead(204);
        res.end();
        return;
      } else {
        return sendJSON(res, 404, { detail: `Crop with ID ${cropId} not found.` });
      }
    }

    // Endpoint: POST /api/chat
    if (pathname === '/api/chat' && req.method === 'POST') {
      const bodyText = await getRequestBody(req);
      let payload;
      try {
        payload = JSON.parse(bodyText);
      } catch (err) {
        return sendJSON(res, 400, { detail: "Invalid JSON body format." });
      }

      if (!payload.message || !payload.message.trim()) {
        return sendJSON(res, 400, { detail: "Message cannot be empty." });
      }

      const msg = payload.message.toLowerCase();
      let response = "";

      // Exact business logic responses matching Python backend
      if (msg.includes("mandua") || msg.includes("finger millet")) {
        response = (
          "Mandua (Finger Millet) is highly resilient and well-suited for Uttarakhand's rainfed terraced slopes. " +
          "If leaves are yellowing, it's often nitrogen deficiency or waterlogging. Make sure terrace drainage is clear. " +
          "Consider mixing well-decomposed cow dung manure (compost) at 10 tonnes/hectare during field preparation."
        );
      } else if (msg.includes("jhangora") || msg.includes("barnyard millet")) {
        response = (
          "Jhangora (Barnyard Millet) is a fast-growing traditional hill millet. If you notice dead hearts (drying central shoots), " +
          "it could be shoot fly. Remove affected plants and spray dilute neem oil (3-5 ml per liter of water) early in the morning."
        );
      } else if (msg.includes("bhatt") || msg.includes("black soybean")) {
        response = (
          "Bhatt (Black Soybean) is nitrogen-fixing and improves soil health. In slopes, ensure the seeds are sown " +
          "with a spacing of 30cm between rows. Avoid water accumulation around roots, as this soil is prone to fungal root rot."
        );
      } else if (msg.includes("rajma") || msg.includes("kidney bean")) {
        response = (
          "Harsil Rajma is a high-value mountain crop. During the flowering and pod formation stages (fruiting), " +
          "moisture stress can cause flower drop. Ensure light irrigation. If climbing, provide support stakes (bamboo/local twigs) early."
        );
      } else if (msg.includes("apple") || msg.includes("orchard") || msg.includes("apricot") || msg.includes("peach")) {
        response = (
          "For apple orchards in Uttarakhand heights (like Harsil/Ramgarh), keep an eye out for Apple Scab and Woolly Aphids. " +
          "Maintain clean orchard sanitation by burning fallen leaves. Apply a copper oxychloride spray (0.3%) in pre-bloom stages."
        );
      } else if (msg.includes("weather") || msg.includes("rain") || msg.includes("climate")) {
        response = (
          "Mountain weather is highly variable. Currently, heavy rains are forecast in some parts. Ensure terrace walls " +
          "are reinforced to prevent landslides, and clear drainage channels. Avoid spraying pesticides or applying fertilizer " +
          "right before a heavy downpour."
        );
      } else if (msg.includes("altitude") || msg.includes("height") || msg.includes("slope")) {
        response = (
          "For high-altitude farming in Uttarakhand (above 1500m), we recommend cultivating traditional millets (Mandua, Jhangora), " +
          "pulses (Bhatt, Rajma), or off-season vegetables. Slopes require contour farming and stone bunding to control soil erosion."
        );
      } else {
        response = (
          "Hello! I am your AI Crop Advisory Assistant for Uttarakhand Mountain Agriculture. I can guide you on " +
          "Millets (Mandua, Jhangora), Pulses (Bhatt, Rajma), Apple Orchards, pest management, and contour farming techniques. " +
          "What specific crop, disease, or farming technique would you like advice on today?"
        );
      }

      return sendJSON(res, 200, {
        sender: "assistant",
        text: response
      });
    }

    // Fallback: 404 Not Found
    return sendJSON(res, 404, { detail: `Route ${pathname} not found.` });

  } catch (error) {
    console.error("Internal Server Error:", error);
    return sendJSON(res, 500, { detail: "Internal Server Error: " + error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Node.js Native Backend listening on http://${HOST}:${PORT}`);
});
