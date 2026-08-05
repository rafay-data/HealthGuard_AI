// HealthGuard AI - API Service
// Axios calls to FastAPI backend

import axios from 'axios'

// Backend URL
const API_URL = 'http://127.0.0.1:8000'

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Predict all diseases
export const predictDiseases = async (healthData) => {
  const response = await api.post('/api/predict', healthData)
  return response.data
}

// Health check
export const healthCheck = async () => {
  const response = await api.get('/api/health')
  return response.data
}

// Get diseases list
export const getDiseases = async () => {
  const response = await api.get('/api/diseases')
  return response.data
}

export default api