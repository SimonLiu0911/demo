<template lang="pug">
.pay-sidebar(@mouseleave="setActive($route, false)")
  ul.flex.pay-sidebar-menu-container
    li.pay-sidebar-menu.menu(
      v-for="menu in menuList"
      :key="menu.mainfunction"
      @click="setActive($route, true, menu)"
      :class="{'active': active === menu.mainfunction && !show, 'show': active === menu.mainfunction && show}"
    )
      p.pay-sidebar-menu-name {{ menu.mainfunctiondesc }}
        PayIcon.icon(iconName="ic-down" :class="{'rotate': show}" v-if="menu.sublist.length")
      Transition(name="pop")
        ul.pay-sidebar-menu-submenu-container(
          v-if="menu.sublist.length"
          v-show="show"
        )
          li.pay-sidebar-menu-submenu(
            v-for="submenu in menu.sublist"
            :key="submenu.subfunction"
            :class="{'active': subMenuCollapsed === submenu.subfunction}"
            @click="toPage(submenu.subfunction)"
          )
            small {{ submenu.subfunctiondesc }}
  ul.pay-sidebar-menu-container
    li.pay-sidebar-more.pay-sidebar-menu(@click="setActive($route, true, selected)")
      p.pay-sidebar-menu-name(
        v-show="leftMenuList.length"
        :class="{'active': selected.mainfunctiondesc !== '更多'}"
      ) {{ selected.mainfunctiondesc }}
        PayIcon.icon(
          v-show="leftMenuList.length"
          iconName="ic-more"
          @click.native.stop="showMenuList()"
        )
      ul.pay-sidebar-menu-submenu-container(v-show="show" v-if="selected.sublist.length")
        li.pay-sidebar-menu-submenu(
          v-for="submenu in selected.sublist"
          :key="submenu.subfunction"
          :class="{ 'active': subMenuCollapsed === submenu.subfunction }"
          @click="toPage(submenu.subfunction)"
        )
          small {{ submenu.subfunctiondesc }}
      ul.flat-menu-container(
        v-show="showMoreMenu"
        @click.stop
      )
        li.flat-menu(
          v-for="menu in leftMenuList"
          :key="menu.mainfunction"
          :class="{ 'active': active === menu.mainfunction }"
          @click="setActive($route, true, menu)"
        )
          PayIcon.icon.left(
            v-if="menu.sublist.length"
            iconName="ic-down"
          )
          p {{ menu.mainfunctiondesc }}
          ul.flat-menu-submenu-container(
            v-if="menu.sublist.length"
            v-show="showMoreMenu"
          )
            li.pay-sidebar-menu-submenu.flat-menu-submenu(
              v-for="submenu in menu.sublist"
              :key="submenu.subfunction"
              :class="{ 'active':subMenuCollapsed === submenu.subfunction }"
              @click="toPage(submenu.subfunction)"
            )
              small {{submenu.subfunctiondesc}}
</template>

<script setup>
import { map } from '@/map/submenu.js';
import { ref, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const route = useRoute();
const user = useUserStore();

const show = ref(false);
const active = ref('');
const subMenuCollapsed = ref('');
const showMoreMenu = ref(false);
const showMenuLength = ref(Math.floor((window.innerWidth - 160) / 160));

const menuList = computed(() => {
  if (showMenuLength.value <= 0) return [];

  return user.menu.slice(0, showMenuLength.value);
});

const leftMenuList = computed(() => {
  if (showMenuLength.value <= 0) return user.menu;

  return user.menu.slice(showMenuLength.value);
});

const selected = computed(() => {
  const index = leftMenuList.value.findIndex((item) => item.mainfunction === active.value);

  if (index === -1) return { mainfunctiondesc: '更多', sublist: [] };

  return leftMenuList.value[index];
});

const showMenuList = () => {
  showMoreMenu.value = !showMoreMenu.value;
};

const hideMenuList = () => {
  showMoreMenu.value = false;
};

const toPage = (activeId) => {
  if (!activeId || route.name === map[activeId]?.split(',')[0]) return;

  router
    .push({ name: `${map[activeId].split(',')[0]}` })
    .catch((err) => console.log(err));
};

const setActive = (route, showState = false, menu = '') => {
  if (menu?.sublist?.length === 0) toPage(menu.mainfunction);

  show.value = showState;

  if (!route.path.includes('homePage')) {
    const key = Object.keys(map).find((key) => map[key].includes(route.name));
    let activeEl;

    if (key?.length === 7) {
      activeEl = key.substring(0, key.length - 2);
    } else {
      activeEl = key;
    }

    subMenuCollapsed.value = key;
    active.value = activeEl;
  }
  if (menu !== '' || route.path.includes('homePage')) {
    active.value = menu?.mainfunction ?? '';
    subMenuCollapsed.value = '';
  }
};
onMounted(() => {
  setActive(route);

  window.addEventListener('resize', () => {
    showMenuLength.value = Math.floor((window.innerWidth - 160) / 160);
  });

  document.addEventListener('click', hideMenuList, false);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {
    showMenuLength.value = Math.floor((window.innerWidth - 160) / 160);
  });

  document.removeEventListener('click', hideMenuList, false);
});

