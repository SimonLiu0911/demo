<template lang="pug">
button.pay-btn(
  :class="className"
  :disabled="disabled"
  @click="emit('click')"
)
  slot(name="prefix")

  | {{name}}

  slot(name="suffix")
</template>

<script setup>
/**
 * @param {String} name - button顯示的文字
 * @param {String} className - button的class名稱
 * @param {Boolean} disabled - 是否disabled button
 */
const props = defineProps({
  name: { type: String },
  className: { type: String },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);
</script>

<style lang="scss" scoped>

$white: #fff;

$blue-100: #c0d3e2;
$blue-200: #9dbbd2;
$blue-300: #5789b1;
$blue-400: #34556f;

$gray-100: #dddddd;
$gray-200: #d7d7d7;
$gray-300: #d4dfe7;
$gray-400: #e6eff6;
$gray-500: #b2c5d4;
$gray-600: #666;
$gray-700: #363636;

$red-100:#f8c9b9;
$red-200: #f4a58b;
$red-300: #eb5b2c;
$red-400: #a3340f;

.pay-btn {
  border-radius: 8px;
  padding: 10px 26px;
  &:disabled,
  &:disabled:hover {
    background-color: $gray-200;
    color: $white;
    cursor: not-allowed;
  }
}

.btn-primary {
  background-color: $blue-300;
  color: $white;
  &:hover {
    background-color: lighten($blue-300, 10%);
  }
  &:active {
    background-color: darken($blue-300, 20%);
  }
}

.btn-second {
  background-color: $white;
  box-shadow:0px 0px 0px 1px $blue-300 inset;
  color: $blue-300;
  &:hover {
    background-color: $blue-100;
    color: $blue-400;
  }
  &:active {
    background-color: $blue-200;
    color: $blue-400;
  }
}

.btn-third {
  background-color: $white;
  box-shadow:0px 0px 0px 1px $gray-100 inset;
  color: $blue-300;
  &:hover {
    background-color: $blue-100;
    box-shadow:0px 0px 0px 1px $blue-300 inset;
    color: $blue-400;
  }
  &:active {
    background-color: $blue-200;
    box-shadow:0px 0px 0px 1px $blue-300 inset;
    color: $blue-400;
  }
}

.btn-gray {
  background-color: $white;
  box-shadow:0px 0px 0px 1px $gray-100 inset;
  color: $gray-600;
  &:hover {
    background-color: $blue-100;
    box-shadow:0px 0px 0px 1px $blue-300 inset;
  }
  &:active {
    background-color: $blue-200;
    box-shadow:0px 0px 0px 1px $blue-300 inset;
  }
}

.btn-second-danger {
  background-color: $white;
  box-shadow:0px 0px 0px 1px $gray-100 inset;
  color: $red-300;
  &:hover {
    background-color: $red-100;
    box-shadow:0px 0px 0px 1px $red-300 inset;
    color: $red-400;
  }
  &:active {
    background-color: $red-200;
    box-shadow:0px 0px 0px 1px $red-300 inset;
    color: $red-400;
  }
}

.btn-danger {
  background-color: $red-300;
  color: $white;
  &:hover {
    background-color: lighten($red-300, 10%);
  }
  &:active {
    background-color: darken($red-300, 20%);
  }
}

.btn-behavior {
  background-color: $gray-300;
  color: $gray-700;
  padding: 10px;
  &:hover {
    background-color: $gray-400;
  }
  &:active {
    background-color: $gray-500;
  }
}
</style>
