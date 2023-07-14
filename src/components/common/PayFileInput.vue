<template lang="pug">
.pay-input(:style="{ 'width': inputObject.width }")
  .prefix.slot
    slot(name="prefix")
  label.input-container(
    :class="{ 'error': inputObject.error, 'disabled': inputObject.disabled }",
    :style="{ 'width': inputObject.width }"
  )
    span.value(
      v-if="val"
      v-html="val"
    )
    span.default(v-else) 未選擇任何檔案
    span.label 選擇檔案
    input(
      type="file",
      ref="fileUploader"
      :accept="inputObject.accept",
      :required="inputObject.required",
      :disabled="inputObject.disabled",
      :multiple="inputObject.multiple"
      @change="uploadFile($event.target.files)",
      @click="resetFileUploader"
    )
  .suffix.slot
    slot(name="suffix")
</template>

<script setup>
import { ref, computed } from 'vue';

/**
 * @param {Object} inputObject
 * {
 *   @param {String} width input外層寬度
 *   @param {String} type input type屬性
 *   @param {Boolean} disabled 是否為禁用
 *   @param {Boolean} required 是否為必填
 *   @param {Boolean} error 是否是error狀態
 *   @param {Object} style input style樣式
 *   @param {String} type input的type屬性
 *   @param {Boolean} multiple 是否開啟多選檔案
 * }
 * @param {String|Object} modelValue v-model綁定值 (預設:空自串，有值:FileList Object)
 */
const props = defineProps({
  inputObject: {
    type: Object,
    required: true
  },
  value: {
    type: [String, Object]
  }
});

const emit = defineEmits(['update:value', 'change']);

const fileUploader = ref(null);

const val = computed({
  get () {
    let valueStr = '';

    if (props.value?.length) {
      Array.from(props.value).forEach((value) => {
        valueStr += `${value?.name ?? value ?? ''}<br>`;
      });

      return valueStr;
    }

    return props.value?.name ?? props.value ?? '';
  },
  set (val) {
    emit('update:value', val);
  }
});

/**
 * 清空目標ref的value
 */
const resetFileUploader = () => {
  if (fileUploader.value) {
    fileUploader.value.value = '';
  }
};

/**
 * emit input event
 */
const uploadFile = (file) => {
  emit('update:value', file);
};
</script>

<style lang="scss" scoped>

input[type='file'] {
  display: none;
}

.pay-input {
  position: relative;
}

.slot {
  position: absolute;
  transform: translateY(-50%);
  border-radius: 0.25rem;
  top: 50%;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  .label {
    color: #32aaff;
  }
  .value {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100% - 60px);
    text-align: left;
  }
  .default {
    color: #8c8c8c;
  }
  &.disabled{
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
  &.error {
    border:  solid 1px #eb5b2c;
  }
}
</style>
