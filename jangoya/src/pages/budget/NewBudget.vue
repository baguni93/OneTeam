<template>
    <div>
        <h2>최초 예산 설정</h2>
        <div>
            <label>월 선택</label>
            <input type="month" v-model="form.month"/>
        </div>
        <div>
            <label>총 예산</label>
            <input type="number" v-model="form.total_budget" placeholder="총 예산을 입력하세요."/>
        </div>
        <h3>카테고리 별 예산</h3>
        <div v-for="cat in budgetPlanStore.categories" :key="cat.id">
            <label>{{ cat.name }}</label>
            <input 
            type="number"
            v-model="categoryBudgets[cat.id]"
            placeholder="카테고리 별 예산을 입력하세요."/>
        </div>
        <button @click="handleSubmit">저장</button>
        <button @click="router.push('/budget')">취소</button>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useBudgetPlanStore} from '@/stores/budgetPlan';

const router = useRouter();
const budgetPlanStore = useBudgetPlanStore();

const form = reactive({
    userId: '1',
    month: new Date().toISOString().slice(0,7),
    total_budget: 0,
});

const categoryBudgets = reactive({});

const handleSubmit = async() => {
    if(!form.month || !form.total_budget) {
        alert('월과 총 예산을 입력해주세요!');
        return;
    }
    const category_budgets = Object.entries(categoryBudgets)
.filter(([_, amount])=> amount > 0)
.map(([categoryId, amount])=> ({categoryId, amount: Number(amount)}));

await budgetPlanStore.addBudget({
    ...form,
    total_budget: Number(form.total_budget),
    category_budgets,
});
router.push('/budget');
};

onMounted(()=> {
    budgetPlanStore.fetchCategories();
});
</script>
