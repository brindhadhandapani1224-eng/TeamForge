import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamRequest extends Document {
  student: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

const TeamRequestSchema: Schema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

// Ensure a student cannot request to join the same project multiple times
TeamRequestSchema.index({ student: 1, project: 1 }, { unique: true });

export const TeamRequest = mongoose.models.TeamRequest || mongoose.model<ITeamRequest>('TeamRequest', TeamRequestSchema);
export default TeamRequest;
