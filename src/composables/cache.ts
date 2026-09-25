import { ref, type Ref } from "vue";

export function useCache(url: string) {
    const hash: Ref<string | null>  = ref(localStorage.getItem(`cache:${url}`))

    function get() {
        return hash.value
    }

    function set(value: string) {
        hash.value = value
        localStorage.setItem(`cache:${url}`, value)
    }

    return {
        get,
        set,
    }
}