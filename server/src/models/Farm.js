import mongoose from 'mongoose';
const farmSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  location: { type: String, required: true, trim: true, maxlength: 160 },
  areaAcres: { type: Number, min: 0, default: 0 },
  soilType: { type: String, trim: true, default: 'Unknown' },
  latitude: { type: Number, min: -90, max: 90 },
  longitude: { type: Number, min: -180, max: 180 }
}, { timestamps: true });
export default mongoose.model('Farm', farmSchema);
