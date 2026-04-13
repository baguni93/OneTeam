<template>
  <div class="container mt-4">
    <!-- 헤더 -->
    <div class="text-center mb-4">
      <h4>카테고리 선택</h4>
      <div class="text-muted">
        {{ type === 'income' ? '수입' : '지출' }} / {{ amount }}원
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
            <!-- 왼쪽 -->
            <div class="d-flex align-items-center gap-3">
              <!-- 아이콘 -->
              <div
                class="icon-circle"
                :style="{ backgroundColor: categoryItem.color }"
              >
                <i :class="['bi', categoryItem.icon]"></i>
              </div>

              <!-- 텍스트 -->
              <div>
                <div class="fw-bold">
                  {{ categoryItem.name }}
                </div>
              </div>
            </div>
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
import { computed } from 'vue';

import { useCategoryStore } from '@/stores/categoryStore';

const categoryStore = useCategoryStore();
const { categoryList } = storeToRefs(categoryStore);

const budgetStore = useBudgetStore();

const router = useRouter();

// 전달값
const amount = history.state?.amount;
const type = history.state?.categoryType;

const categoryItems = computed(() => {
  return categoryList.value.filter((x) => x.type === type);
});

const { addBudget } = budgetStore;

// 등록
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
/* 카드 */
.category-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 12px;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  background-color: #f8f9fa;
}

.category-card:active {
  transform: translateY(-1px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1);
}

/* 아이콘 원 */
.icon-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 18px;
  color: #fff;
}
</style>
