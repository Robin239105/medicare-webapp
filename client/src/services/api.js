import axios from 'axios'
import { getApiBaseUrl } from '../config'

const api = axios.create({
  baseURL: getApiBaseUrl()
})

// Add sanctuary token to clinical requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('sanctuary_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getPatientProfile = () => api.get('/user/profile')
export const updatePatientProfile = (data) => api.put('/user/profile', data)

export const getDoctors = () => api.get('/doctors')
export const getDoctor = (id) => api.get(`/doctors/${id}`)
export const getServices = () => api.get('/services')
export const createAppointment = (data) => api.post('/appointments', data)
export const getAppointments = () => api.get('/appointments')
export const getAdminStats = () => api.get('/admin/stats')
export const getPatients = () => api.get('/admin/patients')
export const createPatient = (data) => api.post('/admin/patients', data)
export const updatePatient = (id, data) => api.put(`/admin/patients/${id}`, data)
export const deletePatient = (id) => api.delete(`/admin/patients/${id}`)

export const createDoctor = (data) => api.post('/doctors', data)
export const updateDoctor = (id, data) => api.put(`/doctors/${id}`, data)
export const deleteDoctor = (id) => api.delete(`/doctors/${id}`)

export const createService = (data) => api.post('/services', data)
export const updateService = (id, data) => api.put(`/services/${id}`, data)
export const deleteService = (id) => api.delete(`/services/${id}`)

export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data)
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`)

export const getSettings = () => api.get('/admin/settings')
export const saveSettings = (data) => api.post('/admin/settings', data)

export const updateAdminProfile = (data) => api.put('/admin/profile', data)
export const getNotifications = () => api.get('/admin/notifications')
export const markNotificationRead = (id) => api.put(`/admin/notifications/${id}/read`)

export default api
