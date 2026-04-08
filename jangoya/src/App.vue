<template>
  <div>
    <Header />
    <router-view></router-view>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import { reactive, computed, provide } from 'vue';

const ts = new Date().getDate.toString();

const states = reactive({
  budgets: [
    {
      id: 1,
      userId: '1',
      date: ts,
      type: 'expense',
      categoryId: '4',
      amount: '10000',
      memo: '마라탕 맛있네ㅎㅎ',
    },
    {
      id: 2,
      userId: '1',
      date: ts,
      type: 'income',
      categoryId: '4',
      amount: '10000',
      memo: '용돈 사랑해',
    },
  ],

  categories: [
    {
      id: '1',
      userId: '1',
      type: 'income',
      name: '월급',
      color: 'red',
      icon: '주소',
    },
    {
      id: '2',
      userId: '1',
      type: 'income',
      name: '용돈',
      color: 'blue',
      icon: '주소',
    },
    {
      id: '3',
      userId: '1',
      type: 'income',
      name: '기타',
      color: 'green',
      icon: '주소',
    },
    {
      id: '4',
      userId: '1',
      type: 'income',
      name: '식비',
      color: 'orange',
      icon: '주소',
    },
    {
      id: '5',
      userId: '1',
      type: 'expens',
      name: '교통비',
      color: 'yellow',
      icon: '주소',
    },
  ],
});

//date 받아옴

//거래내역 추가
const addBudget = ({ date, categoryId, amount, memo }) => {
  states.budgets.push({
    id: new Date().getTime(),
    date,
    categoryId,
    amount,
    memo,
  });
};

//거래내역 수정 - 금액 , 메모 , 카테고리
const updateBudget = (id, categoryId, amount, memo) => {
  let index = states.budgets.findIndex((x) => x.id == id);
  states.budgets[index] = { ...state.budgets[index], categoryId, amount, memo };
};

//거래내역 삭제
const deleteBudget = () => {
  let index = states.budgets.findIndex((x) => x.id == id);
  states.budgets.splice(index, 1);
};

// provide('state', states)
provide(
  'budgets',
  computed(() => states.budgets),
);
provide(
  'categories',
  computed(() => states.categories),
);
provide('actions', { addBudget, updateBudget, deleteBudget });
</script>
