import User from '../models/User.js';
import { publicUser } from './authController.js';

export async function updateProfile(req, res) {
  const allowed = ['name', 'phone', 'qualification', 'experience', 'skills', 'resumeUrl', 'companyName', 'companyDescription'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
  res.json({ user: publicUser(user) });
}
