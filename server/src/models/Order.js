import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [{ name: { type: String, required: true }, quantity: { type: Number, min: 1, required: true }, unitPrice: { type: Number, min: 0, required: true } }],
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Placed', 'Approved', 'Dispatched', 'Delivered', 'Cancelled'], default: 'Placed' },
  deliveryAddress: { type: String, required: true, maxlength: 300 }
}, { timestamps: true });
export default mongoose.model('Order', schema);
