import axios from 'axios'
import { env } from '../env'

export const api = axios.create({
  baseURL: 'http://localhost:3333', // URL da sua API principal
  headers: {
    Authorization: `Bearer ${env.BOT_SERVICE_TOKEN}`,
  },
})
