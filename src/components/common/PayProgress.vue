<template lang="pug">
.pay-progress
  .pay-progress-shell.h-full(:style="progressStyle.width")
    .pay-progress-step.h-full.overflow-hidden.flex.flex-col.justify-center(:style="progressStyle.backgroundColor")
</template>

<script setup>
import { computed } from 'vue';

/**
   * @param {Object} options
   * {
   *   @param progress {String}  已完成的進度條寬度(%)
   *   @param color {String} 已完成進度條顏色
   * }
   */
const props = defineProps({
  options: {
    type: Object,
    required: true
  }
});

const progressStyle = computed(() => ({
  width: `width: ${props.options?.progress}`,
  backgroundColor: `background-color: ${props.options?.color}`
}));

</script>

  <style lang="scss" scoped>
    .pay-progress{
      background-color: #efefef;
      border-radius: 19.5px;
      height: 8px;
      width: 100%;

      &-step {
        animation: load 2s normal forwards;
        border-radius: 19.5px;
      }
    }

    @keyframes load {
      0% { width: 0; }
      100% { width: 100%; }
    }
  </style>
