<template>
  <div>
    <button @click="goMypage">
      <i class="bi bi-arrow-left"></i>
      마이페이지로 돌아가기
    </button>
    <h2>카테고리 관리</h2>
    <router-link
      :to="{ name: 'mypage/category/add', query: { type: 'income' } }"
    >
      + 입금 카테고리 추가
    </router-link>

    <router-link
      :to="{ name: 'mypage/category/add', query: { type: 'expense' } }"
    >
      + 지출 카테고리 추가
    </router-link>
    <section>
      <h3>입금 카테고리</h3>
      <ul>
        <li v-for="category in incomeCategories" :key="category.id">
          <div>
            <router-link
              :to="{
                name: 'mypage/category/edit',
                params: { id: category.id },
              }"
            >
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
                  :style="{ backgroundColor: category.color }"
                >
                  <i
                    :class="['bi', category.icon]"
                    style="color: white; font-size: 32px"
                  ></i>
                </div>
              </section>
              {{ category.name }}</router-link
            >
          </div>
        </li>
      </ul>
    </section>

    <section>
      <h3>지출 카테고리</h3>
      <ul>
        <li v-for="category in expenseCategories" :key="category.id">
          <div>
            <router-link
              :to="{
                name: 'mypage/category/edit',
                params: { id: category.id },
              }"
              ><section style="text-align: center; margin: 20px 0">
                <div
                  style="
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                  "
                  :style="{ backgroundColor: category.color }"
                >
                  <i
                    :class="['bi', category.icon]"
                    style="color: white; font-size: 32px"
                  ></i>
                </div>
              </section>
              {{ category.name }}</router-link
            >
          </div>
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
const goMypage = () => {
  console.log('마이페이지로 돌아갑니다.');
  router.push({ name: 'mypage' });
};

// 2. 데이터 가져오기
// onMounted(() => {
//   fetch('/api/categories?userId=1')
//     .then((res) => res.json())
//     .then((data) => {
//       categories.value = data;
//     })
//     .catch((err) => console.error('데이터 로딩 실패:', err));
// });

// 3. 타입별 필터링
const incomeCategories = computed(() =>
  categories.value.filter((c) => c.type === 'income'),
);
const expenseCategories = computed(() =>
  categories.value.filter((c) => c.type === 'expense'),
);
</script>
