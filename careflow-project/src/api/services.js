import apiClient from './apiClient.js';

export const getApiError = (error, fallback = 'Something went wrong. Please try again.') => {
  const data = error?.response?.data;
  if (typeof data === 'string') return data;
  return data?.message || data?.error || error?.message || fallback;
};

export const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

export const getId = (item) => item?.id ?? item?._id ?? item?.resumeId ?? item?.companyId ?? item?.placementId;

export const authApi = {
  register: (payload) => apiClient.post('/auth/register', payload),
  login: (payload) => apiClient.post('/auth/login', payload)
};

export const userApi = {
  profile: () => apiClient.get('/user/profile'),
  updateProfile: (payload) => apiClient.put('/user/profile', payload)
};

export const resumeApi = {
  create: (payload) => apiClient.post('/resume', payload),
  list: () => apiClient.get('/resume'),
  get: (id) => apiClient.get(`/resume/${id}`),
  update: (id, payload) => apiClient.put(`/resume/${id}`, payload),
  remove: (id) => apiClient.delete(`/resume/${id}`)
};

export const companyApi = {
  create: (payload) => apiClient.post('/company', payload),
  list: () => apiClient.get('/company'),
  get: (id) => apiClient.get(`/company/${id}`),
  update: (id, payload) => apiClient.put(`/company/${id}`, payload),
  remove: (id) => apiClient.delete(`/company/${id}`),
  byLocation: (location) => apiClient.get(`/company/location/${encodeURIComponent(location)}`),
  byRole: (role) => apiClient.get(`/company/role/${encodeURIComponent(role)}`),
  byEligibleCgpa: (cgpa) => apiClient.get(`/company/eligible/${encodeURIComponent(cgpa)}`)
};

export const placementApi = {
  create: (payload) => apiClient.post('/placement', payload),
  list: () => apiClient.get('/placement'),
  get: (id) => apiClient.get(`/placement/${id}`),
  update: (id, payload) => apiClient.put(`/placement/${id}`, payload),
  remove: (id) => apiClient.delete(`/placement/${id}`),
  byStatus: (status) => apiClient.get(`/placement/status/${encodeURIComponent(status)}`)
};

export const interviewApi = {
  start: (payload) => apiClient.post('/interview/start', payload),
  answer: (interviewId, payload) => apiClient.post(`/interview/${interviewId}/answer`, payload),
  report: (interviewId) => apiClient.get(`/interview/report/${interviewId}`)
};
