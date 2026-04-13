<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <!-- 헤더 -->
        <div class="text-center mb-4">
          <h3>{{ editType }}</h3>
          <small class="text-muted">거래 수정</small>
        </div>

        <!-- 카드 -->
        <div class="card shadow-sm">
          <div class="card-body">
            <!-- 카테고리 -->
            <div class="mb-3">
              <label class="form-label">카테고리</label>

              <button
                class="btn btn-light w-100 d-flex justify-content-between align-items-center"
                @click="
                  router.push({
                    path: `/transaction/edit/${currentRoute.params.id}/modalcategory`,
                    state: {
                      categoryType: matchedBudgetsItem.type,
                    },
                  })
                "
              >
                <span class="fw-semibold text-truncate">
                  {{ categoryItem?.name }}
                </span>

                <span class="badge bg-secondary">선택</span>
              </button>
            </div>

            <!-- 금액 -->
            <div class="mb-3">
              <label class="form-label">금액</label>
              <input
                type="number"
                class="form-control form-control-lg"
                v-model="budgetItem.amount"
              />
            </div>

            <!-- 메모 -->
            <div class="mb-4">
              <label class="form-label">메모</label>
              <input
                type="text"
                class="form-control"
                v-model="budgetItem.memo"
              />
            </div>

            <!-- 버튼 -->
            <div class="d-grid gap-2">
              <button class="btn btn-primary" @click="updateBudgetHandler">
                수정
              </button>

              <button
                class="btn btn-outline-secondary"
                @click="router.push('/')"
              >
                취소
              </button>

              <button
                class="btn btn-outline-danger"
                @click="deleteBudgetHandler"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
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
import { useCategoryStore } from '@/stores/categoryStore';
const categoryStore = useCategoryStore();
const { categoryList } = storeToRefs(categoryStore);

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
    if (!item) router.push('/');
  },
  { immediate: true },
);

const budgetItem = reactive({ ...matchedBudgetsItem.value });
const categoryId = computed(() => {
  if (currentRoute.query.categoryId !== undefined) {
    return String(currentRoute.query.categoryId);
  }
  return String(budgetItem.categoryId);
});
const categoryItem = computed(() => {
  return categoryList.value.find(
    (x) => String(x.id) === String(categoryId.value),
  );
});
watch(categoryId, (val) => {
  if (val) {
    budgetItem.categoryId = val;
  }
});
const editType = budgetItem.type === 'income' ? '수입' : '지출';

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
