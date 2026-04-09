<template>
    <div>
        <h2>예산 수정</h2>

        <div>
            <label>총 예산</label>
            <input type="number" v-model="form.total_budget"/>
        </div>

        <h3>카테고리 별 예산</h3>
        <div v-for="cat in budgetPlanStore.categories" :key="cat.id">
            <label>{{ cat.name }}</label>
            <input 
            type="number"
            v-model="categoryBudgets[cat.id]"
            placeholder="카테고리 별 예산을 입력하세요."/>
        </div>
        <button @click="handleUpdate">수정 완료</button>
        <button @click="router.push('/budget')">취소</button>
    </div>
</template>

<script setup>
import {reactive, onMounted} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {useBudgetPlanStore} from '@/stores/budgetPlan';

const router = useRouter();
const route = useRoute();
const budgetPlanStore = useBudgetPlanStore();

const form = reactive({
    total_budget: 0,
});

const categoryBudgets = reactive({});

const handleUpdate = async() => {
    const category_budgets = Object.entries(categoryBudgets)
    .filter(([_, amount])=> amount > 0)
    .map(([categoryId, amount])=> ({categoryId, amount: Number(amount)}));

    await budgetPlanStore.updateBudget(route.params.id, {
        ...form,
        total_budget: Number(form.total_budget),
        category_budgets,
    });
    router.push('/budget');
};

onMounted(async()=> {
    await budgetPlanStore.fetchCategories();
    await budgetPlanStore.fetchBudgetPlan({ userId: '1', month: new Date().toISOString().slice(0,7)});

    const budget = budgetPlanStore.budget;
    if (!budget) {
        router.push('/budget');
        return;
    }

    form.total_budget = budget.total_budget;
    budget.category_budgets.forEach(item => {
        categoryBudgets[item.categoryId] = item.amount;
    });
});
</script>
