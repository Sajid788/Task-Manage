import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'https://task-manage-two-eosin.vercel.app/api'
});

// Add request interceptor to attach token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me')
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  updateUserStatus: (userId, status) => api.patch(`/admin/users/${userId}/status`, { status }),
  getDashboardStats: () => api.get('/admin/stats')
};

// Tasks API
export const tasksAPI = {
  getTasks: (page = 1, limit = 5) => api.get(`/tasks?page=${page}&limit=${limit}`),
  getTaskById: (taskId) => api.get(`/tasks/${taskId}`),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (taskId, taskData) => api.patch(`/tasks/${taskId}`, taskData),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
  bulkUpdateTasks: (taskIds, status) => api.patch('/tasks/bulk-update', { taskIds, status })
};

export default api; 