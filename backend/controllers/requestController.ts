import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { Project } from '../models/Project.ts';
import { TeamRequest } from '../models/TeamRequest.ts';

/**
 * @desc    Send a request to join a project
 * @route   POST /api/projects/:id/request
 * @access  Private (Student)
 */
export const createJoinRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;
    const projectId = req.params.id;

    if (!studentId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    // Validation 1: Student cannot request to join their own project
    if (project.owner.toString() === studentId) {
      res.status(400).json({
        success: false,
        message: 'You cannot request to join your own project',
      });
      return;
    }

    // Validation 2: Student cannot request if already a member
    if (project.members.some((m: any) => m.toString() === studentId)) {
      res.status(400).json({
        success: false,
        message: 'You are already a member of this project team',
      });
      return;
    }

    // Validation 3: Check if team is already full
    if (project.members.length >= project.teamSize) {
      res.status(400).json({
        success: false,
        message: 'This team is already full',
      });
      return;
    }

    // Validation 4: Check duplicate join requests
    const existingRequest = await TeamRequest.findOne({
      student: studentId,
      project: projectId,
    });

    if (existingRequest) {
      res.status(400).json({
        success: false,
        message: `You have already submitted a join request (${existingRequest.status})`,
      });
      return;
    }

    const newRequest = await TeamRequest.create({
      student: studentId,
      project: projectId,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Join request sent successfully',
      request: newRequest,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all join requests for a specific project
 * @route   GET /api/projects/:id/requests
 * @access  Private (Project Owner)
 */
export const getProjectRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    // Only owner or admin can view incoming requests
    if (project.owner.toString() !== req.user?.id && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to view requests for this project' });
      return;
    }

    const requests = await TeamRequest.find({ project: req.params.id })
      .populate('student', 'name email college course year bio skills interests profileImage')
      .populate('project', 'title category teamSize')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Accept a team request
 * @route   PUT /api/requests/:id/accept
 * @access  Private (Project Owner)
 */
export const acceptRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const request = await TeamRequest.findById(req.params.id).populate('project');
    if (!request) {
      res.status(404).json({ success: false, message: 'Request not found' });
      return;
    }

    const project = await Project.findById(request.project._id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Associated project not found' });
      return;
    }

    // Verify ownership
    if (project.owner.toString() !== req.user?.id && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Only the project owner can accept requests' });
      return;
    }

    // Check if team is already full
    if (project.members.length >= project.teamSize) {
      res.status(400).json({ success: false, message: 'Cannot accept request. Team is already full.' });
      return;
    }

    // Add student to project team members if not already there
    if (!project.members.includes(request.student)) {
      project.members.push(request.student);
      await project.save();
    }

    request.status = 'accepted';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request accepted! Teammate added to the project.',
      request,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Reject a team request
 * @route   PUT /api/requests/:id/reject
 * @access  Private (Project Owner)
 */
export const rejectRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const request = await TeamRequest.findById(req.params.id).populate('project');
    if (!request) {
      res.status(404).json({ success: false, message: 'Request not found' });
      return;
    }

    const project = await Project.findById(request.project._id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Associated project not found' });
      return;
    }

    // Verify ownership
    if (project.owner.toString() !== req.user?.id && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Only the project owner can reject requests' });
      return;
    }

    request.status = 'rejected';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request rejected',
      request,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all incoming requests for all projects owned by the logged-in student
 * @route   GET /api/requests/incoming
 * @access  Private
 */
export const getMyIncomingRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const myProjects = await Project.find({ owner: req.user?.id }).select('_id');
    const projectIds = myProjects.map((p: any) => p._id);

    const requests = await TeamRequest.find({ project: { $in: projectIds } })
      .populate('student', 'name email college course year bio skills profileImage')
      .populate('project', 'title category teamSize members')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
