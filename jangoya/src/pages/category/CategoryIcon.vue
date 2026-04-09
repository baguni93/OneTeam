<template>
  <div>
    <header>
      <button @click="router.back()">
        <i class="bi bi-arrow-left"></i> 뒤로
      </button>
      <h2>이미지 선택</h2>
      <button @click="completeSelection">완료</button>
    </header>

    <section style="text-align: center; margin: 20px 0">
      <div
        style="
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        "
        :style="{ backgroundColor: selectedColor }"
      >
        <i
          :class="['bi', selectedIcon]"
          style="color: white; font-size: 32px"
        ></i>
      </div>
    </section>

    <section style="text-align: center; margin-bottom: 20px">
      <button @click="activeTab = 'icon'">아이콘</button>
      <button @click="activeTab = 'color'">색상</button>
    </section>

    <section v-if="activeTab === 'icon'">
      <span
        v-for="icon in iconList"
        :key="icon"
        @click="selectedIcon = icon"
        style="display: inline-block; padding: 10px; cursor: pointer"
      >
        <i :class="['bi', icon]" style="font-size: 24px"></i>
      </span>
    </section>

    <section v-else>
      <span
        v-for="color in colorList"
        :key="color"
        @click="selectedColor = color"
        style="
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin: 5px;
          cursor: pointer;
        "
        :style="{ backgroundColor: color }"
      ></span>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 1. 현재 페이지 상태 관리
const activeTab = ref('icon'); // 처음에 켜지면 '아이콘' 탭부터 보여줍니다
const selectedIcon = ref('bi-star');
const selectedColor = ref('#ccc'); // 기본 회색

// 2. 돌아갈 때 챙겨가야 할 이전 페이지의 데이터들
const originName = ref('');
const originType = ref('');
const originId = ref('');
const originRouteName = ref(''); // 어디로 돌아갈지 (Add인지 Edit인지)

// 3. 화면에 뿌려줄 임시 리스트 (나중에 원하는 아이콘/색상으로 채워 넣으세요!)
const iconList = [
  'bi-star',
  'bi-heart',
  'bi-cash',
  'bi-cart',
  'bi-house',
  'bi-car-front',
];
const colorList = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#F0E68C',
  '#FF69B4',
  '#8A2BE2',
];

// 4. 페이지 열릴 때: 이전 페이지에서 넘겨준 값 세팅
onMounted(() => {
  if (route.query.icon) selectedIcon.value = route.query.icon;
  if (route.query.color) selectedColor.value = route.query.color;

  // 돌아갈 때 잃어버리지 않게 임시 보관해 둡니다.
  if (route.query.name) originName.value = route.query.name;
  if (route.query.type) originType.value = route.query.type;
  if (route.query.id) originId.value = route.query.id;
  if (route.query.origin) originRouteName.value = route.query.origin;
});

// 5. 완료 버튼: 선택한 거 싸들고 출발했던 곳으로 되돌아가기!
// CategoryIcon.vue 내부
const completeSelection = () => {
  const targetRoute = originRouteName.value || 'mypage/category/add';

  // 1. 공통으로 챙겨갈 짐(query)만 먼저 꾸립니다.
  const pushData = {
    name: targetRoute,
    query: {
      name: originName.value,
      type: originType.value,
      icon: selectedIcon.value,
      color: selectedColor.value,
    },
  };

  // 2. 만약 id를 무사히 들고 왔다면(수정 페이지에서 왔다면), 그때만 params 짐을 추가합니다!
  if (originId.value) {
    pushData.params = { id: originId.value };
  }

  // 3. 출발!
  router.push(pushData);
};
</script>
