<template lang="pug">
.pay-switch-container
  ul.pay-switch
    li.pay-item.flex.items-center(
      v-for="item in items"
      :key="item.name"
      :class="{'active': modelValue == item.value}"
    )
      slot(:name="item.prefix")

      button(@click="emit('update:modelValue', item.value);emit('input', item.value)") {{ item.name }}

      slot(:name="item.suffix")
</template>

<script setup>
/**
 * @param { Array } items 選項
 * {
 *  @param { String } name 選項名稱
 *  @param { String, Number } value 選項值
 *  @param { String } prefix 選項前自訂ui插槽名稱
 *  @param { String } suffix 選項後自訂ui插槽名稱
 * }
 * @param { String, Number } active 選取中狀態的選項值
 */
const props = defineProps({
  items: Array,
  modelValue: {
    type: [String, Number],
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'input']);
</script>

<style lang="scss" scoped>
  .pay-switch-container {
    display: flex;
  }
  .pay-switch{
    display: flex;
    border:1px solid #7e9db6;
    background-color: #7e9db6;
    color: #fff;
    border-radius: 6px;
    padding: 2px;
  }

  .pay-item{
    padding: 1px 8px;
    transition: all 0.2s;
    &.active{
      border-radius: 4px;
      background-color: #fff;
      color: #4c4c4c;
    }
  }

  .pay-item:not(:last-child){
    margin-right: 12px;
  }
</style>
