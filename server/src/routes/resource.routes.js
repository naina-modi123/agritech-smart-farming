import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(protect);
export const catalog = [
  { id: 'seed-01', name: 'Seasonal vegetable seeds', category: 'Seeds', price: 120, unit: 'packet', description: 'Small demo pack for home and field gardens.' },
  { id: 'tool-01', name: 'Hand garden tool set', category: 'Tools', price: 450, unit: 'set', description: 'Basic tools for routine crop care.' },
  { id: 'soil-01', name: 'Soil testing kit', category: 'Soil care', price: 299, unit: 'kit', description: 'Demo listing; follow kit instructions for real measurements.' },
  { id: 'drip-01', name: 'Drip irrigation starter kit', category: 'Irrigation', price: 899, unit: 'kit', description: 'Starter kit listing for water-efficient irrigation.' }
];
router.get('/', (_req, res) => res.json(catalog));
router.get('/orders', asyncHandler(async (req, res) => res.json(await Order.find({ owner: req.user._id }).sort({ createdAt: -1 }))));
router.post('/orders', [body('items').isArray({ min: 1 }), body('deliveryAddress').trim().isLength({ min: 5, max: 300 })], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
  const items = req.body.items.map(item => {
    const product = catalog.find(p => p.id === item.productId);
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) throw Object.assign(new Error('Invalid product or quantity'), { status: 400 });
    return { name: product.name, quantity, unitPrice: product.price };
  });
  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const order = await Order.create({ owner: req.user._id, items, total, deliveryAddress: req.body.deliveryAddress });
  res.status(201).json(order);
}));
router.get('/admin/orders', adminOnly, asyncHandler(async (_req, res) => res.json(await Order.find().populate('owner', 'name email').sort({ createdAt: -1 }))));
router.patch('/admin/orders/:id', adminOnly, asyncHandler(async (req, res) => {
  if (!['Approved', 'Dispatched', 'Delivered', 'Cancelled'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid order status' });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}));
export default router;
