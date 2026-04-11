<template>
  <div class="container mt-4" style="max-width: 480px; margin: 0 auto">
    <!-- 타이틀 -->
    <div class="text-center mb-4">
      <div style="font-size: 50px">🐷</div>
      <h1 class="fw-bold">잔고야</h1>
      <p class="text-muted small mt-2">잔고야, 괜찮아?</p>
    </div>

    <!-- 카드 -->
    <div class="card p-4 shadow-sm mb-4" style="border-radius: 20px">
      <!-- 아이디 -->
      <div class="mb-3">
        <label class="form-label fw-semibold">아이디</label>
        <input
          type="text"
          class="form-control"
          placeholder="ID를 입력해 주세요."
          v-model="userId"
          style="border-radius: 12px"
        />
      </div>

      <!-- 비밀번호 -->
      <div class="mb-3">
        <label class="form-label fw-semibold">비밀번호</label>
        <div class="input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            placeholder="비밀번호를 입력해 주세요."
            v-model="password"
            @keyup.enter="login"
            style="border-radius: 12px 0 0 12px"
          />
          <button
            class="btn btn-outline-secondary"
            @click="showPassword = !showPassword"
            style="border-radius: 0 12px 12px 0"
          >
            👁
          </button>
        </div>
      </div>

      <!-- 에러 메시지 -->
      <p v-if="errorMsg" class="text-danger text-center small">
        {{ errorMsg }}
      </p>

      <!-- 버튼들 -->
      <div class="d-grid gap-2 mb-3">
        <button
          class="btn btn-primary fw-bold"
          @click="login"
          style="border-radius: 12px; padding: 10px"
        >
          🔑 로그인
        </button>
        <button
          class="btn btn-outline-secondary"
          @click="router.push('/user/register')"
          style="border-radius: 12px; padding: 10px"
        >
          🧑‍💼 회원가입
        </button>
      </div>

      <!-- 계정 찾기 -->
      <div class="text-center">
        <span
          class="link text-muted small"
          @click="router.push('/user/findaccount')"
          style="cursor: pointer; text-decoration: underline"
          >🔍 아이디/비밀번호를 잊으셨나요?</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const userStore = useUserStore();

const userId = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMsg = ref('');

onMounted(() => {
  document.title = '잔고야 - 로그인';
});

const login = async () => {
  if (!userId.value && !password.value) {
    errorMsg.value = '아이디와 비밀번호를 입력해주세요';
    return;
  }
  if (!userId.value) {
    errorMsg.value = '아이디를 입력해주세요';
    return;
  }
  if (!password.value) {
    errorMsg.value = '비밀번호를 입력해주세요';
    return;
  }

  const result = await userStore.login(userId.value, password.value);

  if (result.success) {
    errorMsg.value = '';
    router.push('/');
  } else {
    errorMsg.value = result.message;
  }
};
</script>

<style scoped>
.link {
  cursor: pointer;
  text-decoration: underline;
  color: inherit;
  transition: color 0.2s;
}

.link:hover {
  color: #0d6efd !important;
}
</style>
