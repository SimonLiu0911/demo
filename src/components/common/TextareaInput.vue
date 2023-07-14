<template lang="pug">
.pay-input(:style="{ width: textareaObject.width }")
  .prefix.slot
    slot(name="prefix")

  textarea.input-container(
    v-model="val"
    :class="{'error': textareaObject.error }"
    :maxLength="textareaObject.maxLength",
    :style="textareaObject.style"
    :placeholder="textareaObject.placeholder"
    :disabled="textareaObject.disabled"
    :required="textareaObject.required"
    :autocomplete="autocomplete"
    @input="onInput($event.target.value)"
    @blur="onBlur($event.target.value)"
  )

  .suffix.slot
    slot(name="suffix")
</template>

<script setup>
import { computed } from 'vue';

/**
 * @param {Object} textareaObject
 * {
 *   @param width {String} textarea外層寬度
 *   @param type {String} textarea的type屬性
 *   @param disabled {Boolean}
 *   @param required {Boolean} 是否必填
 *   @param placeholder {String} textarea的placeholder attribute
 *   @param error {Boolean} 是否是error狀態
 *   @param maxLength {Number} 能輸入的最大字數
 *   @param style {Object} textarea style樣式
 *   @param replaceRule {RegExp} 用來檢查textarea value的正則規則
 * }
 * @param {String} value v-model綁定的值
 * @param {Boolean} autofocus 是否自動focus
 * @param {Boolean} autocomplete 是否使用browser自動填寫
 */
const props = defineProps({
  textareaObject: {
    type: Object,
    required: true
  },
  value: { type: String },
  autofocus: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:value', 'blur']);

const val = computed({
  get: () => props.textareaObject.value,
  set: (val) => emit('update:value', val)
});

const onInput = (val) => {
  const formattedValue = val.toString().replace(props.textareaObject.replaceRule, '');

  emit('update:value', formattedValue);
};

const onBlur = (val) => emit('blur', val);
</script>

<style lang="scss" scoped>
.pay-input {
  position: relative;
}

textarea {
  resize: none;
}

.slot {
  position: absolute;
  transform: translateY(-50%);
  border-radius: 0.25rem;
  top: 22%;
}
.prefix {
  left: 12px;
}
.suffix {
  right: 12px;
}

.input-container {
  width: 100%;
  border-radius: 4px;
  border: solid 1px #d9d9d9;
  background-color: #fff;
  padding: 12px;
  &:disabled{
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
  &:focus {
    border:  solid 1px #32aaff;
  }
  &.error {
    border:  solid 1px #eb5b2c;
  }
}
</style>
