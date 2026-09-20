import { Router } from 'express';
import { getProfile, updateProfile, getUsers, getUserById } from '../controllers/userController.ts';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.ts';

const router = Router();

// Student own profile
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// User list & individual profile
router.get('/', protect, getUsers);
router.get('/:id', getUserById);

export default router;
