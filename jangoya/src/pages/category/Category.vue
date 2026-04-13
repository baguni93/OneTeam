<template>
  <div class="page-wrapper">

    <header class="page-header">
      <button class="btn-ghost" @click="goMypage">
        <i class="bi bi-arrow-left"></i> 마이페이지
      </button>
      <h2 class="page-title">카테고리 관리</h2>
      <div></div>
    </header>

    <div class="add-buttons">
      <button class="btn-add income" @click="goToAdd('income')">
        <i class="bi bi-plus-lg"></i> 수입 추가
      </button>
      <button class="btn-add expense" @click="goToAdd('expense')">
        <i class="bi bi-plus-lg"></i> 지출 추가
      </button>
    </div>

    <div class="content">

      <section class="card">
        <h3 class="section-title">
          <i class="bi bi-arrow-down-circle-fill income-icon"></i> 수입 카테고리
        </h3>
        <ul class="category-grid">
          <li
            v-for="category in incomeCategories"
            :key="category.id"
            class="category-item"
          >
            <router-link
              :to="{ name: 'mypage/category/edit', params: { id: category.id } }"
              class="category-link"
            >
              <div
                class="icon-circle"
                :style="{ backgroundColor: category.color }"
              >
                <i :class="['bi', category.icon]"></i>
              </div>
              <div class="category-name">{{ category.name }}</div>
            </router-link>
          </li>
        </ul>
      </section>

      <section class="card">
        <h3 class="section-title">
          <i class="bi bi-arrow-up-circle-fill expense-icon"></i> 지출 카테고리
        </h3>
        <ul class="category-grid">
          <li
            v-for="category in expenseCategories"
            :key="category.id"
            class="category-item"
          >
            <router-link
              :to="{ name: 'mypage/category/edit', params: { id: category.id } }"
              class="category-link"
            >
              <div
                class="icon-circle"
                :style="{ backgroundColor: category.color }"
              >
                <i :class="['bi', category.icon]"></i>
              </div>
              <div class="category-name">{{ category.name }}</div>
            </router-link>
          </li>
        </ul>
      </section>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/categoryStore';

const router = useRouter();
const categoryStore = useCategoryStore();

const goMypage = () => {
  router.push({ name: 'mypage' });
};

const goToAdd = (type) => {
  categoryStore.resetDraft();
  categoryStore.draft.type = type;
  router.push({ name: 'mypage/category/add' });
};

// 스토어에 카테고리 목록 가져오기
onMounted(async () => {
  await categoryStore.fetchCategoryList();
});

// categoryList를 가져와서 나누기
const incomeCategories = computed(() =>
  categoryStore.categoryList.filter((c) => c.type === 'income'),
);
const expenseCategories = computed(() =>
  categoryStore.categoryList.filter((c) => c.type === 'expense'),
);
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #f4f6f8;
  font-family: 'Noto Sans KR', sans-serif;
}

/* 헤더 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background-color: #212529;
}

.page-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: white;
}

.btn-ghost {
  background: none;
  border: none;
  color: #adb5bd;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}
.btn-ghost:hover { color: white; }

/* 추가 버튼 */
.add-buttons {
  display: flex;
  gap: 10px;
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.btn-add {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-add:hover { opacity: 0.85; }
.btn-add.income  { background-color: #0d6efd; color: white; }
.btn-add.expense { background-color: #e7f1ff; color: #0d6efd; }

/* 콘텐츠 */
.content {
  padding: 0 16px 24px;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 카드 */
.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 섹션 타이틀 */
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 14px 18px;
  font-size: 14px;
  font-weight: 700;
  color: #495057;
  border-bottom: 1px solid #f1f3f5;
}
.income-icon  { color: #0d6efd; font-size: 16px; }
.expense-icon { color: #6ea8fe; font-size: 16px; }

/* 카테고리 그리드 */
.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 18px;
  list-style: none;
  margin: 0;
}

.category-item {
  text-align: center;
}

.category-link {
  text-decoration: none;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 12px;
  transition: background 0.15s;
}
.category-link:hover { background: #f1f3f5; }

.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.icon-circle i {
  color: white;
  font-size: 26px;
}

.category-name {
  font-size: 13px;
  font-weight: 500;
  color: #343a40;
}
</style>
