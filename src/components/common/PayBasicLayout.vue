<template lang="pug">
.pay-layout-container
  .pay-title(v-if="title")
    PayBreadcrumb(:items="title")
  slot
</template>

<script setup>
import PayBreadcrumb from '@/components/common/PayBreadcrumb.vue';

/**
 * @param {String} title 頁面標題
 * @param { Array } title 頁面標題(麵包屑)
 * {
 *  @param { url } 頁面標題連結
 *  @param { name } 頁面標題項目
 * }
 */

const props = defineProps({
  title: {
    type: [Array, String],
    default: ''
  }
});
</script>

<style lang="scss" scoped>
  .pay-layout-container {
    padding: 50px 20px 20px 20px;
  }

  .pay-title {
    align-items: center;
    color: #363636;
    display: flex;
    font-size: 15px;
    letter-spacing: 0.94px;
    margin: 18px 0 16px 14px;
    text-align: left;
  }
</style>
