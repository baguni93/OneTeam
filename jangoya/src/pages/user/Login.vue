<template>
  <div>
    <h1>잔고야</h1>
    <p>잔고야, 괜찮아?</p>

    <div>
      <label>아이디</label><br />
      <input type="text" placeholder="ID를 입력해 주는 고야" v-model="userId" />
    </div>

    <div>
      <label>비밀번호</label><br />
      <div>
        <input
          :type="showPassword ? 'text' : 'password'"
          placeholder="비밀번호를 입력해 주는 고야"
          v-model="password"
        />
        <button @click="showPassword = !showPassword">👁</button>
      </div>
    </div>

    <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>

    <button @click="login">로그인</button>
    <button @click="router.push('/user/register')">회원가입</button>

    <div>
      <span class="link" @click="router.push('/user/findaccount')">아이디/비밀번호를 잊은고야?</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const userId = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMsg = ref('')

onMounted(() => {
  document.title = '잔고야 - 로그인'
})

const login = async () => {
  if (!userId.value && !password.value) {
    errorMsg.value = '아이디와 비밀번호를 입력해주세요'
    return
  }
  if (!userId.value) {
    errorMsg.value = '아이디를 입력해주세요'
    return
  }
  if (!password.value) {
    errorMsg.value = '비밀번호를 입력해주세요'
    return
  }

  const result = await userStore.login(userId.value, password.value)

  if (result.success) {
    errorMsg.value = ''
    router.push('/')
  } else {
    errorMsg.value = result.message
  }
}
</script>

<style scoped>
.link {
  cursor: pointer;
  text-decoration: underline;
  color: inherit;
  transition: color 0.2s;
}

.link:hover {
  color: blue;
}
</style>