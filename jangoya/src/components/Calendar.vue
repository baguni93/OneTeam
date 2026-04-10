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

        <ul class="items">
          <li v-for="item in getItems(day.date)" :key="item">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 입력
    <div class="input-area">
      <input v-model="inputText" placeholder="내용 입력" />
      <button @click="addItem">추가</button>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDateStore } from '@/stores/dateStore';
import { storeToRefs } from 'pinia';
const dateStore = useDateStore();
const { selectedDate } = storeToRefs(dateStore);

const selectDate = (day) => {
  if (!day?.date) return;

  dateStore.setDate(day.date);
};

const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());
/**
 * 데이터 저장 (날짜별 리스트)
 */
const itemsByDate = ref({});

/**
 * 요일
 */
const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

// 달력 굳이 computed 안써도 됨 4월만 만들꺼라
const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const days = [];

  // 이전 달 채우기
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

/**
 * 아이템 추가
 */
// const addItem = () => {
//   if (!selectedDate.value || !inputText.value) return;

//   if (!itemsByDate.value[selectedDate.value]) {
//     itemsByDate.value[selectedDate.value] = [];
//   }

//   itemsByDate.value[selectedDate.value].push(inputText.value);
//   inputText.value = '';
// };

/**
 * 날짜별 아이템 조회
 */
const getItems = (date) => {
  return itemsByDate.value[date] || [];
};
</script>

<style>
.calendar-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  font-family: Arial;
}

/* 헤더 */
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

/* 요일 */
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  margin-top: 10px;
}

/* 달력 그리드 */
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-top: 10px;
  width: 100%;
}

/* 셀 */
.cell {
  border: 1px solid #ccc;
  min-height: 80px;
  padding: 5px;
  cursor: pointer;
  background-color: white;
}

/* 선택된 날짜 */
.selected {
  background-color: #4caf50;
  color: white;
}

/* 다른 달 날짜 */
.disabled {
  background-color: #f5f5f5;
  color: #aaa;
}

/* 날짜 숫자 */
.date {
  font-weight: bold;
}

/* 리스트 */
.items {
  font-size: 12px;
  margin-top: 5px;
  padding-left: 10px;
}

/* 입력 */
.input-area {
  margin-top: 20px;
}
</style>
