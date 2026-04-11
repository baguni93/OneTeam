<template>
    <div class="container">
      <div class="pig-icon">🐷</div>
      <h1 class="app-title">잔고야</h1>
      <p class="app-sub">잔고야, 괜찮아?</p>
  
      <div v-if="!budget" class="card" style="text-align: center; padding: 32px 20px;">
        <p style="color: #888; margin-bottom: 20px;">아직 예산이 설정되지 않았어요 😅</p>
        <button class="btn-primary" @click="router.push('/budget/new')">예산 설정하러 가기</button>
      </div>
  
      <div v-else>
        <div class="budget-card">
          <p class="budget-label">이번 달 예산</p>
          <p class="budget-amount">{{ budget?.total_budget?.toLocaleString() }}원</p>
          <div class="progress-bg">
            <div class="progress-fill" :style="{ width: Math.min((totalUsed / budget.total_budget) * 100, 100) + '%' }"></div>
          </div>
          <p class="budget-sub">{{ totalUsed.toLocaleString() }} / {{ budget?.total_budget?.toLocaleString() }}원 사용</p>
        </div>
  
        <div class="remain-card">
          <p class="remain-label">오늘 쓸 수 있는 돈</p>
          <p class="remain-amount">{{ todayBudget.toLocaleString() }}원 ✨</p>
          <p class="remain-sub">남은 예산 {{ remainingBudget.toLocaleString() }}원</p>
        </div>
  
        <div class="card">
          <p class="field-label">카테고리별 예산</p>
          <div class="cat-row" v-for="item in budget?.category_budgets" :key="item.categoryId">
            <div class="cat-left">
              <div class="cat-dot" :style="{ background: getCategoryColor(item.categoryId) }"></div>
              {{ getCategoryName(item.categoryId) }}
            </div>
            <div style="text-align: right;">
                <div class="cat-amount">{{ item?.amount?.toLocaleString() }}원</div>
                <div style="font-size: 12px; color: #888;">
                    사용 {{ getCategoryUsed(item.categoryId).toLocaleString() }}원
                </div>
            </div>
          </div>
        </div>
  
        <button class="btn-primary" @click="router.push(`/budget/edit/${budget?.id}`)">수정하기 ✏️</button>
        <button class="btn-danger" @click="router.push('/budget/delete')">예산 삭제 🗑️</button>
      </div>
    </div>
  </template>

<script setup>
import { ref, onMounted, computed} from 'vue';
import {useRouter} from 'vue-router';
import { useBudgetPlanStore} from '@/stores/budgetPlan';
import { useUserStore } from '@/stores/userStore';
import {useCategoryStore} from '@/stores/categoryStore';
import { useBudgetStore } from '@/stores/dateStore';

const budgetStore = useBudgetStore();

const categoryStore = useCategoryStore();

const userStore = useUserStore();
const currentUser = userStore.getCurrentUser()

const router = useRouter();
const budgetPlanStore = useBudgetPlanStore();

const selectedMonth = ref(new Date().toISOString().slice(0,7));
const budget = ref(null);

const fetchBudget = async() => {
    await budgetPlanStore.fetchBudgetPlan({userId: currentUser.id, month: selectedMonth.value});
    budget.value = budgetPlanStore.budget;
};

const getCategoryName = (categoryId) => {
    const cat = categoryStore.categoryList.find(c => c.id === categoryId);
    return cat ? cat.name : '알 수 없는 카테고리';
};

const getCategoryColor = (categoryId) => {
    const cat = categoryStore.categoryList.find(c => c.id === categoryId);
    return cat ? cat.color : '#888';
}
const getCategoryUsed = (categoryId) => {
    if(!budgetStore.budgets) return 0;
    return budgetStore.budgets
    .filter(b => b.categoryId === categoryId &&
        b.type === 'expense' &&
        b.date.startsWith(selectedMonth.value)
    )
    .reduce((sum, b)=> sum + Number(b.amount), 0);
}
const totalUsed = computed(()=> {
    if(!budget.value) return 0;
    return budget.value.category_budgets.reduce((sum, item)=> {
        return sum + getCategoryUsed(item.categoryId);
    }, 0);
});
const todayBudget = computed(()=> {
    if(!budget.value) return 0;
    const remainDays = new Date(new Date().getFullYear(), new Date().getMonth()+ 1,0).getDate() - new Date().getDate() + 1;
    return Math.round((budget.value.total_budget - totalUsed.value) / remainDays);
});

