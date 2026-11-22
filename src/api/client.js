import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.BASE_URL,
  timeout: 10_000,
})
