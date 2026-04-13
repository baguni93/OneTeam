import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFilterStore = defineStore('filter', () => {
  // 사용자가 필터 페이지에서 '임시로' 클릭하고 있는 ID들
  const tempSelectedIds = ref([]);

  // '적용'을 눌러서 확정된 최종 ID들 (리스트 페이지에서 쓸 것)
  const appliedIds = ref([]);

  const toggleSelect = (id) => {
    if (tempSelectedIds.value.includes(id)) {
      tempSelectedIds.value = tempSelectedIds.value.filter(
        (itemId) => itemId !== id,
      );
    } else {
      tempSelectedIds.value.push(id);
    }
  };

  // 적용 버튼 누를 때 실행: 임시 저장된 걸 최종 저장소로 복사
  const confirmFilter = (sortedIds) => {
    appliedIds.value = sortedIds;
  };

  return { tempSelectedIds, appliedIds, toggleSelect, confirmFilter };
});
