import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');

// Subjects
export const getSubjects = () => api.get('/subjects');
export const createSubject = (data) => api.post('/subjects', data);
export const getSubject = (id) => api.get(`/subjects/${id}`);
export const updateSubject = (id, data) => api.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => api.delete(`/subjects/${id}`);

// Study Plan
export const generatePlan = (subjectId) => api.post(`/studyplan/generate/${subjectId}`);
export const getPlan = (subjectId) => api.get(`/studyplan/${subjectId}`);
export const togglePlanItem = (planId, itemId) => api.patch(`/studyplan/${planId}/item/${itemId}`);

export default api;
