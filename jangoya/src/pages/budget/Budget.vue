<template>
    <div>
        <h2>예산 설정</h2>

        <!--월 선택-->
        <input type="month" v-model="selectedMonth" @change="fetchBudgetPlan"/>

        <!--예산 없을 때-->
        <div v-if="!budget">
            <p>설정된 예산이 없습니다.</p>
            <button @click="router.push('/budget/new')">예산 설정하기</button>
        </div>

        <!--예산 있을 때-->
        <div v-else>
            <p>총 예산: {{ budget.total_budget.toLocaleString() }}원</p>
            <ul>
                <li v-for="item in budget.category_budgets" :key="item.categoryId">
                    {{ getCategoryName(item.categoryId) }} : {{ item.amount.toLocaleString() }}
                </li>
            </ul>
            <button @click="router.push(`/budget/edit/${budget.id}`)">수정</button>
            <button @click="router.push('/budget/delete')">삭제</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import { useBudgetPlanStore} from '@/stores/budgetPlan';

const router = useRouter();
const budgetPlanStore = useBudgetPlanStore();

const selectedMonth = ref(new Date().toISOString().slice(0,7));
const budget = ref(null);
const categories = ref([]);

const fetchBudget = async() => {
    await budgetPlanStore.fetchBudgetPlan({userId: '1', month: selectedMonth.value});
    budget.value = budgetPlanStore.budget;
};

const getCategoryName = (categoryId) => {
    const cat = budgetPlanStore.categories.find(c => c.id === categoryId);
    return cat ? cat.name : '알 수 없는 카테고리';
};

onMounted(()=> {
    fetchBudget();
});
</script>
