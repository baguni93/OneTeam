<template>
  <div>Main</div>
  <br />

  <p>----------</p>

  <div>수입 : 원</div>
  <br />
  <div>지출 : 원</div>
  <br />
  <div>현금 잔액 : 원</div>
  <br />
  <p>----------</p>
  <div></div>
  <div>달력</div>
  <br />

  <p>----------</p>
  <router-link class="btn btn-primary" to="transction/add">
    빠른 거래내역 추가
  </router-link>
  <TransctionList />

  <p>----------</p>
</template>

<script setup>
import TransctionList from '@/components/TransctionList.vue';
</script>