watchEffect(() => {
  setActive(route);
  hideMenuList();
});

</script>

<style lang="scss" scoped>
.pay-sidebar {
  background: #f9f9f9;
  backdrop-filter: blur(37px);
  display: flex;
  justify-content: space-between;
  max-width: 1920px;
  margin:auto;
  @media screen and (min-width:2561px) {
    background: linear-gradient(to right, #e9ebec 0%,rgba(238,238,238,0) 5%,#f9f9f9 10%,#f9f9f9 90%,rgba(238,238,238,0) 95%,#e9ebec 100%)
  }
}

.pay-sidebar-menu-container {
  // padding: 14px 0;

  .pay-sidebar-menu {
    cursor: pointer;
    height: 100%;
    padding: 22px 0;
    position: relative;
    width: 160px;

    &.active {
      color: #5789b1;
    }

    &.show {
      background-color: rgba(50, 170, 255, 0.12);
      color: #5789b1;
      .pay-sidebar-menu-submenu {
        color: #363636;
      }
    }

    &.menu::before {
      background: #dbdbdb;
      // border-right: 1px solid #dbdbdb;
      content: "";
      height: calc(100% - 28px);
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(-50%,-50%);
      width: 1px;
    }
  }
}

.pay-sidebar-menu-submenu-container {
  padding: 12px 0 0 0;
  .pay-sidebar-menu-submenu {
    color: #8c8c8c;
    padding: 12px 0;
    &.active,
    &:hover {
      background-color: rgba(50, 170, 255, 0.2);
      font-weight: 500;
    }
  }
}

.pay-sidebar-menu-name {
  position: relative;
  font-weight: 500;
  min-height: 21px;
  .icon {
    height: 12px;
    margin: 0 5px;
    position: absolute;
    right: 10px;
    transform: translateY(-50%);
    top: 50%;
    width: 12px;
    &.rotate {
      transition: all 0.1s ease;
      transform: translateY(-50%) rotate(0.5turn);
    }
  }
}

.pay-sidebar-more {
  > p.active {
    color: #5789b1;
  }
  .flat-menu-container {
    background-color: #f9f9f9;
    box-shadow: 5px 2px 12px 0 rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    position: absolute;
    right: 0;
    top: 100%;
    margin: 4px 8px 0 0;
    width: 160px;
    .flat-menu {
      padding: 12px 20px 0 20px;
      position: relative;
      &.active,
      &:hover {
        background-color: rgba(50, 170, 255, 0.2);
        font-weight: 500;
        &:hover > .flat-menu-submenu-container {
          transform: rotateX(0deg);
          visibility: visible;
          opacity: 1;
        }
      }
      p {
        color: #363636;
        padding-bottom: 12px;
        position: relative;
      }
      &:not(:last-child) p {
        border-bottom: 1px solid #dbdbdb;
      }
      .icon {
        position: absolute;
        width: 12px;
        height: 12px;
        transform: rotate(0.25turn);
        margin: 5px 0 0 7px;
        left: 0;
        &.rotate {
          transform: translateY(-50%) rotate(0.5turn);
        }
      }
    }
  }
}

.flat-menu-submenu-container {
  background-color: #f9f9f9;
  border-radius: 4px;
  box-shadow: 5px 2px 12px 0 rgba(0, 0, 0, 0.12);
  left: calc(-100% - 1px);
  margin-bottom: 4px;
  position: absolute;
  top: 0;
  transform-origin: 0% 0%;
  transform: rotateX(-90deg);
  width: 100%;
  opacity: 0;
  visibility: hidden;
  .flat-menu-submenu {
    padding: 12px 0;
    font-weight: 400;
    &:hover, &.active {
      background-color: rgba(50, 170, 255, 0.2);
      font-weight: 500;
    }
  }
}
.pop-enter-active{
  transition: all 0.3s ease;
}
.pop-leave-active{
  transition: all 0.1s ease;
}
.pop-enter-from{
  transform: translateY(-2px);
}
.pop-leave-to{
  height: 0px;
  opacity: 0;
}
.pop-leave-from{
  height: auto;
  opacity: 1;
}
</style>
