import { getAllBanks } from '@/api';
import { defineStore } from 'pinia';

export const useCommonStore = defineStore('common', {
  state: () => ({
    btnDisabled: false,
    $loading: false,
    /**
    * @param { Array } alerts
    * {
    *  @param { String } type alert類型(顯示不同icon:warn/success/notice/fail)
    *  @param { String } msg alert文字
    *  @param { Boolean } hasClose 是否出現關閉按鈕
    *  @param { Number } time 自動關閉秒數 若未設定為3秒鐘
    * }
    * */
    alerts: [],
    allBankList: []
  }),
  actions: {
    setBtnDisabled (payload) {
      this.btnDisabled = payload;
    },
    setLoading (payload) {
      if (this.$loading === payload) return;

      this.$loading = payload;
      this.btnDisabled = payload;
    },
    pushAlert (payload) {
      this.alerts = [];
      this.alerts.push(payload);
    },
    spliceAlert (payload) {
      this.alerts.splice(payload, 1);
    },
    popAlert () {
      this.alerts.pop();
    },
    async getAllBanks() {
      const { rc, rm, data } = await getAllBanks();

      if (rc !== '0') {
        throw new Error(rm);
      }

      this.allBankList = data.banks;
    }
  }
});
