import { Router } from 'express';
import auth from '../middleware/authMiddleware.js';
import { updateProfile } from '../controllers/userController.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = Router(); router.put('/profile', auth, asyncHandler(updateProfile)); export default router;
