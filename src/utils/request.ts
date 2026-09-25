import axios from 'axios'
import { type AxiosInstance } from 'axios'
import { useRouter } from 'vue-router'

import { useUser } from '../composables/user'
import { useCache } from '../composables/cache'


class Request {
    private request: AxiosInstance

    constructor() {
        this.request = axios.create({
            baseURL: "/api/",
            timeout: 5000,
        })

        // this.request.interceptors.request.use(
        //     (config) => {
        //         const token = getToken()
        //         if (token) {
        //             config.headers['Authorization'] = `Bearer ${token}`
        //         }
        //         return config
        //     },
        //     (error) => {
        //         return Promise.reject(error)
        //     }
        // )
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
            headers['X-Cache-Hash'] = useCache(url).get() || ''

        }

        return headers
    }


    get<T>(url: string, requiresAuth: boolean = true, cached: boolean = false): Promise<T> {
        const headers = this.generateHeaders(url, requiresAuth, cached)

        return this.request.get<T>(url, { headers }).then((response) => {
            if (cached) {
                const hash = response.headers['x-cache-hash'] || ''
                if (hash) {
                    useCache(url).set(hash)
                } else {
                    console.warn(`访问可缓存的接口“${url}”但是没有返回缓存hash`)
                }
            }
            return response.data
        })
    }

    post<T>(url: string, data: any, requiresAuth: boolean = true, cached: boolean = false): Promise<T> {
        const headers = this.generateHeaders(url, requiresAuth, cached)

        return this.request.post<T>(url, data, { headers }).then((response) => {
            if (cached) {
                useCache(url).set(response.headers['x-cache-hash'] || '')
            }
            return response.data
        })
    }


}





