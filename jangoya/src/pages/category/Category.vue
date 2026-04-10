<template>
  <div>
    <header style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
      <button @click="goMypage">
        <i class="bi bi-arrow-left"></i> 마이페이지
      </button>
      <h2>카테고리 관리</h2>
      <div></div> </header>

    <div style="display: flex; gap: 10px; padding: 10px;">
      <button @click="goToAdd('income')" style="flex: 1;">+ 입금 카테고리 추가</button>
      <button @click="goToAdd('expense')" style="flex: 1;">+ 지출 카테고리 추가</button>
    </div>

    <section>
      <h3 style="padding: 10px; background-color: #f0f0f0;">입금 카테고리</h3>
      <ul style="display: flex; flex-wrap: wrap; gap: 15px; padding: 10px; list-style: none;">
        <li v-for="category in incomeCategories" :key="category.id" style="text-align: center;">
          <router-link :to="{ name: 'mypage/category/edit', params: { id: category.id } }" style="text-decoration: none; color: black;">
            <div
              style="
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 8px;
              "
              :style="{ backgroundColor: category.color }"
            >
              <i :class="['bi', category.icon]" style="color: white; font-size: 32px"></i>
            </div>
            <div style="font-size: 14px;">{{ category.name }}</div>
          </router-link>
        </li>
      </ul>
    </section>

    <section>
      <h3 style="padding: 10px; background-color: #f0f0f0;">지출 카테고리</h3>
      <ul style="display: flex; flex-wrap: wrap; gap: 15px; padding: 10px; list-style: none;">
        <li v-for="category in expenseCategories" :key="category.id" style="text-align: center;">
          <router-link :to="{ name: 'mypage/category/edit', params: { id: category.id } }" style="text-decoration: none; color: black;">
            <div
              style="
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 8px;
              "
              :style="{ backgroundColor: category.color }"
            >
              <i :class="['bi', category.icon]" style="color: white; font-size: 32px"></i>
            </div>
            <div style="font-size: 14px;">{{ category.name }}</div>
          </router-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useCategoryStore } from '@/stores/categoryStore'; // ✨ 카테고리 스토어 추가
import axios from 'axios';

const router = useRouter();
const userStore = useUserStore();
const categoryStore = useCategoryStore(); // ✨ 스토어 연결

const categories = ref([]);

const goMypage = () => {
  router.push({ name: 'mypage' });
};

// 💡 새 카테고리 추가 페이지로 이동하는 핵심 로직
const goToAdd = (type) => {
  // 1. 서랍장을 깨끗하게 비웁니다.
  categoryStore.resetDraft();
  
  // 2. 사용자가 누른 버튼(수입/지출)에 맞춰 서랍의 타입을 미리 세팅합니다.
  categoryStore.draft.type = type;

  // 3. 짐(query) 없이 가벼운 몸으로 페이지를 이동합니다!
  router.push({ name: 'mypage/category/add' });
};

onMounted(async () => {
  try {
    const res = await axios.get('/api/categories', {
      params: {
        userId: userStore.getCurrentUser().id,
      },
    });
    categories.value = res.data;
  } catch (err) {
    console.error('데이터 로딩 실패:', err);
  }
});

const incomeCategories = computed(() =>
  categories.value.filter((c) => c.type === 'income')
);
const expenseCategories = computed(() =>
  categories.value.filter((c) => c.type === 'expense')
);
</script>