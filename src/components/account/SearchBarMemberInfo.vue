<template lang="pug">
section.bg-white(class="px-[20px] pt-[12px]")
  .flex.items-start(
    class="bg-[#dbdbdb] bg-opacity-[0.1] py-[8px] px-[12px] mb-[2px] h-[63px]"
    v-for="(option, index) in options"
  )
    PayRadioBoxGroup(
      class="leading-[44px]"
      :items="option"
      v-model="selectedCondition"
      :error="false"
      label="uud"
      @input="setDefault('changeOption')"
    )
    .inline-block(v-show="selectedCondition === String(index)")
      .dividing-line-left(:class="{ 'ml-[18px]': index !== 1, 'ml-[4px]': index === 1 }")
        PayInput(
          class="ml-[20px]"
          v-model:value="accountNumber.value"
          :input-object="accountNumber"
          @blur=""
          v-if="index === options.length - 1"
        )
        PayInput(
          class="ml-[20px]"
          v-model:value="payName.value"
          :input-object="payName"
          @blur=""
          v-else-if="index === options.length - 2"
        )
        PayInput(
          class="ml-[20px]"
          v-model:value="memberId.value"
          :input-object="memberId"
          @blur=""
          v-else
        )
  .flex.dividing-line-bottom(class="pb-[20px]")
  .flex.justify-center(class="py-[20px]")
    PayButton(
      name="查詢"
      class="w-[100px]"
      class-name="btn-primary"
      :disabled="common.btnDisabled"
      @click="emit('search')"
    )
    PayButton(
      class="ml-[20px] w-[100px]"
      name="清除"
      class-name="btn-gray"
      @click="setDefault"
    )
</template>

<script setup>
import { useCommonStore } from '@/stores/common';
import useCommon from '@/composables/common';

const emit = defineEmits(['search']);

const common = useCommonStore();

const options = [
  [{
    name: '會員編號',
    value: '0'
  }],
  [{
    name: '付款人名稱',
    value: '1'
  }],
  [{
    name: '收款帳號',
    value: '2'
  }]
];

const selectedCondition = ref('0');

const memberId = reactive({
  type: 'text',
  inputStyle: 'normalInput',
  maxLength: 30,
  width: '300px',
  disabled: false,
  placeholder: '請輸入會員編號',
  value: '',
  error: false,
  replaceRule: /[^a-zA-Z0-9\-_/－＿]/g
});

const payName = reactive({
  type: 'text',
  inputStyle: 'normalInput',
  maxLength: 30,
  width: '300px',
  disabled: false,
  placeholder: '請輸入付款人名稱',
  value: '',
  error: false
});

const accountNumber = reactive({
  type: 'text',
  inputStyle: 'normalInput',
  maxLength: 16,
  width: '300px',
  disabled: false,
  placeholder: '請輸入收款帳號',
  value: '',
  error: false,
  replaceRule: /[^0-9]/g
});

const setDefault = () => {
  memberId.value = '';
  payName.value = '';
  accountNumber.value = '';
};

defineExpose({
  memberId,
  payName,
  accountNumber,
  setDefault
});

</script>

<style lang="scss" scoped>
.dividing-line {
  &-left {
    border-left: 1px solid #dbdbdb;
  }

  &-right {
    border-right: 1px solid #dbdbdb;
  }

  &-bottom {
    border-bottom: 1px solid #dbdbdb;
  }
}
</style>