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
// ✨ axios, useUserStore 삭제!

const route = useRoute();
const router = useRouter();
const categoryStore = useCategoryStore();
const categoryId = route.params.id;

onMounted(async () => {
  if (String(categoryStore.draft.id) !== String(categoryId)) {
    try {
      await categoryStore.fetchCategory(categoryId);
    } catch (err) {
      alert('데이터를 불러오지 못했습니다.');
      router.push('/mypage/category');
    }
  }
});

const handleBack = () => {
  categoryStore.resetDraft();
  router.push({ name: 'mypage/category' });
};

const goToIconSelect = () => {
  router.push({ name: 'categoryicon' });
};

const checkAndUpdate = async () => {
  const { name, type } = categoryStore.draft;

  if (!name.trim()) {
    alert('이름을 입력해주세요!');
    return;
  }

  try {
    // 💡 스토어 목록 최신화 후 검사
    await categoryStore.fetchCategoryList();

    const isDuplicate = categoryStore.categoryList.some((category) => {
      return (
        category.name === name &&
        String(category.id) !== String(categoryId) &&
        category.type === type
      );
    });

    if (isDuplicate) {
      alert('이미 존재하는 카테고리 이름입니다. 다른 이름을 입력해주세요.');
      return;
    }

    await updateCategory();
  } catch (error) {
    console.error('중복 검사 중 에러 발생:', error);
  }
};

const updateCategory = async () => {
  try {
    await categoryStore.updateCategory();
    alert('카테고리가 수정되었습니다!');
    categoryStore.resetDraft();
    router.push('/mypage/category');
  } catch (err) {
    alert('수정 중 오류가 발생했습니다.');
  }
};

const deleteCategory = async () => {
  if (confirm('정말 이 카테고리를 삭제하시겠습니까?')) {
    try {
      await categoryStore.deleteCategory(categoryId);
      alert('카테고리가 삭제되었습니다.');
      router.push('/mypage/category');
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  }
};
</script>
