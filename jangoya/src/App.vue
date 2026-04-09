<template>
  <div>
    <Header />
    <router-view></router-view>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import { reactive, computed, provide } from 'vue';
import axios from 'axios';

const BASEURI = '/api/budgets';
const states = reactive({
  budgets: [],
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
      type: 'expense',
      name: '교통비',
      color: 'yellow',
      icon: '주소',
    },
  ],
});

const ts = new Date().getDate.toString();

const fetchBudget = async () => {
  try {
    const response = await axios.get(BASEURI);
    if (response.status === 200) {
      states.budgets = response.data;
    } else {
      alert('데이터 조회 실패');
    }
  } catch (error) {
    alert('에러발생 :' + error);
  }
};

//date 받아옴

//거래내역 추가
const addBudget = async (
  { date, type, categoryId, amount, memo },
  successCallback,
) => {
  try {
    const payload = { date, type, categoryId, amount, memo };
    const response = await axios.post(BASEURI, payload);

    if (response.status === 201) {
      states.budgets.push({ ...response.data });
      successCallback();
    } else {
      alert('추가 실패');
    }
  } catch (error) {
    alert('에러발생 :' + error);
  }
};

//거래내역 수정 - 금액 , 메모 , 카테고리
const updateBudget = async (
  { id, date, type, categoryId, amount, memo },
  successCallback,
) => {
  try {
    const payload = { id, date, type, categoryId, amount, memo };
    const res = await axios.put(BASEURI + `/${id}`, payload);
    if (res.status === 200) {
      let index = states.budgets.findIndex((x) => x.id === id);
      states.budgets[index] = payload;
      successCallback();
    } else {
      alert('변경 실패');
    }
  } catch (error) {
    alert('에러발생 :' + error);
  }
};

//거래내역 삭제
const deleteBudget = async () => {
  try {
    const res = await axios.delete(BASEURI + `/${id}`);

    if (res.status === 200) {
      let index = states.budgets.findIndex((x) => x.id === id);
      states.budgets.splice(index, 1);
    } else {
      alert('삭제 실패');
    }
  } catch (e) {
    alert('에러발생 :' + e);
  }
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
provide('actions', { fetchBudget, addBudget, updateBudget, deleteBudget });

fetchBudget();
</script>
