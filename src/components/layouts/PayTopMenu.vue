<template lang="pug">
.pay-top-menu-container
  .pay-top-menu
    .pay-top-menu-left
      button(type="button" @click="toHomePage")
      small.pay-top-menu-left-system(v-if="serviceName") | {{serviceName}}

    .pay-top-menu-right
      ul.pay-top-menu-right-menu
        template(v-for="item in menuToggle")
          button.pay-top-menu-right-menu-drop-menu-button(
            v-if="collapseMenu(item.prop)"
            :class="{'active': getActiveMenuIndex(user.header[item.prop]) > -1, 'show': item.show}"
            @click="showMenuList(item)"
          )
            .default
              img(
                v-if="getActiveMenuIndex(user.header[item.prop]) > -1"
                :src="domainTypeForIcon(getActiveProp(user.header[item.prop]), item.show)"
              )
              img(
                v-else
                :src="domainTypeForIcon({ class: 'ic-sso-shop-info' })"
              )
              span {{ getActiveProp(user.header[item.prop],item.name) }}
              PayIcon.icon.rotate-icon(
                iconName="ic-down"
                :class="{'rotate-180':item.show}"
              )
            .mask(v-show="item.show")
            Transition(name="pop")
              .pay-top-menu-right-menu-drop-menu(
                v-show="item.show"
                ref="list"
              )
                ul
                  li(
                    v-for="(service, i) in user.header[item.prop]"
                    :key="service.systemname"
                    @click="linkTo(service.systemname)"
                  )
                    a(:class="{ 'text-active': service.systemname === active }") {{ service.systemnamecn }}
          li(
            v-else
            v-for="(service, i) in user.header[item.prop]"
            :key="service.systemname"
            :class="{'active': getActiveMenuIndex(user.header[item.prop][i])}"
          )
            a.flex.items-center(@click="linkTo(service.systemname)")
              img(:src="domainTypeForIcon(service)")
              | {{ service.systemnamecn }}
      button.pay-top-menu-right-icon(
        type="button"
        v-if="firstLetter"
        @click="infoIsShow = !infoIsShow"
      ) {{ firstLetter }}
      Transition(name="info")
        PayInfo(v-show="infoIsShow")
      .mask(
        v-show="infoIsShow"
        @click="infoIsShow = false"
      )
  PayAlert
  PaySidebar(v-if="!isErrorPage")
</template>

<script setup>
import { getSystemName } from '@/api';
import { ref, reactive, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useCommonStore } from '@/stores/common';
import { useRoute } from 'vue-router';

/**
 * @param { String } serviceName 服務名稱
 * @param { Boolean } isQueryByCode 是否為客服反查
 */
const props = defineProps({
  serviceName: String,
  isQueryByCode: {
    type: Boolean,
    default: false
  }
});

const currentRoute = useRoute();

const common = useCommonStore();

const menuToggle = reactive([
  { prop: 'servicelist2', show: false, name: '下拉選單一' },
  { prop: 'addition', show: false, name: '下拉選單二' },
  { prop: 'account2', show: false, name: '下拉選單三' },
  { prop: 'infoitem2', show: false, name: '下拉選單四' }
]);
const infoIsShow = ref(false);
const active = ref('payment');

const user = useUserStore();

const firstLetter = computed(() => user.userData?.email?.substring(0, 1)?.toUpperCase());

onMounted(async () => {
  await user.hasUserDataPromise;
  await user.getMerchantInfo();

  if (user.merchantInfo.merchantStatus === 's') {
    common.pushAlert({
      type: 'fail',
      msg: '服務暫停中，如有任何疑問，請聯繫客服人員'
    });
  }

  if (user.SSOTestDomain) active.value = 'payment_test';
});

const collapseMenu = (menu) => {
  const showMenu = ['infoitem2', 'addition'].includes(menu);
  if (!showMenu) return false;
  let menuLength = 0;
  // 加值服務 > 3 收合
  if (menu === 'addition') {
    menuLength = user.header[menu]?.length ?? 0;
    if (menuLength < 3) return false;
  }
  //  商店管理 按鈕總數 > 6 收合
  if (menu === 'infoitem2') {
    menuLength = Object.values(user.header).reduce(
      (previousValue, currentValue) => previousValue + currentValue.length,
      0
    );
    if ((menuLength < 6) || user.header[menu]?.length < 2) return false;
  }
  return true;
};

const getActiveMenuIndex = (menu) => {
  if (!menu?.length) {
    return menu.systemname === active.value;
  }

  return menu.findIndex((item) => item.systemname === active.value);
};

const getActiveProp = (menu, propName = '') => {
  if (propName) {
    return getActiveMenuIndex(menu) > -1 ? menu[getActiveMenuIndex(menu)].systemnamecn : propName;
  }

  return menu[getActiveMenuIndex(menu)];
};

