<template>
  <div>
    <span
      class="pointer"
      @click="router.push(`/transaction/edit/${budgetItem.id}`)"
    >
      {{ budgetItem.id }} / {{ budgetItem.type }} {{ budgetItem.categoryId }} /
      {{ budgetItem.memo }} / {{ budgetItem.amount }} 원
    </span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const { budgetItem } = defineProps({
  budgetItem: { type: Object, required: true },
});

const router = useRouter();
</script>
