import { FileItem, CreateFileInput, UpdateFileInput } from '@/types/file';

const API_BASE_URL = '/api/files';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface GetFilesParams {
  search?: string;
  category?: string;
  projectId?: string;
  customerId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function uploadFile(file: File): Promise<ApiResponse<{ url: string; filename: string }>> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', 'file'); // General file upload

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to upload file',
    };
  }
}

export async function getFiles(params?: GetFilesParams): Promise<ApiResponse<FileItem[]>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.projectId) queryParams.append('projectId', params.projectId);
    if (params?.customerId) queryParams.append('customerId', params.customerId);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `${API_BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch files',
    };
  }
}

export async function getFile(id: string): Promise<ApiResponse<FileItem>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch file',
    };
  }
}

export async function createFile(file: CreateFileInput): Promise<ApiResponse<FileItem>> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(file),
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create file',
    };
  }
}

export async function updateFile(id: string, file: UpdateFileInput): Promise<ApiResponse<FileItem>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(file),
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update file',
    };
  }
}

export async function deleteFile(id: string): Promise<ApiResponse<FileItem>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete file',
    };
  }
}
