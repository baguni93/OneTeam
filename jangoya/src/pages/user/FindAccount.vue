<template>
  <div class="container mt-4" style="max-width: 480px; margin: 0 auto">
    <!-- 타이틀 -->
    <div class="text-center mb-4">
      <div style="font-size: 50px">🐷</div>
      <h1 class="fw-bold">계정 찾기</h1>
    </div>

    <!-- 아이디 찾기 카드 -->
    <div class="card p-4 shadow-sm mb-3" style="border-radius: 20px">
      <h5 class="fw-bold mb-3">🔍 아이디 찾기</h5>

      <div class="mb-3">
        <label class="form-label fw-semibold">이름</label>
        <input
          type="text"
          class="form-control"
          placeholder="이름을 입력해 주세요"
          v-model="findName"
          style="border-radius: 12px"
        />
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">이메일</label>
        <input
          type="email"
          class="form-control"
          placeholder="이메일을 입력해 주세요"
          v-model="findEmail"
          style="border-radius: 12px"
        />
      </div>

      <p v-if="findErrorMsg" class="text-danger text-center small">
        {{ findErrorMsg }}
      </p>
      <p v-if="foundUserId" class="text-success text-center small">
        아이디: {{ foundUserId }}
      </p>

      <button
        class="btn btn-primary fw-bold w-100"
        @click="findAccount"
        style="border-radius: 12px; padding: 10px"
      >
        🔍 아이디 찾기
      </button>
    </div>

    <!-- 비밀번호 변경 카드 -->
    <div class="card p-4 shadow-sm mb-3" style="border-radius: 20px">
      <h5 class="fw-bold mb-3">🔒 비밀번호 변경</h5>

      <div class="mb-3">
        <label class="form-label fw-semibold">아이디</label>
        <input
          type="text"
          class="form-control"
          placeholder="아이디를 입력해 주세요"
          v-model="changeUserId"
          style="border-radius: 12px"
        />
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">새 비밀번호</label>
        <div class="input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            placeholder="새 비밀번호를 입력해 주세요"
            v-model="newPassword"
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

      <p v-if="changeErrorMsg" class="text-danger text-center small">
        {{ changeErrorMsg }}
      </p>
      <p v-if="changeSuccessMsg" class="text-success text-center small">
        {{ changeSuccessMsg }}
      </p>

      <button
        class="btn btn-primary fw-bold w-100"
        @click="changePassword"
        style="border-radius: 12px; padding: 10px"
      >
        🔑 비밀번호 변경
      </button>
    </div>

    <!-- 로그인으로 돌아가기 -->
    <div class="d-grid">
      <button
        class="btn btn-outline-secondary"
        @click="router.push('/user/login')"
        style="border-radius: 12px; padding: 10px"
      >
        ↩️ 로그인으로 돌아가기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const findName = ref('');
const findEmail = ref('');
const findErrorMsg = ref('');
const foundUserId = ref('');

const changeUserId = ref('');
const newPassword = ref('');
const showPassword = ref(false);
const changeErrorMsg = ref('');
const changeSuccessMsg = ref('');

onMounted(() => {
  document.title = '잔고야 - 계정 찾기';
});

const findAccount = async () => {
  foundUserId.value = '';
  findErrorMsg.value = '';

  if (!findName.value) {
    findErrorMsg.value = '이름을 입력해주세요';
    return;
  }
  if (!findEmail.value) {
    findErrorMsg.value = '이메일을 입력해주세요';
    return;
  }

  try {
    const res = await axios.get('/api/users', {
      params: { name: findName.value, email: findEmail.value },
    });
    if (res.data.success) foundUserId.value = res.data.userId;
  } catch (error) {
    findErrorMsg.value =
      error.response?.data?.message || '아이디 찾기에 실패했습니다';
  }
};

const changePassword = async () => {
  changeErrorMsg.value = '';
  changeSuccessMsg.value = '';

  if (!changeUserId.value) {
    changeErrorMsg.value = '아이디를 입력해주세요';
    return;
  }
  if (!newPassword.value) {
    changeErrorMsg.value = '새 비밀번호를 입력해주세요';
    return;
  }

  try {
    const res = await axios.get('/api/users', {
      params: { userId: changeUserId.value },
    });

    if (res.data.success) {
      await axios.patch(`/api/users/${res.data.id}`, {
        password: newPassword.value,
      });
      changeSuccessMsg.value = '비밀번호가 변경되었습니다!';
      changeUserId.value = '';
      newPassword.value = '';
      setTimeout(() => {
        router.push('/user/login');
      }, 2000);
    }
  } catch (error) {
    changeErrorMsg.value =
      error.response?.data?.message || '비밀번호 변경에 실패했습니다';
  }
};
</script>
