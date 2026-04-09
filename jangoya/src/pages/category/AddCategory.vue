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

const router = useRouter();
const route = useRoute();

// 데이터 상태 관리
const categoryName = ref('');
const selectedIcon = ref('bi-star');
const selectedColor = ref('black');
const categoryType = ref('expense');

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
});

// 1. 중복 확인
const checkAndSubmit = async () => {
  if (!categoryName.value.trim()) {
    alert('이름을 입력해주세요!');
    return;
  }

  try {
    const response = await fetch('/api/categories?userId=1');
    const existingCategories = await response.json();

    const isDuplicate = existingCategories.some((category) => {
      return category.name === categoryName.value && category.type===categoryType.value;
    });

    if (isDuplicate) {
      alert('이미 존재하는 카테고리 이름입니다. 다른 이름을 입력해주세요.');
      return;
    }

    // 검문을 무사히 통과하면 아래에 있는 2번 함수를 호출합니다!
    submitCategory();
  } catch (error) {
    console.error('중복 검사 중 에러 발생:', error);
  }
};

// ✅ 2. 진짜 저장 함수 (얘도 독립적으로 밖으로 빼냈습니다)
const submitCategory = () => {
  const newCategory = {
    userId: '1',
    type: categoryType.value,
    name: categoryName.value,
    color: selectedColor.value,
    icon: selectedIcon.value,
  };

  fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCategory),
  })
    .then((res) => res.json())
    .then((data) => {
      alert('카테고리가 추가되었습니다!');
      router.back();
    })
    .catch((err) => console.error('추가 실패:', err));
};
</script>
