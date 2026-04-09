import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  // 로그인한 유저 정보 (비밀번호 제외)
  const user = ref(null)

  // 로그인 여부 상태
  const isLoggedIn = ref(false)

  // 로그인
  const login = async (userId, password) => {
    try {
      const res = await axios.post('/api/users/login', { userId, password })
      if (res.data.success) {
        const { password, ...userWithoutPassword } = res.data.data
        user.value = userWithoutPassword
        isLoggedIn.value = true
        localStorage.setItem('user', JSON.stringify(userWithoutPassword))
        return { success: true }
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || '로그인에 실패했습니다' }
    }
  }

  // 로그아웃
  const logout = () => {
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('user')
  }

  // 새로고침 시 로그인 유지
  const initUser = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
      isLoggedIn.value = true
    }
  }

  // 현재 로그인한 유저 정보 반환
  const getCurrentUser = () => {
    return user.value
  }

  // 회원탈퇴
  const deleteUser = async () => {
    await axios.delete(`/api/users/${user.value.id}`)
    logout()
  }

  return { user, isLoggedIn, login, logout, initUser, getCurrentUser, deleteUser }
})