import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const issueToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  next();
};

router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], validate, asyncHandler(async (req, res) => {
  const { name, email, password, preferredLanguage } = req.body;
  if (await User.findOne({ email })) return res.status(409).json({ message: 'An account with this email already exists' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), preferredLanguage: preferredLanguage === 'hi' ? 'hi' : 'en' });
  res.status(201).json({ token: issueToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role, preferredLanguage: user.preferredLanguage } });
}));

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], validate, asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ message: 'Email or password is incorrect' });
  res.json({ token: issueToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role, preferredLanguage: user.preferredLanguage } });
}));

router.get('/me', protect, (req, res) => res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, preferredLanguage: req.user.preferredLanguage } }));
export default router;
