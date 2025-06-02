import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  },
  register: async (userData) => {
    return await apiClient.post('/auth/register', userData);
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
};

// User services
export const userService = {
  getAll: async () => {
    return await apiClient.get('/users');
  },
  getById: async (id) => {
    return await apiClient.get(`/users/${id}`);
  },
  create: async (userData) => {
    return await apiClient.post('/users', userData);
  },
  update: async (id, userData) => {
    return await apiClient.put(`/users/${id}`, userData);
  },
  delete: async (id) => {
    return await apiClient.delete(`/users/${id}`);
  }
};

// Role services
export const roleService = {
  getAll: async () => {
    return await apiClient.get('/roles');
  },
  getById: async (id) => {
    return await apiClient.get(`/roles/${id}`);
  }
};

// Rule services
export const ruleService = {
  getAll: async () => {
    return await apiClient.get('/rules');
  },
  getById: async (id) => {
    return await apiClient.get(`/rules/${id}`);
  },
  getByRoleId: async (roleId) => {
    return await apiClient.get(`/rules/role/${roleId}`);
  },
  create: async (ruleData) => {
    return await apiClient.post('/rules', ruleData);
  },
  update: async (id, ruleData) => {
    return await apiClient.put(`/rules/${id}`, ruleData);
  },
  delete: async (id) => {
    return await apiClient.delete(`/rules/${id}`);
  }
};
