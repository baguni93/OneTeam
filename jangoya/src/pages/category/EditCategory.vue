<template>
  <div>
    <h2>카테고리 수정</h2>
    <p>현재 수정 중인 카테고리 ID: {{ categoryId }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // ★ useRouter가 아니라 useRoute 입니다!

const route = useRoute();
const categoryId = route.params.id; // 앞서 보낸 id 값을 여기서 꺼냅니다.

const categoryData = ref({});

onMounted(() => {
  // 꺼낸 ID를 이용해 해당 카테고리 하나의 정보만 서버에서 불러옵니다.
  fetch(`http://localhost:3000/categories/${categoryId}`)
    .then(res => res.json())
    .then(data => {
      categoryData.value = data; // 화면의 input 창들에 이 데이터가 뿌려지게 연결합니다.
    });
});
</script>
