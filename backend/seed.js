import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Crop } from './models/Crop.js';
import { WeatherAlert } from './models/WeatherAlert.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple manual .env parser to maintain zero dependencies for loading MONGO_URI
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
          const cleanValue = value.replace(/^["']|["']$/g, '');
          process.env[key] = cleanValue;
        }
      }
    });
  }
}

loadEnv();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crop_advisory";

const CROPS = [
  {
    name: "Finger Millet (Mandua)",
    category: "Millet",
    altitude_range: "1000m - 2500m",
    soil_type: "Sandy Loam / Loamy",
    watering_frequency: "Low (Rainfed)",
    growth_stage: "Vegetative",
    health_status: "Excellent",
    recommended_action: "Keep monitoring soil moisture. Water only if soil feels completely dry.",
    advisory_notes: "Well suited for drylands and sloping mountain terrains. Rich in calcium."
  },
  {
    name: "Barnyard Millet (Jhangora)",
    category: "Millet",
    altitude_range: "800m - 2000m",
    soil_type: "Gravelly / Poor Soils",
    watering_frequency: "Low",
    growth_stage: "Flowering",
    health_status: "Good",
    recommended_action: "Check for shoot fly infestation. Keep weed-free.",
    advisory_notes: "Traditional crop with short maturity period. High fiber content."
  },
  {
    name: "Black Soybean (Bhatt)",
    category: "Pulse",
    altitude_range: "1000m - 2000m",
    soil_type: "Sandy Loam",
    watering_frequency: "Moderate",
    growth_stage: "Vegetative",
    health_status: "Excellent",
    recommended_action: "Ensure proper drainage around roots to prevent root rot.",
    advisory_notes: "Essential part of Kumaoni and Garhwali diet. Highly nutritious."
  },
  {
    name: "Harsil Rajma (Kidney Beans)",
    category: "Pulse",
    altitude_range: "1800m - 3000m",
    soil_type: "Deep Rich Loamy",
    watering_frequency: "Moderate",
    growth_stage: "Fruiting",
    health_status: "Needs Attention",
    recommended_action: "Watering levels are slightly low. Increase watering during the fruiting stage.",
    advisory_notes: "Premium quality high-altitude pulse with unique taste. High demand."
  }
];

const WEATHER_ALERTS = [
  {
    type: "warning",
    title: "Heavy Rainfall Warning",
    message: "Heavy rain forecast for Uttarkashi and Chamoli districts over the next 48 hours. Ensure clear drainage channels in your terrace fields to prevent soil erosion."
  },
  {
    type: "info",
    title: "Frost Alert",
    message: "Night temperatures expected to drop below 5°C in altitudes above 2200m. Consider mulching for sensitive young crops."
  }
];

async function seed() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully. Seeding database...");

    // Clear existing data
    await Crop.deleteMany({});
    await WeatherAlert.deleteMany({});

    // Insert new data
    const insertedCrops = await Crop.insertMany(CROPS);
    console.log(`Successfully seeded ${insertedCrops.length} crops!`);

    const insertedAlerts = await WeatherAlert.insertMany(WEATHER_ALERTS);
    console.log(`Successfully seeded ${insertedAlerts.length} weather alerts!`);

  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
