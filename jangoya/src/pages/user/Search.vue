<template>
  <div>
    <h2>검색</h2>
    <hr />

    <!-- 검색바 -->
    <div>
      <input
        type="text"
        v-model="keyword"
        placeholder="검색어를 입력하세요"
      /><button @click="search">검색</button>
    </div>

    <div>
      <!-- 조 건 설 정 -->
      <!-- 1. 기간 -->
      <p style="color: blue; font-weight: bold">기간</p>
      <button @click="selectedPeriod = 'all'">전체</button>
      <button @click="selectedPeriod = 'week'">이번 주</button>
      <button @click="selectedPeriod = 'month'">이번 달</button>
      <button @click="selectedPeriod = 'custom'">사용자 지정</button>
      <!-- 선택한 기간 보여줌 -->
      <p>지금 선택: {{ selectedPeriod }}</p>
      <p v-if="selectedPeriod === 'week'">
        {{ weekRange[6] }} ~ {{ weekRange[0] }}
      </p>
      <p v-if="selectedPeriod === 'month'">
        {{ monthRange[0] }} ~ {{ monthRange[monthRange.length - 1] }}
      </p>
      <p v-if="selectedPeriod === 'custom'">
        <input type="date" v-model="customDate" />
      </p>

      <!-- 2. 카테고리 -->
      <div>
        <p style="color: blue; font-weight: bold">카테고리</p>
        <button @click="showCategoryTab = !showCategoryTab">
          전체 카테고리
        </button>
        <div v-if="showCategoryTab">
          <!-- income 토글 -->
          <button @click="toggleType('income')">
            {{ openType.includes('income') ? '⬇️' : '➡️' }}수입
          </button>
          <div v-if="openType.includes('income')">
            <button
              v-for="cat in categories.filter((c) => c.type === 'income')"
              :key="cat.id"
              @click="toggleCategory(cat.id)"
            >
              {{ cat.name }}
            </button>
          </div>
          <!-- expense 토글 -->
          <br />
          <button @click="toggleType('expense')">
            {{ openType.includes('expense') ? '⬇️' : '➡️' }}지출
          </button>
          <div v-if="openType.includes('expense')">
            <button
              v-for="cat in categories.filter((c) => c.type === 'expense')"
              :key="cat.id"
              @click="toggleCategory(cat.id)"
            >
              {{ cat.name }}
            </button>
          </div>
          <p v-if="selectedCategories.length > 0">
            지금 선택: {{ selectedCategoriesLabels.join(', ') }}
          </p>
        </div>
        <!-- 3. 금액 -->
        <div>
          <p style="color: blue; font-weight: bold">금액</p>
          <!-- 금액 범위 입력 -->
          <input type="number" v-model="minAmount" placeholder="최솟값" /> -
          <input type="number" v-model="maxAmount" placeholder="최댓값" />
          <p v-if="minAmount || maxAmount">
            ₩{{ minAmount || 0 }} ~ ₩{{ maxAmount || '제한없음' }}
          </p>
        </div>

        <!-- 결과 -->
        <br />
        <hr />
        <table style="border: 1px solid #ccc; width: 500px">
          <thead>
            <tr>
              <th>날짜</th>
              <th>카테고리</th>
              <th>구분</th>
              <th>금액</th>
              <th>메모</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in results" :key="item.id">
              <td>{{ item.date }}</td>
              <td>{{ getCategoryName(item.categoryId) }}</td>
              <td>{{ item.type === 'income' ? '수입' : '지출' }}</td>
              <td>{{ item.amount.toLocaleString() }} 원</td>
              <td>{{ item.memo }}</td>
            </tr>
            <tr v-if="results.length === 0">
              <td colspan="5">검색결과가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

// 로그인 한 사용자 불러오기 (민성님)
import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();
userStore.initUser();
const currentUser = userStore.getCurrentUser();
console.log(currentUser); // 유저 객체 전체 확인
console.log(currentUser?.id);

// ======================
// 1.기간
// ======================

const selectedPeriod = ref('all'); // 현재 선택된 기간 저장
const customDate = ref(''); // "기간: 사용자지정" 과 연결

