<template>
    <div class="container">
      <div class="pig-icon">🐷</div>
      <h1 class="app-title">예산 삭제</h1>
      <p class="app-sub">정말 삭제할까요?</p>
  
      <div class="card" style="text-align: center;">
        <p style="color: #888; margin-bottom: 16px;">정말로 삭제하시겠어요? 😢</p>
        <div class="budget-card" v-if="budget">
          <p class="budget-label">{{ budget?.month }} 예산</p>
          <p class="budget-amount">{{ budget?.total_budget?.toLocaleString() }}원</p>
        </div>
      </div>
  
      <button class="btn-danger" style="background: #FCEBEB; margin-bottom: 10px;" @click="handleDelete">네, 삭제할게요</button>
      <button class="btn-outline" @click="router.push('/budget')">아니요, 취소할게요</button>
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
