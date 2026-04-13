<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <!-- 헤더 -->
        <div class="text-center mb-4">
          <h3>거래 추가</h3>
          <small class="text-muted">{{ dateStore.selectedDate }}</small>
        </div>

        <!-- 카드 -->
        <div class="card shadow-sm">
          <div class="card-body">
            <!-- 금액 -->
            <div class="mb-3">
              <label class="form-label">금액</label>
              <input
                type="number"
                class="form-control form-control-lg"
                v-model.number="budgetItem.amount"
                placeholder="₩ 금액 입력"
              />
            </div>

            <!-- 메모 -->
            <div class="mb-4">
              <label class="form-label">메모</label>
              <input
                type="text"
                class="form-control"
                v-model="budgetItem.memo"
                placeholder="예: 점심, 월급, 커피"
              />
            </div>

            <!-- 버튼 -->
            <div class="d-grid gap-2">
              <button
                class="btn btn-success"
                @click="
                  router.push({
                    path: '/transaction/select/category',
                    state: {
                      amount: budgetItem.amount,
                      memo: budgetItem.memo,
                      categoryType: 'income',
                    },
                  })
                "
              >
                + 입금
              </button>

              <button
                class="btn btn-danger"
                @click="
                  router.push({
                    path: '/transaction/select/category',
                    state: {
                      amount: budgetItem.amount,
                      memo: budgetItem.memo,
                      categoryType: 'expense',
                    },
                  })
                "
              >
                - 지출
              </button>

              <button
                class="btn btn-outline-secondary"
                @click="router.push('/')"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useDateStore } from '@/stores/dateStore';
const dateStore = useDateStore();
const router = useRouter();

const budgetItem = reactive({
  date: dateStore.selectedDate,
  categoryId: '',
  amount: 0,
  memo: '',
});
</script>
