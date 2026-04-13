<template>
  <div class="page-wrapper">
    <!-- 헤더 -->
    <header class="page-header">
      <button class="btn-ghost" @click="router.back()">
        <i class="bi bi-arrow-left"></i> 뒤로
      </button>
      <h2 class="page-title">아이콘 선택</h2>
      <button class="btn-done" @click="completeSelection">완료</button>
    </header>

    <!-- 미리보기 -->
    <div class="preview-area">
      <div class="icon-circle" :style="{ backgroundColor: localDraft.color }">
        <i :class="['bi', localDraft.icon]"></i>
      </div>
      <p class="preview-label">미리보기</p>
    </div>

    <!-- 탭 -->
    <div class="tab-bar">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'icon' }"
        @click="activeTab = 'icon'"
      >
        <i class="bi bi-grid-3x3-gap"></i> 아이콘
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'color' }"
        @click="activeTab = 'color'"
      >
        <i class="bi bi-palette"></i> 색상
      </button>
    </div>

    <!-- 아이콘 그리드 -->
    <div class="content" v-if="activeTab === 'icon'">
      <div class="card grid-card">
        <p class="section-label">아이콘 선택</p>
        <div class="icon-grid">
          <button
            v-for="icon in iconList"
            :key="icon"
            class="icon-item"
            :class="{ selected: localDraft.icon === icon }"
            @click="localDraft.icon = icon"
          >
            <i :class="['bi', icon]"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 컬러 그리드 -->
    <div class="content" v-else>
      <div class="card grid-card">
        <p class="section-label">색상 선택</p>
        <div class="color-grid">
          <button
            v-for="color in colorList"
            :key="color"
            class="color-item"
            :class="{ selected: localDraft.color === color }"
            :style="{ backgroundColor: color }"
            @click="localDraft.color = color"
          >
            <i
              v-if="localDraft.color === color"
              class="bi bi-check-lg check-icon"
            ></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/categoryStore';

const router = useRouter();
const categoryStore = useCategoryStore();
const activeTab = ref('icon');

const localDraft = ref({ icon: '', color: '' });

onMounted(() => {
  document.title = '잔고야 - 아이콘 선택';
  localDraft.value.icon  = categoryStore.draft.icon;
  localDraft.value.color = categoryStore.draft.color;
});

const iconList = [
  'bi-star', 'bi-heart', 'bi-cash', 'bi-cart', 'bi-house',
  'bi-car-front', 'bi-gift', 'bi-cup-hot', 'bi-bicycle',
  'bi-wallet2', 'bi-briefcase', 'bi-bag', 'bi-music-note',
  'bi-airplane', 'bi-book', 'bi-camera', 'bi-controller',
  'bi-hospital', 'bi-phone', 'bi-lightning-charge',
];

const colorList = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#06b6d4', '#84cc16', '#f59e0b', '#6366f1',
  '#10b981', '#0ea5e9', '#a855f7', '#78716c',
];

const completeSelection = () => {
  categoryStore.draft.icon  = localDraft.value.icon;
  categoryStore.draft.color = localDraft.value.color;
  router.back();
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
}
.btn-done:hover { color: #6ea8fe; }

/* 미리보기 */
.preview-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 0 20px;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.icon-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: background-color 0.2s;
}
.icon-circle i { font-size: 30px; color: white; }

.preview-label {
  margin: 10px 0 0;
  font-size: 12px;
  color: #adb5bd;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 탭 */
.tab-bar {
  display: flex;
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 0 16px;
}

.tab-btn {
  flex: 1;
  padding: 14px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 14px;
  font-weight: 600;
  color: #adb5bd;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.tab-btn.active {
  color: #212529;
  border-bottom-color: #0d6efd;
}

/* 콘텐츠 */
.content {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.grid-card { padding: 20px; }

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 0 0 16px;
}

/* 아이콘 그리드 */
.icon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.icon-item {
  aspect-ratio: 1;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #495057;
  cursor: pointer;
  transition: all 0.15s;
}
.icon-item:hover { border-color: #adb5bd; background: #f1f3f5; }
.icon-item.selected {
  border-color: #0d6efd;
  background: #e7f1ff;
  color: #0a58ca;
}

/* 컬러 그리드 */
.color-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.color-item {
  aspect-ratio: 1;
  border-radius: 50%;
  border: 3px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
.color-item:hover { transform: scale(1.1); }
.color-item.selected {
  border-color: #212529;
  transform: scale(1.15);
}

.check-icon {
  color: white;
  font-size: 16px;
  font-weight: 900;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));
}
</style>
