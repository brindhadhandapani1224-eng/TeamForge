import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { User } from '../models/User.ts';

/**
 * @desc    Get current student's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.id).populate('projects');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update current student's profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { name, college, course, year, bio, skills, interests, profileImage } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (college) user.college = college;
    if (course) user.course = course;
    if (year) user.year = year;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map((s: string) => s.trim());
    if (interests) user.interests = Array.isArray(interests) ? interests : interests.split(',').map((i: string) => i.trim());
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all users (admin or general directory)
 * @route   GET /api/users
 * @access  Private
 */
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Public / Authenticated
 */
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('projects');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
