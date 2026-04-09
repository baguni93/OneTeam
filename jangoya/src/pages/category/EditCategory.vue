<template>
  <div>
    <header>
      <button @click="router.back()">
        <i class="bi bi-arrow-left"></i> 뒤로가기
      </button>

      <h2>카테고리 수정</h2>
      <h3>{{ categoryData.type === 'expense' ? '지출' : '입금' }}</h3>

      <button @click="deleteCategory">삭제</button>

      <button @click="checkAndUpdate">완료</button>
    </header>

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
        :style="{ backgroundColor: categoryData.color }"
      >
        <i
          :class="['bi', categoryData.icon]"
          style="color: white; font-size: 32px"
        ></i>
      </div>
      <p>아이콘 변경</p>
    </section>

    <section>이름 : <input type="text" v-model="categoryData.name" /></section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const categoryId = route.params.id;

// 카테고리 데이터를 담을 상태
const categoryData = ref({
  name: '',
  icon: '',
  color: '',
  type: '',
});

// 1. 페이지가 열릴 때 기존 데이터 불러오기
onMounted(() => {
  fetch(`/api/categories/${categoryId}`)
    .then((res) => res.json())
    .then((data) => {
      categoryData.value = data;

      // 아이콘 변경 페이지에 갔다가 돌아온 것이라면, 새 데이터로 덮어씌우기
      if (route.query.name) categoryData.value.name = route.query.name;
      if (route.query.icon) categoryData.value.icon = route.query.icon;
      if (route.query.color) categoryData.value.color = route.query.color;
    })
    .catch((err) => console.error('데이터 로딩 실패:', err));
});

// 2. 아이콘 변경 페이지로 이동 (현재 입력된 값 들고 가기)
const goToIconSelect = () => {
  router.push({
    name: 'categoryicon',
    query: {
      name: categoryData.value.name,
      icon: categoryData.value.icon,
      color: categoryData.value.color,
      type: categoryData.value.type,
      id: categoryId,
      origin: 'mypage/category/edit',
    },
  });
};

// 🚨 3. 중복 검문소: 빈 값과 이름 중복을 먼저 확인합니다.
const checkAndUpdate = async () => {
  // 빈 값 방지
  if (!categoryData.value.name.trim()) {
    alert('이름을 입력해주세요!');
    return;
  }

  try {
    // 유저 1번의 전체 카테고리 목록 가져오기
    const response = await fetch(`/api/categories?userId=${1}`);
    const existingCategories = await response.json();

    // 중복 검사: 이름이 똑같으면서 && 동시에 내 카테고리가 아닌 녀석이 있는지 검사!
    const isDuplicate = existingCategories.some((category) => {
      return (
        category.name === categoryData.value.name &&
        String(category.id) !== String(categoryId)
      );
    });

    if (isDuplicate) {
      alert('이미 존재하는 카테고리 이름입니다. 다른 이름을 입력해주세요.');
      return;
    }

    // 무사히 통과했다면 진짜 수정 함수 실행!
    updateCategory();
  } catch (error) {
    console.error('중복 검사 중 에러 발생:', error);
  }
};

// ✅ 4. 진짜 수정 완료 요청 (PATCH)
const updateCategory = () => {
  // 기존 데이터에 userId를 묶어서 포장
  const updatedData = {
    ...categoryData.value,
    userId: 1,
  };

  // ✨ 바뀐 부분: PATCH 방식으로 통신합니다.
  fetch(`/api/categories/${categoryId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  })
    .then((res) => res.json())
    .then(() => {
      alert('카테고리가 수정되었습니다!');
      router.push('/mypage/category'); // 완료 후 카테고리 홈으로 이동
    })
    .catch((err) => console.error('수정 실패:', err));
};

// 5. 삭제 버튼: 데이터 삭제 요청 (DELETE)
const deleteCategory = () => {
  fetch(`/api/categories/${categoryId}`, {
    method: 'DELETE',
  })
    .then(() => {
      alert('카테고리가 삭제되었습니다.');
      router.push('/mypage/category');
    })
    .catch((err) => console.error('삭제 실패:', err));
};
</script>
