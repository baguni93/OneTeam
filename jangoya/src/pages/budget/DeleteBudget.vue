<template>
    <div>
        <h2>예산 삭제</h2>
        <p>정말 예산을 삭제하시겠습니까?</p>

        <div v-if="budget">
            <p>{{ budget.month }} 예산</p>
            <p>총 예산: {{ budget.total_budget.toLocaleString() }}원</p>
        </div>
        <button @click="handleDelete">삭제</button>
        <button @click="router.push('/budget')">취소</button>
    </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useBudgetPlanStore} from '@/stores/budgetPlan';

const router = useRouter();
const budgetPlanStore = useBudgetPlanStore();
const budget = ref(null);

const handleDelete = async() => {
    await budgetPlanStore.deleteBudget(budget.value.id);
    router.push('/budget/new');
};

onMounted(async()=> {
    await budgetPlanStore.fetchBudgetPlan({ userId: '1', month: new Date().toISOString().slice(0,7)});
    budget.value = budgetPlanStore.budget;
});
</script>
