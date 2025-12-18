export interface FileItem {
  id: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFileInput {
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
}

export interface UpdateFileInput {
  name?: string;
  description?: string;
  category?: string;
  projectId?: string;
  customerId?: string;
}

