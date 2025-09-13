<template>
<h1>login</h1>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useAccountStore } from '../stores/user'
    const store = useAccountStore()
    const username = ref('')
    const password = ref('')
</script>

<style scoped>
</style>
