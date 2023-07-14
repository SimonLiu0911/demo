<template lang="pug">
.pay-info-container
  .pay-info-content
    section.pay-info-section
      small.pay-info-small-text(v-if="user.userData.position") - {{ user.userData.position }} -
      p.mb-0 {{ user.userData.username }}
      small.pay-info-small-text {{ user.userData.userid }}
    section.pay-info-section(v-if="(user.userData.part == 'E' || (user.userData.part == 'I' && isSimulation)) && !atShop")
      p {{ user.userData.unitname }}
      small.pay-info-small-text {{ user.userData.unitnumber }}
    hr.divider
    button.pay-info-blue-btn(
      type="button"
      @click="toModifyPwdPage"
    ) 修改密碼
    template(v-if="user.userData.merchantchoose && !atShop" )
      hr.divider
      button.pay-info-blue-btn(
        type="button"
        @click="toShop"
      ) 切換商店
    hr.divider
    button.pay-info-red-btn(
      type="button"
      @click="logout"
    ) 登出
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';

const user = useUserStore();

const isSimulation = computed(() => sessionStorage.getItem('simulation') === '1');

const atShop = computed(() => window.location.href.includes('SelectMerchantNum'));

const toModifyPwdPage = () => {
  const regex = /f2e/g;

  window.location.href = `${window.location.protocol}//${user.SSODomain}${window.location.href.match(regex) !== null ? '/f2e' : ''}/SSO/#/modifyPwd`;
};

const toShop = () => {
  window.location.href = `${window.location.protocol}//${user.SSODomain}/SSO/#/ext/SelectMerchantNum`;
};

const logout = () => {
  // 導回外部首頁
  // 內部人員登出到 int
  // 外部人員登出到 ext
  // 模擬人員登出到 int 用 part判斷
  window.location.href = `${window.location.protocol}//${user.SSODomain}/SSO/#/${user.userData.part === 'I' ? 'int' : 'ext'}`;
};

</script>

<style lang="scss" scoped>
  .pay-info-container {
    position: relative;
  }

  .pay-info-section:not(:first-child) {
    margin-top: 12px;
  }

  .pay-info-blue-btn {
    color: #5789b1;
  }

  .pay-info-red-btn {
    color: #eb5b2c;
  }

  .pay-info-small-text {
    color: #9d9d9e;
  }

  .pay-info-content {
    background-color: #fff;
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.04), 0 2px 20px 0 rgba(0, 0, 0, 0.2);
    border-radius: 22px;
    border: solid 0.5px rgba(0, 0, 0, 0.05);
    color: #333333;
    line-height: 1.5;
    min-width: 236px;
    padding: 22px;
    position: absolute;
    right: -40px;
    top: 40px;
    text-align: center;
    z-index: 101;
  }

  .divider {
    border-color: #e9e9e9;
    margin: 12px 0;
    width: 100%;
  }

</style>
