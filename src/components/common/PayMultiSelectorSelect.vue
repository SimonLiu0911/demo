<template lang="pug">
.pay-select-option-container(
  :tabindex='tabIndex'
  :class="{ 'default': notYetSelected && !openSelect, 'disabled': disabled, 'selected_color': !notYetSelected && openSelect }"
  @blur="handleBlur"
)
  .pay-select-value(@click="openSelectOption") {{ selectedName }}
    PayIcon.pay-select-value-icon(
      iconName="ic-down"
      :class="{ 'hidden': notYetSelected && !openSelect, 'transform rotate-180': openSelect }"
    )
  Transition(name="pop")
    .pay-select-options(v-if="openSelect")
      .pay-select-option(
        v-for="option in options"
        :key="option.value"
        @click="updateValue(option)"
      ) {{ option.name }}
</template>

<script setup>
import { ref, computed, watch } from 'vue';

/**
 * @param { String, Number } modelValue 綁定的值
 * @param { Array } options 選項
 * {
 *   @param { String } name 選項名稱
 *   @param { String, Number } 選項值
 * }
 * @param { Boolean } disabled 是否不可選擇
 * @param { Number } tabIndex 焦點(因為不是html元素 自訂焦點)
 * @param { String } placeholder 未選擇時的提示文字
 */
const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  tabIndex: {
    type: Number,
    default: 0
  },
  placeholder: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const openSelect = ref(false);

watch(() => props.modelValue, (value) => {
  selectedName.value = value;
});

const selectedName = computed({
  get: () => props.options.find((item) => item.value === props.modelValue)?.name ?? props.placeholder,
  set: (value) => emit('update:modelValue', value)
});
const notYetSelected = computed(() => props.placeholder === selectedName.value);

const updateValue = (option) => {
  selectedName.value = option.value;

  openSelectOption();
};

const openSelectOption = () => {
  if (props.disabled) return;

  openSelect.value = !openSelect.value;
};

const handleBlur = () => {
  openSelect.value = false;
};

</script>

<style lang="scss" scoped>
$blue: #32aaff;

@mixin select-base($bgColor, $border, $textColor) {
  box-shadow: $border;
  background-color: $bgColor;
  color: $textColor;
}

.pay-select-option-container {
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  padding: 3px 0;
  text-align: left;
  @include select-base(#EEF8FE,  0 0 0 1px $blue, $blue);
  &.default {
    padding: 3px 6px;
    @include select-base(#f4f4f4,  0 0 0 1px #f4f4f4, #8c8c8c);

    .pay-select-value {
      justify-content: space-around;
    }
  }
  &.disabled {
    cursor: not-allowed;
    @include select-base(#f4f4f4,  0 0 0 1px rgba(0, 0, 0, 0.15), #8c8c8c);
  }

  .pay-select-value {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 3px 8px;
    .pay-select-value-icon {
      height: 14px;
      margin-left: 10px;
      transition: all 0.2s ease-in-out;
      width: 14px;
      &.hidden {
        display: none;
      }
    }

  }
  .pay-select-options {
    background-color: #EEF8FE;
    border-radius: 0  0 4px 4px ;
    box-shadow: $blue 0px 1px 0px 1px,  0 4px 8px 0 rgba(0, 0, 0, 0.12);
    left: 0;
    max-height: 200px;
    position: absolute;
    right: 0;
    z-index: 99;
  }

  .pay-select-option{
    cursor: pointer;
    padding: 6px;
    &:hover {
      background-color:#d4ecff;
      border-radius: 0  0 4px 4px ;
      padding: 6px;
    }
  }
}

.selected_color {
  background-color:#d4ecff;
}

.pop-enter-active{
  transition: all 0.2s ease;
}

.pop-enter-from{
  transform: translateY(-8px);
}
</style>
