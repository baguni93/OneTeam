<template>
  <div class="row">
    <div class="col p-3">
      <h2>{{ ts }}</h2>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <div class="form-group" style="background-color: aqua">
        <label> ₩ : </label>
        <input
          type="number"
          class="form-control"
          v-model.number="budgetItem.amount"
        />
      </div>
      <div class="form-group" style="background-color: cadetblue">
        <label> 메모 : </label>
        <input type="text" class="form-control" v-model="budgetItem.memo" />
      </div>
      <div class="form-group">
        <button
          type="button"
          class="btn btn-primary m-1"
          @click="
            router.push({
              path: '/transaction/select/category',
              state: {
                amount: budgetItem.amount,
                categoryType: 'income',
              },
            })
          "
        >
          입금
        </button>
        <button
          type="button"
          class="btn btn-primary m-1"
          @click="
            router.push({
              path: '/transaction/select/category',
              state: {
                amount: budgetItem.amount,
                categoryType: 'expense',
              },
            })
          "
        >
          지출
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
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const ts = new Date();

const router = useRouter();

const budgetItem = reactive({
  date: new Date().toDateString(),
  categoryId: '',
  amount: 0,
  memo: '',
});
</script>
