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
      <button @click="handleBack">
        <i class="bi bi-arrow-left"></i> 뒤로가기
      </button>

      <h2>카테고리 수정</h2>
      <h3>{{ categoryStore.draft.type === 'expense' ? '지출' : '입금' }}</h3>

      <div style="display: flex; gap: 10px">
        <button @click="deleteCategory" style="color: red">삭제</button>
        <button @click="checkAndUpdate">완료</button>
      </div>
    </header>

    <section
      @click="goToIconSelect"
      style="text-align: center; margin: 20px 0; cursor: pointer"
    >
      <div
        style="
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        "
        :style="{ backgroundColor: categoryStore.draft.color }"
      >
        <i
          :class="['bi', categoryStore.draft.icon]"
          style="color: white; font-size: 32px"
        ></i>
      </div>
      <p style="margin-top: 10px; color: #666">아이콘 변경</p>
    </section>

    <section style="padding: 0 20px">
      이름 :
      <input
        type="text"
        v-model="categoryStore.draft.name"
        style="padding: 5px"
      />
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/categoryStore';
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();
const userStore = useUserStore();
const categoryId = route.params.id;

// 1. 페이지가 열릴 때 데이터 세팅
onMounted(async () => {
  // ✨ [핵심 방어 로직]
  // 서랍에 있는 ID와 주소창의 ID가 다를 때만 서버에서 데이터를 가져옵니다.
  // 이렇게 해야 아이콘을 고르고 돌아왔을 때 데이터가 초기화되지 않아요!
  if (String(categoryStore.draft.id) !== String(categoryId)) {
    try {
      await categoryStore.fetchCategory(categoryId);
    } catch (err) {
      alert('데이터를 불러오지 못했습니다.');
      router.push('/mypage/category');
    }
  }
});

// 뒤로 가기 처리
const handleBack = () => {
  categoryStore.resetDraft(); // 취소할 땐 서랍 비우기
  router.push({ name: 'mypage/category' });
};

// 2. 아이콘 선택 페이지로 이동
const goToIconSelect = () => {
  // query 데이터 싹 지우고 이름만으로 깔끔하게 이동!
  router.push({ name: 'categoryicon' });
};

// 3. 중복 검문소
const checkAndUpdate = async () => {
  const { name, type } = categoryStore.draft;

  if (!name.trim()) {
    alert('이름을 입력해주세요!');
    return;
  }

  try {
    // 중복 검사용 데이터 호출
    const response = await axios.get('/api/categories', {
      params: { userId: userStore.getCurrentUser().id },
    });

    const isDuplicate = response.data.some((category) => {
      return (
        category.name === name &&
        String(category.id) !== String(categoryId) && // 자기 자신은 중복 검사에서 제외!
        category.type === type
      );
    });

    if (isDuplicate) {
      alert('이미 존재하는 카테고리 이름입니다. 다른 이름을 입력해주세요.');
      return;
    }

    // 통과하면 진짜 수정 함수 실행
    await updateCategory();
  } catch (error) {
    console.error('중복 검사 중 에러 발생:', error);
  }
};

// 4. 진짜 수정 완료 요청 (스토어 액션 사용)
const updateCategory = async () => {
  try {
    // ✨ axios 로직은 스토어가 알아서 해줍니다!
    await categoryStore.updateCategory();

    alert('카테고리가 수정되었습니다!');
    categoryStore.resetDraft(); // 작업 완료 후 서랍 비우기
    router.push('/mypage/category');
  } catch (err) {
    alert('수정 중 오류가 발생했습니다.');
  }
};

// 5. 삭제 버튼 (스토어 액션 사용)
const deleteCategory = async () => {
  if (confirm('정말 이 카테고리를 삭제하시겠습니까?')) {
    try {
      // ✨ 파라미터로 id만 넘겨주면 스토어가 알아서 삭제해줍니다!
      await categoryStore.deleteCategory(categoryId);

      alert('카테고리가 삭제되었습니다.');
      router.push('/mypage/category');
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  }
};
</script>
