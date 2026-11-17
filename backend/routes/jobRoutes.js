import { Router } from 'express';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';
import { listJobs, createJob, myJobs, getJob } from '../controllers/jobController.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = Router();
router.get('/', asyncHandler(listJobs)); router.get('/mine', auth, role('recruiter'), asyncHandler(myJobs)); router.get('/:id', asyncHandler(getJob)); router.post('/', auth, role('recruiter'), asyncHandler(createJob));
export default router;
