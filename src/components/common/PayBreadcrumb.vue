<template lang="pug">
.pay-breadcrumb
  router-link(
    v-for="(item, key) in showItems"
    :key="item.name"
    :class="{'active': isActive(item.linkName) }"
    :to="{ 'name': item.linkName }"
    )
      | {{ item.name }}
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

/**
 * @param { Array } items 多個麵包屑項目
 * {
 *  @param { String } name 連結名稱
 *  @param { String } linkName 連結router Name
 * }
 * @param { String } items 單一麵包屑連結名稱
 */
const props = defineProps({
  items: {
    type: [Array, String],
    required: true
  }
});

const route = useRoute();

const showItems = computed(() => {
  if (typeof props.items === 'object') return props.items;
  return [
    {
      name: props.items,
      linkName: route.name
    }
  ];
});

const isActive = (linkName) => route.name === linkName;
</script>

<style lang="scss" scoped>
.pay-breadcrumb {
  border-left: 4px solid #5789b1;
  padding-left:8px;
  display: flex;
  color: #8c8c8c;
  a {
    cursor: pointer;
    color: #363636;
    &:last-child {
      cursor: default;
    }
    &:hover {
      font-weight: 500;
      // color: #363636
    }
    &.active {
      font-weight: 400;
      // color: #363636;
    }
    &:not(:last-child):after {
      content: '>';
      display: inline-block;
      margin: 0 4px;
      color: #bababa;
    }
  }
}
</style>
