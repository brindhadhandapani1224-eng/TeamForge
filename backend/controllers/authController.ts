import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.ts';
import { JWT_SECRET } from '../middleware/authMiddleware.ts';

/**
 * Generate JWT token
 */
export const generateToken = (id: string, email: string, role: string): string => {
  return jwt.sign({ id, email, role }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * @desc    Register a new student
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, college, course, year, skills, interests, bio } = req.body;

    if (!name || !email || !password || !college || !course || !year) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password, college, course, year)',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      college,
      course,
      year,
      bio: bio || '',
      skills: Array.isArray(skills) ? skills : skills ? skills.split(',').map((s: string) => s.trim()) : [],
      interests: Array.isArray(interests) ? interests : interests ? interests.split(',').map((i: string) => i.trim()) : [],
      role: 'student',
    });

    const token = generateToken(newUser._id.toString(), newUser.email, newUser.role);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        college: newUser.college,
        course: newUser.course,
        year: newUser.year,
        skills: newUser.skills,
        interests: newUser.interests,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

/**
 * @desc    Authenticate student/admin & return token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    const token = generateToken(user._id.toString(), user.email, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        year: user.year,
        skills: user.skills,
        interests: user.interests,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};
