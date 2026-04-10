<template>
    <div>
        <h2>💸 예산을 설정해볼까요?</h2>
        <div>
            <label>월 선택</label>
            <input type="month" v-model="form.month"/>
        </div>
        <div>
            <label>총 예산</label>
            <input type="number" v-model="form.total_budget" placeholder="총 예산을 입력해주세요:)"/>
        </div>
        <h3>카테고리별 예산 설정 🗂️</h3>
        <div v-for="cat in budgetPlanStore.categories" :key="cat.id">
            <label>{{ cat.name }}</label>
            <input 
            type="number"
            v-model="categoryBudgets[cat.id]"
            placeholder="카테고리 별 예산을 입력해주세요:)"/>
        </div>
        <button @click="handleSubmit">설정 완료 ✅</button>
        <button @click="router.push('/budget')">취소</button>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useBudgetPlanStore} from '@/stores/budgetPlan';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore()
const currentUser = userStore.getCurrentUser()

const router = useRouter();
const budgetPlanStore = useBudgetPlanStore();

const form = reactive({
    userId: currentUser.id,
    month: new Date().toISOString().slice(0,7),
    total_budget: 0,
});

const categoryBudgets = reactive({});

const handleSubmit = async() => {
    if(!form.month || !form.total_budget) {
        alert('월과 총 예산을 입력해주세요:)');
        return;
    }
    const hasCategory = Object.values(categoryBudgets).some(amount => amount >0);
    if(!hasCategory) {
        alert('카테고리별 예산에 숫자를 입력해주세요!');
        return;
    }
    await budgetPlanStore.fetchBudgetPlan({userId: '1', month: form.month});
    if(budgetPlanStore.budget) {
        alert('이미 예산이 설정되어 있어요:(');
        router.push('/budget');
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
