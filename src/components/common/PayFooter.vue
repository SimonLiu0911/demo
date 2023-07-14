<template lang="pug">
footer.pay-footer
  p Copyright © 壹壹柒柒科技 {{ currentYear }} All Rights Reserved.
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style lang="scss" scoped>
  .pay-footer {
    background-color: #e8ebec;
    bottom: 0;
    color: #67757c;
    position: absolute;
    font-size: 12px;
    left: 0;
    padding: 13px 0;
    right: 0;
    text-align: center;
  }
</style>
