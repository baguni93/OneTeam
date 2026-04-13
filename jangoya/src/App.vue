<template>
  <div>
    <Header />
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';

import { useBudgetStore } from './stores/dateStore';
import { useCategoryStore } from './stores/categoryStore';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import Header from './components/Header.vue';

const categoryStore = useCategoryStore();
const userStore = useUserStore();
const budgetStore = useBudgetStore();
const router = useRouter();
const { fetchBudget } = budgetStore;
const { fetchCategoryList } = categoryStore;

onMounted(() => {
  userStore.initUser();

  if (!userStore.isLoggedIn) {
    router.push('/user/login');
  } else {
    fetchBudget();
    fetchCategoryList();
  }
});

//date 받아옴
</script>
