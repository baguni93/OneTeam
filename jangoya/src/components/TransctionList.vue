<template>
  <div class="row">
    <div class="col p-3">
      <div>오늘 날짜</div>
      <div>거래 내역</div>
      <div>지출 내역이 없어요.</div>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <ul class="list-group" style="background-color: aqua">
        <TrasctionItem
          v-for="budgetItem in budgets"
          :key="budgetItem.id"
          :budgetItem="budgetItem"
        ></TrasctionItem>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import TrasctionItem from './TrasctionItem.vue';

const budgets = inject('budgets');
</script>
