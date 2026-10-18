import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
  category: { type: String, enum: ['Question', 'Tip', 'Discussion'], default: 'Question' },
  moderated: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('CommunityPost', schema);
