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
      <button @click="goMypage">
        <i class="bi bi-arrow-left"></i> 마이페이지
      </button>
      <h2>카테고리 관리</h2>
      <div></div>
    </header>

    <div style="display: flex; gap: 10px; padding: 10px">
      <button @click="goToAdd('income')" style="flex: 1">
        + 입금 카테고리 추가
      </button>
      <button @click="goToAdd('expense')" style="flex: 1">
        + 지출 카테고리 추가
      </button>
    </div>

    <section>
      <h3 style="padding: 10px; background-color: #f0f0f0">입금 카테고리</h3>
      <ul
        style="
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          padding: 10px;
          list-style: none;
        "
      >
        <li
          v-for="category in incomeCategories"
          :key="category.id"
          style="text-align: center"
        >
          <router-link
            :to="{ name: 'mypage/category/edit', params: { id: category.id } }"
            style="text-decoration: none; color: black"
          >
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
              <i
                :class="['bi', category.icon]"
                style="color: white; font-size: 32px"
              ></i>
            </div>
            <div style="font-size: 14px">{{ category.name }}</div>
          </router-link>
        </li>
      </ul>
    </section>

    <section>
      <h3 style="padding: 10px; background-color: #f0f0f0">지출 카테고리</h3>
      <ul
        style="
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          padding: 10px;
          list-style: none;
        "
      >
        <li
          v-for="category in expenseCategories"
          :key="category.id"
          style="text-align: center"
        >
          <router-link
            :to="{ name: 'mypage/category/edit', params: { id: category.id } }"
            style="text-decoration: none; color: black"
          >
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
              <i
                :class="['bi', category.icon]"
                style="color: white; font-size: 32px"
              ></i>
            </div>
            <div style="font-size: 14px">{{ category.name }}</div>
          </router-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
// ✨ ref, axios, useUserStore 전부 지웠습니다! 컴포넌트가 엄청 가벼워졌죠.
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

// 💡 스토어에 "목록 다 가져와!" 명령만 내리면 끝입니다.
onMounted(async () => {
  await categoryStore.fetchCategoryList();
});

// 💡 화면에 뿌릴 때는 스토어의 categoryList를 가져와서 나눕니다.
const incomeCategories = computed(() =>
  categoryStore.categoryList.filter((c) => c.type === 'income'),
);
const expenseCategories = computed(() =>
  categoryStore.categoryList.filter((c) => c.type === 'expense'),
);
</script>
