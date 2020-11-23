import { Unary } from './types'

export const isFunction = <T = any, K = T>(x: any): x is Unary<T, K> => typeof x == 'function'
