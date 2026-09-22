import axios from 'axios'

import { API_BASE_URL } from '@/lib/config'

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})
