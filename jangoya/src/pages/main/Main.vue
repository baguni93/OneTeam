<template>
  <div class="container-fluid mt-3">
    <!-- 🔥 요약 카드 (항상 한 줄) -->
    <div class="summary-row mb-3">
      <div class="card summary-card shadow-sm border-0 text-center">
        <div class="label text-success">수입</div>
        <div class="amount">{{ formatNumber(sumAmount('income')) }}원</div>
      </div>

      <div class="card summary-card shadow-sm border-0 text-center">
        <div class="label text-danger">지출</div>
        <div class="amount">{{ formatNumber(sumAmount('expense')) }}원</div>
      </div>

      <div class="card summary-card shadow-sm border-0 text-center">
        <div class="label text-primary">잔액</div>
        <div
          class="amount"
          :class="{
            'text-danger': currentAmount < 0,
            'text-primary': currentAmount >= 0,
          }"
        >
          {{ formatNumber(currentAmount) }}원
        </div>
      </div>
    </div>

    <!-- 달력 -->
    <div class="card shadow-sm mb-3 border-0">
      <div class="card-body calendar-wrapper">
        <Calendar />
      </div>
    </div>

    <!-- 버튼 -->
    <div class="d-flex justify-content-end gap-2 mb-2 flex-wrap">
      <router-link class="btn btn-sm btn-outline-primary" to="search">
        검색
      </router-link>

      <router-link
        class="btn btn-sm btn-outline-secondary"
        to="category/filter"
      >
        필터
      </router-link>

      <router-link class="btn btn-sm btn-primary" to="transction/add">
        + 추가
      </router-link>
    </div>

    <!-- 리스트 -->
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
import { computed } from 'vue';

const budgetsStore = useBudgetStore();
const budgets = budgetsStore.budgets;

const sumAmount = (type) => {
  return budgets
    .filter((x) => x.type === type)
    .reduce((sum, x) => sum + x.amount, 0);
};

const currentAmount = computed(() => {
  return sumAmount('income') - sumAmount('expense');
});

const formatNumber = (num) => {
  if (!num) return 0;
  return num.toLocaleString();
};
</script>

<style scoped>
/* 🔥 항상 3칸 고정 */
.summary-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}

/* 카드 */
.summary-card {
  padding: 6px;
  min-width: 0;
}

/* 텍스트 */
.label {
  font-size: clamp(9px, 2vw, 12px);
  font-weight: bold;
}

.amount {
  font-size: clamp(11px, 3vw, 16px);
  font-weight: bold;
  margin-top: 2px;
}

/* 달력 overflow 방지 */
.calendar-wrapper {
  overflow-x: hidden;
}
</style>
