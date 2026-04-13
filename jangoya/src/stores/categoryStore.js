import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

export const useCategoryStore = defineStore('category', () => {
  const userStore = useUserStore();

  // 수정/추가용 ***딱 1개***
  const draft = ref({
    id: null,
    name: '',
    type: 'expense',
    icon: 'bi-star',
    color: '#000000',
  });

  // 2. 전체 목록 상자 (State - 화면에 뿌려줄 배열)
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

  // [GET] 1. 전체 목록 가져오기 (Category.vue 리스트 렌더링용)
  const fetchCategoryList = async () => {
    try {
      const res = await axios.get('/api/categories', {
        params: { userId: getUserId() },
      });
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

      await fetchCategoryList();
    } catch (err) {
      console.error('카테고리 삭제 실패:', err);
      throw err;
    }
  };

  return {
    draft,
    categoryList,
    resetDraft,
    fetchCategoryList,
    fetchCategory,
    saveCategory,
    updateCategory,
    deleteCategory,
  };
});
