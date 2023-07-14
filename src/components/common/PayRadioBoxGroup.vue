<template lang="pug">
.pay-checkbox-group-container(:style="customStyle")
  .pay-checkbox-container(
    v-for="item in items"
    @click="emit('click', item.value)"
  )
    slot(:name="item.prefix")

    input.pay-checkbox(
      v-model="val"
      type="radio"
      :id="`${label}${item.name}`"
      :value="item.value"
      :disabled="item.disabled"
    )
    label.pay-checkbox-label(
      :class="{'error': error && !item.disabled}"
      :for="`${label}${item.name}`"
    )
    label.pay-checkbox-name(:for="`${label}${item.name}`") {{ item.name }}

    slot(:name="item.suffix")
</template>

<script setup>
import { computed } from 'vue';

/**
 * @param { Object } customStyle 套用的css樣式
 * @param { String, Number } modelValue 綁定的值
 * @param { String } label radio群組的名稱
 * @param { Array } items radioBox選項
 * {
 *  @param { String } prefix 選項前客製化區塊名稱
 *  @param { String } suffix 選項後客製化區塊名稱
 *  @param { String } name 選項名稱
 *  @param { String, Number } value 選項值
 *  @param { Boolean } disabled 選項是否不能選擇
 * }
 * @param { Boolean } error 錯誤紅點
 */
const props = defineProps({
  customStyle: {
    type: Object,
    default () {
      return { display: 'flex' };
    }
  },
  modelValue: {
    type: [String, Number],
    value: ''
  },
  label: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    required: true
  },
  error: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'click']);

const val = computed({
  get () {
    return props.modelValue;
  },
  set (val) {
    emit('update:modelValue', val);
  }
});

</script>

<style lang="scss" scoped>
.pay-checkbox-container {
  margin-right: 16px;
  position: relative;
  padding-left: 24px;

  .pay-checkbox {
    display: none;
    left: 0;
    position: absolute;

    &:checked ~ .pay-checkbox-label {
      animation: selected .4s;
      background-color: #fff;

      &:after {
        display: inline-block;
      }
    }

    &:disabled {
      ~ .pay-checkbox-label {
        background-color: #f0f0f0;
      }

      ~ .pay-checkbox-name {
        cursor: not-allowed;
      }
    }
  }
  .pay-checkbox-label {
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 50%;
    height: 16px;
    left: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;

    &.error {
      border: 1px solid #eb5b2c;
    }

    &:after {
      animation: bubble .4s;
      background-color: #5789b1;
      border-radius: 50%;
      content: '';
      display: none;
      height: 10px;
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 10px;
    }
  }
}

@keyframes selected {
 0%{
    border: 1px solid #d9d9d9;
 }
 50%{
    border: 3px solid rgba(87, 137,177,0.4);
 }
 100%{
    border: 1px solid #d9d9d9;
 }
}

@keyframes bubble {
  0%{
    width: 10px;
    height: 10px;
  }
  50%{
    width: 7px;
    height: 7px;
  }
  100%{
    width: 10px;
    height: 10px;
  }
}

.pay-checkbox-name,
.pay-checkbox-label,
.pay-checkbox-container {
  cursor: pointer;
}
</style>
