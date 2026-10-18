import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true, maxlength: 120 },
  details: { type: String, required: true, maxlength: 2000 },
  preferredDate: { type: Date },
  status: { type: String, enum: ['Requested', 'Scheduled', 'Resolved'], default: 'Requested' },
  expertResponse: { type: String, maxlength: 2000, default: '' }
}, { timestamps: true });
export default mongoose.model('Consultation', schema);
