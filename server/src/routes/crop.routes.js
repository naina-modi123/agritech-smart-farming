import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Crop from '../models/Crop.js';
import Farm from '../models/Farm.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(protect);
const check = (req, res, next) => { const e = validationResult(req); if (!e.isEmpty()) return res.status(400).json({ message: e.array()[0].msg }); next(); };
router.get('/', asyncHandler(async (req, res) => res.json(await Crop.find({ owner: req.user._id }).populate('farm', 'name location').sort({ createdAt: -1 }))));
router.post('/', [body('farm').notEmpty(), body('name').trim().isLength({ min: 2, max: 80 }), body('stage').optional().isIn(['Planned','Sowing','Growing','Flowering','Harvest-ready','Harvested'])], check, asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ _id: req.body.farm, owner: req.user._id });
  if (!farm) return res.status(400).json({ message: 'Choose one of your farms' });
  const crop = await Crop.create({ ...req.body, owner: req.user._id });
  res.status(201).json(await crop.populate('farm', 'name location'));
}));
router.put('/:id', asyncHandler(async (req, res) => {
  if (req.body.farm) {
    const farm = await Farm.findOne({ _id: req.body.farm, owner: req.user._id });
    if (!farm) return res.status(400).json({ message: 'Choose one of your farms' });
  }
  const crop = await Crop.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true }).populate('farm', 'name location');
  if (!crop) return res.status(404).json({ message: 'Crop not found' });
  res.json(crop);
}));
router.delete('/:id', asyncHandler(async (req, res) => {
  const crop = await Crop.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!crop) return res.status(404).json({ message: 'Crop not found' });
  res.json({ message: 'Crop deleted' });
}));
export default router;
