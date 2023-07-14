<template lang="pug">
template(v-if="showAlert")
  TransitionGroup(name="list")
    .pay-toast(
      v-for="(alert, index) in common.alerts"
      :key="index"
    )
      .inner-container
        .pay-toast-left
          PayIcon.pay-toast-icon(
            v-if="alert.type"
            :iconName="`ic-${alert.type}`"
          )
          span {{ alert.msg }}
</template>

<script setup>
import { computed } from 'vue';
import { useCommonStore } from '@/stores/common';
/**
* @param { Array } common.alerts
* {
*  @param { String } type alert類型(顯示不同icon:warn/success/notice/fail)
*  @param { String } msg alert文字
*  @param { Boolean } hasClose 是否出現關閉按鈕
* }
*/
const common = useCommonStore();

const showAlert = computed(() => common.alerts.length > 0);
</script>

<style lang="scss" scoped>
.pay-toast {
  padding: 5px 20px;
  font-size: 12px;
  color: #333;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  background-color: #DBE7F1;
  z-index: 33;
  width: 100%;
  .pay-toast-icon {
    width: 17px;
    height: 17px;
    margin-right: 10px;
  }
  .pay-toast-close {
    font-size: 10px;
    color: white;
  }
  .pay-toast-left{
    display: flex;
    justify-items: center;
  }
}
.inner-container {
  max-width: 1920px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-enter-active,
.list-leave-active{
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
