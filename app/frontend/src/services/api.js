// HealthGuard AI - API Service
// Axios calls to FastAPI backend

import axios from 'axios'

// Backend URL - uses environment variable in production, localhost in dev
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const predictDiseases = async (healthData) => {
  const response = await api.post('/api/predict', healthData)
  return response.data
}

export const healthCheck = async () => {
  const response = await api.get('/api/health')
  return response.data
}

export const getDiseases = async () => {
  const response = await api.get('/api/diseases')
  return response.data
}

export default api