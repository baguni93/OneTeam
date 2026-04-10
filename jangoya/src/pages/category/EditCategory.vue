<template>
  <div>
    <header>
      <button @click="router.push({ name: 'mypage/category' })">
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
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const categoryId = route.params.id;
const userStore = useUserStore();

const categoryData = ref({
  name: '',
  icon: '',
  color: '',
  type: '',
});

// 1. 페이지가 열릴 때 기존 데이터 불러오기 (✨ fetch를 axios로 통일!)
onMounted(async () => {
  try {
    const res = await axios.get(`/api/categories/${categoryId}`);
    categoryData.value = res.data; // ✨ axios는 .data로 바로 꺼냅니다!

    if (route.query.name) categoryData.value.name = route.query.name;
    if (route.query.icon) categoryData.value.icon = route.query.icon;
    if (route.query.color) categoryData.value.color = route.query.color;
  } catch (err) {
    console.error('데이터 로딩 실패:', err);
  }
});

// 2. 아이콘 변경 페이지로 이동
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

// 3. 중복 검문소
const checkAndUpdate = async () => {
  if (!categoryData.value.name.trim()) {
    alert('이름을 입력해주세요!');
    return;
  }

  try {
    const response = await axios.get('/api/categories', {
      params: {
        userId: userStore.getCurrentUser().id,
      },
    });

    // ✨ axios는 .json() 안 씁니다!
    const existingCategories = response.data;

    const isDuplicate = existingCategories.some((category) => {
      return (
        category.name === categoryData.value.name &&
        String(category.id) !== String(categoryId) &&
        category.type === categoryData.value.type
      );
    });

    if (isDuplicate) {
      alert('이미 존재하는 카테고리 이름입니다. 다른 이름을 입력해주세요.');
      return;
    }

    updateCategory();
  } catch (error) {
    console.error('중복 검사 중 에러 발생:', error);
  }
};

// 4. 진짜 수정 완료 요청 (PATCH)
const updateCategory = async () => {
  try {
    const updatedData = {
      ...categoryData.value,
      userId: userStore.getCurrentUser().id, // ✨ 1 대신 유저 스토어 사용!
    };

    // ✨ 중괄호 빼고 updatedData 덩어리만 쏙 던져줍니다!
    await axios.patch(`/api/categories/${categoryId}`, updatedData);

    alert('카테고리가 수정되었습니다!');
    router.push('/mypage/category');
  } catch (err) {
    // ✨ 점(.) 빼고 올바른 try...catch 문법 적용!
    console.error('수정 실패:', err);
  }
};

// 5. 삭제 버튼
const deleteCategory = async () => {
  try {
    await axios.delete(`/api/categories/${categoryId}`);

    alert('카테고리가 삭제되었습니다.');
    router.push('/mypage/category');
  } catch (err) {
    // ✨ 점(.) 빼고 올바른 try...catch 문법 적용!
    console.error('삭제 실패:', err);
  }
};
</script>
