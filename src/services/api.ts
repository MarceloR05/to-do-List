import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
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
