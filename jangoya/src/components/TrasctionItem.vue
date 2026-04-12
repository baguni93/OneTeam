<template>
  <li class="list-group-item transaction-item" @click="goEdit">
    <!-- 왼쪽: 아이콘 + 정보 -->
    <div class="d-flex align-items-center gap-3">
      <!-- 아이콘 -->
      <div class="icon-circle" :class="budgetItem.type">
        {{ getIcon(budgetItem.categoryId) }}
      </div>

      <!-- 내용 -->
      <div class="text-box">
        <!-- 메모 -->
        <div class="memo">
          {{ budgetItem.memo || '메모 없음' }}
        </div>

        <!-- 서브 정보 -->
        <small class="text-muted">
          {{ budgetItem.type }} · 카테고리 {{ budgetItem.categoryId }}
        </small>
      </div>
    </div>

    <!-- 오른쪽: 금액 -->
    <div class="amount" :class="budgetItem.type">
      {{ budgetItem.type === 'income' ? '+' : '-' }}
      {{ budgetItem.amount.toLocaleString() }}원
    </div>
  </li>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  budgetItem: Object,
});

const router = useRouter();

const goEdit = () => {
  router.push(`/transaction/edit/${props.budgetItem.id}`);
};

/* 임시 카테고리 아이콘 */
const getIcon = (categoryId) => {
  const icons = {
    1: '💰',
    2: '🍔',
    3: '🚗',
    4: '🏠',
    5: '🎮',
  };

  return icons[categoryId] || '📌';
};
</script>

<style scoped>
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 12px 10px;
  cursor: pointer;

  transition: 0.2s;
}

.transaction-item:hover {
  background: #f8f9fa;
}

/* 아이콘 */
.icon-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 18px;
  background: #eee;
}

/* 수입/지출 색 */
.icon-circle.income {
  background: #e6f7ee;
}

.icon-circle.expense {
  background: #fdeaea;
}

/* 텍스트 영역 */
.text-box {
  max-width: 180px;
}

/* 메모 줄임 */
.memo {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 금액 */
.amount {
  font-weight: bold;
  white-space: nowrap;
}

.amount.income {
  color: #28a745;
}

.amount.expense {
  color: #dc3545;
}
</style>