const domainTypeForIcon = (service, show = false) => {
  const domain = location.origin;
  let imgDomain = 'img';

  if (domain.includes('dev')) imgDomain = 'imgd';

  if (domain.includes('sit')) imgDomain = 'imgs';

  return `https://${imgDomain}.1177tech.com.tw/icon/${service.systemname === active.value || show ? 'blue' : 'gray'}/${service.class}.svg`;
};

const linkTo = (system) => {
  window.location.href = `${window.location.protocol}//${user.SSODomain
  }/SSO/DivertServlet?systemname=${system}&token=${localStorage.getItem(
    'token'
  )}&simulation=${sessionStorage.getItem('simulation')}`;
};

const toHomePage = async () => {
  if (props.isQueryByCode) return;
  // 跳到首頁
  const system = await getSystemNameHandler();
  linkTo(system);
};

const showMenuList = (item) => {
  item.show = !item.show;
};

const getSystemNameHandler = async () => {
  const envReg = /uat/g;
  const sendData = {
    page: 'sso_home',
    env: window.location.host.match(envReg) !== null ? 'uat' : 'dev'
  };
  const { data, rc } = await getSystemName(sendData);

  if (+rc === 0) return data;
};
</script>

<style lang="scss" scoped>
.pay-top-menu-container {
  position: fixed;
  z-index: 3000;
  width: 100%;
  top: 0%;
  box-shadow: 5px 2px 10px 0 rgba(0, 0, 0, 0.12);
  background: #fff;

  @media screen and (min-width:2561px) {
    background: linear-gradient(to right, #e9ebec 0%, rgba(238, 238, 238, 0) 5%, #ffffff 10%, #ffffff 90%, rgba(238, 238, 238, 0) 95%, #e9ebec 100%)
  }
}

.pay-top-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 40px;
  max-width: 1920px;
  margin: auto;
  background-color: #fff;
  min-height: 72px;
}

.pay-top-menu-left {
  display: flex;
  align-items: flex-end;

  .pay-top-menu-left-logo {
    width: 140px;
    height: 22px;
  }

  .pay-top-menu-left-system {
    color: #333;
    letter-spacing: 0.75px;
    font-weight: 300;
    margin-left: 4px;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
  }
}

.pay-top-menu-right {
  align-items: center;
  color: #666666;
  display: flex;
  font-size: 16px;
  letter-spacing: 1px;

  .pay-top-menu-right-menu {
    display: flex;

    >li a {
      display: inline-block;
      height: 100%;
      padding: 23px 26px;
      cursor: pointer;

      img {
        width: 20px;
        height: 20px;
        margin-right: 8px;
        display: inline-block;
      }
    }
  }

  .pay-top-menu-right-icon {
    border-radius: 16px;
    background-color: #5c74b0;
    width: 40px;
    height: 40px;
    color: #fff;
    line-height: 40px;
    margin-left: 32px;
    position: relative;
  }
}

.pay-top-menu-right-menu-drop-menu-button {
  padding: 23px 26px;
  position: relative;
  background-color: #fff;
  z-index: 100;

  &.show {
    background-color: rgba(50, 170, 255, 0.12);
    color: #5789b1;
  }

  .mask {
    background-color: transparent;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100vw;
    height: 100vh;
  }
}

.default {
  display: flex;
  align-items: center;

  img {
    margin-right: 8px;
    width: 24px;
    height: 24px;
  }

  .icon {
    width: 12px;
    height: 12px;
    margin-left: 8px;

    &.rotate-icon {
      transition: all 0.1s ease;
    }
  }
}

.pay-top-menu-right-menu-drop-menu {
  margin-top: 28px;
  position: absolute;
  right: 0px;
  left: 0;
  z-index: 10;
  background-color: #fff;
  color: #363636;
  border-radius: 4px;
  box-shadow: 5px 2px 12px 0 rgba(0, 0, 0, 0.12);

  li {
    text-align: center;
    padding: 12px 0;

    &:hover {
      background: rgba(50, 170, 255, 0.2);
      font-weight: 500;
    }
  }
}

.active {
  color: #386fd3;
  border-bottom: 2px solid #386fd3;
}

.text-active {
  color: #5789b1;
}

.mask {
  background-color: transparent;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
}

.pop-enter-active,
.info-enter-active {
  transition: all 0.3s ease;
}

.pop-leave-active,
.info-leave-active {
  transition: all 0.05s ease;
}

.pop-enter-from,
.pop-leave-to {
  transform: translateY(-3px);
}

.info-enter-from,
.info-leave-to {
  top: -10px;
}
</style>
