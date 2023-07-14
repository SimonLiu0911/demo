<template lang="pug">
.pay-label(
  :class="className"
  :style="otherStyle"
)
  | {{name}}
</template>

<script setup>
/**
 * @param { String } name 標籤文字
 * @param { Object, String } otherStyle 套用的css樣式
 * @param { String, Array, Object } className 套用的class樣式名稱
 */
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  otherStyle: { type: [Object, String] },
  className: { type: [String, Array, Object] }
});
</script>

<style lang="scss" scoped>
.pay-label {
  border-radius: 4px;
  display: inline-block;
  font-weight: 500;
  letter-spacing: normal;
  min-width: 113px;
  min-height: 82px;
  padding: 31px 8px;
  text-align: center;
  word-break: break-all;
}

</style>