// 날짜를 "2026.04.08" 형식으로 변환하는 함수
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// 이번 달 범위 자동
const monthRange = computed(() => {
  const month = [];
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1); // 이번 달 "1일"

  // 1일부터 오늘까지 하루씩 배열에 추가
  const current = new Date(start);
  while (current <= today) {
    month.push(formatDate(current));
    current.setDate(current.getDate() + 1); // 하루씩 증가
  }
  console.log(`${month[month.length - 1]} ~ ${month[0]}`);
  return month;
});

// 이번 주 범위 자동 계산
const weekRange = computed(() => {
  const week = [];
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // 하루를 밀리초로

  for (let i = 0; i < 7; i++) {
    const newDay = new Date(today.getTime() - i * oneDay); // i일 전 날짜
    week.push(formatDate(newDay));
  }
  console.log(`${week[6]} ~ ${week[0]}`);

  return week;
});

// ======================
// 2. 카테고리
// ======================

const showCategoryTab = ref(false); // 카테고리 탭 열고 닫는 상태
const openType = ref([]); // 수입,지출 열림 상태
const selectedCategories = ref([]); //사용자가 선택한 카테고리 id 목록

// (토글 함수, 수입/지출) type : income, expense
const toggleType = (type) => {
  const idx = openType.value.indexOf(type);
  if (idx === -1) openType.value.push(type);
  else openType.value.splice(idx, 1);
};
// (토글 함수, 카테고리 선택/해제) id : 선택한 카테고리의 id
const toggleCategory = (id) => {
  const idx = selectedCategories.value.indexOf(id);
  if (idx === -1) selectedCategories.value.push(id);
  else selectedCategories.value.splice(idx, 1);
};

// 선택된 카테고리를 "수입-월급" 형식으로 변환
// selectedCategories 가 바뀔 때마다 자동으로 계산
const selectedCategoriesLabels = computed(() => {
  return selectedCategories.value.map((id) => {
    // id로 카테고리 객체 찾기
    const cat = categories.value.find((c) => c.id === id);
    // type에 따라 '수입', '지출' 붙여서 return
    return cat
      ? `${cat.type === 'income' ? '수입' : '지출'} - ${cat.name}`
      : '';
  });
});

const categories = ref([]); // db.json에서 불러온 전체 카테고리 목록
// onMounted(async () => {
//   const res = await axios.get('http://localhost:3000/categories');
//   categories.value = res.data; // 불러온 데이터 categories 에 저장
// });

const getCategoryName = (categoryId) => {
  const cat = categories.value.find((c) => c.id === categoryId);
  return cat ? cat.name : categoryId;
};
// ======================
// 3. 금액
// ======================

const minAmount = ref(''); //사용자가 입력한 최솟값
const maxAmount = ref('');

// ======================
// 4. 검색어 (keyword)
// ======================
const keyword = ref(''); // 사용자가 입력한 검색어
const results = ref([]); // 검색 결과 저장

// ======================
// API 연결 :  search 함수
// ======================

const search = async () => {
  results.value = []; // 검색 시작 전, 초기화

  // json-server에서 전체 데이터 가져오기
  const res = await axios.get('http://localhost:3000/budgets');
  let data = res.data;
  console.log(data.length);
  console.log(data);
  data = data.filter((item) => String(item.userId) === String(currentUser?.id));

  // 기간 필터 (선택했을 때만 적용)
  if (selectedPeriod.value === 'week') {
    data = data.filter((item) => weekRange.value.includes(item.date));
  } else if (selectedPeriod.value === 'month') {
    data = data.filter((item) => monthRange.value.includes(item.date));
  } else if (selectedPeriod.value === 'custom' && customDate.value) {
    data = data.filter((item) => item.date === customDate.value);
  }

  // 카테고리 필터 (선택했을 때만 적용)
  if (selectedCategories.value.length > 0) {
    data = data.filter((item) =>
      selectedCategories.value.includes(item.categoryId),
    );
  }

  // 금액  필터 (입력했을 때만 적용)
  if (minAmount.value) {
    data = data.filter((item) => item.amount >= Number(minAmount.value));
  }
  if (maxAmount.value) {
    data = data.filter((item) => item.amount <= Number(maxAmount.value));
  }

  // 검색어 필터 (입력했을 때만 적용)
  if (keyword.value) {
    data = data.filter(
      (item) =>
        String(item.amount).includes(keyword.value) ||
        item.memo.includes(keyword.value),
    ); // amount 와 memo 에서 일치하는 값 찾기
  }
  results.value = data;
};
</script>
