import { Router } from 'express';
import {
  acceptRequest,
  rejectRequest,
  getMyIncomingRequests,
} from '../controllers/requestController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

router.put('/:id/accept', protect, acceptRequest);
router.put('/:id/reject', protect, rejectRequest);
router.get('/incoming', protect, getMyIncomingRequests);

export default router;
