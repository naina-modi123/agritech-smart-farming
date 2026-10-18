import mongoose from 'mongoose';
const cropSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  variety: { type: String, trim: true, default: '' },
  plantingDate: { type: Date },
  stage: { type: String, enum: ['Planned', 'Sowing', 'Growing', 'Flowering', 'Harvest-ready', 'Harvested'], default: 'Planned' },
  notes: { type: String, maxlength: 1000, default: '' }
}, { timestamps: true });
export default mongoose.model('Crop', cropSchema);
