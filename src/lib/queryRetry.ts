import axios from 'axios'

const MAX_RETRIES = 2

/** Retenta só falhas transitórias (rede, timeout, 5xx); erros 4xx não melhoram ao repetir. */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES) return false
  if (axios.isAxiosError(error) && error.response && error.response.status < 500) return false
  return true
}
