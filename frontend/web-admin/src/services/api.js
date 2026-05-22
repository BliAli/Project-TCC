import axios from 'axios';

const AUTH_API = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

// Auth Service
export const authService = {
  login: (data) => axios.post(`${AUTH_API}/api/auth/login`, data),
  register: (data) => axios.post(`${AUTH_API}/api/auth/register`, data),
  getProfile: () => axios.get(`${AUTH_API}/api/auth/profile`, authHeaders()),
  updateProfile: (data) => axios.put(`${AUTH_API}/api/auth/profile`, data, authHeaders()),
};

// Staff
export const staffService = {
  getAll: () => axios.get(`${API}/api/staff`, authHeaders()),
  getById: (id) => axios.get(`${API}/api/staff/${id}`, authHeaders()),
  create: (data) => axios.post(`${API}/api/staff`, data, authHeaders()),
  update: (id, data) => axios.put(`${API}/api/staff/${id}`, data, authHeaders()),
  delete: (id) => axios.delete(`${API}/api/staff/${id}`, authHeaders()),
};

// Packages
export const packageService = {
  getAll: () => axios.get(`${API}/api/packages`),
  create: (data) => axios.post(`${API}/api/packages`, data, authHeaders()),
  update: (id, data) => axios.put(`${API}/api/packages/${id}`, data, authHeaders()),
  delete: (id) => axios.delete(`${API}/api/packages/${id}`, authHeaders()),
};

// Orders
export const orderService = {
  getAll: (params) => axios.get(`${API}/api/orders`, { ...authHeaders(), params }),
  getById: (id) => axios.get(`${API}/api/orders/${id}`, authHeaders()),
  create: (data) => axios.post(`${API}/api/orders`, data, authHeaders()),
  update: (id, data) => axios.put(`${API}/api/orders/${id}`, data, authHeaders()),
  delete: (id) => axios.delete(`${API}/api/orders/${id}`, authHeaders()),
};

// Schedules
export const scheduleService = {
  getAll: (params) => axios.get(`${API}/api/schedules`, { ...authHeaders(), params }),
  create: (data) => axios.post(`${API}/api/schedules`, data, authHeaders()),
};

// Ratings
export const ratingService = {
  getByStaffId: (id) => axios.get(`${API}/api/ratings/staff/${id}`),
};
