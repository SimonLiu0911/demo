import { inject } from 'vue';

export default function () {
  // toast
  const toast = inject('$toast');
  const successIcon = inject('successIcon');
  const errorIcon = inject('errorIcon');

  /**
   * 時間戳轉換成日期格式
   * @param {*} timestamp 時間戳 
   * @returns 日期格式
   */
  const timestampToDateString = (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  /**
   * 日期格式換成時間戳轉
   * @param {*} dateString 日期格式
   */
  const dateStringToTimestamp = (dateString) => {
    console.log(dateString);
  };

  /**
   * 複製帳號功能
   * @param {*} text 要copy的字串
   */
  const copyAccount = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('帳號已複製', { icon: successIcon });
      })
      .catch((error) => {
        console.log(error);
        toast.error('複製失敗', { icon: errorIcon });
      });
  };

  /**
   * 轉換成money
   * @param {*} value 數字
   * @returns 
   */
  const setMoney = (value) => {
    const reg = /^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/;

    return String(value).replace(reg, (all, pre, groupOf3Digital) => pre + groupOf3Digital.replace(/\d{3}/g, ',$&'));
  };

  return {
    timestampToDateString,
    dateStringToTimestamp,
    copyAccount,
    setMoney,
    toast,
    successIcon,
    errorIcon
  };
}
