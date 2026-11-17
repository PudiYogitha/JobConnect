import { Router } from 'express';
import auth from '../middleware/authMiddleware.js';
import role from '../middleware/roleMiddleware.js';
import { apply, myApplications, receivedApplications, updateStatus } from '../controllers/applicationController.js';
import asyncHandler from '../utils/asyncHandler.js';
const router = Router();
router.post('/', auth, role('seeker'), asyncHandler(apply)); router.get('/mine', auth, role('seeker'), asyncHandler(myApplications)); router.get('/received', auth, role('recruiter'), asyncHandler(receivedApplications)); router.patch('/:id/status', auth, role('recruiter'), asyncHandler(updateStatus));
export default router;
