import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task';

const API_BASE_URL = '/api/tasks';

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

export interface GetTasksParams {
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function getTasks(params?: GetTasksParams): Promise<ApiResponse<Task[]>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
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
      error: error.message || 'Failed to fetch tasks',
    };
  }
}

export async function getTask(id: string): Promise<ApiResponse<Task>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch task',
    };
  }
}

export async function createTask(task: CreateTaskInput): Promise<ApiResponse<Task>> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create task',
    };
  }
}

export async function updateTask(id: string, task: UpdateTaskInput): Promise<ApiResponse<Task>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update task',
    };
  }
}

export async function deleteTask(id: string): Promise<ApiResponse<Task>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete task',
    };
  }
}

export async function bulkDeleteTasks(taskIds: string[]): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation: 'delete',
        taskIds,
      }),
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete tasks',
    };
  }
}

export async function bulkUpdateTaskStatus(
  taskIds: string[],
  status: 'pending' | 'in-progress' | 'completed'
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation: 'updateStatus',
        taskIds,
        updateData: { status },
      }),
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update task status',
    };
  }
}

export async function bulkUpdateTaskPriority(
  taskIds: string[],
  priority: 'low' | 'medium' | 'high'
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation: 'updatePriority',
        taskIds,
        updateData: { priority },
      }),
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update task priority',
    };
  }
}

