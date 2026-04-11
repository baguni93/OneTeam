<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <div class="col-md-4 mb-2">
        <div class="card shadow-sm border-0 text-center p-3">
          <div class="text-success fw-bold">수입</div>
          <h4 class="mt-2">{{ sumAmount('income') }}원</h4>
        </div>
      </div>

      <div class="col-md-4 mb-2">
        <div class="card shadow-sm border-0 text-center p-3">
          <div class="text-danger fw-bold">지출</div>
          <h4 class="mt-2">{{ sumAmount('expense') }}원</h4>
        </div>
      </div>
      <div class="col-md-4 mb-2">
        <div class="card shadow-sm border-0 text-center p-3">
          <div class="text-primary fw-bold">잔액</div>
          <h4 class="mt-2">
            {{ currentAmount(sumAmount('income'), sumAmount('expense')) }}원
          </h4>
        </div>
      </div>
    </div>

    <div class="card shadow-sm mb-4 border-0">
      <div class="card-body">
        <Calendar />
      </div>
    </div>

    <div class="d-flex justify-content-end gap-2 mb-3 flex-wrap">
      <router-link class="btn btn-outline-primary" to="search">
        검색
      </router-link>

      <router-link class="btn btn-outline-secondary" to="category/filter">
        필터
      </router-link>

      <router-link class="btn btn-primary" to="transction/add">
        + 추가
      </router-link>
    </div>
    <div class="card shadow-sm border-0">
      <div class="card-body">
        <TransctionList />
      </div>
    </div>
  </div>
</template>
<script setup>
import TransctionList from '@/components/TransctionList.vue';
import Calendar from '@/components/Calendar.vue';
import { useBudgetStore } from '@/stores/dateStore';

const budgetsStore = useBudgetStore();
const budgets = budgetsStore.budgets;

const sumAmount = (type) => {
  const incomeBudgets = budgets.filter((x) => x.type === type);
  let sum = 0;

  incomeBudgets.forEach((x) => {
    sum += x.amount;
  });

  return sum;
};

const currentAmount = (income, expense) => {
  return income - expense;
};
</script>
