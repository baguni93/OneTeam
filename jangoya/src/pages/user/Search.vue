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
import { ref, computed, onMounted } from 'vue'; //  onMounted 여기로 통합
import axios from 'axios';
import { useUserStore } from '@/stores/userStore'; //  추가

const userStore = useUserStore(); //  추가

// ======================
// 1.기간
// ======================

const selectedPeriod = ref('all');
const customDate = ref('');

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const monthRange = computed(() => {
  const month = [];
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const current = new Date(start);
  while (current <= today) {
    month.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  return month;
});

const weekRange = computed(() => {
  const week = [];
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  for (let i = 0; i < 7; i++) {
    const newDay = new Date(today.getTime() - i * oneDay);
    week.push(formatDate(newDay));
  }
  return week;
});

// ======================
// 2. 카테고리
// ======================

const showCategoryTab = ref(false);
const openType = ref([]);
const selectedCategories = ref([]);

const toggleType = (type) => {
  const idx = openType.value.indexOf(type);
  if (idx === -1) openType.value.push(type);
  else openType.value.splice(idx, 1);
};

const toggleCategory = (id) => {
  const idx = selectedCategories.value.indexOf(id);
  if (idx === -1) selectedCategories.value.push(id);
  else selectedCategories.value.splice(idx, 1);
};

const selectedCategoriesLabels = computed(() => {
  return selectedCategories.value.map((id) => {
    const cat = categories.value.find((c) => c.id === id);
    return cat
      ? `${cat.type === 'income' ? '수입' : '지출'} - ${cat.name}`
      : '';
  });
});

const categories = ref([]);

// 주석 풀고 userId 필터 추가
onMounted(async () => {
  const currentUser = userStore.getCurrentUser()
  const res = await axios.get('/api/categories', {
    params: { userId: currentUser.id }
  })
  categories.value = res.data
})

const getCategoryName = (categoryId) => {
  const cat = categories.value.find((c) => c.id === categoryId);
  return cat ? cat.name : categoryId;
};

// ======================
// 3. 금액
// ======================

const minAmount = ref('');
const maxAmount = ref('');

// ======================
// 4. 검색어 (keyword)
// ======================

const keyword = ref('');
const results = ref([]);

// ======================
// API 연결 : search 함수
// ======================

const search = async () => {
  results.value = [];

  // userId 필터 추가
  const currentUser = userStore.getCurrentUser()
  const res = await axios.get('/api/budgets', {
    params: { userId: currentUser.id }
  })
  let data = res.data;

  if (selectedPeriod.value === 'week') {
    data = data.filter((item) => weekRange.value.includes(item.date));
  } else if (selectedPeriod.value === 'month') {
    data = data.filter((item) => monthRange.value.includes(item.date));
  } else if (selectedPeriod.value === 'custom' && customDate.value) {
    data = data.filter((item) => item.date === customDate.value);
  }

  if (selectedCategories.value.length > 0) {
    data = data.filter((item) =>
      selectedCategories.value.includes(item.categoryId),
    );
  }

  if (minAmount.value) {
    data = data.filter((item) => item.amount >= Number(minAmount.value));
  }
  if (maxAmount.value) {
    data = data.filter((item) => item.amount <= Number(maxAmount.value));
  }

  if (keyword.value) {
    data = data.filter(
      (item) =>
        String(item.amount).includes(keyword.value) ||
        item.memo.includes(keyword.value),
    );
  }
  results.value = data;
};
</script>