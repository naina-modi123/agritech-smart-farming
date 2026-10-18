import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Farm from '../models/Farm.js';
import SoilReport from '../models/SoilReport.js';
import Crop from '../models/Crop.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(protect);

router.get('/weather', asyncHandler(async (req, res) => {
  const lat = Number(req.query.lat), lon = Number(req.query.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return res.status(400).json({ message: 'Valid latitude and longitude are required' });
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5`;
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) return res.status(502).json({ message: 'Weather provider is temporarily unavailable' });
  res.json(await response.json());
}));

router.get('/soil', asyncHandler(async (req, res) => res.json(await SoilReport.find({ owner: req.user._id }).populate('farm', 'name').sort({ createdAt: -1 }))));
router.post('/soil', [body('farm').notEmpty(), body('ph').isFloat({ min: 0, max: 14 }), body('nitrogen').isFloat({ min: 0 }), body('phosphorus').isFloat({ min: 0 }), body('potassium').isFloat({ min: 0 })], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
  const farm = await Farm.findOne({ _id: req.body.farm, owner: req.user._id });
  if (!farm) return res.status(400).json({ message: 'Choose one of your farms' });
  const report = await SoilReport.create({ ...req.body, owner: req.user._id });
  res.status(201).json(await report.populate('farm', 'name'));
}));

router.get('/pests', asyncHandler(async (req, res) => {
  const crops = await Crop.find({ owner: req.user._id }).populate('farm', 'name location');
  const alerts = crops.map(crop => {
    const flowering = crop.stage === 'Flowering';
    return {
      id: crop._id, crop: crop.name, farm: crop.farm?.name || 'Farm',
      level: flowering ? 'Watch' : 'Info',
      title: flowering ? 'Monitor flowering crops' : 'Routine crop inspection',
      advice: flowering ? 'Inspect leaves and flowers regularly for visible pest damage. Confirm identification with a local agriculture expert before treatment.' : 'Check the undersides of leaves and record unusual spots, wilting or insects during your next field visit.'
    };
  });
  res.json(alerts);
}));
export default router;
