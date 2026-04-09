<template>
  <div class="row">
    <div class="col p-3">
      <div>오늘 날짜 : {{ ts }}</div>
      <div v-if="budgets.length > 0">
        거래 내역 수입 : {{ sumAmount('income') }}원 지출 :
        {{ sumAmount('expense') }}원
      </div>

      <div v-if="budgets.length <= 0">지출 내역이 없어요.</div>
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

const ts = new Date().toDateString();
const budgets = inject('budgets');

const sumAmount = (type) => {
  const incomeBudgets = budgets.value.filter((x) => x.type === type);
  let sum = 0;

  incomeBudgets.forEach((x) => {
    sum += x.amount;
  });

  return sum;
};
</script>
