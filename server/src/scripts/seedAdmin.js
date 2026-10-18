import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

if (!process.env.MONGODB_URI || !process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD) {
  console.error('Set MONGODB_URI, SEED_ADMIN_EMAIL, and SEED_ADMIN_PASSWORD in server/.env first.');
  process.exit(1);
}
if (process.env.SEED_ADMIN_PASSWORD.length < 12) {
  console.error('SEED_ADMIN_PASSWORD must be at least 12 characters.');
  process.exit(1);
}
try {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = process.env.SEED_ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'admin';
    await existing.save();
    console.log(`Existing user ${email} promoted to admin. Keep the password private.`);
  } else {
    await User.create({
      name: process.env.SEED_ADMIN_NAME || 'AgriTech Admin',
      email,
      password: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12),
      role: 'admin'
    });
    console.log(`Admin account created: ${email}`);
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
