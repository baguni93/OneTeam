<template>
  <div>
    <span
      class="pointer"
      @click="router.push(`/transaction/edit/${budgetItem.id}`)"
      :style="{ background: isIncome }"
    >
      {{ budgetItem.type }} {{ budgetItem.categoryId }} /
      {{ budgetItem.memo }} / {{ budgetItem.amount }} 원
    </span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const { budgetItem } = defineProps({
  budgetItem: { type: Object, required: true },
});

const isIncome = budgetItem.type === 'income' ? 'red' : 'blue';

console.log(isIncome);

const router = useRouter();
</script>
