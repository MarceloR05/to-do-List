import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    if (!response.data.data) throw new Error('Error al iniciar sesión');
    return response.data.data;
  },

  register: async (userData: { username: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    if (!response.data.data) throw new Error('Error al registrar usuario');
    return response.data.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    if (!response.data.data) throw new Error('Error al obtener perfil');
    return response.data.data;
  }
};

export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>('/tasks');
    return response.data.data || [];
  },

  create: async (task: { title: string; description?: string }): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>('/tasks', task);
    if (!response.data.data) throw new Error('Error al crear la tarea');
    return response.data.data;
  },

  update: async (id: string, updates: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>): Promise<Task> => {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, updates);
    if (!response.data.data) throw new Error('Error al actualizar la tarea');
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
