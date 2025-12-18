import { Project } from '@/types/project';

const API_BASE_URL = '/api/projects';

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

export interface GetProjectsParams {
  customer?: string;
  location?: string;
  projectType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateProjectInput {
  projectName: string;
  customer: string;
  remodelType: string;
  projectDescription?: string;
  location?: string;
  openInvoice?: number;
  paidInvoice?: number;
  created?: string;
  budgetVariance?: string;
  coverPhoto?: string;
}

export interface UpdateProjectInput {
  name?: string;
  customer?: string;
  location?: string;
  projectType?: string;
  openInvoice?: number;
  paidInvoice?: number;
  created?: string;
  projectNumber?: string;
  budgetVariance?: string;
  description?: string;
  coverPhoto?: string;
}

export async function getProjects(params?: GetProjectsParams): Promise<ApiResponse<Project[]>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.customer) queryParams.append('customer', params.customer);
    if (params?.location) queryParams.append('location', params.location);
    if (params?.projectType) queryParams.append('projectType', params.projectType);
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
      error: error.message || 'Failed to fetch projects',
    };
  }
}

export async function getProject(id: string): Promise<ApiResponse<Project>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch project',
    };
  }
}

export async function createProject(project: CreateProjectInput): Promise<ApiResponse<Project>> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create project',
    };
  }
}

export async function updateProject(id: string, project: UpdateProjectInput): Promise<ApiResponse<Project>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update project',
    };
  }
}

export async function deleteProject(id: string): Promise<ApiResponse<Project>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete project',
    };
  }
}

export async function uploadImage(file: File): Promise<ApiResponse<{ url: string; filename: string }>> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to upload image',
    };
  }
}

