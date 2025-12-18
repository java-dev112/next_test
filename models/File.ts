import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFile extends Document {
  name: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  description?: string;
  category?: string;
  projectId?: string;
  customerId?: string;
  uploadedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
      maxlength: [200, 'File name cannot exceed 200 characters'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
      trim: true,
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [0, 'File size cannot be negative'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      trim: true,
    },
    projectId: {
      type: String,
      trim: true,
    },
    customerId: {
      type: String,
      trim: true,
    },
    uploadedBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

FileSchema.index({ name: 1 });
FileSchema.index({ category: 1 });
FileSchema.index({ projectId: 1 });
FileSchema.index({ customerId: 1 });
FileSchema.index({ createdAt: -1 });

const FileModel: Model<IFile> = mongoose.models.File || mongoose.model<IFile>('File', FileSchema);

export default FileModel;

