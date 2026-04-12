<template>
  <div class="container mt-3">
    <!-- 상단 날짜 + 요약 -->
    <div class="row mb-3">
      <div class="col p-3">
        <div class="d-flex justify-content-between align-items-center">
          <!-- 날짜 -->
          <div class="fw-bold fs-5">
            {{ selectedDate || '날짜 없음' }}
          </div>

          <!-- 수입/지출 -->
          <div class="d-flex gap-2" v-if="budgets.length > 0">
            <div class="badge bg-success p-2">
              수입 {{ sumAmount('income') }}원
            </div>

            <div class="badge bg-danger p-2">
              지출 {{ sumAmount('expense') }}원
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 리스트 영역 -->
    <div class="row">
      <div class="col">
        <div class="card shadow-sm">
          <div class="card-body">
            <!-- empty state -->
            <div
              v-if="filterBudgets.length <= 0"
              class="text-center text-muted py-4"
            >
              📭 지출 내역이 없어요.
            </div>

            <!-- 리스트 -->
            <ul class="list-group list-group-flush">
              <TrasctionItem
                v-for="budgetItem in filterBudgets"
                :key="budgetItem.id"
                :budgetItem="budgetItem"
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDateStore, useBudgetStore } from '@/stores/dateStore';
import TrasctionItem from './TrasctionItem.vue';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

/* store */
const budgetStore = useBudgetStore();
const dateStore = useDateStore();

const { budgets } = storeToRefs(budgetStore);
const { selectedDate } = storeToRefs(dateStore);

/* 날짜 필터 */
const filterBudgets = computed(() => {
  if (!selectedDate.value) return budgets.value;

  return budgets.value.filter(
    (x) => String(x.date) === String(selectedDate.value),
  );
});

/* 합계 */
const sumAmount = (type) => {
  return filterBudgets.value
    .filter((x) => x.type === type)
    .reduce((sum, x) => sum + x.amount, 0);
};
</script>
