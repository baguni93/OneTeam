<template>
  <div class="page-wrapper">
    <!-- 헤더 -->
    <header class="page-header">
      <button class="btn-ghost" @click="handleBack">
        <i class="bi bi-arrow-left"></i> 뒤로가기
      </button>
      <div class="header-center">
        <h2 class="page-title">카테고리 수정</h2>
        <span
          class="type-badge"
          :class="categoryStore.draft.type === 'expense' ? 'badge-expense' : 'badge-income'"
        >
          {{ categoryStore.draft.type === 'expense' ? '지출' : '수입' }}
        </span>
      </div>
      <div class="header-actions">
        <button class="btn-delete" @click="deleteCategory">
          <i class="bi bi-trash3"></i>
        </button>
        <button class="btn-done" @click="checkAndUpdate">완료</button>
      </div>
    </header>

    <div class="content">
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

    <!-- 삭제 확인 모달 -->
    <div class="modal-overlay" v-if="showDeleteModal" @click.self="showDeleteModal = false">
      <div class="modal-box">
        <div class="modal-icon">🗑️</div>
        <p class="modal-title">카테고리 삭제</p>
        <p class="modal-desc">
          <strong>{{ categoryStore.draft.name }}</strong> 카테고리를<br />
          정말 삭제하시겠습니까?
        </p>
        <div class="modal-buttons">
          <button class="modal-btn-cancel" @click="showDeleteModal = false">취소</button>
          <button class="modal-btn-confirm" @click="confirmDelete">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/categoryStore';

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();
const categoryId = route.params.id;
const showDeleteModal = ref(false);

onMounted(async () => {
  document.title = '잔고야 - 카테고리 수정';
  if (String(categoryStore.draft.id) !== String(categoryId)) {
    try {
      await categoryStore.fetchCategory(categoryId);
    } catch {
      alert('데이터를 불러오지 못했습니다.');
      router.push('/mypage/category');
    }
  }
});

const handleBack = () => {
  categoryStore.resetDraft();
  router.push({ name: 'mypage/category' });
};

const goToIconSelect = () => {
  router.push({ name: 'categoryicon' });
};

const checkAndUpdate = async () => {
  const { name, type } = categoryStore.draft;
  if (!name.trim()) {
    alert('이름을 입력해주세요!');
    return;
  }
  try {
    await categoryStore.fetchCategoryList();
    const isDuplicate = categoryStore.categoryList.some(
      (cat) =>
        cat.name === name &&
        String(cat.id) !== String(categoryId) &&
        cat.type === type
    );
    if (isDuplicate) {
      alert('이미 존재하는 카테고리 이름입니다.');
      return;
    }
    await categoryStore.updateCategory();
    alert('카테고리가 수정되었습니다!');
    categoryStore.resetDraft();
    router.push('/mypage/category');
  } catch {
    alert('수정 중 오류가 발생했습니다.');
  }
};

const deleteCategory = () => {
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    await categoryStore.deleteCategory(categoryId);
    showDeleteModal.value = false;
    alert('카테고리가 삭제되었습니다.');
    router.push('/mypage/category');
  } catch {
    alert('삭제 중 오류가 발생했습니다.');
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

.header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.page-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: white;
}

.type-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 20px;
}
.badge-expense { background: #fee2e2; color: #dc2626; }
.badge-income  { background: #cfe2ff; color: #0a58ca; }

.btn-ghost {
  background: none;
  border: none;
  color: #adb5bd;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}
.btn-ghost:hover { color: white; }

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-delete {
  background: none;
  border: none;
  color: #f87171;
  font-size: 17px;
  cursor: pointer;
  transition: color 0.2s;
}
.btn-delete:hover { color: #ef4444; }

.btn-done {
  background: none;
  border: none;
  color: #0d6efd;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
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
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.section-card { padding: 18px 20px; }

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 0 0 12px;
}

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
.icon-circle i { font-size: 26px; color: white; }

.icon-card-text { flex: 1; }
.icon-card-main { margin: 0; font-size: 15px; font-weight: 600; color: #212529; }
.icon-card-sub  { margin: 2px 0 0; font-size: 13px; color: #adb5bd; }
.chevron { font-size: 14px; color: #ced4da; }

.name-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  color: #212529;
  background: transparent;
}
.name-input::placeholder { color: #ced4da; }

/* 모달 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  background: white;
  border-radius: 20px;
  padding: 32px 28px 24px;
  width: 300px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.modal-icon { font-size: 36px; margin-bottom: 12px; }
.modal-title { font-size: 17px; font-weight: 700; margin: 0 0 8px; }
.modal-desc { font-size: 14px; color: #6c757d; margin: 0 0 24px; line-height: 1.6; }

.modal-buttons {
  display: flex;
  gap: 10px;
}

.modal-btn-cancel {
  flex: 1;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.modal-btn-confirm {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #ef4444;
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
</style>