onMounted(async()=> {
    await categoryStore.fetchCategoryList();
    await budgetStore.fetchBudget();
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

<style scoped>
/* 기본 모바일 설정 */
.container {
  max-width: 390px;
  margin: 0 auto;
  padding: 20px 16px;
  min-height: 100vh;
}

/* 태블릿 (768px 이상) */
@media (min-width: 768px) {
  .container {
    max-width: 500px;
    padding: 32px 24px;
  }

  .app-title {
    font-size: 32px;
  }

  .budget-amount {
    font-size: 36px;
  }

  .remain-amount {
    font-size: 30px;
  }

  .btn-primary, .btn-outline, .btn-danger {
    padding: 16px;
    font-size: 16px;
  }

  .card {
    padding: 24px;
  }

  .cat-row {
    font-size: 15px;
    padding: 12px 0;
  }
}

/* 노트북/데스크탑 (1024px 이상) */
@media (min-width: 1024px) {
  .container {
    max-width: 600px;
    padding: 40px 32px;
  }

  .pig-icon {
    font-size: 52px;
  }

  .app-title {
    font-size: 36px;
  }

  .app-sub {
    font-size: 16px;
  }

  .budget-amount {
    font-size: 42px;
  }

  .remain-amount {
    font-size: 34px;
  }

  .btn-primary, .btn-outline, .btn-danger {
    padding: 18px;
    font-size: 17px;
    border-radius: 14px;
  }

  .card {
    padding: 28px;
    border-radius: 20px;
  }

  .cat-row {
    font-size: 16px;
    padding: 14px 0;
  }

  .cat-input {
    width: 140px;
    font-size: 15px;
  }
}

.pig-icon {
  font-size: 40px;
  text-align: center;
  margin-bottom: 8px;
}

.app-title {
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  margin: 0 0 4px;
}

.app-sub {
  font-size: 14px;
  color: #888;
  text-align: center;
  margin: 0 0 24px;
}

.card {
  background: white;
  border: 0.5px solid #e0e0e0;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
}

.btn-primary {
  width: 100%;
  background: #534AB7;
  color: #EEEDFE;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 10px;
  cursor: pointer;
}

.btn-outline {
  width: 100%;
  background: white;
  color: #888;
  border: 0.5px solid #ddd;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  margin-bottom: 10px;
  cursor: pointer;
}

.btn-danger {
  width: 100%;
  background: white;
  color: #A32D2D;
  border: 0.5px solid #F09595;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  cursor: pointer;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 8px;
}

.cat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 0.5px solid #e0e0e0;
  font-size: 14px;
}

.cat-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cat-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.cat-input {
  border: none;
  border-bottom: 0.5px solid #ddd;
  width: 100px;
  text-align: right;
  font-size: 14px;
  background: transparent;
  outline: none;
  padding: 4px 0;
}

/* 추가 css */
.budget-card {
  background: #EEEDFE;
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 12px;
  text-align: center;
}

.budget-label {
  font-size: 12px;
  color: #534AB7;
  margin: 0 0 6px;
}

.budget-amount {
  font-size: 28px;
  font-weight: 500;
  color: #3C3489;
  margin: 0 0 12px;
}

.budget-sub {
  font-size: 12px;
  color: #534AB7;
  margin: 0;
}

.progress-bg {
  background: #AFA9EC;
  border-radius: 10px;
  height: 8px;
  margin-bottom: 8px;
}

.progress-fill {
  background: #534AB7;
  border-radius: 10px;
  height: 8px;
}

.remain-card {
  background: #E1F5EE;
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 12px;
  text-align: center;
}

.remain-label {
  font-size: 12px;
  color: #0F6E56;
  margin: 0 0 6px;
}

.remain-amount {
  font-size: 24px;
  font-weight: 500;
  color: #085041;
  margin: 0 0 4px;
}

.remain-sub {
  font-size: 12px;
  color: #0F6E56;
  margin: 0;
}

.cat-amount {
  color: #534AB7;
  font-weight: 500;
}
</style>
