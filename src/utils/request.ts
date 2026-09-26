import axios from 'axios'
import { type AxiosInstance, type AxiosResponse } from 'axios'
import { useRouter } from 'vue-router'

import { useUser } from '../composables/user'
import { useCache } from '../composables/cache'


interface ApiResponse<T> {
    status: number
    data: T
}

class NotModifiedError extends Error {
    response: AxiosResponse

    constructor(message: string, response: AxiosResponse) {
        super(message)

        this.response = response
    }
} // 304 未修改

class Request {
    private request: AxiosInstance

    constructor() {
        this.request = axios.create({
            baseURL: "/api/",
            timeout: 5000,
        })

        this.request.interceptors.request.use(
            (config) => {

                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )

        this.request.interceptors.response.use(
            (response) => {
                return response
            },
            (error) => {
                // 处理响应错误
                if (error.response?.status == 401) {
                    // 处理401错误，跳转到登录页
                    const router = useRouter()

                    router.push('/login')
                }

                if (error.response?.status == 304) {
                    throw new NotModifiedError("未修改", error.response)
                }
                
                return Promise.reject(error)
            }
        )
    }

    private generateHeaders(url: string, requiresAuth: boolean, cached: boolean): Record<string, string> {
        const headers: Record<string, string> = {}

        if (requiresAuth) {
            const token = useUser().getToken()

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            } else {
                const router = useRouter()

                router.push('/login')
            }
        }

        if (cached) {
            headers['X-Cache'] = 'true'
            headers['X-Cache-Hash'] = useCache(url).getHash() || ''

        }

        return headers
    }

    private updateCache(url: string, response: AxiosResponse) {
        const cache = useCache(url)


        // 尝试读取缓存

        if (response.status === 304) {
            // 缓存命中，返回缓存数据
            return useCache(url).getData() || null
        } else {

            // 缓存未命中，更新缓存
            const hash = response.headers['x-cache-hash'] || ''
            const data = response.data

            if (hash) {
    
                cache.setHash(hash)
                cache.setData(data)


            } else {
                console.warn(`访问可缓存的接口“${url}”但是没有返回缓存hash`)
            }
        }

        return response.data
        
    }


    async get<T>(url: string, requiresAuth: boolean = true, cached: boolean = false): Promise<ApiResponse<T>> {
        const headers = this.generateHeaders(url, requiresAuth, cached)

        try {
            const response = await this.request.get<ApiResponse<T>>(url, { headers })

            return response.data

        } catch (error) {
            if (cached) {
                if (error instanceof NotModifiedError) {
                    return this.updateCache(url, error.response)
                }
            }

            throw error
        }
        
    }

    async post<T>(url: string, data: any, requiresAuth: boolean = true, cached: boolean = false): Promise<ApiResponse<T>> {
        const headers = this.generateHeaders(url, requiresAuth, cached)
        
        try {
            const response = await this.request.post<ApiResponse<T>>(url, data, { headers })

            return response.data

        } catch(error)  {
            if (cached) {
                if (error instanceof NotModifiedError) {
                    return this.updateCache(url, error.response)
                }
            }

            throw error
        }
    }
}

export const request = new Request()






