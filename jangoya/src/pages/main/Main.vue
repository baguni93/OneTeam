<template>
  <div>Main</div>
  <br />

  <p>----------</p>

  <div>수입 : {{ sumAmount('income') }}원</div>
  <br />
  <div>지출 : {{ sumAmount('expense') }}원</div>
  <br />
  <div>
    현금 잔액 : {{ currentAmount(sumAmount('income'), sumAmount('expense')) }}원
  </div>
  <br />
  <p>----------</p>
  <div></div>
  <div><FullCalendar :options="calendarOptions" /></div>
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
import { inject } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';

const calendarOptions = {
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
};

const budgets = inject('budgets');

const sumAmount = (type) => {
  const incomeBudgets = budgets.value.filter((x) => x.type === type);
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
