<template>
  <div>
    <header>
      <button @click="router.back()">
        <i class="bi bi-arrow-left"></i> 카테고리 홈으로 돌아가기
      </button>

      <h2>카테고리 추가</h2>

      <button @click="checkAndSubmit">완료</button>
    </header>

    <section style="margin: 20px 0">
      <label>
        <input type="radio" value="income" v-model="categoryType" /> 입금
      </label>
      <label>
        <input type="radio" value="expense" v-model="categoryType" /> 지출
      </label>
    </section>

    <section @click="goToIconSelect" style="text-align: center; margin: 20px 0">
      <div
        style="
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        "
        :style="{ backgroundColor: selectedColor }"
      >
        <i
          :class="['bi', selectedIcon]"
          style="color: white; font-size: 32px"
        ></i>
      </div>
      <p>아이콘 변경</p>
    </section>

    <section>
      이름 :
      <input
        type="text"
        v-model="categoryName"
        placeholder="카테고리 이름 입력"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

// ✨ 1. axios를 꼭 import 해주세요!
import axios from 'axios';

const router = useRouter();
const route = useRoute();

// 데이터 상태 관리
const categoryName = ref('');
const selectedIcon = ref('bi-star');
const selectedColor = ref('black');
const categoryType = ref('expense');
const userStore = useUserStore();

const goToIconSelect = () => {
  router.push({
    name: 'categoryicon',
    query: {
      name: categoryName.value,
      type: categoryType.value,
      color: selectedColor.value,
      icon: selectedIcon.value,
      origin: 'mypage/category/add',
    },
  });
};

onMounted(() => {
  if (route.query.name) categoryName.value = route.query.name;
  if (route.query.type) categoryType.value = route.query.type;
  if (route.query.icon) selectedIcon.value = route.query.icon;
  if (route.query.color) selectedColor.value = route.query.color;
});

// 1. 중복 확인
const checkAndSubmit = async () => {
  if (!categoryName.value.trim()) {
    alert('이름을 입력해주세요!');
    return;
  }

  try {
    const response = await axios.get('/api/categories', {
      params: {
        userId: userStore.getCurrentUser().id,
      },
    });

    const existingCategories = response.data;

    const isDuplicate = existingCategories.some((category) => {
      return (
        category.name === categoryName.value &&
        category.type === categoryType.value
      );
    });

    if (isDuplicate) {
      alert('이미 존재하는 카테고리 이름입니다. 다른 이름을 입력해주세요.');
      return;
    }

    // 통과했다면 진짜 저장/수정 함수 실행!
    submitCategory(); // ✨ 세미콜론(;) 추가
  } catch (error) {
    console.error('중복 검사 중 에러 발생:', error);
  }
};

// ✅ 2. 진짜 저장 함수 (try...catch 문법 깔끔하게 정리!)
const submitCategory = async () => {
  try {
    const newCategory = {
      userId: userStore.getCurrentUser().id,
      type: categoryType.value,
      name: categoryName.value,
      color: selectedColor.value,
      icon: selectedIcon.value,
    };

    // ✨ 2. POST는 params 없이 데이터를 바로 두 번째 자리에 던져줍니다!
    await axios.post('/api/categories', newCategory);

    // ✨ 3. await로 통신이 끝날 때까지 기다렸다가 성공하면 아래 코드가 실행됩니다.
    alert('카테고리가 추가되었습니다!');
    router.back();
  } catch (err) {
    // ✨ 에러가 나면 이쪽으로 빠집니다.
    console.error('추가 실패:', err);
  }
};
</script>
