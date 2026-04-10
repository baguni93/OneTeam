<template>
  <div>
    <header
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <button @click="handleBack">
        <i class="bi bi-arrow-left"></i> 뒤로가기
      </button>
      <h2>카테고리 추가</h2>
      <button @click="checkAndSubmit">완료</button>
    </header>

    <section style="margin: 20px 0">
      <label>
        <input type="radio" value="income" v-model="categoryStore.draft.type" />
        입금
      </label>
      <label>
        <input
          type="radio"
          value="expense"
          v-model="categoryStore.draft.type"
        />
        지출
      </label>
    </section>

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

    <section>
      이름 :
      <input
        type="text"
        v-for-model="categoryStore.draft.name"
        v-model="categoryStore.draft.name"
        placeholder="카테고리 이름 입력"
      />
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/categoryStore';
// ✨ axios, useUserStore 삭제! (스토어가 다 알아서 합니다)

const router = useRouter();
const categoryStore = useCategoryStore();

onMounted(() => {});

const goToIconSelect = () => {
  router.push({ name: 'categoryicon' });
};

const handleBack = () => {
  categoryStore.resetDraft();
  router.back();
};

const checkAndSubmit = async () => {
  const { name, type } = categoryStore.draft;

  if (!name.trim()) {
    alert('이름을 입력해주세요!');
    return;
  }

  try {
    // 💡 혹시 모르니 가장 최신 목록으로 한번 갱신해주고
    await categoryStore.fetchCategoryList();

    // 💡 스토어에 있는 배열(categoryList)을 검사합니다! (속도 향상)
    const isDuplicate = categoryStore.categoryList.some((cat) => {
      return cat.name === name && cat.type === type;
    });

    if (isDuplicate) {
      alert('이미 존재하는 카테고리 이름입니다.');
      return;
    }

    await submitCategory();
  } catch (error) {
    console.error('중복 검사 에러:', error);
  }
};

const submitCategory = async () => {
  try {
    // 💡 괄호 안에 아무것도 안 넣어도 됩니다!
    await categoryStore.saveCategory();
    alert('카테고리가 성공적으로 추가되었습니다!');
    router.back();
  } catch (err) {
    alert('저장 중 오류가 발생했습니다.');
  }
};
</script>
