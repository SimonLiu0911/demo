<template lang="pug">
.pay-card
  .pay-card-subtitle
    slot(name="subtitle")
  .pay-card-body
    slot(name="body")
</template>

<script>
export default {
  name: 'PaySubCard'
};
</script>

<style lang="scss" scoped>
.pay-card {
  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.04);
  text-align: left;
}

.pay-card-subtitle {
  padding: 7px 32px;
  background-color: #d4dfe7;
}

.pay-card-body {
  background-color: #fff;
  // padding: 20px 0 20px 68px;
}
</style>
