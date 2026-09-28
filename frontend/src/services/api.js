import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
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

// Response interceptor to handle authorization errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};

export const companyAPI = {
  getAll: async () => {
    const response = await api.get('/companies');
    return response.data;
  },
  create: async (companyData) => {
    const response = await api.post('/companies', companyData);
    return response.data;
  },
};

export const jobAPI = {
  getAll: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },
  create: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },
};

export const eligibilityAPI = {
  check: async (jobId) => {
    const response = await api.get(`/eligibility/${jobId}`);
    return response.data;
  },
};

export const applicationAPI = {
  apply: async (jobId) => {
    const response = await api.post('/applications', { jobId });
    return response.data;
  },
  getMyApplications: async () => {
    const response = await api.get('/applications/my');
    return response.data;
  },
  getJobApplications: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },
  updateStatus: async (applicationId, status) => {
    const response = await api.put(`/applications/${applicationId}/status`, { status });
    return response.data;
  },
};

export default api;
