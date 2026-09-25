import { ref } from 'vue'

interface User {
    id: number
    token: string
    username: string
    isAdmin: boolean
    createdAt: Date
    lastLoginAt: Date

}

export function useUser() {
    const user = ref<User | null>(null)

    user.value = JSON.parse(localStorage.getItem('user') || 'null')
    
    function getToken(): string | null {
        return user.value?.token || null
    }

    return {
        getToken,
    }

}