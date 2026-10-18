import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Farm from '../models/Farm.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(protect);
const check = (req, res, next) => { const e = validationResult(req); if (!e.isEmpty()) return res.status(400).json({ message: e.array()[0].msg }); next(); };

router.get('/', asyncHandler(async (req, res) => res.json(await Farm.find({ owner: req.user._id }).sort({ createdAt: -1 }))));
router.post('/', [body('name').trim().isLength({ min: 2, max: 100 }), body('location').trim().isLength({ min: 2, max: 160 }), body('areaAcres').optional().isFloat({ min: 0 })], check, asyncHandler(async (req, res) => {
  const farm = await Farm.create({ ...req.body, owner: req.user._id });
  res.status(201).json(farm);
}));
router.put('/:id', asyncHandler(async (req, res) => {
  const farm = await Farm.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true });
  if (!farm) return res.status(404).json({ message: 'Farm not found' });
  res.json(farm);
}));
router.delete('/:id', asyncHandler(async (req, res) => {
  const farm = await Farm.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!farm) return res.status(404).json({ message: 'Farm not found' });
  res.json({ message: 'Farm deleted' });
}));
export default router;
