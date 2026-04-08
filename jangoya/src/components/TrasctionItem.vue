<template>
  <span class="pointer" @click="updateBudget(budgetItem.id)">
    {{ budgetItem.categoryId }} / {{ budgetItem.memo }} /
    {{ budgetItem.amount }} 원
  </span>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { inject } from 'vue';

defineProps({
  budgetItem: { Type: Object, required: true },
});

const router = useRouter();
const { updateBudget } = inject('actions');
</script>
