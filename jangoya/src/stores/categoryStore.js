import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore'; // ✨ 유저 스토어 가져오기

// 💡 주석 해제 및 export 추가! 이 부분이 있어야 외부에서 스토어를 쓸 수 있습니다.
export const useCategoryStore = defineStore('category', () => {
  const userStore = useUserStore(); // ✨ 스토어 안에서 유저 스토어 활성화

  // 1. 임시 작업대 (State)
  const draft = ref({
    id: null,
    name: '',
    type: 'expense',
    icon: 'bi-star',
    color: '#000000',
  });

  // 2. 초기화 로직 (Actions)
  const resetDraft = () => {
    draft.value = {
      id: null,
      name: '',
      type: 'expense',
      icon: 'bi-star',
      color: '#000000',
    };
  };

  // ✨ 현재 로그인한 유저의 ID를 가져오는 전용 '치트키'
  const getUserId = () => userStore.getCurrentUser().id;

  // 3. CRUD 통신 로직 (Actions)

  // [GET] 특정 카테고리 정보 가져오기 (수정 페이지 진입 시)
  const fetchCategory = async (id) => {
    try {
      const res = await axios.get(`/api/categories/${id}`);
      draft.value = { ...res.data }; // 서버 데이터를 작업대에 복사
      return res.data;
    } catch (err) {
      console.error('카테고리 조회 실패:', err);
      throw err; // 에러를 던져서 컴포넌트가 알 수 있게 함
    }
  };

  // [POST] 새 카테고리 저장
  const saveCategory = async () => {
    try {
      const payload = {
        ...draft.value,
        userId: getUserId(), // 💡 컴포넌트에서 안 보내줘도 여기서 알아서 붙임!
      };
      await axios.post('/api/categories', payload);
      resetDraft(); // 성공하면 서랍 비우기
    } catch (err) {
      console.error('카테고리 저장 실패:', err);
      throw err;
    }
  };

  // [PATCH] 카테고리 정보 수정
  const updateCategory = async () => {
    try {
      const payload = {
        ...draft.value,
        userId: getUserId(), // 💡 수정할 때도 내 것이 맞는지 확인
      };
      await axios.patch(`/api/categories/${draft.value.id}`, payload);
    } catch (err) {
      console.error('카테고리 수정 실패:', err);
      throw err;
    }
  };

  // [DELETE] 카테고리 삭제
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      resetDraft(); // 삭제했으니 서랍도 비우기
    } catch (err) {
      console.error('카테고리 삭제 실패:', err);
      throw err;
    }
  };

  // 4. 외부로 내보내기 (이걸 빼먹으면 다른 파일에서 못 씁니다!)
  return {
    draft,
    resetDraft,
    fetchCategory,
    saveCategory,
    updateCategory,
    deleteCategory,
  };
});
