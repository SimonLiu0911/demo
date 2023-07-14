<template lang="pug">
label.pay-label(
  :class="className"
  :style="otherStyle"
)
  .circle(
    v-if="circleColor"
    :style="{'backgroundColor': circleColor}"
  )
  span {{ name }}
</template>

<script setup>
/**
 * @param { String } name 標籤名稱
 * @param { Object, String } otherStyle 標籤自訂css樣式
 * @param { String } circleColor 圓圈點點的色碼，有色碼會顯示圓點
 * @param { String, Array, Object } 標籤自訂class樣式
 */
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  otherStyle: [Object, String],
  circleColor: String,
  className: [String, Array, Object]
});
</script>

<style lang="scss" scoped>

.pay-label {
  min-width: 66px;
  padding: 5px 8px;
  border-radius: 2px;
  display: inline-block;
  font-size: 12px;
  letter-spacing: 0.75px;
  line-height: normal;
  font-weight: normal;
}

.circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 9px;
  display: inline-block;
}

.small-tag {
  border-radius: 4px;
  padding: 1px 8px;
}
</style>
