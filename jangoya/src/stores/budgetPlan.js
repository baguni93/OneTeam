import {defineStore} from 'pinia';
import {reactive, ref} from 'vue';
import axios from 'axios';


const BASEURL = '/api/budget_plans';

export const useBudgetPlanStore = defineStore('budgetPlan', ()=> {
    const budget = ref(null);

    const fetchBudgetPlan = async ({userId, month}) => { 

        try {
            const res = await axios.get(BASEURL, {params: {userId,month}});
           budget.value = res.data[0] || null;
        } catch(e) {
            alert('예산 조회 실패: ' + e);
        } 
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

    return {budget, fetchBudgetPlan, addBudget, updateBudget, deleteBudget};
});