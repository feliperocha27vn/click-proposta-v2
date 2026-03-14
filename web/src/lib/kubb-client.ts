import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { env } from '../../env'
import { supabase } from './supabase'

/**
 * Subset of AxiosRequestConfig
 */
export type RequestConfig<TData = unknown> = {
  baseURL?: string
  url?: string
  method?: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD'
  params?: unknown
  data?: TData | FormData
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
  signal?: AbortSignal
  validateStatus?: (status: number) => boolean
  headers?: AxiosRequestConfig['headers']
  paramsSerializer?: AxiosRequestConfig['paramsSerializer']
}

/**
 * Subset of AxiosResponse
 */
export type ResponseConfig<TData = unknown> = {
  data: TData
  status: number
  statusText: string
  headers: AxiosResponse['headers']
}

export type ResponseErrorConfig<TError = unknown> = AxiosError<TError>

export type Client = <TResponseData, _TError = unknown, TRequestData = unknown>(
  config: RequestConfig<TRequestData>
) => Promise<ResponseConfig<TResponseData>>

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  async config => {
    try {
      const { data } = await supabase.auth.getSession()
      const token = data?.session?.access_token ?? null

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Erro ao obter sessão do Supabase:', error)
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export const client: Client = async <
  TResponseData,
  _TError = unknown,
  TRequestData = unknown,
>(
  config: RequestConfig<TRequestData>
) => {
  const response = await axiosInstance.request<
    TResponseData,
    AxiosResponse<TResponseData>,
    TRequestData
  >(config as AxiosRequestConfig)
  
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  }
}

export default client
