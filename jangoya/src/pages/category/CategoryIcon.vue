<template>
  <div>
    <header style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
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
        :style="{ backgroundColor: categoryStore.draft.color }"
      >
        <i
          :class="['bi', categoryStore.draft.icon]"
          style="color: white; font-size: 32px"
        ></i>
      </div>
    </section>

    <section style="text-align: center; margin-bottom: 20px">
      <button @click="activeTab = 'icon'">아이콘</button>
      <button @click="activeTab = 'color'">색상</button>
    </section>

    <section v-if="activeTab === 'icon'" style="padding: 0 10px;">
      <span
        v-for="icon in iconList"
        :key="icon"
        @click="categoryStore.draft.icon = icon"
        style="display: inline-block; padding: 10px; cursor: pointer"
      >
        <i :class="['bi', icon]" style="font-size: 24px"></i>
      </span>
    </section>

    <section v-else style="padding: 0 10px;">
      <span
        v-for="color in colorList"
        :key="color"
        @click="categoryStore.draft.color = color"
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/categoryStore'; // ✨ 피니아 스토어 가져오기

const router = useRouter();
const categoryStore = useCategoryStore(); // ✨ 서랍장 연결

// UI 전용 상태 (아이콘 탭인지 색상 탭인지)
const activeTab = ref('icon');

// 아이콘 및 색상 목록
const iconList = [
  'bi-star', 'bi-heart', 'bi-cash', 'bi-cart', 'bi-house', 
  'bi-car-front', 'bi-gift', 'bi-cup-hot', 'bi-bicycle'
];
const colorList = [
  '#FF5733', '#33FF57', '#3357FF', '#F0E68C', 
  '#FF69B4', '#8A2BE2', '#00CED1', '#FFD700'
];

// 완료 버튼: 선택한 건 이미 Store에 저장되어 있으므로 몸만 뒤로 갑니다!
const completeSelection = () => {
  // router.replace로 억지로 끼워넣을 필요 없이, 
  // 자연스럽게 이전 페이지(Add/Edit)로 돌아갑니다.
  router.back(); 
};
</script>