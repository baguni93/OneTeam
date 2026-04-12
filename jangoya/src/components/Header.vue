<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-dark shadow-sm">
    <!-- 브랜드 -->
    <span class="navbar-brand ps-2 fw-bold"> Jangoya App </span>

    <!-- 햄버거 -->
    <button class="navbar-toggler" type="button" @click="toggleNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- 메뉴 -->
    <div :class="navClass">
      <!-- 좌측 메뉴 -->
      <ul class="navbar-nav me-auto">
        <template v-if="userStore.isLoggedIn">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'main' }">
              메인
            </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'budget' }">
              예산설정
            </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'mypage' }">
              마이페이지
            </router-link>
          </li>
        </template>
      </ul>

      <!-- 우측 -->
      <ul class="navbar-nav ms-auto pe-2">
        <template v-if="userStore.isLoggedIn">
          <li class="nav-item d-flex align-items-center">
            <span class="nav-link text-white fw-semibold">
              {{ userStore.user?.name }}님
            </span>
          </li>

          <li class="nav-item">
            <button
              class="btn btn-outline-light btn-sm ms-2"
              @click="handleLogout"
            >
              로그아웃
            </button>
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
  state.isNavShow
    ? 'collapse navbar-collapse show'
    : 'collapse navbar-collapse',
);

const changedIsNavShow = () => {
  state.isNavShow = !state.isNavShow;
};

const handleLogout = () => {
  userStore.logout();
  router.push({ name: 'user/login' });
};
</script>
<style scoped>
.navbar {
  padding: 10px 0;
}

.nav-link {
  transition: 0.2s;
}

.nav-link:hover {
  opacity: 0.8;
}

.navbar-brand {
  font-size: 18px;
}
</style>
