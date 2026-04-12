<template>
  <!-- backdrop 클릭 시 닫기 -->
  <div class="modal-backdrop" @click.self="exit">
    <div class="modal-box">
      <!-- 헤더 -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold m-0">카테고리 선택</h5>

        <button class="btn btn-sm btn-outline-secondary" @click="exit">
          X
        </button>
      </div>

      <!-- 리스트 -->
      <div class="category-list">
        <button
          v-for="categoryItem in categoryItems"
          :key="categoryItem.id"
          class="category-item"
          @click="selectCategory(categoryItem.id)"
        >
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-start">
              <div class="fw-semibold">
                {{ categoryItem.name }}
              </div>

              <small class="text-muted">
                ID: {{ categoryItem.id }} / {{ categoryItem.type }}
              </small>
            </div>

            <span class="badge bg-light text-dark">선택</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useBudgetStore } from '@/stores/dateStore';
import { storeToRefs } from 'pinia';

const budgetStore = useBudgetStore();
const { categories } = storeToRefs(budgetStore);

const router = useRouter();
const currentRoute = useRoute();

const type = history.state?.categoryType;
const categoryItems = categories.value.filter((x) => x.type === type);

/**
 * 모달 닫기
 */
const exit = () => {
  router.push({ name: 'transaction/edit/id' });
};

/**
 * 카테고리 선택
 */
const selectCategory = (id) => {
  router.push({
    name: 'transaction/edit/id',
    params: { id: currentRoute.params.id },
    query: { categoryId: id },
  });
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-box {
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category-item {
  width: 100%;
  border: 1px solid #e9ecef;
  background: white;
  padding: 12px;
  border-radius: 12px;
  transition: 0.2s;
  text-align: left;
}

.category-item:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

button {
  cursor: pointer;
}
</style>
