<template lang="pug">
ul.pay-pagination
  li(
    @click="toPage(currentPage - 1)"
    @mouseover="handleHover('back', true)"
    @mouseleave="handleHover('back', false)"
  )
    PayIcon.pagination-icon(:iconName="backIcon")

  li.pay-number(
    v-for="number in pageRange"
    :key="number"
    :class="{'active': number === currentPage}"
    @click="toPage(number)"
  ) {{ number }}

  li(
    @click="toPage(currentPage + 1)"
    @mouseover="handleHover('next', true)"
    @mouseleave="handleHover('next', false)"
  )
    PayIcon.pagination-icon(:iconName="nextIcon")
</template>

<script setup>
import { computed, toRefs, ref } from 'vue';

/**
 * @param {Number} currentPage 當前頁碼
 * @param {Number} totalPage 總頁數
 * @param {Number} range=5 頁碼顯示範圍 預設為5
 */
const props = defineProps({
  currentPage: {
    type: Number
  },
  totalPage: {
    type: Number
  },
  range: {
    type: Number,
    default: 5
  }
});

const { totalPage } = toRefs(props);
const nextIconHover = ref(false);
const backIconHover = ref(false);

const emit = defineEmits(['changePage']);

/**
 * 計算頁碼顯示範圍
 * @returns {Array} 頁碼陣列
 */
const pageRange = computed(() => {
  const arr = [];

  let left = props.currentPage - parseInt(props.range / 2);
  let right = parseInt(props.range / 2) + props.currentPage;
  let diff = 0;

  if (props.range % 2 > 0) right += 1;

  if (left < 1) {
    diff = 1 - left;
    right += diff;
  }

  if (right > totalPage.value) {
    diff = right - totalPage.value;
    right = totalPage.value + 1;
    left = left - diff + 1;
  }

  if (left < 1) {
    left = 1;
  }

  for (let i = left; i < right; i++) {
    arr.push(i);
  }

  return arr;
});

const backIcon = computed(() => (backIconHover.value ? 'ic-back-hover' : 'ic-back'));

const nextIcon = computed(() => (nextIconHover.value ? 'ic-next-hover' : 'ic-next'));

const handleHover = (type, val) => {
  if (type === 'next') nextIconHover.value = val;
  else backIconHover.value = val;
};

/**
 * @param {Number} page 當前要切換的頁碼
 */
const toPage = (page) => {
  if (page < 1 || page > totalPage.value || page === props.currentPage) return;

  emit('changePage', page);
};
</script>

<style lang="scss" scoped>
  .pay-pagination {
    align-items: center;
    display: flex;
    font-size: 12px;
    letter-spacing: 0.75px;
  }

  li {
    cursor: pointer;
    user-select: none;
  }
  .pay-number{
    margin: 0 8px;

    &:hover:not(.active) {
      color: #5789b1;
    }
  }

  // li:not(.pay-number, :last-child) {
  //   margin-right: 10px;
  // }
  li:not(.pay-number) {
    line-height: 0;
  }

  .active {
    background-color: #5789b1;
    border-radius: 4px;
    color: #fff;
    padding: 2px 8px;
  }

  .pagination-icon {
    height: 14px;
    width: 14px;
  }
</style>
