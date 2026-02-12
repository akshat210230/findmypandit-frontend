import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Automatically add token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Auth
export const register = (data: any) => api.post('/auth/register', data)
export const login = (data: any) => api.post('/auth/login', data)

// Services
export const getServices = () => api.get('/services')

// Pandits
export const searchPandits = (params?: any) => api.get('/pandits/search', { params })
export const getPandit = (id: string) => api.get(`/pandits/${id}`)
export const createPanditProfile = (data: any) => api.post('/pandits/profile', data)

// Bookings
export const createBooking = (data: any) => api.post('/bookings', data)
export const getMyBookings = () => api.get('/bookings/my')
export const updateBookingStatus = (id: string, data: any) => api.patch(`/bookings/${id}/status`, data)

// Reviews
export const createReview = (data: any) => api.post('/reviews', data)
export const getPanditReviews = (panditId: string) => api.get(`/reviews/pandit/${panditId}`)

export default api