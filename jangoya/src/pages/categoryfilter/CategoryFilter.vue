<template>
  <div class="p-3">
    <header
      style="display: flex; justify-content: space-between; margin-bottom: 20px"
    >
      <h3>카테고리 필터</h3>
      <button @click="router.back()">취소</button>
    </header>

    <section>
      <ul
        style="
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          padding: 0;
          list-style: none;
        "
      >
        <li
          v-for="cat in sortedCategories"
          :key="cat.id"
          @click="filterStore.toggleSelect(cat.id)"
          style="text-align: center; cursor: pointer"
          :style="{
            opacity: filterStore.tempSelectedIds.includes(cat.id) ? 1 : 0.3,
          }"
        >
          <div
            style="
              width: 60px;
              height: 60px;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 5px;
            "
            :style="{ backgroundColor: cat.color }"
          >
            <i
              :class="['bi', cat.icon]"
              style="color: white; font-size: 24px"
            ></i>
          </div>
          <div style="font-size: 14px">{{ cat.name }}</div>
        </li>
      </ul>

      <button style="margin-top: 20px; width: 100%" @click="goToAdd">
        + 새 카테고리 추가하기
      </button>
    </section>

    <button style="margin-top: 10px; width: 100%" @click="applyAndGoBack">
      선택 완료
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useFilterStore } from '@/stores/filterStore'; // ✨ 피니아 추가
import { useCategoryStore } from '@/stores/categoryStore';

const router = useRouter();
const filterStore = useFilterStore(); // ✨ 스토어 활성화
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
  // 정렬된 순서대로 ID 뽑기 로직 유지
  const finalSortedIds = sortedCategories.value
    .filter((cat) => filterStore.tempSelectedIds.includes(cat.id))
    .map((cat) => cat.id);

  // 피니아의 최종 저장소에 저장!
  filterStore.confirmFilter(finalSortedIds);

  // 부모 페이지(테스트 페이지)로 돌아가기
  router.push({ name: 'testFilter' });
};

const goToAdd = () => {
  router.push('/mypage/category/add');
};
</script>
