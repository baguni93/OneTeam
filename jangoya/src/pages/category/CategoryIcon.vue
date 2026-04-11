<template>
  <div>
    <header
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
      "
    >
      <button @click="router.back()">
        <i class="bi bi-arrow-left"></i> 뒤로
      </button>
      <h2>이미지 선택</h2>
      <button @click="completeSelection">완료</button>
    </header>

    <section style="text-align: center; margin: 20px 0">
      <div
        style="
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        "
        :style="{ backgroundColor: localDraft.color }"
      >
        <i
          :class="['bi', localDraft.icon]"
          style="color: white; font-size: 32px"
        ></i>
      </div>
    </section>

    <section style="text-align: center; margin-bottom: 20px">
      <button @click="activeTab = 'icon'">아이콘</button>
      <button @click="activeTab = 'color'">색상</button>
    </section>

    <section v-if="activeTab === 'icon'" style="padding: 0 10px">
      <span
        v-for="icon in iconList"
        :key="icon"
        @click="localDraft.icon = icon"
        style="display: inline-block; padding: 10px; cursor: pointer"
      >
        <i :class="['bi', icon]" style="font-size: 24px"></i>
      </span>
    </section>

    <section v-else style="padding: 0 10px">
      <span
        v-for="color in colorList"
        :key="color"
        @click="localDraft.color = color"
        style="
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin: 5px;
          cursor: pointer;
        "
        :style="{ backgroundColor: color }"
      ></span>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/categoryStore';

const router = useRouter();
const categoryStore = useCategoryStore();

const activeTab = ref('icon');

// ==========================================
// 🚀 1. 임시 복사본 만들기 (Local State)
// ==========================================
const localDraft = ref({
  icon: '',
  color: '',
});

// 페이지가 열릴 때, 피니아 원본 서랍에 있던 값을 복사해옵니다.
onMounted(() => {
  localDraft.value.icon = categoryStore.draft.icon;
  localDraft.value.color = categoryStore.draft.color;
});

const iconList = [
  'bi-star',
  'bi-heart',
  'bi-cash',
  'bi-cart',
  'bi-house',
  'bi-car-front',
  'bi-gift',
  'bi-cup-hot',
  'bi-bicycle',
];
const colorList = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#F0E68C',
  '#FF69B4',
  '#8A2BE2',
  '#00CED1',
  '#FFD700',
];

// ==========================================
// 🚀 2. '완료' 버튼 누를 때만 덮어쓰기!
// ==========================================
const completeSelection = () => {
  // 내가 이것저것 눌러보던 임시 복사본의 값을
  // 비로소 진짜 피니아 서랍장에 덮어씌웁니다.
  categoryStore.draft.icon = localDraft.value.icon;
  categoryStore.draft.color = localDraft.value.color;

  // 그리고 뒤로 돌아갑니다.
  router.back();
};
</script>
