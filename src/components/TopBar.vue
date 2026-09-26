<template>
    <mdui-top-app-bar>
        <slot name="left"></slot>
        <mdui-button-icon @click="handleBack" v-if="props.showBack">
            <mdui-icon-arrow-back></mdui-icon-arrow-back>
        </mdui-button-icon>

        <mdui-button-icon @click="handleHome" v-if="props.showHome">
            <mdui-icon-home></mdui-icon-home>
        </mdui-button-icon>

        <mdui-top-app-bar-title>{{ props.title }}</mdui-top-app-bar-title>

        <div style="flex-grow: 1"></div>

        <slot name="right"></slot>

    </mdui-top-app-bar>
</template>

<script setup lang="ts">
    import 'mdui/components/top-app-bar.js'
    import 'mdui/components/top-app-bar-title.js'
    import 'mdui/components/button-icon.js'

    import '@mdui/icons/arrow-back.js'
    import '@mdui/icons/home.js';

    import { useRouter } from 'vue-router'

    const props = defineProps({
        "title": {
            type: String,
            default: "Title"
        },
        "showBack": {
            type: Boolean,
            default: true
        },
        "showHome": {
            type: Boolean,
            default: true
        }
    })

    const router = useRouter()

    const handleBack = () => {
        router.back()
    }

    const handleHome = () => {
        router.push("/")
    }


</script>