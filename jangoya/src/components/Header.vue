<template>
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
    <span class="navbar-brand ps-2">Jangoya App</span>
    <button class="navbar-toggler" type="button" @click="changedIsNavShow">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div :class="navClass">
      <ul class="navbar-nav me-auto">
        <!-- 로그인 했을 때만 보이는 메뉴들 -->
        <template v-if="userStore.isLoggedIn">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'main' }">요약 카드 , 달력 , 거래내역</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'mypage' }">마이페이지</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'budget' }">예산설정</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'search' }">검색</router-link>
          </li>
        </template>
      </ul>

      <ul class="navbar-nav ms-auto pe-2">
        <!-- 로그인 후에만 OO님 + 로그아웃 버튼 표시 -->
        <template v-if="userStore.isLoggedIn">
          <li class="nav-item">
            <span class="nav-link text-white">{{ userStore.user?.name }}님</span>
          </li>
          <li class="nav-item">
            <button class="btn btn-outline-light btn-sm my-1" @click="handleLogout">로그아웃</button>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const state = reactive({ isNavShow: false });
const navClass = computed(() =>
  state.isNavShow ? 'collapse navbar-collapse show' : 'collapse navbar-collapse',
);
const changedIsNavShow = () => {
  state.isNavShow = !state.isNavShow;
};

const handleLogout = () => {
  userStore.logout();
  router.push({ name: 'user/login' });
};
</script>