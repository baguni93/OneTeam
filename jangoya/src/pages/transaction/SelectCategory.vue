<template>
  <div>여기는 {{ type }} 카테고리 선택 페이지입니다.</div>
  <div>{{ amount }}</div>

  <ul class="list-group">
    <li
      v-for="categoryItem in categoriesTest"
      :key="categoryItem.id"
      @click="addTodoHandler(categoryItem.id)"
    >
      <div style="background-color: blue">
        카테고리 Id : {{ categoryItem.id }} / 카테고리 이름 :
        {{ categoryItem.name }} 카테고리 타입 : {{ categoryItem.type }}
      </div>
      <br />
    </li>
  </ul>

  <div class="form-group">
    <button
      type="button"
      class="btn btn-primary m-1"
      @click="
        // router.push({
        //   path: '/transction/add',
        //   state: {
        //     amount: amount,
        //   },
        // })
        router.back()
      "
    >
      뒤로가기
    </button>
    <button type="button" class="btn btn-primary m-1" @click="router.push('/')">
      취 소
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { inject } from 'vue';
let router = useRouter();
const amount = history.state.amount;
const type = history.state.categoryType;
let categories = inject('categories');

let categoriesTest = categories.value.filter((x) => x.type === type);

const { addBudget } = inject('actions');

const addTodoHandler = (categoryItemId) => {
  const budgetItem = {
    date: new Date().toDateString(),
    categoryId: categoryItemId,
    amount: amount,
    memo: '',
  };
  addBudget({ ...budgetItem });
  router.push('/');
};
</script>
