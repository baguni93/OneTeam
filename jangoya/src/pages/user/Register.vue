<template>
  <div>
    <h1>회원가입</h1>

    <div>
      <label>이름</label><br />
      <input type="text" placeholder="이름을 입력해 주세요" v-model="name" />
    </div>

    <div>
      <label>아이디</label><br />
      <input type="text" placeholder="아이디를 입력해 주세요" v-model="userId" />
    </div>

    <div>
      <label>이메일</label><br />
      <input type="email" placeholder="이메일을 입력해 주세요 (예: hong@test.com)" v-model="email" />
    </div>

    <div>
      <label>비밀번호</label><br />
      <div>
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="비밀번호를 입력해 주세요"
          v-model="password"
        />
        <button @click="showPassword = !showPassword">👁</button>
      </div>
    </div>

    <div>
      <label>비밀번호 확인</label><br />
      <div>
        <input
          :type="showPasswordConfirm ? 'text' : 'password'"
          placeholder="비밀번호를 다시 입력해 주세요"
          v-model="passwordConfirm"
        />
        <button @click="showPasswordConfirm = !showPasswordConfirm">👁</button>
      </div>
    </div>

    <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>
    <p v-if="successMsg" style="color: green">{{ successMsg }}</p>

    <button @click="register">가입하기</button>
    <button @click="router.push('/user/login')">로그인으로 돌아가기</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const name = ref('')
const userId = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

onMounted(() => {
  document.title = '잔고야 - 회원가입'
})

const register = async () => {
  if (!name.value) { errorMsg.value = '이름을 입력해주세요'; return }
  if (!userId.value) { errorMsg.value = '아이디를 입력해주세요'; return }
  if (!email.value) { errorMsg.value = '이메일을 입력해주세요'; return }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMsg.value = '이메일 형식이 올바르지 않습니다 (예: hong@test.com)'
    return
  }

  if (!password.value) { errorMsg.value = '비밀번호를 입력해주세요'; return }
  if (!passwordConfirm.value) { errorMsg.value = '비밀번호 확인을 입력해주세요'; return }
  if (password.value !== passwordConfirm.value) {
    errorMsg.value = '비밀번호가 일치하지 않습니다'
    return
  }

  try {
    const res = await axios.post('/api/users', {
      userId: userId.value,
      name: name.value,
      email: email.value,
      password: password.value
    })

    if (res.data.success) {
      successMsg.value = '회원가입이 완료되었습니다!'
      errorMsg.value = ''
      setTimeout(() => { router.push('/user/login') }, 2000)
    }
  } catch (error) {
    errorMsg.value = error.response?.data?.message || '회원가입에 실패했습니다'
  }
}
</script>