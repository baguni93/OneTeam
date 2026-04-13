<template>
  <div class="p-3">
    <h2>수입/지출 내역</h2>
    <hr />

    <div style="margin-top: 20px">
      <button @click="goToFilterPage">필터 설정 페이지로 이동하기</button>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <div class="header" v-if="categoryFilterBudgets.length <= 0">
            지출 내역이 없어요.
          </div>
          <ul class="list-group" style="background-color: aqua">
            <TrasctionItem
              v-for="budgetItem in categoryFilterBudgets"
              :key="budgetItem.id"
              :budgetItem="budgetItem"
            />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFilterStore } from '@/stores/filterStore';
import { useBudgetStore } from '@/stores/dateStore'; // 이름은 dateStore지만 budgetStore를 가져옴
import TrasctionItem from '@/components/TrasctionItem.vue';

const router = useRouter();
const filterStore = useFilterStore();
const budgetStore = useBudgetStore();

//페이지가 열릴 때 일단 가계부 전체 내역 가져오기
onMounted(() => {
  budgetStore.fetchBudget();
});

const categoryFilterBudgets = computed(() => {
  // 1. 텅 빈 배열일 때
  if (!filterStore.appliedIds || filterStore.appliedIds.length === 0) {
    return [];
  }

  // 2. 가계부 '전체 내역 배열'을 돌면서 필터링
  return budgetStore.budgets.filter((budget) => {
    return filterStore.appliedIds.includes(String(budget.categoryId));
  });
  console.log(categoryFilterBudgets); // 콘솔에는 잘찍힙니다!
});

const goToFilterPage = () => {
  router.go(-2);
};
</script>
