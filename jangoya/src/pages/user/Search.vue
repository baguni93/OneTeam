<template>
  <div class="search-wrap">
    <h2 class="search-title">검색</h2>
    <hr class="divider" />

    <!-- 검색바 -->
    <div class="search-bar">
      <input
        type="text"
        v-model="keyword"
        placeholder="검색어를 입력하세요"
        class="search-input"
      />
      <button @click="search" class="btn-primary">검색</button>
    </div>

    <div class="filter-section">
      <!-- 1. 기간 -->
      <div class="filter-group">
        <p class="filter-label">기간</p>
        <div class="btn-group">
          <button
            @click="selectedPeriod = 'all'"
            :class="['btn-filter', selectedPeriod === 'all' ? 'active' : '']"
          >
            전체
          </button>
          <button
            @click="selectedPeriod = 'week'"
            :class="['btn-filter', selectedPeriod === 'week' ? 'active' : '']"
          >
            이번 주
          </button>
          <button
            @click="selectedPeriod = 'month'"
            :class="['btn-filter', selectedPeriod === 'month' ? 'active' : '']"
          >
            이번 달
          </button>
          <button
            @click="selectedPeriod = 'custom'"
            :class="['btn-filter', selectedPeriod === 'custom' ? 'active' : '']"
          >
            사용자 지정
          </button>
        </div>
        <p class="filter-info" v-if="selectedPeriod === 'week'">
          {{ weekRange[6] }} ~ {{ weekRange[0] }}
        </p>
        <p class="filter-info" v-if="selectedPeriod === 'month'">
          {{ monthRange[0] }} ~ {{ monthRange[monthRange.length - 1] }}
        </p>
        <div v-if="selectedPeriod === 'custom'">
          <input type="date" v-model="customDate" class="input-date" />
        </div>
      </div>

      <!-- 2. 카테고리 -->
      <div class="filter-group">
        <p class="filter-label">카테고리</p>
        <button @click="showCategoryTab = !showCategoryTab" class="btn-filter">
          전체 카테고리 {{ showCategoryTab ? '▲' : '▼' }}
        </button>
        <div v-if="showCategoryTab" class="category-panel">
          <!-- income 토글 -->
          <button @click="toggleType('income')" class="btn-type">
            {{ openType.includes('income') ? '▼' : '▶' }} 수입
          </button>
          <div v-if="openType.includes('income')" class="category-list">
            <button
              v-for="cat in categories.filter((c) => c.type === 'income')"
              :key="cat.id"
              @click="toggleCategory(cat.id)"
              :class="[
                'btn-cat',
                selectedCategories.map(String).includes(String(cat.id))
                  ? 'active'
                  : '',
              ]"
            >
              {{ cat.name }}
            </button>
          </div>
          <!-- expense 토글 -->
          <button @click="toggleType('expense')" class="btn-type">
            {{ openType.includes('expense') ? '▼' : '▶' }} 지출
          </button>
          <div v-if="openType.includes('expense')" class="category-list">
            <button
              v-for="cat in categories.filter((c) => c.type === 'expense')"
              :key="cat.id"
              @click="toggleCategory(cat.id)"
              :class="[
                'btn-cat',
                selectedCategories.map(String).includes(String(cat.id))
                  ? 'active'
                  : '',
              ]"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>
        <p class="filter-info" v-if="selectedCategories.length > 0">
          선택: {{ selectedCategoriesLabels.join(', ') }}
        </p>
      </div>

      <!-- 3. 금액 -->
      <div class="filter-group">
        <p class="filter-label">금액</p>
        <div class="amount-row">
          <input
            type="number"
            v-model="minAmount"
            placeholder="최솟값"
            class="input-amount"
          />
          <span class="amount-dash">~</span>
          <input
            type="number"
            v-model="maxAmount"
            placeholder="최댓값"
            class="input-amount"
          />
        </div>
        <p class="filter-info" v-if="minAmount || maxAmount">
          ₩{{ Number(minAmount || 0).toLocaleString() }} ~ ₩{{
            maxAmount ? Number(maxAmount).toLocaleString() : '제한없음'
          }}
        </p>
      </div>
    </div>

    <!-- 결과 -->
    <hr class="divider" />
    <table class="result-table">
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
          <td colspan="5" class="no-result">검색결과가 없습니다.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();
