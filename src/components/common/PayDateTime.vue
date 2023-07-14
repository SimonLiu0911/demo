<template lang="pug">
.pay-input(:style="{ 'width': settings.width }")
  .prefix.slot
    slot(name="prefix")
  template(v-if="inputType === 'date'")
    DatePicker.rounded-4(
      v-model:value="settings.value"
      range-separator="、"
      :value-type="settings.valueType || 'format'"
      :format="settings.format"
      :editable="false"
      :disabled-date="settings.disabledDate"
      :placeholder="settings.placeholder"
      :disabled="settings.disabled"
      :multiple="settings.multiple"
      :default-value="settings.defaultDate || new Date()"
      :class="{'error': settings.error,'disabled': settings.disabled}"
      @change="change"
      )
      template(#icon-calendar)
        PayIcon(iconName="ic-input-calendar")
  template(v-else)
    DatePicker.rounded-4.time-input(
      v-model:value="settings.value",
      type="time",
      popup-class="time-popup"
      :value-type="settings.valueType || 'format'",
      :format="settings.format",
      :minute-step="settings.minuteStep ? settings.minuteStep : 30",
      :hour-options="settings.hours ? settings.hours : hours"
      :editable="false",
      :clearable="false",
      :disabled-date="settings.disabledDate",
      :placeholder="settings.placeholder",
      :disabled="settings.disabled"
      :class="{'error': settings.error, 'disabled': settings.disabled}"
      :disabled-time="settings.disabledTime",
      :popup-style="{'width': settings.width}"
      :default-value="timeDefaultValue"
      @change="change"
    )
      template(#icon-calendar)
        PayIcon(iconName="ic-down")
  .suffix.slot
    slot(name="suffix")
</template>

<script setup>
import 'vue-datepicker-next/locale/zh-tw.es';
import DatePicker from 'vue-datepicker-next';

/**
 * @param { Object } settings 設定選項值
 * {
 * @param { String } value 綁定的值
 * @param { String } valueType 綁定的值的日期/時間格式，預設為顯示的格式
 * @param { String } format 選擇的值顯示在日期/時間元件中的格式
 * @param { Function } disabledDate 不可選取的日期
 * @param { String } placeholder 未選擇時的提示文字
 * @param { Boolean } disabled 是否可以操作
 * @param { Boolean } multiple 是否可以選擇多個日期
 * @param { String } defaultDate 展開時出現的月份，預設為今日
 * @param { Boolean } error 是否出現紅框
 * @param { Number } minuteStep 分鐘時間間隔區間
 * @param { Array } hours 要出現在選單的小時時間
 * @param { Function } disabledTime 不可選取的時間
 * @param { Object } width 時間視窗的寬度
 * }
 * @param { String } inputType 元件種類(日期選擇:date/時間選擇:time)
 */
const props = defineProps({
  settings: {
    type: Object,
    required: true
  },
  inputType: {
    type: String,
    default: 'date'
  }
});

const emit = defineEmits(['change']);

const hours = Array.from({ length: 24 }).map((_, idx) => idx);

const settingHoursTimeStamp = computed(() => new Date(new Date().setHours(props.settings.hours[0],0,0,0)));

const hoursTimeStamp = computed(() => new Date(new Date().setHours(hours[0],0,0,0)));

const timeDefaultValue = computed(() => (props.settings.hours ? settingHoursTimeStamp : hoursTimeStamp));


const change = (val) => {
  emit('change', val);
};
</script>
