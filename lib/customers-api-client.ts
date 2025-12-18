import { Customer } from '@/types/project';

const API_BASE_URL = '/api/customers';

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

export interface GetCustomersParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateCustomerInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export async function getCustomers(params?: GetCustomersParams): Promise<ApiResponse<Customer[]>> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
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
      error: error.message || 'Failed to fetch customers',
    };
  }
}

export async function getCustomer(id: string): Promise<ApiResponse<Customer>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch customer',
    };
  }
}

export async function createCustomer(customer: CreateCustomerInput): Promise<ApiResponse<Customer>> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create customer',
    };
  }
}

export async function updateCustomer(id: string, customer: UpdateCustomerInput): Promise<ApiResponse<Customer>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update customer',
    };
  }
}

export async function deleteCustomer(id: string): Promise<ApiResponse<Customer>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete customer',
    };
  }
}

