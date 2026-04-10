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
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';

const router = useRouter();
const categoryStore = useCategoryStore();
const userStore = useUserStore();

onMounted(() => {
  // 💡 만약 리스트 페이지에서 갓 넘어온 상태라면 서랍을 비워줍니다.
  // (아이콘 페이지에서 돌아온 게 아닐 때만 초기화하기 위함)
  // 이 로직은 보통 '리스트 페이지'의 추가 버튼에서 resetDraft()를 부르고 오는 게 더 깔끔합니다!
});

// 아이콘 선택 페이지로 이동 (더 이상 query를 주렁주렁 달지 않습니다!)
const goToIconSelect = () => {
  router.push({ name: 'categoryicon' });
};

// 뒤로 가기 처리
const handleBack = () => {
  categoryStore.resetDraft(); // 취소하고 나갈 때는 서랍을 비워줍니다.
  router.back();
};

// 1. 중복 확인 로직 (Store의 데이터를 기준으로 검사)
const checkAndSubmit = async () => {
  const { name, type } = categoryStore.draft;

  if (!name.trim()) {
    alert('이름을 입력해주세요!');
    return;
  }

  try {
    const response = await axios.get('/api/categories', {
      params: { userId: userStore.getCurrentUser().id },
    });

    const isDuplicate = response.data.some((cat) => {
      return cat.name === name && cat.type === type;
    });

    if (isDuplicate) {
      alert('이미 존재하는 카테고리 이름입니다.');
      return;
    }

    // 중복 통과 시 저장 실행
    await submitCategory();
  } catch (error) {
    console.error('중복 검사 에러:', error);
  }
};

// 2. 진짜 저장 로직 (Store의 Action을 호출!)
const submitCategory = async () => {
  try {
    const userId = userStore.getCurrentUser().id;

    // ✨ 피니아 스토어에 미리 만들어둔 saveCategory 액션을 호출합니다!
    await categoryStore.saveCategory(userId);

    alert('카테고리가 성공적으로 추가되었습니다!');
    router.back(); // 카테고리 홈으로 복귀
  } catch (err) {
    console.error('추가 실패:', err);
    alert('저장 중 오류가 발생했습니다.');
  }
};
</script>
