import { Router } from 'express';
import { listSkills } from '../controllers/skillController.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = Router(); router.get('/', asyncHandler(listSkills)); export default router;
