<template>
  <div>
    <button @click="router.go(-1)">
      <i class="bi bi-arrow-left"></i>
      마이페이지로 돌아가기
    </button>
    <h2>카테고리 관리</h2>
    <router-link :to="{ name: 'mypage/category/add' }">
      + 새 카테고리 추가
    </router-link>
    <section>
      <h3>입금 카테고리</h3>
      <ul>
        <li v-for="category in incomeCategories" :key="category.id">
          <div>
            <i :class="['bi', category.icon]"></i>
            <router-link :to="{name: 'mypage/category/edit', params:{id: category.id}}">{{ category.name }}</router-link>
          </div>
          <i class="bi bi-chevron-right"></i>
        </li>
      </ul>
    </section>

    <section>
      <h3>지출 카테고리</h3>
      <ul>
        <li v-for="category in expenseCategories" :key="category.id">
          <div>
            <i :class="['bi', category.icon]"></i>
            <router-link :to="{ name: 'mypage/category/edit', params:{id: category.id} }">{{
              category.name
            }}</router-link>
          </div>
          <i class="bi bi-chevron-right"></i>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 1. 카테고리 상태 관리
const categories = ref([]);
const router = useRouter();

// 2. 데이터 가져오기
onMounted(() => {
  fetch('http://localhost:3000/categories?userId=1')
    .then((res) => res.json())
    .then((data) => {
      categories.value = data;
    })
    .catch((err) => console.error('데이터 로딩 실패:', err));
});

// 3. 타입별 필터링
const incomeCategories = computed(() =>
  categories.value.filter((c) => c.type === 'income'),
);
const expenseCategories = computed(() =>
  categories.value.filter((c) => c.type === 'expense'),
);
</script>
