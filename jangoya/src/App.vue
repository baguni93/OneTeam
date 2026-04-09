<template>
  <div>
    <Header />
    <router-view></router-view>
    <Search />
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import Header from './components/Header.vue';
import Search from './pages/user/Search.vue';

const userStore = useUserStore()
const router = useRouter()

onMounted(() => {
  userStore.initUser()

  if (!userStore.isLoggedIn) {
    router.push('/user/login')
  }
})
</script>