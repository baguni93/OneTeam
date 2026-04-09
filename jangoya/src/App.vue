<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const userStore = useUserStore()
const router = useRouter()

onMounted(() => {
  userStore.initUser()

  if (!userStore.isLoggedIn) {
    router.push('/user/login')
  }
})
</script>