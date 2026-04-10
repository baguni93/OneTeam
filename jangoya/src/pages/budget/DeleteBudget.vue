<template>
    <div>
        <h2>🗑️ 예산을 삭제할까요?</h2>
        <p>🥺정말로 삭제하시겠어요?🥺</p>

        <div v-if="budget">
            <p>{{ budget.month }} 예산</p>
            <p>총 예산: {{ budget.total_budget.toLocaleString() }}원</p>
        </div>
        <button @click="handleDelete">네, 삭제할게요</button>
        <button @click="router.push('/budget')">아니요</button>
    </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useBudgetPlanStore} from '@/stores/budgetPlan';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore()
const currentUser = userStore.getCurrentUser()

const router = useRouter();
const budgetPlanStore = useBudgetPlanStore();
const budget = ref(null);

const handleDelete = async() => {
    console.log('삭제할 id:', budget.value.id);
    await budgetPlanStore.deleteBudget(budget.value.id);
    alert('삭제가 완료되었습니다');
    router.push('/budget/new');
};

onMounted(async()=> {
    await budgetPlanStore.fetchBudgetPlan({ userId: currentUser.id, month: new Date().toISOString().slice(0,7)});
    budget.value = budgetPlanStore.budget;
    console.log('budget:', JSON.stringify(budget.value));
});
</script>
