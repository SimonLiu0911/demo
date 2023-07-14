import { createRouter, createWebHashHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { map } from '@/map/submenu';

const routes = [
  {
    path: '/',
    redirect: { name: 'HomePage' },
    component: () => import('@/components/layouts/PayLayout.vue'),
    children: [
      // 首頁
      {
        path: '/home',
        name: 'HomePage',
        meta: {
          title: '服務首頁 | 固定式虛擬帳號'
          // hasAuthority: true
        },
        component: () => import('@/views/HomePage.vue')
      },
      // 產生收款帳號
      {
        path: '/accountCreate',
        name: 'AccountCreate',
        meta: {
          title: '產生收款帳號 | 固定式虛擬帳號',
          hasAuthority: true
        },
        component: () => import('@/views/AccountCreate.vue')
      },
      // 交易查詢
      {
        path: 'transactionSearch',
        name: 'TransactionSearch',
        meta: {
          title: '交易查詢 | 固定式虛擬帳號',
          hasAuthority: true
        },
        component: () => import('@/views/TransactionSearch.vue')
      },
      // 客服反查頁
      {
        path: '/querybycode',
        name: 'QueryByCode',
        meta: { title: '固定式虛擬帳號 | 客服系統' },
        component: () => import('@/views/QueryByCode.vue')
      },
      {
        path: '/:catchAll(.*)',
        name: 'ErrorPage',
        meta: {
          title: '固定式虛擬帳號',
          hasAuthority: false,
          isErrorPage: true
        },
        component: () => import('@/views/ErrorPage.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to) => {
  const user = useUserStore();

  try {
    if (to.meta.title) document.title = to.meta.title;

    if (to.meta.hasAuthority === true) {
      if (user.function.length !== 0) {
        const functionList = user.function;
        const key = Object.keys(map).find((key) => map[key].includes(to.name));
        if (!functionList.includes(key)) {
          if (to.name !== 'HomePage') return { name: 'HomePage' };
        }
      }
    }
  } catch (error) {
    console.log(error);
    sessionStorage.clear();
    localStorage.clear();
    const regex = /f2e/g;
    window.location.href = `${window.location.protocol}//${user.SSODomain}${window.location.href.includes(regex) ? '/f2e' : ''}/SSO/#/timeOut`;
  }
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});

export default router;
