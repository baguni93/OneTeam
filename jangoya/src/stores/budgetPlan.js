import {defineStore} from 'pinia';
import {reactive, ref} from 'vue';
import axios from 'axios';


const BASEURL = '/api/budget_plans';

export const useBudgetPlanStore = defineStore('budgetPlan', ()=> {
    const budget = ref(null);
    const categories = ref([]);

    const fetchBudgetPlan = async ({userId, month}) => { 

        try {
            const res = await axios.get(BASEURL, {params: {userId,month}});
           budget.value = res.data[0] || null;
        } catch(e) {
            alert('예산 조회 실패: ' + e);
        } 
    };
    const fetchCategories = async () => {
        // 더미데이터 임시 사용
        categories.value = [
            { id: '1', name: '월급', type: 'income', color: 'red', icon: 'bi-cash' },
            { id: '2', name: '용돈', type: 'income', color: 'blue', icon: 'bi-piggy-bank' },
            { id: '3', name: '기타', type: 'income', color: 'green', icon: 'bi-three-dots' },
            { id: '4', name: '식비', type: 'expense', color: 'orange', icon: 'bi-cup-straw' },
            { id: '5', name: '교통비', type: 'expense', color: 'yellow', icon: 'bi-bus-front' },
            { id: '6', name: '쇼핑', type: 'expense', color: 'pink', icon: 'bi-bag' },
            { id: '7', name: '의료비', type: 'expense', color: 'red', icon: 'bi-hospital' },
            { id: '8', name: '문화생활', type: 'expense', color: 'purple', icon: 'bi-camera' },
            { id: '9', name: '통신비', type: 'expense', color: 'gray', icon: 'bi-phone' },
            { id: '10', name: '주거비', type: 'expense', color: 'brown', icon: 'bi-house' },
        ]; // <- 추후 삭제 예정.

        //try {
        //    const res = await axios.get('http://localhost:3000/api/categories', {
        // params: {userId: '1}});
        //    categories.value = res.data;
        //} catch(e) {
        //    alert('카테고리 조회 실패: ' + e);
        //} ---api 연결 시, 주석 해제.---
    };
    const addBudget = async (payload) => {

        try {
            await axios.post(BASEURL, payload);
        } catch(e) {
            alert('예산 수정 실패:' + e);
        } 
    };
    const deleteBudget = async (id) => {

        try {
            await axios.delete(`${BASEURL}/${id}`);
            budget.value = null;
        } catch(e) {
            alert('예산 삭제 실패:' + e);
        } 
    };
    const updateBudget = async (id, payload) => {

        try {
            const res = await axios.patch(`${BASEURL}/${id}`, payload);
            if (res.status === 200) {
                await fetchBudgetPlan({userId: payload.userId, month: payload.month});
            } else {
                alert('예산 수정 실패');
            }
        } catch(e) {
            alert('예산 수정 실패:'+ e);
        } 
    };

    return {budget, categories, fetchBudgetPlan, fetchCategories, addBudget, updateBudget, deleteBudget};
});