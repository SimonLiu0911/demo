import { useUserStore } from '@/stores/user';
import { useCommonStore } from '@/stores/common';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import ToastError from '@/components/common/toast/ToastError.vue';

const $toast = useToast();

let loadingTimer = '';

const { protocol, host } = window.location; // 協議、主機
const reg = /^localhost+/;

const request = axios.create({
  // 本機 http://localhost:8012 / 動態
  baseURL: reg.test(host) ? 'http://localhost:8012' : `${protocol}//${host}`,
  timeout: 15e3,
  headers: {
    common: {
      simulation: sessionStorage.getItem('simulation'),
      Authorization: localStorage.getItem('token')
    }
  }
});

request.interceptors.request.use(
  (config) => {
    showLoading();

    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    hideLoading();

    const user = useUserStore();
    const { data } = response;
    // 判斷 user 資料是否過期
    const notShowToastList = [];
    if (+data.rc === 2104) {
      sessionStorage.clear();
      localStorage.clear();
      const regex = /f2e/g;
      const url = `${protocol}//${user.SSODomain}`;
      if (window.location.href.match(regex)) {
        window.location.href = `${`${url}/f2e/SSO/#/timeOut`}`;
      } else {
        window.location.href = `${`${url}/SSO/#/timeOut`}`;
      }
    } else if (+data.rc === 103) {
      $toast.clear();
    } else if (+data.rc !== 0 && data.rc && !notShowToastList.includes(response.config.url)) {
      $toast.error(data.rm, {
        icon: ToastError
      });
    }
    return response;
  },
  (error) => {
    const common = useCommonStore();
    if (!window.navigator.onLine) {
      return Promise.reject(new Error('網路出了點問題，請重新連線後重整網頁'));
    }
    $toast.error('系統錯誤', { icon: ToastError });

    common.setBtnDisabled = false;
    return Promise.reject(error);
  }
);

export default request;

const showLoading = () => {
  if (loadingTimer) window.clearTimeout(loadingTimer);
  const common = useCommonStore();
  loadingTimer = setTimeout(() => {
    common.setLoading(true);
  }, 500);
};

const hideLoading = () => {
  const common = useCommonStore();
  window.clearTimeout(loadingTimer);
  common.setLoading(false);
};
