import { createRouter, createWebHistory } from 'vue-router';
import Main from '@/pages/Main.vue';
import Transction from '@/pages/Transction.vue';
import AddTransction from '@/pages/AddTransction.vue';
import SelectCategory from '@/pages/SelectCategory.vue';
import EditTransction from '@/pages/EditTransction.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/user/login', name: 'user/login', component: Login },
    { path: '/user/mypage', name: 'mypage', component: Mypage },
    {
      path: '/user/findaccount',
      name: 'user/findaccount',
      component: FindAccount,
    },
    { path: '/user/register', name: 'user/register', component: Register },

    { path: '/', name: 'main', component: Main },
    { path: '/transction', name: 'transction', component: Transction },
    {
      path: '/transction/add',
      name: 'transction/add',
      component: AddTransction,
    },
    {
      path: '/transaction/select/category',
      name: 'transaction/select/category',
      component: SelectCategory,
    },
    {
      path: '/transaction/edit/:id',
      name: 'transaction/edit/:id',
      component: EditTransction,
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
    },
    {
      path: '/category/filter',
      name: 'category/filter',
      component: CategoryFilter,
    },
    {
      path: '/mypage/category',
      name: 'mypage/category',
      component: Category,
    },
    {
      path: '/mypage/category/edit',
      name: 'mypage/category/edit',
      component: EditCategory,
    },
    {
      path: '/mypage/category/add',
      name: 'mypage/category/add',
      component: AddCategory,
    },
    {
      path: '/categoryicon',
      name: 'categoryicon',
      component: Categoryicon,
    },
    {
      path: '/categorycolor',
      name: 'categorycolor',
      component: CategoryColor,
    },
    {
      path: '/budget',
      name: 'budget',
      component: Budget,
    },
    {
      path: '/budget/new',
      name: 'budget/new',
      component: NewBudget,
    },
    {
      path: '/budget/edit/:id',
      name: 'budget/edit/:id',
      component: EditBudget,
    },
    {
      path: '/budget/delete',
      name: 'budget/delete',
      component: DeleteBudget,
    },
  ],
});

export default router;
