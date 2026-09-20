import { Router } from 'express';
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController.ts';
import {
  createJoinRequest,
  getProjectRequests,
} from '../controllers/requestController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

// Project CRUD
router.get('/', getProjects);
router.post('/', protect, createProject);
router.get('/:id', getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

// Team requests under project
router.post('/:id/request', protect, createJoinRequest);
router.get('/:id/requests', protect, getProjectRequests);

export default router;
