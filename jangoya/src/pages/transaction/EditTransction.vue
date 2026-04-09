<template>
  <div class="row">
    <div class="col p-3">
      <h2>{{ editType }}</h2>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <div>
        <button
          @click="
            router.push({
              path: `/transaction/edit/${currentRoute.params.id}/modalcategory`,
              state: {
                categoryType: matchedBudgetsItem.type,
              },
            })
          "
        >
          {{ categoryItem?.name }} {{ categoryItem?.id }}
        </button>
      </div>

      <div class="form-group">
        <label>금액:</label>
        <input type="text" class="form-control" v-model="budgetItem.amount" />
      </div>
      <div class="form-group">
        <label>메모:</label>
        <textarea
          class="form-control"
          rows="3"
          v-model="budgetItem.memo"
        ></textarea>
      </div>

      <div class="form-group">
        <button
          type="button"
          class="btn btn-primary m-1"
          @click="updateBudgetHandler"
        >
          수 정
        </button>
        <button
          type="button"
          class="btn btn-primary m-1"
          @click="router.push('/')"
        >
          취 소
        </button>
      </div>
    </div>
  </div>

  <router-view />
</template>

<script setup>
//날짜 변경
//카테고리 모달
//카테고리 변경

import { inject, reactive, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const budgets = inject('budgets');
const { updateBudget } = inject('actions');
const router = useRouter();
const currentRoute = useRoute();

const matchedBudgetsItem = budgets.value.find(
  (item) => item.id === currentRoute.params.id,
);

console.log(matchedBudgetsItem.type);

if (!matchedBudgetsItem) {
  router.push('/');
}
let categories = inject('categories');

const budgetItem = reactive({ ...matchedBudgetsItem });

watch(
  () => currentRoute.query.categoryId,
  (newId) => {
    if (newId) {
      budgetItem.categoryId = newId;
    }
  },
  { immediate: true },
);
const categoryItem = computed(() => {
  return categories.value.find((x) => x.id === budgetItem.categoryId);
});

const editType =
  matchedBudgetsItem.type === 'income' ? '입금 영수승' : '지출 영수증';

const updateBudgetHandler = () => {
  updateBudget({ ...budgetItem }, () => {
    router.push('/');
  });
};
</script>
