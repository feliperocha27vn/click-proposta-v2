import axios, { type AxiosRequestConfig } from 'axios'
import { env } from '../../env'
import { supabase } from './supabase'

const api = axios.create({
  baseURL: env.VITE_API_URL,
})

api.interceptors.request.use(
  async config => {
    const { data } = await supabase.auth.getSession()
    const token = data?.session?.access_token ?? null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Mutator function para o Orval - deve retornar uma promise
const apiMutator = <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
  return api.request<T>(config).then(response => response.data)
}

// Exportação padrão para o Orval (mutator)
export default apiMutator

// Exportação nomeada para uso direto no código e para o Orval
export { api, apiMutator }
