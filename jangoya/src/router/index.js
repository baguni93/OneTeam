import { createRouter, createWebHistory } from 'vue-router';
import Main from '@/pages/main/Main.vue';
import Transction from '@/pages/transaction/Transction.vue';
import AddTransction from '@/pages/transaction/AddTransction.vue';
import SelectCategory from '@/pages/transaction/SelectCategory.vue';
import EditTransction from '@/pages/transaction/EditTransction.vue';
import Login from '@/pages/user/Login.vue';
import Mypage from '@/pages/user/Mypage.vue';
import FindAccount from '@/pages/user/FindAccount.vue';
import Register from '@/pages/user/Register.vue';
import Search from '@/pages/user/Search.vue';
import CategoryFilter from '@/pages/categoryfilter/CategoryFilter.vue';
import Category from '@/pages/category/Category.vue';
import AddCategory from '@/pages/category/AddCategory.vue';
import CategoryIcon from '@/pages/category/CategoryIcon.vue';
import CategoryColor from '@/pages/category/CategoryColor.vue';
import EditCategory from '@/pages/category/EditCategory.vue';
import Budget from '@/pages/budget/Budget.vue';
import DeleteBudget from '@/pages/budget/DeleteBudget.vue';
import EditBudget from '@/pages/budget/EditBudget.vue';
import NewBudget from '@/pages/budget/NewBudget.vue';
import SelectModalCategory from '@/pages/transaction/SelectModalCategory.vue';

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
      name: 'transaction/edit/id',
      component: EditTransction,
      children: [
        {
          path: 'modalcategory',
          component: SelectModalCategory,
        },
      ],
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
      component: CategoryIcon,
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
