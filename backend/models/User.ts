import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  college: string;
  course: string;
  year: string;
  bio?: string;
  skills: string[];
  interests: string[];
  profileImage?: string;
  projects: mongoose.Types.ObjectId[];
  role: 'student' | 'admin';
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't expose password by default
    },
    college: {
      type: String,
      required: [true, 'Please specify your college or university'],
      trim: true,
    },
    course: {
      type: String,
      required: [true, 'Please specify your course or major'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Please specify your graduation year or current year of study'],
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    profileImage: {
      type: String,
      default: '',
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
