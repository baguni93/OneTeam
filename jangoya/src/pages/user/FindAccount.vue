<template>
  <div>
    <h1>계정 찾기</h1>

    <!-- 아이디 찾기 -->
    <div>
      <h2>아이디 찾기</h2>
      <div>
        <label>이름</label><br />
        <input type="text" placeholder="이름을 입력해 주세요" v-model="findName" />
      </div>
      <div>
        <label>이메일</label><br />
        <input type="email" placeholder="이메일을 입력해 주세요" v-model="findEmail" />
      </div>
      <p v-if="findErrorMsg" style="color: red">{{ findErrorMsg }}</p>
      <p v-if="foundUserId" style="color: green">아이디: {{ foundUserId }}</p>
      <button @click="findAccount">아이디 찾기</button>
    </div>

    <hr />

    <!-- 비밀번호 변경 -->
    <div>
      <h2>비밀번호 변경</h2>
      <div>
        <label>아이디</label><br />
        <input type="text" placeholder="아이디를 입력해 주세요" v-model="changeUserId" />
      </div>
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
      <p v-if="changeErrorMsg" style="color: red">{{ changeErrorMsg }}</p>
      <p v-if="changeSuccessMsg" style="color: green">{{ changeSuccessMsg }}</p>
      <button @click="changePassword">비밀번호 변경</button>
    </div>

    <hr />

    <button @click="router.push('/user/login')">로그인으로 돌아가기</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const findName = ref('')
const findEmail = ref('')
const findErrorMsg = ref('')
const foundUserId = ref('')

const changeUserId = ref('')
const newPassword = ref('')
const showPassword = ref(false)
const changeErrorMsg = ref('')
const changeSuccessMsg = ref('')

onMounted(() => {
  document.title = '잔고야 - 계정 찾기'
})

const findAccount = async () => {
  foundUserId.value = ''
  findErrorMsg.value = ''

  if (!findName.value) { findErrorMsg.value = '이름을 입력해주세요'; return }
  if (!findEmail.value) { findErrorMsg.value = '이메일을 입력해주세요'; return }

  try {
    const res = await axios.get('/api/users', {
      params: { name: findName.value, email: findEmail.value }
    })
    if (res.data.success) foundUserId.value = res.data.userId
  } catch (error) {
    findErrorMsg.value = error.response?.data?.message || '아이디 찾기에 실패했습니다'
  }
}

const changePassword = async () => {
  changeErrorMsg.value = ''
  changeSuccessMsg.value = ''

  if (!changeUserId.value) { changeErrorMsg.value = '아이디를 입력해주세요'; return }
  if (!newPassword.value) { changeErrorMsg.value = '새 비밀번호를 입력해주세요'; return }

  try {
    const res = await axios.get('/api/users', {
      params: { userId: changeUserId.value }
    })

    if (res.data.success) {
      await axios.patch(`/api/users/${res.data.id}`, {
        password: newPassword.value
      })
      changeSuccessMsg.value = '비밀번호가 변경되었습니다!'
      changeUserId.value = ''
      newPassword.value = ''
      setTimeout(() => { router.push('/user/login') }, 2000)
    }
  } catch (error) {
    changeErrorMsg.value = error.response?.data?.message || '비밀번호 변경에 실패했습니다'
  }
}
</script>