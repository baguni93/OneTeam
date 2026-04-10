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
        <button
          type="button"
          class="btn btn-primary m-1"
          @click="deleteBudgetHandler"
        >
          삭제
        </button>
      </div>
    </div>
  </div>

  <router-view />
</template>

<script setup>
import { reactive, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useBudgetStore } from '@/stores/dateStore';
import { storeToRefs } from 'pinia';

const budgetStore = useBudgetStore();
const { budgets, categories } = storeToRefs(budgetStore);
const { updateBudget, deleteBudget } = budgetStore;

const router = useRouter();
const currentRoute = useRoute();

const matchedBudgetsItem = computed(() => {
  return budgets.value.find(
    (item) => item.id === Number(currentRoute.params.id),
  );
});

watch(
  matchedBudgetsItem,
  (item) => {
    if (!item) {
      router.push('/');
    }
  },
  { immediate: true },
);

const budgetItem = reactive({ ...matchedBudgetsItem.value });

watch(
  () => currentRoute.query.categoryId,
  (newId) => {
    if (newId) {
      budgetItem.categoryId = Number(newId);
    }
  },
  { immediate: true },
);

const categoryItem = computed(() => {
  return categories.value.find((x) => x.id === budgetItem.categoryId);
});

const editType =
  budgetItem.type === 'income' ? '수입 내역 수정 ' : '지출 내역 수정';

const updateBudgetHandler = () => {
  updateBudget({ ...budgetItem }, () => {
    router.push('/');
  });
};

const deleteBudgetHandler = () => {
  deleteBudget(budgetItem.id, () => {
    router.push('/');
  });
};
</script>
