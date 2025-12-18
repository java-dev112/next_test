import mongoose, { Schema, Document, Model } from 'mongoose';
import { ProjectType, RemodelType } from '@/types/project';

export interface IProject extends Document {
  name: string;
  customer: string;
  location: string;
  projectType: RemodelType;
  openInvoice: number;
  paidInvoice: number;
  created: string;
  projectNumber: string;
  budgetVariance?: string;
  description?: string;
  coverPhoto?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [200, 'Project name cannot exceed 200 characters'],
    },
    customer: {
      type: String,
      required: [true, 'Customer is required'],
      trim: true,
    },
    location: {
      type: String,
      default: 'TBD',
      trim: true,
    },
    projectType: {
      type: String,
      enum: ['Residential Build', 'High-Rise Construction', 'Commercial', 'Renovation'],
      required: [true, 'Project type is required'],
    },
    openInvoice: {
      type: Number,
      default: 0,
      min: [0, 'Open invoice cannot be negative'],
    },
    paidInvoice: {
      type: Number,
      default: 0,
      min: [0, 'Paid invoice cannot be negative'],
    },
    created: {
      type: String,
      required: true,
    },
    projectNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    budgetVariance: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    coverPhoto: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ customer: 1 });
ProjectSchema.index({ location: 1 });
ProjectSchema.index({ projectType: 1 });
ProjectSchema.index({ projectNumber: 1 });
ProjectSchema.index({ created: -1 });
ProjectSchema.index({ openInvoice: 1 });
ProjectSchema.index({ paidInvoice: 1 });

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;

