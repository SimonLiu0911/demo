<template lang="pug">
ul.pay-item-list
  li.pay-item-child(
    v-for="item in options"
    :key="item.value"
    :class="{ 'active': isActive(item.value), 'disabled': item.disabled }"
  )
    button(
      type="button"
      :disabled="item.disabled || item.view"
      @click="setActive(item.value)"
    ) {{ item.name }}
      Transition(name="fade")
        span.icon(v-show="isActive(item.value)") ×
</template>

<script setup>
/**
 * @param { Array, String, Number } modelValue 綁定的值
 * @param { Array } options 選項
 * {
 *   @param { String } name 選項名稱
 *   @param { String, Number } value 選項值
 *   @param { Boolean } disabled 選項是否不能選取
 *   @param { Boolean } view 選項是否唯讀
 * }
 */

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: [Array, String, Number]
  }
});

const emit = defineEmits(['update:modelValue']);

const isActive = (value) => props.modelValue.includes(value);

const arrayCheckValueExist = (value) => {
  const active = props.modelValue;
  const index = active.indexOf(value);

  if (index > -1) {
    active.splice(index, 1);
  } else {
    active.push(value);
  }

  return emit('update:modelValue', active);
};

const stringCheckValueExist = (value) => {
  emit('update:modelValue', value);
};

const setActive = (value) => {
  if (typeof props.modelValue === 'string' || typeof props.modelValue === 'number') {
    return stringCheckValueExist(value);
  }
  return arrayCheckValueExist(value);
};
</script>

<style lang="scss" scoped>
$blue: #32aaff;

.pay-item-list {
  display: flex;
}
.pay-item-child {
  padding: 6px 8px;
  background-color: #f4f4f4;
  border-radius: 4px;
  color: #8c8c8c;
  margin-right: 8px;
  margin-top: 8px;
  box-shadow: none;
  transition: box-shadow 0.4s ease-in-out;
  &.active {
    background-color: rgba(50, 170, 255, 0.08);
    color: $blue;
    box-shadow: 0px 0px 0px 1px $blue inset;
  }
  &.disabled {
    box-shadow: 0px 0px 0px 1px #cfcfcf inset;
    color: #8c8c8c;
    background-color: #f4f4f4;
    button {
      cursor: not-allowed;
    }
  }
  .icon {
    margin-left: 6px;
  }
}

// .fade-enter-active {
//   transition: opacity 0.4s ease-in-out;
// }
// .fade-leave-active {
//   transition: opacity 0.2s ease-in-out;
// }

// .fade-enter-from,
// .fade-leave-to {
//   opacity: 0;
// }
// .fade-enter-to,
// .fade-leave-from {
//   opacity: 1;
// }
</style>
