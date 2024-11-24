import axios, { AxiosRequestConfig } from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 3000,
})

interface PendingTask {
  config: AxiosRequestConfig
  resolve: Function
}
let refreshing = false
const queue: PendingTask[] = []

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    let { data, config } = error.response

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        })
      })
    }

    if (data.statusCode === 401 && !config.url.includes('/refresh')) {
      refreshing = true

      const res = await refreshToken()

      refreshing = false

      if (res.status === 200) {
        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config))
        })

        return axiosInstance(config)
      } else {
        alert(data || '登录过期，请重新登录')
      }
    } else {
      return error.response
    }
  }
)

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem('access_token')

  if (accessToken) {
    config.headers.authorization = 'Bearer ' + accessToken
  }
  return config
})

export async function userLogin(username: string, password: string) {
  return await axiosInstance.post('/login', {
    username,
    password,
  })
}

async function refreshToken() {
  const res = await axiosInstance.get('/refresh', {
    params: {
      token: localStorage.getItem('refresh_token'),
    },
  })
  localStorage.setItem('access_token', res.data.accessToken)
  localStorage.setItem('refresh_token', res.data.refreshToken)
  return res
}

export async function aaa() {
  return await axiosInstance.get('/aaa')
}
