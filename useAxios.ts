import axios, { AxiosError, Method } from 'axios'
import { useState, useEffect, useContext, useMemo } from 'react'

interface Options<T> {
  path: string
  method: Method
  payload?: T
  id?: string
  params?: Record<string, string>
}

export default <T, A>(options: Options<T>) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AxiosError>()
  const [data, setData] = useState<A | null>(null)


  const request = async ({ path, method, id, payload, params }: Options<T>) => {
    try {
      const response = await axios.request<A>({
        method,
        params,
        data: payload,
        url: id ? `${path}/${id}` : path
      })
      setData(response.data)
    } catch (err) {
      setError(err as AxiosError)
    } finally {
      setLoading(false)
    }
  }
  const sendRequest = () => {
    request(options)
  }
  useEffect(() => {
    if (options.method === 'GET' || options.method === 'get') sendRequest()
  }, [])

  return { data, loading, error, request }
}
