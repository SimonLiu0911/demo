<template lang="pug">
section.bg-white(class="px-[32px] py-[20px]")
  .flex
    .dividing-line-right(class="pl-[12px] pr-[32px] mr-[20px]") 建立時間
    div(class="pb-[20px]")
      PayRadioBoxGroup(
        class="pb-[20px]"
        label="uud"
        v-model="orderRange"
        :items="orderRangeOptions"
        :error="false"
        @click="handleOrderRange"
      )
      .flex.items-center
        PayRadioBoxGroup.custom-radio(
          label="test"
          v-model="customRange"
          :items="customRangeOptions"
          :error="false"
          @click="handleOrderRange"
        )
        .flex.items-center
          PayDateTime(
            input-type="date"
            :settings="startTime"
            @change="changeStartTimePicker"
          )
          span(class="pl-[12px] pr-[12px]") 至
          PayDateTime(
            input-type="date"
            :settings="endTime"
            @change="changeEndTimePicker"
          )
  .flex.dividing-line-bottom(class="pb-[20px] mb-[20px]")
    .dividing-line-right(class="pl-[12px] pr-[32px] mr-[20px] leading-[52.2px]") 所屬銀行
    PayMultiSelector(
      v-model="bank.bankValue"
      :options="bank.options"
      :multiple-choice="false"
      btn-width="auto"
    )
    button(
      class="text-[#5789b1] ml-[12px]"
      @click="emit('setAll')"
    ) 全選
  .flex.justify-center
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
import { orderRangeOptions, customRangeOptions } from '@/map/options';

import useCommon from '@/composables/common';

const props = defineProps({
  bank: {
    type: Object
  }
});

const today = new Date();

const emit = defineEmits(['setAll', 'getStartTime', 'getEndTime', 'getRange', 'search']);

const common = useCommonStore();

const orderRange = ref('today');
const customRange = ref('');

const disablePayDateTime = (value) => {
  startTime.disabled = value;
  endTime.disabled = value;
};

const changeStartTimePicker = (value) => {
  startTime.value = value ? value : '';
};

const changeEndTimePicker = (value) => {
  endTime.value = value ? value : '';
};

const handleOrderRange = (value) => {
  if (value === 'custom') {
    // 'other'只是用來區分是在orderRange還是customRange
    orderRange.value = 'other';
    customRange.value = value;

    disablePayDateTime(false);
  } else {
    customRange.value = '';
    orderRange.value = value;

    disablePayDateTime(true);
  }
};

const startTime = reactive({
  value: '',
  format: 'YYYY/MM/DD',
  disabledDate: (date) => date > new Date() || date > new Date(endTime.value) || date < new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
  placeholder: '日期',
  disabled: true,
  error: false,
  width: '150px'
});
const endTime = reactive({
  value: '',
  format: 'YYYY/MM/DD',
  disabledDate: (date) => date > new Date() || date < new Date(startTime.value) || date < new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
  placeholder: '日期',
  disabled: true,
  error: false,
  width: '150px'
});

const setDefault = () => {
  startTime.value = '';
  endTime.value = '';
  orderRange.value = 'today';
  customRange.value = '';
  disablePayDateTime(true);
  emit('setAll');
};

defineExpose({
  startTime,
  endTime,
  orderRange,
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