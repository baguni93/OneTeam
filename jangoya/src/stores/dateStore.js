import { defineStore } from 'pinia';
import { ref, reactive, toRefs } from 'vue';
import axios from 'axios';
import { useUserStore } from './userStore';

export const useDateStore = defineStore('date', () => {
  const selectedDate = ref(null);

  const setDate = (x) => {
    selectedDate.value = x;
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();
  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDate).padStart(2, '0')}`;

  if (selectedDate.value === null) {
    selectedDate.value = dateStr;
  }

  return {
    dateStr,
    selectedDate,
    setDate,
  };
});

export const useBudgetStore = defineStore('budgets', () => {
  const userStore = useUserStore();
  const dateStore = useDateStore();

  const BASEURI = '/api/budgets';
  const state = reactive({
    budgets: [],
    categories: [
      {
        id: '1',
        userId: '1',
        type: 'income',
        name: '월급',
        color: 'red',
        icon: 'bi-cash',
      },
      {
        id: '2',
        userId: '1',
        type: 'income',
        name: '용돈',
        color: 'blue',
        icon: 'bi-wallet2',
      },
      {
        id: '3',
        userId: '1',
        type: 'income',
        name: '기타',
        color: 'green',
        icon: 'bi-star',
      },
      {
        id: '4',
        userId: '1',
        type: 'expense',
        name: '식비',
        color: 'orange',
        icon: 'bi-cup-hot',
      },
      {
        id: '5',
        userId: '1',
        type: 'expense',
        name: '교통비',
        color: 'yellow',
        icon: 'bi-car-front',
      },
    ],
  });

  const fetchBudget = async () => {
    try {
      const currentUser = userStore.getCurrentUser();
      let params = { userId: currentUser.userId };
      const response = await axios.get(BASEURI, { params });
      if (response.status === 200) {
        state.budgets = response.data;
        console.log(state.budgets);
      } else {
        alert('데이터 조회 실패');
      }
    } catch (error) {
      alert('에러발생 :' + error);
    }
  };

  //거래내역 추가
  const addBudget = async (
    { type, categoryId, amount, memo },
    successCallback,
  ) => {
    try {
      const currentUser = userStore.getCurrentUser();
      const payload = {
        date: dateStore.selectedDate,
        type,
        categoryId,
        amount,
        memo,
        userId: currentUser.userId,
      };
      const response = await axios.post(BASEURI, payload);
      if (response.status === 201) {
        state.budgets.push({ ...response.data });
        successCallback();
      } else {
        alert('추가 실패');
      }
    } catch (error) {
      alert('에러발생 :' + error);
    }
  };

  //거래내역 수정
  const updateBudget = async (
    { id, date, type, categoryId, amount, memo },
    successCallback,
  ) => {
    try {
      const payload = { id, date, type, categoryId, amount, memo };
      const res = await axios.put(BASEURI + `/${id}`, payload);
      if (res.status === 200) {
        let index = state.budgets.findIndex((x) => x.id === id);
        state.budgets[index] = payload;
        successCallback();
      } else {
        alert('변경 실패');
      }
    } catch (error) {
      alert('에러발생 :' + error);
    }
  };

  //거래내역 삭제
  const deleteBudget = async (id, successCallback) => {
    try {
      const res = await axios.delete(BASEURI + `/${id}`);

      if (res.status === 200) {
        let index = state.budgets.findIndex((x) => x.id === id);
        state.budgets.splice(index, 1);
        successCallback();
      } else {
        alert('삭제 실패');
      }
    } catch (e) {
      alert('에러발생 :' + e);
    }
  };

  const categoryFilterBudgets = (categoryId) => {
    return state.budgets.filter((x) => x.categoryId === String(2));
  };

  return {
    ...toRefs(state),
    fetchBudget,
    addBudget,
    updateBudget,
    deleteBudget,
    categoryFilterBudgets,
  };
});
