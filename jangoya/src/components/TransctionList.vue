<template>
  <div class="row">
    <div class="col p-3">
      <div>
        {{ selectedDate }}
        <span v-if="budgets.length > 0">
          수입 {{ sumAmount('income') }} 지출 {{ sumAmount('expense') }}
        </span>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <div class="header" v-if="filterBudgets.length <= 0">
            지출 내역이 없어요.
          </div>
          <ul class="list-group" style="background-color: aqua">
            <TrasctionItem
              v-for="budgetItem in filterBudgets"
              :key="budgetItem.id"
              :budgetItem="budgetItem"
            ></TrasctionItem>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDateStore } from '@/stores/dateStore';
import { useBudgetStore } from '@/stores/dateStore';
import TrasctionItem from './TrasctionItem.vue';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const budgetStore = useBudgetStore();
const { budgets } = storeToRefs(budgetStore);

const dateStore = useDateStore();
const { selectedDate } = storeToRefs(dateStore);

const filterBudgets = computed(() => {
  if (!selectedDate.value) return budgets.value;

  return budgets.value.filter(
    (x) => String(x.date) === String(selectedDate.value),
  );
});

const sumAmount = (type) => {
  return filterBudgets.value
    .filter((x) => x.type === type)
    .reduce((sum, x) => sum + x.amount, 0);
};
</script>
