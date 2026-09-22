import axios from 'axios'
import { preconnect } from 'react-dom'

import { API_BASE_URL } from '@/lib/config'

// Open the connection early when the API lives on another origin.
if (API_BASE_URL.startsWith('http')) preconnect(new URL(API_BASE_URL).origin)

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})
