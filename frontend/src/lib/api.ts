const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ path: string; message: string }>;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });

  const data = (await response.json().catch(() => ({}))) as ApiResponse<T>;

  if (!response.ok) {
    const message = data.message ?? 'Request failed';
    throw new Error(message);
  }

  return data;
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
};

export const api = {
  register: (payload: { name: string; email: string; password: string }) =>
    request<{ user: User }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  login: (payload: { email: string; password: string }) =>
    request<{ user: User }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  logout: () => request('/api/v1/auth/logout', { method: 'POST' }),
  me: () => request<{ user: User }>('/api/v1/auth/me'),
  listTasks: () => request<{ tasks: Task[] }>('/api/v1/tasks'),
  createTask: (payload: { title: string; description?: string; status?: Task['status'] }) =>
    request<{ task: Task }>('/api/v1/tasks', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updateTask: (id: string, payload: Partial<{ title: string; description: string | null; status: Task['status'] }>) =>
    request<{ task: Task }>(`/api/v1/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),
  deleteTask: (id: string) =>
    request(`/api/v1/tasks/${id}`, { method: 'DELETE' }),
  adminUsers: () =>
    request<{ users: User[] }>('/api/v1/admin/users')
};
