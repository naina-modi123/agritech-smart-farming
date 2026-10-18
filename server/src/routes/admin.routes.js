import { Router } from 'express';
import User from '../models/User.js';
import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import Order from '../models/Order.js';
import Consultation from '../models/Consultation.js';
import CommunityPost from '../models/CommunityPost.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(protect, adminOnly);
router.get('/summary', asyncHandler(async (_req, res) => {
  const [users, farms, crops, orders, consultations, pendingPosts] = await Promise.all([
    User.countDocuments(), Farm.countDocuments(), Crop.countDocuments(), Order.countDocuments(),
    Consultation.countDocuments({ status: 'Requested' }), CommunityPost.countDocuments({ moderated: false })
  ]);
  res.json({ users, farms, crops, orders, consultations, pendingPosts });
}));
router.get('/users', asyncHandler(async (_req, res) => res.json(await User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(100))));
export default router;
