import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  altitude_range: { type: String, default: "1000m - 2500m" },
  soil_type: { type: String, default: "Sandy Loam" },
  watering_frequency: { type: String, default: "Moderate" },
  growth_stage: { type: String, default: "Vegetative" },
  health_status: { type: String, required: true },
  recommended_action: { type: String, default: "" },
  advisory_notes: { type: String, default: "" }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  }
});

export const Crop = mongoose.model('Crop', cropSchema);
