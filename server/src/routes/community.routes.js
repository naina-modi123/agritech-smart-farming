import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import CommunityPost from '../models/CommunityPost.js';
import Consultation from '../models/Consultation.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(protect);
router.get('/posts', asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { $or: [{ moderated: true }, { author: req.user._id }] };
  res.json(await CommunityPost.find(filter).populate('author', 'name role').sort({ createdAt: -1 }));
}));
router.post('/posts', [body('title').trim().isLength({ min: 4, max: 120 }), body('body').trim().isLength({ min: 10, max: 2000 })], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
  const post = await CommunityPost.create({ ...req.body, author: req.user._id, moderated: req.user.role === 'admin' });
  res.status(201).json(await post.populate('author', 'name role'));
}));
router.patch('/posts/:id/moderate', adminOnly, asyncHandler(async (req, res) => {
  const post = await CommunityPost.findByIdAndUpdate(req.params.id, { moderated: Boolean(req.body.moderated) }, { new: true });
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
}));
router.get('/consultations', asyncHandler(async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { farmer: req.user._id };
  res.json(await Consultation.find(query).populate('farmer', 'name email').sort({ createdAt: -1 }));
}));
router.post('/consultations', [body('subject').trim().isLength({ min: 4, max: 120 }), body('details').trim().isLength({ min: 10, max: 2000 })], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
  const consultation = await Consultation.create({ ...req.body, farmer: req.user._id });
  res.status(201).json(consultation);
}));
router.patch('/consultations/:id', adminOnly, asyncHandler(async (req, res) => {
  const allowed = {};
  if (['Requested', 'Scheduled', 'Resolved'].includes(req.body.status)) allowed.status = req.body.status;
  if (typeof req.body.expertResponse === 'string') allowed.expertResponse = req.body.expertResponse.slice(0, 2000);
  const item = await Consultation.findByIdAndUpdate(req.params.id, allowed, { new: true }).populate('farmer', 'name email');
  if (!item) return res.status(404).json({ message: 'Consultation not found' });
  res.json(item);
}));
export default router;
