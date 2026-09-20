import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  teamSize: number;
  members: mongoose.Types.ObjectId[];
  owner: mongoose.Types.ObjectId;
  deadline: Date;
  status: 'Open' | 'In Progress' | 'Completed';
  createdAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category (e.g., Hackathon, College Project, Startup)'],
      trim: true,
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Please provide at least one required skill'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Project must specify at least one required skill',
      },
    },
    teamSize: {
      type: Number,
      required: [true, 'Please specify maximum team size'],
      min: [2, 'Team size must be at least 2 members'],
      max: [20, 'Team size cannot exceed 20 members'],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide a project deadline'],
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Completed'],
      default: 'Open',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export default Project;
