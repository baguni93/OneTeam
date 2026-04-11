import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

export const useCategoryStore = defineStore('category', () => {
  const userStore = useUserStore();

  // 1. 임시 작업대 (State - 수정/추가용 딱 1개)
  const draft = ref({
    id: null,
    name: '',
    type: 'expense',
    icon: 'bi-star',
    color: '#000000',
  });

  // ✨ 2. 전체 목록 상자 (State - 화면에 뿌려줄 배열)
  const categoryList = ref([]);

  const resetDraft = () => {
    draft.value = {
      id: null,
      name: '',
      type: 'expense',
      icon: 'bi-star',
      color: '#000000',
    };
  };

  const getUserId = () => userStore.getCurrentUser().id;



  // ✨ [GET] 1. 전체 목록 가져오기 (Category.vue 리스트 렌더링용)
  const fetchCategoryList = async () => {
    try {
      // json-server는 params로 넘기면 자동으로 필터링해서 배열을 줍니다!
      // ex) /api/categories?userId=123
      const res = await axios.get('/api/categories', {
        params: { userId: getUserId() },
      });
      // 가져온 배열 데이터를 스토어의 큰 상자에 담습니다.
      categoryList.value = res.data;
    } catch (err) {
      console.error('카테고리 목록 조회 실패:', err);
    }
  };

  // [GET] 2. 단건 조회 (EditCategory.vue 수정 페이지용)
  const fetchCategory = async (id) => {
    try {
      const res = await axios.get(`/api/categories/${id}`);
      draft.value = { ...res.data };
      return res.data;
    } catch (err) {
      console.error('카테고리 단건 조회 실패:', err);
      throw err;
    }
  };

  // [POST] 새 카테고리 저장
  const saveCategory = async () => {
    try {
      const payload = {
        ...draft.value,
        userId: getUserId(),
      };
      await axios.post('/api/categories', payload);
      resetDraft();

      // 💡 센스 추가: 새로운 걸 저장했으니 목록을 다시 불러와서 최신화!
      await fetchCategoryList();
    } catch (err) {
      console.error('카테고리 저장 실패:', err);
      throw err;
    }
  };

  // [PATCH] 카테고리 정보 수정
  const updateCategory = async () => {
    try {
      await axios.patch(`/api/categories/${draft.value.id}`, draft.value);

      // 💡 센스 추가: 수정이 끝났으니 목록 다시 최신화!
      await fetchCategoryList();
    } catch (err) {
      console.error('카테고리 수정 실패:', err);
      throw err;
    }
  };

  // [DELETE] 카테고리 삭제
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      resetDraft();

      // 💡 센스 추가: 삭제했으니 목록 다시 최신화!
      await fetchCategoryList();
    } catch (err) {
      console.error('카테고리 삭제 실패:', err);
      throw err;
    }
  };

  return {
    draft,
    categoryList, // ✨ 추가됨
    resetDraft,
    fetchCategoryList, // ✨ 추가됨
    fetchCategory,
    saveCategory,
    updateCategory,
    deleteCategory,
  };
});
