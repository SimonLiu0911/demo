import { getSSODomain, getUserInfo, changeRole, verify, ifSSODomain, getMerchantInfo } from '@/api';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userData: {},
    token: '',
    ticket: '',
    function: [],
    header: [],
    menu: [],
    merchantInfo: {},
    hasUserDataPromise: Promise.resolve(),
    SSODomain: '',
    SSOTestDomain: '',
    isAtUAT: false,
    simulation: false
  }),
  actions: {
    async ifSSODomain () {
      const system = 'fixedvap';
      const hasTestEnvSystems = ['authsys', 'eshopping', 'payment', 'fixedvap']; // 有測試環境的系統
      const promise = (async () => {
        if (hasTestEnvSystems.includes(system)) {
          const { rc, testEnv, url } = await ifSSODomain();
          if (+rc !== 0) throw new Error('系統錯誤');

          if (+testEnv === 1) {
            if (window.location.host.includes('uat')) this.isAtUAT = true;

            this.SSOTestDomain = url;
            this.SSODomain = url;

            await this.verify();

            return;
          }
        }
        await this.getSSODomain();
        await this.verify();
      })();

      this.hasUserDataPromise = promise;
    },
    async getSSODomain () {
      const { rc, rm, domain } = await getSSODomain();

      if (+rc !== 0) {
        throw new Error(rm);
      }

      this.SSODomain = domain;
    },
    async verify () {
      // token / ticket choose one
      const { rc, rm, token } = await verify();
      this.simulation = Boolean(sessionStorage.getItem('simulation') ?? false) ?? null;
      if (+rc === 0) {
        const sendUserData = {
          token,
          systemname: 'fixedvap'
        };
        await this.getUserInfo(sendUserData);
      } else {
        throw new Error(rm);
      }
    },
    async getUserInfo (sendData) {
      const data = await getUserInfo(sendData);
      if (+data.rc === 0) {
        this.userData = data.userdata;
        this.header = data.header;
        this.menu = data.menu;
        this.function = data.function;
      } else {
        throw new Error('系統錯誤');
      }
    },
    async changeUserRole (sendData) {
      const { rc, rm } = await changeRole(sendData);
      if (+rc !== 0) {
        throw new Error(rm);
      }
    },
    async getMerchantInfo (sendData) {
      const { rc, data } = await getMerchantInfo(sendData);

      if (rc !== '0') throw new Error(rm);

      this.merchantInfo = { ...data };
    }
  }
});
