<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card text-center p-3">
          <div>수입</div>
          <h5>{{ sumAmount('income') }}원</h5>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card text-center p-3">
          <div>지출</div>
          <h5>{{ sumAmount('expense') }}원</h5>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card text-center p-3">
          <div>잔액</div>
          <h5>
            {{ currentAmount(sumAmount('income'), sumAmount('expense')) }}원
          </h5>
        </div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-body">
        <Calendar />
      </div>
    </div>

    <div class="d-flex justify-content-end mb-3">
      <router-link class="btn btn-primary" to="transction/add">
        + 추가
      </router-link>
    </div>

    <div class="card">
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
