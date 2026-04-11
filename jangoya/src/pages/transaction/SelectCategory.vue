<template>
  <div class="container mt-4">
    <!-- 헤더 -->
    <div class="text-center mb-4">
      <h4>카테고리 선택</h4>
      <div class="text-muted">
        {{ type === 'income' ? '💰 수입' : '💸 지출' }} / {{ amount }}원
      </div>
    </div>

    <!-- 카테고리 리스트 -->
    <div class="row">
      <div
        class="col-md-6 mb-2"
        v-for="categoryItem in categoryItems"
        :key="categoryItem.id"
      >
        <div
          class="card category-card shadow-sm border-0"
          @click="addBudgetHandler(categoryItem.id)"
        >
          <div
            class="card-body d-flex justify-content-between align-items-center"
          >
            <div>
              <div class="fw-bold">
                {{ categoryItem.name }}
              </div>
              <small class="text-muted"> ID: {{ categoryItem.id }} </small>
            </div>

            <span
              class="badge"
              :class="type === 'income' ? 'bg-success' : 'bg-danger'"
            >
              {{ categoryItem.type }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 버튼 -->
    <div class="d-flex justify-content-between mt-4">
      <button
        type="button"
        class="btn btn-outline-secondary"
        @click="router.back()"
      >
        ← 뒤로가기
      </button>

      <button
        type="button"
        class="btn btn-outline-danger"
        @click="router.push('/')"
      >
        취소
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useBudgetStore } from '@/stores/dateStore';
import { storeToRefs } from 'pinia';

const budgetStore = useBudgetStore();
const { categories } = storeToRefs(budgetStore);

const router = useRouter();

const amount = history.state?.amount;
const type = history.state?.categoryType;

let categoryItems = categories.value.filter((x) => x.type === type);

const { addBudget } = budgetStore;

const addBudgetHandler = (categoryItemId) => {
  const budgetItem = {
    date: new Date().toDateString(),
    type: type,
    categoryId: categoryItemId,
    amount: amount,
    memo: '',
  };
  addBudget({ ...budgetItem }, () => {
    router.push('/');
  });
};
</script>

<style scoped>
/* ===== 카드 hover 핵심 ===== */
.category-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 12px;
}

/* hover 효과 */
.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  background-color: #f8f9fa;
}

/* 클릭 느낌 */
.category-card:active {
  transform: translateY(-1px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1);
}
</style>
