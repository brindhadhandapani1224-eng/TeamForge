import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { Project } from '../models/Project.ts';
import { TeamRequest } from '../models/TeamRequest.ts';
import { User } from '../models/User.ts';

/**
 * @desc    Get all projects with filtering and search
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, category, skill, status } = req.query;

    const query: any = {};

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Required skill filter
    if (skill && skill !== 'All') {
      query.requiredSkills = { $in: [new RegExp(skill as string, 'i')] };
    }

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
        { category: { $regex: search as string, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email college course profileImage')
      .populate('members', 'name email college course skills profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Student)
 */
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { title, description, category, requiredSkills, teamSize, deadline, status } = req.body;

    if (!title || !description || !category || !requiredSkills || !teamSize || !deadline) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, description, category, requiredSkills, teamSize, deadline)',
      });
      return;
    }

    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : requiredSkills.split(',').map((s: string) => s.trim());

    const project = await Project.create({
      title,
      description,
      category,
      requiredSkills: skillsArray,
      teamSize: Number(teamSize),
      owner: req.user.id,
      members: [req.user.id], // Owner is automatically the first member
      deadline: new Date(deadline),
      status: status || 'Open',
    });

    // Add project to user's created projects list
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { projects: project._id },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email college course year bio skills profileImage')
      .populate('members', 'name email college course year skills profileImage');

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (Owner only)
 */
export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    // Verify ownership
    if (project.owner.toString() !== req.user?.id && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to edit this project' });
      return;
    }

    const { title, description, category, requiredSkills, teamSize, deadline, status } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (requiredSkills) {
      project.requiredSkills = Array.isArray(requiredSkills)
        ? requiredSkills
        : requiredSkills.split(',').map((s: string) => s.trim());
    }
    if (teamSize) project.teamSize = Number(teamSize);
    if (deadline) project.deadline = new Date(deadline);
    if (status) project.status = status;

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (Owner or Admin)
 */
export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    // Verify ownership or admin
    if (project.owner.toString() !== req.user?.id && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
      return;
    }

    // Clean up related requests
    await TeamRequest.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
