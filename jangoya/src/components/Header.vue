<template>
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
    <span class="navbar-brand ps-2">Jangoya App</span>
    <button class="navbar-toggler" type="button" @click="changedIsNavShow">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div :class="navClass">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'transction' }"
            >요약 카드 , 달력 , 거래내역</router-link
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { reactive, computed } from 'vue';
const state = reactive({ isNavShow: false });
const navClass = computed(() =>
  state.isNavShow
    ? 'collpase navbar-collapse show'
    : 'collapse navbar-collapse',
);
const changedIsNavShow = () => {
  state.isNavShow = !state.isNavShow;
};
</script>
