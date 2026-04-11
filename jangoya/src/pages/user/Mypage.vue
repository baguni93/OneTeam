<template>
  <div class="container mt-4" style="max-width: 480px; margin: 0 auto">
    <!-- 유저 정보 -->
    <div class="text-center mb-4">
      <div
        style="
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
          overflow: hidden;
          line-height: 1;
          margin: 0 auto 12px;
        "
      >
        🐷
      </div>
      <h2 class="fw-bold">{{ currentUser?.name }} 님</h2>
    </div>

    <!-- 메인 버튼들 -->
    <div
      v-if="!showEdit"
      class="card p-4 shadow-sm mb-3"
      style="border-radius: 20px"
    >
      <div class="d-grid gap-2">
        <button
          class="btn btn-outline-primary fw-bold"
          @click="showEdit = true"
          style="border-radius: 12px; padding: 10px"
        >
          👤 개인 정보 관리
        </button>
        <button
          class="btn btn-outline-secondary"
          @click="router.push('/mypage/category')"
          style="border-radius: 12px; padding: 10px"
        >
          📂 카테고리 관리
        </button>
        <button
          class="btn btn-outline-danger"
          @click="handleLogout"
          style="border-radius: 12px; padding: 10px"
        >
          🚪 로그아웃
        </button>
      </div>
    </div>

    <!-- 개인 정보 수정 폼 -->
    <div
      v-if="showEdit"
      class="card p-4 shadow-sm mb-3"
      style="border-radius: 20px"
    >
      <h5 class="fw-bold mb-3">👤 개인 정보 관리</h5>

      <div class="mb-3">
        <label class="form-label fw-semibold">이름</label>
        <input
          type="text"
          class="form-control"
          v-model="newName"
          :placeholder="currentUser?.name"
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

      <p v-if="errorMsg" class="text-danger text-center small">
        {{ errorMsg }}
      </p>
      <p v-if="successMsg" class="text-success text-center small">
        {{ successMsg }}
      </p>

      <div class="d-grid gap-2 mb-3">
        <button
          class="btn btn-primary fw-bold"
          @click="updateUser"
          style="border-radius: 12px; padding: 10px"
        >
          ✅ 수정하기
        </button>
        <button
          class="btn btn-outline-secondary"
          @click="showEdit = false"
          style="border-radius: 12px; padding: 10px"
        >
          ↩️ 취소
        </button>
      </div>

      <div class="border-top pt-3">
        <div class="d-grid">
          <button
            class="btn btn-outline-danger"
            @click="handleDeleteUser"
            style="border-radius: 12px; padding: 10px"
          >
            🚫 회원탈퇴
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';

const router = useRouter();
const userStore = useUserStore();

const currentUser = ref(null);
const showEdit = ref(false);
const newName = ref('');
const newPassword = ref('');
const showPassword = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

onMounted(() => {
  document.title = '잔고야 - 마이페이지';
  currentUser.value = userStore.getCurrentUser();
});

// 회원 정보 수정
const updateUser = async () => {
  errorMsg.value = '';
  successMsg.value = '';

  if (!newName.value && !newPassword.value) {
    errorMsg.value = '수정할 정보를 입력해주세요';
    return;
  }

  try {
    const updateData = {};
    if (newName.value) updateData.name = newName.value;
    if (newPassword.value) updateData.password = newPassword.value;

    await axios.patch(`/api/users/${currentUser.value.id}`, updateData);

    if (newName.value) {
      currentUser.value.name = newName.value;
      // ✅ sessionStorage로 변경
      sessionStorage.setItem('user', JSON.stringify(currentUser.value));
      userStore.user.name = newName.value;
    }

    successMsg.value = '수정이 완료되었습니다!';
    newName.value = '';
    newPassword.value = '';
  } catch (error) {
    errorMsg.value = error.response?.data?.message || '수정에 실패했습니다';
  }
};

// 로그아웃
const handleLogout = () => {
  userStore.logout();
  router.push('/user/login');
};

// 회원탈퇴
const handleDeleteUser = async () => {
  if (!confirm('정말 탈퇴하시겠습니까?')) return;

  try {
    await userStore.deleteUser();
    router.push('/user/login');
  } catch (error) {
    errorMsg.value = '회원탈퇴에 실패했습니다';
  }
};
</script>
