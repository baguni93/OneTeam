<template>
    <div class="container">
      <div class="pig-icon">🐷</div>
      <h1 class="app-title">예산 수정</h1>
      <p class="app-sub">예산을 수정할게요 ✏️</p>
  
      <div class="card">
        <p class="field-label">총 예산 수정</p>
        <input 
          type="number" 
          v-model="form.total_budget" min="0"
          @keydown="preventMinus"
          placeholder="총 예산을 입력해 주는 고야"
          style="width: 100%; border: none; border-bottom: 1.5px solid #534AB7; padding: 10px 0; font-size: 16px; outline: none; box-sizing: border-box; margin-bottom: 16px;" />
  
        <p class="field-label">카테고리별 예산 수정</p>
        <div class="cat-row" v-for="cat in categoryStore.categoryList" :key="cat.id">
          <div class="cat-left">
            <div class="cat-dot" :style="{ background: cat.color }"></div>
            {{ cat.name }}
          </div>
          <input 
            class="cat-input" 
            type="number" min="0"
            @keydown="preventMinus"
            v-model="categoryBudgets[cat.id]" 
            placeholder="금액 입력" />
        </div>
      </div>
  
      <button class="btn-primary" @click="handleUpdate">수정 완료 ✅</button>
      <button class="btn-outline" @click="router.push('/budget')">취소</button>
    </div>
  </template>

<script setup>
import {reactive, onMounted} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {useBudgetPlanStore} from '@/stores/budgetPlan';
import { useUserStore } from '@/stores/userStore';
import {useCategoryStore} from '@/stores/categoryStore';

const categoryStore = useCategoryStore();

const userStore = useUserStore()
const currentUser = userStore.getCurrentUser()

const router = useRouter();
const route = useRoute();
const budgetPlanStore = useBudgetPlanStore();

const form = reactive({
    total_budget: 0,
});

const categoryBudgets = reactive({});

const handleUpdate = async() => {
    const totalCategory = Object.values(categoryBudgets).reduce((sum,amount)=> sum + Number(amount), 0);
    if(totalCategory > Number(form.total_budget)) {
        alert('카테고리 예산 합계가 총 예산을 초과할 수 없어요! 😅');
        return;
    }
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

const preventMinus = (e) => {
    if (e.key === '-' || e.key === 'e') {
        e.preventDefault();
    }
};

onMounted(async()=> {
    await categoryStore.fetchCategoryList();
    await budgetPlanStore.fetchBudgetPlan({ userId: currentUser.id, month: new Date().toISOString().slice(0,7)});

    const budget = budgetPlanStore.budget;
    if (!budget) {
        router.push('/budget');
        return;
    }

    form.total_budget = budget.total_budget;
    budget.category_budgets?.forEach(item => {
        categoryBudgets[item.categoryId] = item.amount;
    });
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
</style>
