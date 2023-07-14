<template lang="pug">
.pay-layout-container
  Transition(name="load")
    PayLoading(v-if="common.$loading")
  PayTopMenu(serviceName="管理後台")
  .view
    router-view
  PayFooter

PayModal(
  :modal="modal"
  @close="closeModal"
)
  template(#detailHeader)
    .flex.justify-between.items-center(class="pl-[40px]")
      .flex.items-center
        p 會員編號 - {{ modalContent.memberId }}
      button(@click="modal.show = false")
        PayIcon(
          icon-name="largePopup-close"
          class="w-[24px] h-[24px]"
        )
  template(#detailBodyAccountCreate)
    div.modal-content-wrap
      .flex
        .flex.flex-col.break-all(class="p-[9px] pl-[68px] w-[220px]")
          p 建立時間
          p(class="text-[#666666]") {{ modalContent.createTime }}
        .flex.flex-col.item-wrap(class="p-[9px] pl-[12px] w-[220px]")
          p 付款人名稱
          p(class="text-[#666666]") {{ modalContent.payName }}
        .flex.flex-col.item-wrap(class="p-[9px] pl-[12px] w-[220px]")
          p 電子信箱
          p(class="text-[#666666]") {{ modalContent.email }}
    div.modal-content-wrap(class="mb-[20px]")
      .flex
        .flex.flex-col.item-wrap(class="p-[9px] pl-[68px] w-[220px]")
          p 收款帳號
          .flex.items-center
            p(class="text-[#666666] mr-[4px]") {{ modalContent.accountNumber }}
            span.cursor-pointer(@click.stop="copyAccount(modalContent.accountNumber)")
              PayTooltips
                template(#content)
                  p 複製帳號
                template(#toggle)
                  PayIcon(
                    icon-name="ic-copy"
                    class="w-[16px] h-[16px]"
                  )
        .flex.flex-col.item-wrap(class="p-[9px] pl-[12px] w-[220px]")
          p 所屬銀行
          p(class="text-[#666666]") {{ modalContent.bank }}
        .flex.flex-col.item-wrap(class="p-[9px] pl-[12px]")
          p 付款帳號
          p(class="text-[#666666]" v-html="formatPredictAccounts()")
  template(#detailBody)
    div.modal-content-wrap
      .flex
        .flex.items-center.item-wrap(class="p-[17px] pl-[68px]")
          PayTag.label-width(
            :name="modalContent.contractStatusText.text"
            :class-name="modalContent.contractStatusText.className"
            :other-style="modalContent.contractStatusText.otherStyle"
            :circle-color="modalContent.contractStatusText.circleColor"
          )
        .flex.flex-col.break-all(class="p-[9px] pl-[12px] w-[220px]")
          p 付款人名稱
          p(class="text-[#666666]") {{ modalContent.payName }}
        .flex.flex-col.item-wrap(class="p-[9px] pl-[12px]")
          p 交易時間
          p(class="text-[#666666]") {{ modalContent.orderTime }}
        .flex.flex-col(class="p-[9px] pl-[12px]")
          p 交易金額
          p(class="text-[#666666]") ${{ setMoney(modalContent.orderAmount) }}
    div.modal-content-wrap
      .flex
        .flex.flex-col(class="p-[9px] pl-[68px] pr-[96px]")
          p 交易序號
          p(class="text-[#666666]") {{ modalContent.serviceOrderSno }}
        .flex.flex-col(class="p-[9px] pl-[12px] pr-[152px]")
          p 付款序號
          p(class="text-[#666666]") {{ modalContent.paymentNumber }}
        .flex.flex-col(class="p-[9px] pl-[12px]")
          p 電子信箱
          p(class="text-[#666666]") {{ modalContent.email }}
    div.modal-content-wrap(class="mb-[20px]")
      .flex
        .flex.flex-col.item-wrap(class="p-[9px] pl-[68px]")
          p 收款帳號
          .flex.items-center
            p(class="text-[#666666] mr-[4px]") {{ modalContent.accountNumber }}
            span.cursor-pointer(@click.stop="copyAccount(modalContent.accountNumber)")
              PayTooltips
                template(#content)
                  p 複製帳號
                template(#toggle)
                  PayIcon(
                    icon-name="ic-copy"
                    class="w-[14px] h-[14px]"
                  )

        .flex.flex-col.item-wrap(class="p-[9px]")
          p 所屬銀行
          p(class="text-[#666666]") {{ modalContent.bank }}
        .flex.flex-col(class="p-[9px] pl-[12px]")
          p 付款帳號
          p(class="text-[#666666]") {{ modalContent.transoutAccount }}
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCommonStore } from '@/stores/common';
import { useModalStore } from '@/stores/modal';
import useCommon from '@/composables/common';

const { toast, successIcon, errorIcon } = useCommon();

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
});

const common = useCommonStore();
const modalStore = useModalStore();

const { modal, modalContent } = storeToRefs(modalStore);
const { closeModal } = modalStore;

const setMoney = (value) => {
  const reg = /^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/;

  return String(value).replace(reg, (all, pre, groupOf3Digital) => pre + groupOf3Digital.replace(/\d{3}/g, ',$&'));
};

const copyAccount = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.success('帳號已複製', { icon: successIcon });
    })
    .catch((error) => {
      toast.error('複製失敗', { icon: errorIcon });
    });
};

const formatPredictAccounts = (() => {
  if (modalContent.value?.predictAccounts?.length) {
    let accounts = '';
    modalContent.value.predictAccounts.forEach((item, index) => {
      const bankId = item.slice(0,3);
      accounts += `${index === 0 ? '' : '<br>'}${toBankName(bankId)} (${bankId}) ${item.slice(3)}`;
    });
    return accounts;
  }
});


const toBankName = (str) => common.allBankList?.find((item) => String(item.code) === String(str))?.label;

</script>

<style lang="scss" scoped>
.pay-layout-container {
  background-color: #e8ebec;
  padding-top: 137px; // 只有上方選單要改 72px
  padding-bottom: 60px;
  position: relative;
  min-height: 100vh;
  height: 100%;
  min-width: 1260px;
}

.view {
  max-width: 1920px;
  margin: auto;
}

.load-leave-active,
.load-enter-active {
  transition: all 0.4s ease;
}

.load-enter-from,
.load-leave-to {
  opacity: 0;
  transform: translateY(25px);
}

// payModal
.modal-content-wrap {
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  background-color: #fff;
}

.item-wrap {
  min-width: 220px;
}

// .pay-name-wrap {
//   max-width: 220px;
// }

.label-width {
  min-width: 88px;
}</style>
