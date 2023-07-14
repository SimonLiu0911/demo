<template lang="pug">
Teleport(to="body")
  Transition(name="modal")
    .pay-modal(
      class="modal"
      v-if="modal.show"
    )
      .pay-modal-container(
        ref="modalTarget"
        :style="{ 'width': modal.width }"
        :class="modal.modalClass"
        @click.stop
      )
        .pay-modal-header-custom(v-if="!modal.title && modal.header")
          slot(:name="modal.header")
        .pay-modal-header(v-if="modal.title")
          .title
            PayIcon.icon(
              :iconName="modal.type"
              v-if="modal.type"
            )
            span {{ modal.title }}
          button(
            v-if="modal.hasCloseBtn"
            @click="closeModal(false)"
          )
            PayIcon.icon-close(iconName="largepopup-close")
        .pay-modal-content(:class="{'has-footer': modal.footer}")
          slot(:name="modal.body || 'body'")
          .toast(:class="modal.type")
            slot(
              name="toast"
              :type="modal.type"
              :text="modal.text"
            )
        .pay-modal-footer(v-if="modal.footer")
          slot(:name="modal.footer")
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { onClickOutside } from '@vueuse/core';

/**
 * @param {Object} modal
 * {
 *   @param {Boolean} show 是否顯示
 *   @param {Boolean} hasCloseBtn 是否有關閉按鈕
 *   @param {Boolean} canClickOutsideClose 是否可以點擊遮罩關閉
 *   @param {String} title 標題名稱
 *   @param {String} type 大icon顯示類型 ex. success、fail、delete
 *   @param {String} text 大icon下的顯示文字 ex. 交易成功、退款失敗、刪除成功
 *   @param {String} width 寬度
 *   @param {String} header header slot name
 *   @param {String} body body slot name
 *   @param {String} footer footer slot name
 *   @param {String} modalClass container class name
 * }
 */
const props = defineProps({
  modal: {
    type: Object
  }
});

const time = 3000;
let timer = null;

const modalTarget = ref(null);
const modalTypeList = ref(['success', 'fail', 'delete']);


const emit = defineEmits(['close', 'init']);

/**
 * emit init event
 */
const init = () => {
  emit('init');
};

/**
 * 點擊遮罩事件
 * @param {String} modalTarget 目標DOM元素上的ref
 */
onClickOutside(modalTarget, (event) => {
  if (props.modal.canClickOutsideClose) {
    closeModal();
  }
});

/**
 * 清除計時器
 */
const clearTimer = () => {
  clearTimeout(timer);
  timer = null;
};

/**
 * 倒數關閉modal
 */
const countDownToClose = () => {
  timer = setTimeout(() => {
    closeModal(false);
  }, time);
};

/**
 * 關閉元件
 */
const closeModal = (value = !props.modal.canClickOutsideClose) => {
  if (value) return;

  emit('close');
};

/**
 * 監聽modal.show的變化
 * 1.show = true 且 type = 大icon顯示類型 ex. success、fail、delete，執行倒數關閉modal
 * 2.show = true 且 modalClass = detail，執行init()，emit init event，取非同步資料
 * @param {Boolean} props.modal.show 是否顯示
 */
watch(() => props.modal.show,
  async () => {
    document.body.classList.toggle('modal-is-open');

    if (!props.modal.show) {
      clearTimer();
    }
    if (
      props.modal.show &&
      modalTypeList.value.includes(props.modal.type)
    ) {
      countDownToClose();
    }
    if (
      props.modal.show &&
      props.modal.modalClass === 'detail'
    ) {
      await init();
    }
  }, {
    deep: true
  }
);

onMounted(async () => {
  if (
    props.modal.show &&
    props.modal.modalClass === 'detail'
  ) {
    await init();
  }
});
</script>

<style lang="scss" scoped>
$color-success: #dae6f0;
$color-fail: #fdd6cf;
$color-delete: #f6ecd4;
$min-width: 1280px;

.pay-modal {
  background-color: rgba(0,0,0,0.4);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 99999;
}

.pay-modal-container {
  background-color: #fff;
  border-radius: 4px;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all .3s linear;
}

.pay-modal-container.detail {
  background-color: #fcfcfc;
  // height: 85%;
  width: 85%;
  // top: 74px;
}

.pay-modal-header {
  background-color: #e9eef2;
  border-radius: 4px 4px 0 0;
  box-shadow: 0px 0px 0px 1px #cadeed inset;
  color: #363636;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 16px 28px;

  button {
    color: rgba(0, 0, 0, 0.45);
    padding: 0;
    .icon-close {
      height: 24px;
      width:24px;
    }
  }
}

.pay-modal-header-custom {
  background-color: #e9eef2;
  box-shadow: 0px 0px 0px 1px #cadeed inset;
  border-radius: 4px 4px 0 0;
  color: #363636;
  font-size: 16px;
  font-weight: 500;
  padding: 16px 28px;
}

.pay-modal-content {
  max-height: 70vh;
  overflow-y: auto;

  .toast {
    border-radius: 4px;

    &.success {
      background-color: $color-success;
    }

    &.fail {
      background-color: $color-fail;
    }

    &.delete {
      background-color: $color-delete;
    }
  }
}

.detail {
  .pay-modal-content {
    height: calc(100% - 74px);
    overflow-y: auto;

    &.has-footer {
      height: calc(100% - 120px);
    }
  }
}

@media (min-width: $min-width) {
  .pay-modal-container.detail {
    width: 1104px;
  }
}

.modal-leave-to {
  opacity: 0;
  transition: all .3s linear;
}

.modal-enter-from .pay-modal-container,
.modal-leave-to .pay-modal-container {
  top: 48%;
  opacity: 0;
}
</style>
