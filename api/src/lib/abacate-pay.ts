import { env } from '@/env'
import AbacatePay from 'abacatepay-nodejs-sdk'

export const abacatePay = AbacatePay(env.ABACATE_API_KEY)
