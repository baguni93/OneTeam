<template>
  <div>
    <h2>콘솔을 확인합니다.</h2>
  </div>

  <div>
    <Header />
    <router-view></router-view>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
</script>
