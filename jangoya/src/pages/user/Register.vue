<template>
  <div class="container mt-4" style="max-width: 480px; margin: 0 auto">
    <!-- 타이틀 -->
    <div class="text-center mb-4">
      <div style="font-size: 50px">🐷</div>
      <h1 class="fw-bold">회원가입</h1>
    </div>

    <!-- 카드 -->
    <div class="card p-4 shadow-sm mb-4" style="border-radius: 20px">
      <!-- 이름 -->
      <div class="mb-3">
        <label class="form-label fw-semibold">이름</label>
        <input
          type="text"
          class="form-control"
          placeholder="이름을 입력해 주세요"
          v-model="name"
          style="border-radius: 12px"
        />
      </div>

      <!-- 아이디 -->
      <div class="mb-3">
        <label class="form-label fw-semibold">아이디</label>
        <input
          type="text"
          class="form-control"
          placeholder="아이디를 입력해 주세요"
          v-model="userId"
          style="border-radius: 12px"
        />
      </div>

      <!-- 이메일 -->
      <div class="mb-3">
        <label class="form-label fw-semibold">이메일</label>
        <input
          type="email"
          class="form-control"
          placeholder="이메일을 입력해 주세요 (예: hong@test.com)"
          v-model="email"
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
            placeholder="비밀번호를 입력해 주세요"
            v-model="password"
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

      <!-- 비밀번호 확인 -->
      <div class="mb-3">
        <label class="form-label fw-semibold">비밀번호 확인</label>
        <div class="input-group">
          <input
            :type="showPasswordConfirm ? 'text' : 'password'"
            class="form-control"
            placeholder="비밀번호를 다시 입력해 주세요"
            v-model="passwordConfirm"
            style="border-radius: 12px 0 0 12px"
          />
          <button
            class="btn btn-outline-secondary"
            @click="showPasswordConfirm = !showPasswordConfirm"
            style="border-radius: 0 12px 12px 0"
          >
            👁
          </button>
        </div>
      </div>

      <!-- 에러/성공 메시지 -->
      <p v-if="errorMsg" class="text-danger text-center small">
        {{ errorMsg }}
      </p>
      <p v-if="successMsg" class="text-success text-center small">
        {{ successMsg }}
      </p>

      <!-- 버튼들 -->
      <div class="d-grid gap-2">
        <button
          class="btn btn-primary fw-bold"
          @click="register"
          style="border-radius: 12px; padding: 10px"
        >
          👋 가입하기
        </button>
        <button
          class="btn btn-outline-secondary"
          @click="router.push('/user/login')"
          style="border-radius: 12px; padding: 10px"
        >
          🔑 로그인으로 돌아가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const name = ref('');
const userId = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

onMounted(() => {
  document.title = '잔고야 - 회원가입';
});

const register = async () => {
  if (!name.value) {
    errorMsg.value = '이름을 입력해주세요';
    return;
  }
  if (!userId.value) {
    errorMsg.value = '아이디를 입력해주세요';
    return;
  }
  if (!email.value) {
    errorMsg.value = '이메일을 입력해주세요';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMsg.value = '이메일 형식이 올바르지 않습니다 (예: hong@test.com)';
    return;
  }

  if (!password.value) {
    errorMsg.value = '비밀번호를 입력해주세요';
    return;
  }
  if (!passwordConfirm.value) {
    errorMsg.value = '비밀번호 확인을 입력해주세요';
    return;
  }
  if (password.value !== passwordConfirm.value) {
    errorMsg.value = '비밀번호가 일치하지 않습니다';
    return;
  }

  try {
    const res = await axios.post('/api/users', {
      userId: userId.value,
      name: name.value,
      email: email.value,
      password: password.value,
    });

    if (res.data.success) {
      successMsg.value = '회원가입이 완료되었습니다!';
      errorMsg.value = '';
      setTimeout(() => {
        router.push('/user/login');
      }, 2000);
    }
  } catch (error) {
    errorMsg.value = error.response?.data?.message || '회원가입에 실패했습니다';
    console.log(error);
  }
};
</script>
