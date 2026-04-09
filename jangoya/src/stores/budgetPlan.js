import {defineStore} from 'pinia';
import {reactive, ref} from 'vue';
import axios from 'axios';


const BASEURL = '/api/budget_plans';

export const useBudgetPlanStore = defineStore('budgetPlan', ()=> {
    const budget = ref(null);
    const categories = ref([]);

    const fetchBudgetPlan = async ({userId, month}) => { 
        // 더미데이터 임시 사용
        budget.value = {
            id: '1',
            userId: '1',
            month: new Date().toISOString().slice(0,7),
            total_budget: 1000000,
            category_budgets: [
                {categoryId: '1', amount: 500000},
            ]
        }; // <- 추후 삭제 예정.

        //try {
        //    const res = await axios.get(BASEURL, {params: {userId,month}});
        //   budget.value = res.data[0] || null;
        //} catch(e) {
        //    alert('예산 조회 실패: ' + e);
        //} ---api 연결 시, 주석 해제.---
    };
    const fetchCategories = async () => {
        // 더미데이터 임시 사용
        categories.value = [
            { id: '1', name: '월급', type: 'income', color: 'red' },
            { id: '2', name: '용돈', type: 'income', color: 'blue' },
            { id: '3', name: '기타', type: 'income', color: 'green' },
            { id: '4', name: '식비', type: 'expense', color: 'orange' },
            { id: '5', name: '교통비', type: 'expense', color: 'yellow' },
        ]; // <- 추후 삭제 예정.

        //try {
        //    const res = await axios.get('/api/categories');
        //    categories.value = res.data;
        //} catch(e) {
        //    alert('카테고리 조회 실패: ' + e);
        //} ---api 연결 시, 주석 해제.---
    };
    const addBudget = async (payload) => {
        // 더미데이터 임시 사용
        console.log('추가할 데이터: ',payload);
        // <- 추후 삭제 예정.

        //try {
        //    await axios.post(BASEURL, payload);
        //} catch(e) {
        //    alert('예산 수정 실패:' + e);
        //} ---api 연결 시, 주석 해제.---
    };
    const deleteBudget = async (id) => {
        // 더미데이터 임시 사용
        console.log('삭제할 id: ', id);
        budget.value = null;
        // <- 추후 삭제 예정.

        //try {
        //    await axios.delete(`${BASEURL}/${id}`);
        //    budget.value = null;
        //} catch(e) {
        //    alert('예산 삭제 실패:' + e);
        //} ---api 연결 시, 주석 해제.---
    };
    const updateBudget = async (id, payload) => {
        // 더미데이터 임시 사용
        console.log('수정할 데이터: ', id, payload);
        await fetchBudgetPlan({userId: '1', month: new Date().toISOString().slice(0,7)}); 
        // <-추후 삭제 예정.

        //try {
        //    const res = await axios.patch(`${BASEURL}/${id}`, payload);
        //    if (res.status === 200) {
        //        await fetchBudgetPlan();
        //    } else {
        //        alert('예산 수정 실패');
        //    }
        //} catch(e) {
        //    alert('예산 수정 실패:'+ e);
        //} ---api 연결 시, 주석 해제.---
    };

    return {budget, categories, fetchBudgetPlan, fetchCategories, addBudget, updateBudget, deleteBudget};
});