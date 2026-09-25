import { ref, type Ref } from "vue";

export function useCache(url: string) {
    const hash: Ref<string | null>  = ref(localStorage.getItem(`cache:${url}`))
    const data: Ref<any | null> = ref(JSON.parse(localStorage.getItem(`cache-data:${url}`) || 'null')) 

    function getHash() {
        return hash.value
    }

    function getData() {
        return data.value
    }

    function setData(value: any) {
        data.value = value
        localStorage.setItem(`cache-data:${url}`, JSON.stringify(value))
    }

    function setHash(value: string) {
        hash.value = value
        localStorage.setItem(`cache:${url}`, value)
    }

    return {
        getHash,
        setHash,
        getData,
        setData,
    }
}