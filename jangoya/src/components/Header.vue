<template>
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
    <div class="container">
      <span class="navbar-brand">Jangoya App</span>

      <button class="navbar-toggler" type="button" @click="changedIsNavShow">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div :class="navClass">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'main' }">
              메인
            </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'mypage' }">
              마이페이지
            </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'budget' }">
              예산설정
            </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'search' }">
              검색
            </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'mypage/category' }">
              카테고리
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { reactive, computed } from 'vue';

const state = reactive({ isNavShow: false });

const navClass = computed(() =>
  state.isNavShow
    ? 'collapse navbar-collapse show'
    : 'collapse navbar-collapse',
);

const changedIsNavShow = () => {
  state.isNavShow = !state.isNavShow;
};
</script>
