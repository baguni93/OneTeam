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
              <div class="text-start">
                <div class="fw-semibold">
                  {{ categoryItem.name }}
                </div>
              </div>
            </div>

            <!-- 오른쪽 -->
            <span class="badge bg-light text-dark">선택</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '@/stores/categoryStore';
import { computed } from 'vue';

const categoryStore = useCategoryStore();
const { categoryList } = storeToRefs(categoryStore);

const router = useRouter();
const currentRoute = useRoute();

const type = history.state?.categoryType;

const categoryItems = computed(() => {
  return categoryList.value.filter((x) => x.type === type);
});

const exit = () => {
  router.back();
};

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

/* 리스트 */
.category-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 카드 */
.category-item {
  width: 100%;
  border: 1px solid #e9ecef;
  background: white;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  text-align: left;
  cursor: pointer;
}

.category-item:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
}

/* 아이콘 */
.icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 20px;
  color: #fff;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

/* 아이콘 hover */
.category-item:hover .icon-circle {
  transform: scale(1.1);
}

/* 클릭 느낌 */
.category-item:active .icon-circle {
  transform: scale(0.95);
}

/* 아이콘 가독성 */
.icon-circle i {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}
</style>
