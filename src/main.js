import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import vSelect from 'vue-select';
import DatePicker from 'vue-datepicker-next';
import Toast, { useToast } from 'vue-toastification';
import ToastSuccess from '@/components/common/toast/ToastSuccess.vue';
import ToastError from '@/components/common/toast/ToastError.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import 'virtual:svg-icons-register';
import './assets/tailwind.css';
import '@/style/main.scss';

const pinia = createPinia();
const app = createApp(App);

import { useUserStore } from '@/stores/user.js';
import { accountSchema } from '@/utils/validation.js';


app.component('PayIcon', SvgIcon);

app.use(pinia);
app.use(router);
app.use(vSelect);
app.use(DatePicker);
app.use(Toast, {
  position: 'top-center',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  draggable: false,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: false,
  rtl: false,
  transition: 'Vue-Toastification__fade',
  icon: true
});

app.mount('#app');

const toast = useToast();

app.provide('$toast', toast);
app.provide('successIcon', ToastSuccess);
app.provide('errorIcon', ToastError);
app.provide('schema', {
  accountSchema
});

const user = useUserStore();

try {
  user.ifSSODomain();
} catch (e) {
  console.log(e);
}
