<template lang="pug">
.pay-select-container(
  :class="{ 'error': settings.error, 'sm': settings.size === 'sm', 'disabled': settings.disabled }"
  :style="customStyle"
)
  VSelect(
    v-model="val"
    label="label"
    transition="none"
    :options="options"
    :clearable="settings.clearable"
    :reduce="label => label.code"
    :searchable="settings.searchable"
    :append-to-body="false"
    :placeholder="settings.placeholder"
    :disabled="settings.disabled"
  )
    template(#open-indicator="{ attributes }")
      span(v-bind="attributes")
        PayIcon(iconName="ic-down" class="select-icon")
    template(#no-options="{ search, searching }")
      p.no-result(v-if="searching") 查無符合 {{ search }} 的選項
      p.no-result(v-else) 目前沒有選項
</template>

<script setup>
import VSelect from 'vue-select';
import { computed } from 'vue';

/**
 * @param { Array } options 下拉選單選項
 * {
 * @param { String } label 選項文字
 * @param { String, Number } code 選項值
 * }
 * @param { String, Number } modelValue 綁定選取的值
 * @param { Object } customStyle 套用的css樣式
 * @param { Object } settings 下拉選單設定選項
 * {
 *   @param { String } size 選單大小(小選單:sm，預設大選單)
 *   @param { Boolean } error 選單是否出現錯誤紅框
 *   @param { Boolean } searchable 選單是否可以搜尋選項內容
 *   @param { String } placeholder 選單未選取時的預設文字
 *   @param { Boolean } disabled 選單是否不能選取用
 * }
 */
const props = defineProps({
  options: Array,
  modelValue: {
    type: [String, Number],
    default: ''
  },
  customStyle: {
    type: Object,
    default: () => ({ width: '192px' })
  },
  settings: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue', 'changeValue']);

const val = computed({
  get () {
    return props.modelValue;
  },
  set (val) {
    emit('update:modelValue', val ?? '');
    emit('changeValue', val);
  }
});

</script>

<style lang="scss" scoped>
  .no-result {
    padding: 12px;
  }

  .select-icon {
    color: #8C8C8C;
    height: 14px;
    width: 14px;
  }
</style>
