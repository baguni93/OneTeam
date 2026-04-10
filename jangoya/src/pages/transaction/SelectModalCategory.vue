<template>
  <div class="modal">
    <div class="box">
      <h3></h3>
      <div class="heading">
        <span class="title"> :: 카테고리 선택</span>
        <span class="float-end badge bg-secondary pointer" @click="exit">
          X
        </span>
      </div>
      <button
        v-for="categoryItem in categoryItems"
        :key="categoryItem.id"
        @click="selectCategory(categoryItem.id)"
      >
        <div style="background-color: blue">
          카테고리 Id : {{ categoryItem.id }} / 카테고리 이름 :
          {{ categoryItem.name }} 카테고리 타입 : {{ categoryItem.type }}
        </div>
        <br />
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useBudgetStore } from '@/stores/dateStore';
import { storeToRefs } from 'pinia';

const budgetStore = useBudgetStore();
const { categories } = storeToRefs(budgetStore);

const router = useRouter();
const currentRoute = useRoute();

const type = history.state?.categoryType;
let categoryItems = categories.value.filter((x) => x.type === type);

const exit = () => {
  router.push({ name: 'transaction/edit/id' });
};

const selectCategory = (id) => {
  router.push({
    name: 'transaction/edit/id',
    params: { id: currentRoute.params.id },
    query: { categoryId: id },
  });
};
</script>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.box {
  background-color: white;
  margin: 80px auto;
  max-width: 500px;
  min-width: 100px;
  min-height: 350px;
  font: 13px 'verdana';
  padding: 10px 10px 10px 10px;
}

.box div {
  padding: 0;
  display: block;
  margin: 10px 0 0 0;
}

.box .heading {
  background: #33a17f;
  font-weight: 300;
  text-align: left;
  color: #fff;
  margin: 5px 0 5px 0;
  padding: 10px;
  min-width: 200px;
  max-width: 500px;
}

.box .player {
  background: white;
}

.pointer {
  cursor: pointer;
}
</style>
