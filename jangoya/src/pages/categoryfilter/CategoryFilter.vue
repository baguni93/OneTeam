<template>
  <div class="page-wrapper">
    <header class="filter-header">
      <h3 class="filter-title">카테고리 필터</h3>
      <button class="btn-cancel" @click="router.back()">취소</button>
    </header>

    <section class="filter-body">
      <ul class="category-grid">
        <li
          v-for="cat in sortedCategories"
          :key="cat.id"
          @click="filterStore.toggleSelect(cat.id)"
          class="category-item"
          :class="{ selected: filterStore.tempSelectedIds.includes(cat.id) }"
        >
          <div
            class="icon-circle"
            :style="{ backgroundColor: cat.color }"
          >
            <i :class="['bi', cat.icon]" class="cat-icon"></i>
          </div>
          <div class="cat-name">{{ cat.name }}</div>
        </li>
      </ul>

      <button class="btn-add-category" @click="goToAdd">
        <i class="bi bi-plus-lg"></i> 새 카테고리 추가하기
      </button>
    </section>

    <div class="footer">
      <button class="btn-confirm" @click="applyAndGoBack">선택 완료</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useFilterStore } from '@/stores/filterStore'; 
import { useCategoryStore } from '@/stores/categoryStore';

const router = useRouter();
const filterStore = useFilterStore(); 
const categoryStore = useCategoryStore();

onMounted(async () => {
  try {
    await categoryStore.fetchCategoryList();
  } catch (error) {
    console.error('카테고리 로딩 실패:', error);
  }
});

const sortedCategories = computed(() => {
  return [...categoryStore.categoryList].sort((a, b) => {
    if (a.type === 'income' && b.type === 'expense') return -1;
    if (a.type === 'expense' && b.type === 'income') return 1;
    return 0;
  });
});

const applyAndGoBack = () => {
  // 정렬된 순서대로 ID 뽑기
  const finalSortedIds = sortedCategories.value
    .filter((cat) => filterStore.tempSelectedIds.includes(cat.id))
    .map((cat) => cat.id);

  // 피니아에 저장
  filterStore.confirmFilter(finalSortedIds);

  router.push({ name: 'testFilter' });
};

const goToAdd = () => {
  router.push('/mypage/category/add');
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #f4f6f8;
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: column;
}

/* 헤더 */
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background-color: #212529;
}

.filter-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: white;
}

.btn-cancel {
  background: none;
  border: none;
  color: #adb5bd;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}
.btn-cancel:hover { color: white; }

/* 바디 */
.filter-body {
  flex: 1;
  padding: 20px 16px;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

/* 카테고리 그리드 */
.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0;
  list-style: none;
  margin: 0 0 20px;
}

.category-item {
  text-align: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 14px;
  transition: background 0.15s;
  opacity: 0.3;
}
.category-item.selected {
  opacity: 1;
  background-color: #e7f1ff;
}
.category-item:hover { background-color: #f1f3f5; opacity: 1; }

.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}
.cat-icon { color: white; font-size: 24px; }

.cat-name {
  font-size: 13px;
  font-weight: 500;
  color: #343a40;
}

/* 새 카테고리 추가 버튼 */
.btn-add-category {
  width: 100%;
  padding: 13px;
  border: 2px dashed #9ec5fe;
  border-radius: 14px;
  background: transparent;
  color: #0d6efd;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.2s;
}
.btn-add-category:hover { background: #e7f1ff; }

/* 하단 완료 버튼 */
.footer {
  padding: 16px;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.btn-confirm {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background-color: #0d6efd;
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.35);
}
.btn-confirm:hover { background-color: #0a58ca; }
</style>
