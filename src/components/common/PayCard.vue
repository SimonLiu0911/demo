<template lang="pug">
.pay-card
  .pay-card-title
    slot(name="title")
  .pay-card-body
    slot(name="body")
</template>

<script setup>

</script>

<style lang="scss" scoped>
.pay-card {
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.04);
  text-align: left;
}

.pay-card-title {
  background-color: #e9eef2;
  box-shadow: inset 0 0 0 1px #cadeed;
  font-size: 16px;
  padding: 16px 0 16px 68px;
}

.pay-card-subtitle {
  padding: 7px 32px;
}

.pay-card-body {
  background-color: #fcfcfc;
  // padding: 20px 0 20px 68px;
}
</style>
