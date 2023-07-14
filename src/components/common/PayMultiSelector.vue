<template lang="pug">
.pay-switch-container
  ul.pay-switch(:class="{ 'disabled': isAllDisabled, 'some_disabled': isSomeDisabled }")
    li.pay-item-container(
      v-for="item in options"
      :key="item.value"
    )
      PayMultiSelectorButton(
        v-model="val"
        :option="item"
        :modelValue="val"
        :btnWidth="btnWidth"
        :isSomeDisabled="isSomeDisabled"
        :isAllDisabled="isAllDisabled"
        :chooseAtLeastOne="chooseAtLeastOne"
        :multipleChoice="multipleChoice"
      )
</template>

<script setup>
import PayMultiSelectorButton from '@/components/common/PayMultiSelectorButton.vue';
import { computed } from 'vue';

/**
 * @param { Array } options 選項
 * {
 *  @param { String } name 單一選項名稱
 *  @param { String, Number } value 單一選項值
 *  @param { Boolean } disabled 單一選項是否可選擇
 * }
 * @param { Array, String, Number } modelValue 綁定的值
 * @param { Boolean } chooseAtLeastOne 是否至少選取一個選項，預設為true
 * @param { Boolean } multipleChoice 是否只能選取一個選項，預設為false
 * @param { String } btnWidth PayMultiSelectorButton的寬度
 */
const props = defineProps({
  options: { type: Array },
  btnWidth: { type: String },
  modelValue: { type: [Array, String, Number] },
  chooseAtLeastOne: {
    type: Boolean,
    default: true
  },
  multipleChoice: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'switchValue']);

const val = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val);
    emit('switchValue', val);
  }
});

const isAllDisabled = computed(() => props.options.filter((item) => item.disabled).length === props.options.length);

const isSomeDisabled = computed(() => (props.options.filter((item) => item.disabled).length) !== (props.options.length && props.options.filter((item) => item.disabled).length));

</script>

<style lang="scss" scoped>
.pay-switch-container {
  display: flex;
}
.pay-switch {
  display: flex;
  border: solid 1px rgba(0, 0, 0, 0.15);
  background-color: #fefefe;
  color: #939393;
  border-radius: 6px;
  padding: 2px;
  &.disabled {
    background-color: #f4f4f4;
    cursor: not-allowed;
  }
  &.some_disabled {
    background-color: #fff;
  }
}

.pay-item-container:not(:last-child) {
  &:after {
    content: '';
    display: inline-block;
    width: 1px;
    height: 16px;
    background-color: rgba(151, 151, 151, 0.3);
    top: 50%;
    transform: translateY(20%);
  }
}
</style>
