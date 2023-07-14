<template lang="pug">
.pay-loading-mask
  .img-background
    img(src="@/assets/images/loading.gif")
</template>

<style lang="scss" scoped>
  .pay-loading-mask {
    align-items: center;
    background-color: rgba(0,0,0,0);
    bottom: 0;
    display: flex;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    justify-content: center;
    z-index: 999;
    .img-background {
      align-items: center;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 8px 10px 0 rgba(0, 0, 0, 0.24);
      display: flex;
      height: 144px;
      justify-content: center;
      width: 144px;
    }
  }
</style>
