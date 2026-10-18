import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  ph: { type: Number, min: 0, max: 14, required: true },
  nitrogen: { type: Number, min: 0, required: true },
  phosphorus: { type: Number, min: 0, required: true },
  potassium: { type: Number, min: 0, required: true },
  notes: { type: String, maxlength: 500, default: '' }
}, { timestamps: true });
export default mongoose.model('SoilReport', schema);