userStore.initUser();
const currentUser = userStore.getCurrentUser();

// ======================
// 1. 기간
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
const categories = ref([]);

onMounted(async () => {
  const res = await axios.get('http://localhost:3000/categories');
  categories.value = res.data;
});

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
    const cat = categories.value.find((c) => String(c.id) === String(id));
    return cat
      ? `${cat.type === 'income' ? '수입' : '지출'} - ${cat.name}`
      : '';
  });
});

const getCategoryName = (categoryId) => {
  const cat = categories.value.find((c) => String(c.id) === String(categoryId));
  return cat ? cat.name : categoryId;
};

// ======================
// 3. 금액
// ======================

const minAmount = ref('');
const maxAmount = ref('');

// ======================
// 4. 검색어
// ======================

const keyword = ref('');
const results = ref([]);

// ======================
// 검색 함수
// ======================

const search = async () => {
  results.value = [];

  const res = await axios.get('http://localhost:3000/budgets');
  let data = res.data;

  // 로그인한 유저가 있을 때만 userId 필터 적용 (null이면 전체 표시)
  if (currentUser?.id) {
    data = data.filter(
      (item) => String(item.userId) === String(currentUser.id),
    );
  }

  // 기간 필터
  if (selectedPeriod.value === 'week') {
    data = data.filter((item) => weekRange.value.includes(item.date));
  } else if (selectedPeriod.value === 'month') {
    data = data.filter((item) => monthRange.value.includes(item.date));
  } else if (selectedPeriod.value === 'custom' && customDate.value) {
    data = data.filter((item) => item.date === customDate.value);
  }

  // 카테고리 필터 (String 변환으로 타입 불일치 방지)
  if (selectedCategories.value.length > 0) {
    data = data.filter((item) =>
      selectedCategories.value.map(String).includes(String(item.categoryId)),
    );
  }

  // 금액 필터
  if (minAmount.value) {
    data = data.filter((item) => item.amount >= Number(minAmount.value));
  }
  if (maxAmount.value) {
    data = data.filter((item) => item.amount <= Number(maxAmount.value));
  }

  // 검색어 필터
  if (keyword.value) {
    data = data.filter(
      (item) =>
        String(item.amount).includes(keyword.value) ||
        (item.memo ?? '').includes(keyword.value),
    );
  }

  results.value = data;
};
</script>

<style scoped>
.search-wrap {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px;
  font-size: 14px;
  color: #222;
}

.search-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 16px 0;
}

/* 검색바 */
.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
}

.search-input:focus {
  border-color: #888;
}

.btn-primary {
  padding: 8px 16px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:hover {
  background: #555;
}

/* 필터 섹션 */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-weight: 600;
  font-size: 13px;
  color: #444;
  margin: 0;
}

/* 버튼 그룹 */
.btn-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.btn-filter {
  padding: 6px 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  color: #333;
}

.btn-filter:hover {
  background: #f5f5f5;
}

.btn-filter.active {
  background: #333;
  color: #fff;
  border-color: #333;
}

.filter-info {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.input-date {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 13px;
}

/* 카테고리 패널 */
.category-panel {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fafafa;
}

.btn-type {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  text-align: left;
  padding: 2px 0;
  font-weight: 500;
}

.category-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding-left: 12px;
}

.btn-cat {
  padding: 4px 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  color: #333;
}

.btn-cat:hover {
  background: #f0f0f0;
}

.btn-cat.active {
  background: #333;
  color: #fff;
  border-color: #333;
}

/* 금액 */
.amount-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-amount {
  width: 120px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 13px;
}

.amount-dash {
  color: #888;
}

/* 결과 테이블 */
.result-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 4px;
}

.result-table th {
  padding: 10px 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #e0e0e0;
}

.result-table td {
  padding: 10px 12px;
  font-size: 13px;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}

.result-table tr:hover td {
  background: #fafafa;
}

.no-result {
  text-align: center;
  color: #aaa;
  padding: 24px !important;
}
</style>
