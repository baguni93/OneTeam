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

  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <div class="header" v-if="filterBudgets.length <= 0">
            지출 내역이 없어요.
          </div>
          <ul class="list-group" style="background-color: aqua">
            <TrasctionItem
              v-for="budgetItem in filterBudgets"
              :key="budgetItem.id"
              :budgetItem="budgetItem"
            ></TrasctionItem>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useFilterStore } from '@/stores/filterStore'; // ✨ 피니아 추가

const router = useRouter();
const filterStore = useFilterStore(); // ✨ 스토어 활성화

//budget을 불러옵니다.
import { useBudgetStore } from '@/stores/dateStore';
import TrasctionItem from '@/components/TrasctionItem.vue';
const budgetStore = useBudgetStore();
const { categoryFilterBudgets } = budgetStore;
const filterBudgets = categoryFilterBudgets(2);

const goToFilterPage = () => {
  // 라우터 설정에 등록된 필터 페이지 주소로 이동
  router.push({ name: 'category/filter' });
};
</script>
