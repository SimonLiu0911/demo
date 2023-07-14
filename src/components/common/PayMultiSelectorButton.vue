<template lang="pug">
button.pay-item(
  type="button"
  :class="{ 'active': isActive(option.value), 'disabled': option.disabled, 'custom_border': customBorder, 'custom_bg_color': customBgColor }",
  :disabled="option.disabled"
  :style="customWidth(btnWidth)"
  @click="setActive(option.value)",
)
  PayIcon.pay-item-btn(
    v-if="isActive(option.value)"
    iconName="ic-check"
  )
  span.pay-item-name {{ option.name }}
</template>

<script setup>
import { computed, toRefs } from 'vue';

/**
 * @param { Boolean } isSomeDisabled 是否部分選項停用
 * @param { Boolean } isAllDisabled 是否全部選項停用
 * @param { Boolean } chooseAtLeastOne 是否至少選取一個選項
 * @param { Boolean } multipleChoice 是否只能選取一個選項
 * @param { Object } option 選項
 * {
 *  @param { String } name 選項名稱
 *  @param { String, Number } value 選項值
 *  @param { Boolean } disabled 選項是否可選擇
 * }
 * @param { Array, String, Number } modelValue 綁定的值
 */
const props = defineProps({
  isSomeDisabled: {
    type: Boolean,
    default: true
  },
  isAllDisabled: {
    type: Boolean,
    default: false
  },
  option: { type: Object },
  modelValue: { type: [Array, String, Number] },
  chooseAtLeastOne: {
    type: Boolean,
    default: true
  },
  multipleChoice: {
    type: Boolean,
    default: false
  },
  btnWidth: {
    type: String
  }
});
const { modelValue, isSomeDisabled, option, isAllDisabled } = toRefs(props);

const emit = defineEmits(['update:modelValue']);

const customBorder = computed(() => (!isSomeDisabled.value || option.value.disabled) && !isAllDisabled.value);

const customBgColor = computed(() => (isSomeDisabled.value || option.value.disabled) && !isAllDisabled.value);

const customWidth = (val) => {
  if (!val) return;

  return `width: ${val}`;
};

const isActive = (value) =>
  (props.multipleChoice
    ? modelValue.value === value
    : modelValue.value.includes(value));

const arrayCheckValueExist = (value) => {
  if (!modelValue.value.length) return emit('update:modelValue', [value]);

  const active = modelValue.value;
  const index = active.indexOf(value);

  if (index > -1 && ((modelValue.value.length > 1 && props.chooseAtLeastOne) || !props.chooseAtLeastOne)) {
    active.splice(index, 1);

    return emit('update:modelValue', active);
  }
  if (!active.includes(value)) {
    active.push(value);

    return emit('update:modelValue', active);
  }

};

const stringCheckValueExist = (value) => {
  emit('update:modelValue', value);
};

const setActive = (value) => {
  if (typeof modelValue.value === 'string' || typeof modelValue.value === 'number') {
    return stringCheckValueExist(value);
  }

  return arrayCheckValueExist(value);
};

</script>

<style lang="scss" scoped>
$blue: #32aaff;
.pay-item {
  border-radius: 4px;
  color: #8c8c8c;
  display: inline-block;
  margin: 6px;
  padding: 6px 6px 6px 6px;
  transition: box-shadow 0.15s ease;
  &.custom_bg_color {
    background-color: #f4f4f4;
  }
  &.active {
    background-color: rgba(50, 170, 255, 0.08);
    box-shadow: 0px 0px 0px 1px $blue inset;
    color: $blue;
    padding: 6px;
  }
  &.disabled {
    background-color: transparent;
    box-shadow: none;
    color: #8c8c8c;
    cursor: not-allowed;
    &.custom_border {
      background-color: #f4f4f4;
      box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.15) inset;
    }
  }
  .pay-item-btn {
    height: 20px;
    width: 20px;
  }
}
</style>
