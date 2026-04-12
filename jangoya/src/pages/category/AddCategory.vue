<template>
  <div class="page-wrapper">
    <!-- 헤더 -->
    <header class="page-header">
      <button class="btn-ghost" @click="handleBack">
        <i class="bi bi-arrow-left"></i> 뒤로가기
      </button>
      <h2 class="page-title">카테고리 추가</h2>
      <button class="btn-done" @click="checkAndSubmit">완료</button>
    </header>

    <div class="content">
      <!-- 타입 선택 -->
      <div class="card section-card">
        <p class="section-label">유형</p>
        <div class="type-toggle">
          <label
            class="toggle-option"
            :class="{ active: categoryStore.draft.type === 'income' }"
          >
            <input type="radio" value="income" v-model="categoryStore.draft.type" hidden />
            <i class="bi bi-arrow-down-circle"></i> 수입
          </label>
          <label
            class="toggle-option"
            :class="{ active: categoryStore.draft.type === 'expense' }"
          >
            <input type="radio" value="expense" v-model="categoryStore.draft.type" hidden />
            <i class="bi bi-arrow-up-circle"></i> 지출
          </label>
        </div>
      </div>

      <!-- 아이콘 선택 -->
      <div class="card section-card icon-card" @click="goToIconSelect">
        <div
          class="icon-circle"
          :style="{ backgroundColor: categoryStore.draft.color }"
        >
          <i :class="['bi', categoryStore.draft.icon]"></i>
        </div>
        <div class="icon-card-text">
          <p class="icon-card-main">아이콘 및 색상</p>
          <p class="icon-card-sub">탭하여 변경</p>
        </div>
        <i class="bi bi-chevron-right chevron"></i>
      </div>

      <!-- 이름 입력 -->
      <div class="card section-card">
        <p class="section-label">카테고리 이름</p>
        <input
          type="text"
          class="name-input"
          v-model="categoryStore.draft.name"
          placeholder="카테고리 이름을 입력해 주세요"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/categoryStore';

const router = useRouter();
const categoryStore = useCategoryStore();

onMounted(() => {
  document.title = '잔고야 - 카테고리 추가';
});

const goToIconSelect = () => {
  router.push({ name: 'categoryicon' });
};

const handleBack = () => {
  categoryStore.resetDraft();
  router.back();
};

const checkAndSubmit = async () => {
  const { name, type } = categoryStore.draft;
  if (!name.trim()) {
    alert('이름을 입력해주세요!');
    return;
  }
  try {
    await categoryStore.fetchCategoryList();
    const isDuplicate = categoryStore.categoryList.some(
      (cat) => cat.name === name && cat.type === type
    );
    if (isDuplicate) {
      alert('이미 존재하는 카테고리 이름입니다.');
      return;
    }
    await categoryStore.saveCategory();
    alert('카테고리가 성공적으로 추가되었습니다!');
    router.back();
  } catch (error) {
    console.error('중복 검사 에러:', error);
    alert('저장 중 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #f4f6f8;
  font-family: 'Noto Sans KR', sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background-color: #212529;
  color: white;
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
  padding: 4px 0;
  transition: color 0.2s;
}
.btn-ghost:hover { color: white; }

.btn-done {
  background: none;
  border: none;
  color: #0d6efd;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s;
}
.btn-done:hover { color: #6ea8fe; }

.content {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.section-card {
  padding: 18px 20px;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 0 0 12px;
}

/* 타입 토글 */
.type-toggle {
  display: flex;
  gap: 10px;
}

.toggle-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #e9ecef;
  font-size: 14px;
  font-weight: 600;
  color: #adb5bd;
  cursor: pointer;
  transition: all 0.2s;
}
.toggle-option.active {
  border-color: #0d6efd;
  background-color: #e7f1ff;
  color: #0a58ca;
}

/* 아이콘 카드 */
.icon-card {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: background 0.15s;
}
.icon-card:hover { background: #f8f9fa; }

.icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-circle i {
  font-size: 26px;
  color: white;
}

.icon-card-text { flex: 1; }
.icon-card-main { margin: 0; font-size: 15px; font-weight: 600; color: #212529; }
.icon-card-sub  { margin: 2px 0 0; font-size: 13px; color: #adb5bd; }

.chevron { font-size: 14px; color: #ced4da; }

/* 이름 입력 */
.name-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  color: #212529;
  background: transparent;
  padding: 0;
}
.name-input::placeholder { color: #ced4da; }
</style>
