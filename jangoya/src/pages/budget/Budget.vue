<template>
    <div>
        <h2>💰이번 달 예산</h2>

        <!--월 선택-->
        <input type="month" v-model="selectedMonth" @change="fetchBudgetPlan"/>

        <!--예산 없을 때-->
        <div v-if="!budget">
            <p>아직 예산이 설정되지 않았어요😅</p>
            <button @click="router.push('/budget/new')">예산 설정하기</button>
        </div>

        <!--예산 있을 때-->
        <div v-else>
            <p>총 예산 {{ budget?.total_budget?.toLocaleString() }}원 🎯</p>
            <ul>
                <li v-for="item in budget?.category_budgets" :key="item.categoryId">
                    {{ getCategoryName(item.categoryId) }} : {{ item?.amount?.toLocaleString() }}
                </li>
            </ul>
            <p>카테고리 예산 합계 {{ totalCategoryBudget.toLocaleString() }}원</p>
            <p>남은 예산 {{ remainingBudget.toLocaleString() }}원 ✨</p>
            <button @click="router.push(`/budget/edit/${budget?.id}`)">수정하기 ✏️</button>
            <button @click="router.push('/budget/delete')">삭제 🗑️</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue';
import {useRouter} from 'vue-router';
import { useBudgetPlanStore} from '@/stores/budgetPlan';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const currentUser = userStore.getCurrentUser()

const router = useRouter();
const budgetPlanStore = useBudgetPlanStore();

const selectedMonth = ref(new Date().toISOString().slice(0,7));
const budget = ref(null);
const categories = ref([]);

const fetchBudget = async() => {
    await budgetPlanStore.fetchBudgetPlan({userId: currentUser.id, month: selectedMonth.value});
    budget.value = budgetPlanStore.budget;
};

const getCategoryName = (categoryId) => {
    const cat = budgetPlanStore.categories.find(c => c.id === categoryId);
    return cat ? cat.name : '알 수 없는 카테고리';
};

onMounted(()=> {
    fetchBudget();
});

const totalCategoryBudget = computed(()=> {
    if(!budget.value) return 0;
    return budget.value.category_budgets.reduce((sum, item)=> sum + item.amount, 0);
});
const remainingBudget = computed(()=> {
    if(!budget.value) return 0;
    return budget.value.total_budget - totalCategoryBudget.value;
});
</script>
