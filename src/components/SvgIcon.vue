<script setup>
import { computed } from 'vue';
const props = defineProps({
  iconName: {
    type: String,
    required: true,
  },
  className: {
    type: String,
  },
  color: {
    type: String,
    // default: '#333',
  },
});

const svgName = computed(() => `#/${props.iconName}`);
const svgClass = computed(() =>
  (props.className ? `svg-icon ${props.className}` : 'svg-icon')
);
</script>

<template lang="pug">
svg(aria-hidden="true" :class="svgClass")
  use(:xlink:href="svgName" :fill="color")
</template>

<style>
.svg-icon {
  /* width: 100%;
  height: 100%; */
  fill: currentColor;
  overflow: hidden;
  display: inline-block;
}
</style>
