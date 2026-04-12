<template>
  <div class="calendar-container">
    <!-- 헤더 -->
    <div class="header">
      <h2>{{ currentYear }}년 {{ currentMonth + 1 }}월</h2>
    </div>

    <!-- 요일 -->
    <div class="weekdays">
      <div v-for="day in weekDays" :key="day">
        {{ day }}
      </div>
    </div>

    <!-- 날짜 -->
    <div class="grid">
      <div
        v-for="day in calendarDays"
        :key="day.date"
        class="cell"
        :class="{
          selected: selectedDate === day.date,
          disabled: !day.isCurrentMonth,
        }"
        @click="selectDate(day)"
      >
        <div class="date">{{ day.day }}</div>

        <!-- 수입 / 지출 -->
        <div class="summary" v-if="day.date">
          <div class="income">
            {{ sumByDate(day.date, 'income') }}
          </div>
          <div class="expense">
            {{ sumByDate(day.date, 'expense') }}
          </div>
        </div>

        <!-- 리스트 -->
        <ul class="items">
          <li v-for="item in getItems(day.date)" :key="item">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBudgetStore, useDateStore } from '@/stores/dateStore';
import { storeToRefs } from 'pinia';

/* store */
const dateStore = useDateStore();
const budgetStore = useBudgetStore();

const { selectedDate } = storeToRefs(dateStore);
const { budgets } = storeToRefs(budgetStore);

/* 날짜 선택 */
const selectDate = (day) => {
  if (!day?.date) return;
  dateStore.setDate(day.date);
};

/* 현재 날짜 */
const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());

/* 요일 */
const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

/* 달력 생성 */
const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const days = [];

  // 이전 달
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push({ day: '', date: null, isCurrentMonth: false });
  }

  // 현재 달
  for (let i = 1; i <= totalDays; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

    days.push({
      day: i,
      date: dateStr,
      isCurrentMonth: true,
    });
  }

  return days;
});

/* 🔥 핵심: 0이면 공백 */
const sumByDate = (date, type) => {
  const sum = budgets.value
    .filter((x) => x.date === date && x.type === type)
    .reduce((sum, x) => sum + x.amount, 0);

  return sum === 0 ? '' : sum;
};

/* 테스트 데이터 */
const itemsByDate = ref({});
const inputText = ref('');

const addItem = () => {
  if (!selectedDate.value || !inputText.value) return;

  if (!itemsByDate.value[selectedDate.value]) {
    itemsByDate.value[selectedDate.value] = [];
  }

  itemsByDate.value[selectedDate.value].push(inputText.value);
  inputText.value = '';
};

const getItems = (date) => {
  return itemsByDate.value[date] || [];
};
</script>

<style scoped>
.calendar-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 10px;
}

/* 헤더 */
.header {
  text-align: center;
}

/* 요일 */
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  text-align: center;
  font-weight: bold;
  font-size: clamp(12px, 2vw, 16px);
}

/* 🔥 핵심 grid */
.grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 5px;
  width: 100%;
}

/* 🔥 핵심 cell */
.cell {
  aspect-ratio: 1 / 1;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #ddd;
  padding: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 선택 */
.selected {
  background-color: #4caf50;
  color: white;
}

/* 비활성 */
.disabled {
  background-color: #f5f5f5;
  color: #aaa;
}

/* 날짜 */
.date {
  font-weight: bold;
  font-size: clamp(12px, 2vw, 16px);
}

/* 수입/지출 */
.summary {
  font-size: clamp(10px, 1.5vw, 12px);
}

.income {
  color: #2e7d32;
}

.expense {
  color: #c62828;
}

/* 리스트 */
.items {
  font-size: clamp(10px, 1.3vw, 12px);
  overflow: hidden;
}

/* 입력 */
.input-area {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.input-area input {
  flex: 1;
}

/* 모바일 */
@media (max-width: 600px) {
  .cell {
    padding: 2px;
  }
}
</style>
