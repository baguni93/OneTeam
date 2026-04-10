<template>
  <div class="p-3">
    <h2>🧪 필터 테스트 샌드박스 (Pinia 버전)</h2>
    <hr />

    <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px">
      <h4>✅ 현재 피니아에 저장된 결과:</h4>
      <p>
        배열 형태: <strong>{{ filterStore.appliedIds }}</strong>
      </p>
    </div>

    <div style="margin-top: 20px">
      <button @click="goToFilterPage">필터 설정 페이지로 이동하기</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useFilterStore } from '@/stores/filterStore'; // ✨ 피니아 추가

const router = useRouter();
const filterStore = useFilterStore(); // ✨ 스토어 활성화

const goToFilterPage = () => {
  // 라우터 설정에 등록된 필터 페이지 주소로 이동
  router.push({ name: 'category/filter' });
};
</script>
