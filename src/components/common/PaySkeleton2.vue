<template lang="pug">
.bg-white
  template(v-if="skeletonLoading")
    .animate-pulse.p-4(role="status")
      .h-2.bg-gray-200.rounded-full(class="dark:bg-gray-700 w-48 mb-4")
      .h-2.bg-gray-200.rounded-full(class="dark:bg-gray-700 max-w-[560px] mb-2.5")
      .h-2.bg-gray-200.rounded-full(class="dark:bg-gray-700 max-w-[660px] mb-2.5")
      .h-2.bg-gray-200.rounded-full(class="dark:bg-gray-700 max-w-[560px]")
  template(v-else)
    .p-4
      .text-left Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex quasi enim facere commodi omnis...
      .text-left Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex quasi enim facere commodi omnis...
      .text-left Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex quasi enim facere commodi omnis...
      .text-left Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex quasi enim facere commodi omnis...
</template>

<script setup>
import { ref } from 'vue';

const skeletonLoading = ref(true);

setTimeout(() => {
  skeletonLoading.value = false;
}, 2000);
</script>

<style lang="scss" scoped>

</style>
