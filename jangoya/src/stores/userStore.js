import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useUserStore = defineStore('user', () => {
  // 로그인한 유저 정보 (비밀번호 제외)
  const user = ref(null);

  // 로그인 여부 상태
  const isLoggedIn = ref(false);

  // 로그인
  // userId, password를 받아서 서버에 로그인 요청
  // 성공 시 유저 정보를 세션스토리지에 인코딩해서 저장
  const login = async (userId, password) => {
    try {
      const res = await axios.post('/api/users/login', { userId, password });
      if (res.data.success) {
        // 비밀번호는 제외하고 나머지 정보만 저장
        const { password: _, ...userWithoutPassword } = res.data.data;
        user.value = userWithoutPassword;
        isLoggedIn.value = true;
        // 한글 지원을 위해 encodeURIComponent로 변환 후 btoa로 인코딩해서 저장
        sessionStorage.setItem( //  변경
          'user',
          btoa(
            unescape(encodeURIComponent(JSON.stringify(userWithoutPassword))),
          ),
        );
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || '로그인에 실패했습니다',
      };
      return {
        success: false,
        message: error.response?.data?.message || '로그인에 실패했습니다',
      };
    }
  };

  // 로그아웃
  // 유저 정보 초기화 및 세션스토리지에서 삭제
  const logout = () => {
    user.value = null;
    isLoggedIn.value = false;
    sessionStorage.removeItem('user'); //  로컬에서 섹션으로변경
  };

  // 새로고침 시 로그인 유지
  // 세션스토리지에 저장된 유저 정보를 디코딩해서 불러옴
  const initUser = () => {
    const savedUser = sessionStorage.getItem('user'); //  로컬에서 섹션으로 변경
    if (savedUser) {
      // btoa로 인코딩된 데이터를 atob로 디코딩 후 한글 복원
      user.value = JSON.parse(decodeURIComponent(escape(atob(savedUser))));
      isLoggedIn.value = true;
    }
  };

  // 현재 로그인한 유저 정보 반환
  // 다른 컴포넌트에서 userStore.getCurrentUser()로 호출해서 사용
  const getCurrentUser = () => {
    return user.value;
  };

  // 회원탈퇴
  // 서버에서 유저 삭제 후 로그아웃 처리
  const deleteUser = async () => {
    await axios.delete(`/api/users/${user.value.id}`);
    logout();
  };

  return {
    user,
    isLoggedIn,
    login,
    logout,
    initUser,
    getCurrentUser,
    deleteUser,
  };
});