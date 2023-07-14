<template lang="pug">
.pay-input-wrap(:style="{ width: inputObject.width }")
  .slot.prefix.flex
    slot(name="prefix")

  input.input-container(
    :value="val"
    :type="inputObject.type"
    :disabled="inputObject.disabled"
    :required="inputObject.required"
    :placeholder="inputObject.placeholder"
    :class="[{'error': inputObject.error}, inputStyle]"
    :maxLength="inputObject.maxLength"
    :style="inputObject.style"
    :autofocus="autofocus"
    @input="onInput($event.target.value)"
    @blur="onBlur($event.target.value)"
    @focus="onFocus($event.target.value)"
  )

  .slot.suffix.flex
    slot(name="suffix")
</template>

<script setup>
import { computed } from 'vue';

/**
 * @param {Object} inputObject
 * {
 *   @param width {String} input外層寬度
 *   @param type {String} input的type屬性
 *   @param inputStyle {String} underlineInput/normalInput
 *   @param disabled {Boolean}
 *   @param required {Boolean} 是否必填
 *   @param placeholder {String} input的placeholder attribute
 *   @param error {Boolean} 是否是error狀態
 *   @param maxLength {Number} 能輸入的最大字數
 *   @param style {Object} input style樣式
 *   @param replaceRule {RegExp} 用來檢查input輸入的value的正則(不能用來驗證如email等格式)
 * }
 * @param {String} value v-model綁定的值
 * @param {Boolean} autofocus 是否自動focus
 * modifier:
 * capitalize 第一個字大寫
 * thousandComma 千分位符號
 */
const props = defineProps({
  inputObject: {
    type: Object,
    required: true
  },
  value: { type: String },
  autofocus: {
    type: Boolean,
    default: false
  },
  valueModifiers: { default: () => { } }
});
const emit = defineEmits(['update:value', 'blur', 'focus']);

const val = computed(() => {
  let formattedValue = props.inputObject.value.replace(props.inputObject.replaceRule, '');

  if (props.valueModifiers?.capitalize) formattedValue = formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1);

  if (props.valueModifiers?.thousandComma) formattedValue = formattedValue.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');

  emit('update:value', formattedValue);

  return formattedValue;
});

const inputStyle = computed(() => props.inputObject.inputStyle);

const onInput = (val) => {
  let replaceValue = val;

  if (props.valueModifiers?.thousandComma) replaceValue = val.replaceAll(',', '');

  emit('update:value', replaceValue);
};

const onBlur = (val) => emit('blur', val);

const onFocus = (val) => emit('focus', val);
</script>

<style lang="scss" scoped>
.pay-input-wrap {
  position: relative;
}

.slot {
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
}

.prefix {
  left: 0px;
}

.suffix {
  right: 0px;
}

.input-container {
  width: 100%;
  padding: 12px;

  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
}

.underlineInput {
  border-bottom: solid 1px #d9d9d9;
  background-color: transparent;

  &:focus {
    border-bottom: solid 1px #32aaff;
  }

  &.error {
    border-bottom: solid 1px #eb5b2c;
  }
}

.normalInput {
  border-radius: 4px;
  border: solid 1px #d9d9d9;
  background-color: #fff;

  &:focus {
    border:  solid 1px #32aaff;
  }
  &.error {
    border:  solid 1px #eb5b2c;
  }
}

// For webview
input {
  appearance: none;
  border-radius: 0px;
  overflow: hidden;
  -webkit-appearance: none;  /* Safari 和 Chrome，常用於iOS下移除內建樣式 */
  -moz-appearance: none;     /* FireFox */
}
</style>
