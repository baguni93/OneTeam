<template>
  <div>
    <h1>마이페이지</h1>

    <!-- 유저 정보 -->
    <div>
      <div
        style="
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
        "
      >
        🙂
      </div>
      <h2>{{ currentUser?.name }} 님</h2>
    </div>

    <!-- 메인 버튼들 -->
    <div v-if="!showEdit">
      <button @click="showEdit = true">개인 정보 관리</button>
      <button @click="router.push('/mypage/category')">카테고리 관리</button>
      <button @click="handleLogout">로그아웃</button>
    </div>

    <!-- 개인 정보 수정 폼 -->
    <div v-if="showEdit">
      <h2>개인 정보 관리</h2>

      <!-- 이름 변경 -->
      <div>
        <label>이름</label><br />
        <input type="text" v-model="newName" :placeholder="currentUser?.name" />
      </div>

      <!-- 비밀번호 변경 -->
      <div>
        <label>새 비밀번호</label><br />
        <div>
          <input
            :type="showPassword ? 'text' : 'password'"
            placeholder="새 비밀번호를 입력해 주세요"
            v-model="newPassword"
          />
          <button @click="showPassword = !showPassword">👁</button>
        </div>
      </div>

      <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>
      <p v-if="successMsg" style="color: green">{{ successMsg }}</p>

      <button @click="updateUser">수정하기</button>
      <button @click="showEdit = false">취소</button>

      <hr />

      <!-- 회원탈퇴 -->
      <button @click="handleDeleteUser" style="color: red">회원탈퇴</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import axios from 'axios'

const router = useRouter()
const userStore = useUserStore()

const currentUser = ref(null)
const showEdit = ref(false)
const newName = ref('')
const newPassword = ref('')
const showPassword = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

onMounted(() => {
  document.title = '잔고야 - 마이페이지'
  currentUser.value = userStore.getCurrentUser()
})

// 회원 정보 수정
const updateUser = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  if (!newName.value && !newPassword.value) {
    errorMsg.value = '수정할 정보를 입력해주세요'
    return
  }

  try {
    const updateData = {}
    if (newName.value) updateData.name = newName.value
    if (newPassword.value) updateData.password = newPassword.value

    await axios.patch(`/api/users/${currentUser.value.id}`, updateData)

    if (newName.value) {
      currentUser.value.name = newName.value
      localStorage.setItem('user', JSON.stringify(currentUser.value))
      userStore.user.name = newName.value
    }

    successMsg.value = '수정이 완료되었습니다!'
    newName.value = ''
    newPassword.value = ''
  } catch (error) {
    errorMsg.value = error.response?.data?.message || '수정에 실패했습니다'
  }
}

// 로그아웃
const handleLogout = () => {
  userStore.logout()
  router.push('/user/login')
}

// 회원탈퇴
const handleDeleteUser = async () => {
  if (!confirm('정말 탈퇴하시겠습니까?')) return

  try {
    await userStore.deleteUser()
    router.push('/user/login')
  } catch (error) {
    errorMsg.value = '회원탈퇴에 실패했습니다'
  }
}
</script>