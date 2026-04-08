<template>
  <div>
    <header>
      <button @click="router.back()">
        <i class="bi bi-arrow-left"></i> 카테고리 홈으로 돌아가기
      </button>

      <h2>카테고리 추가</h2>

      <button @click="submitCategory">완료</button>
    </header>

    <section @click="goToIconSelect">
      <div>
        <i :class="['bi', selectedIcon]"></i>
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
const selectedIcon = ref('bi-star'); // 기본 아이콘
const selectedColor = ref('black'); // 기본 색상

// 아이콘 선택 페이지로 이동 (이름 들고 가기)
const goToIconSelect = () => {
  router.push({
    name: 'categoryicon',
    query: {
      name: categoryName.value,
    },
  });
};

// 아이콘 페이지에서 돌아왔을 때 데이터 복구
onMounted(() => {
  if (route.query.name) categoryName.value = route.query.name;
  if (route.query.icon) selectedIcon.value = route.query.icon;
  if (route.query.color) selectedColor.value = route.query.color;
});

// 완료 버튼 (POST 요청)
const submitCategory = () => {
  if (!categoryName.value) {
    alert('이름을 입력해주세요!');
    return;
  }

  const newCategory = {
    userId: '1',
    type: 'expense',
    name: categoryName.value,
    color: selectedColor.value,
    icon: selectedIcon.value,
  };

  fetch('http://localhost:3000/categories', {
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
