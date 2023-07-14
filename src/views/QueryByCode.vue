<template lang="pug">
//- PayTopMenu(:isQueryByCode="true")
.pay-card(class="mx-[20px]")
  .pay-card-title.text-left(class="px-[68px] py-[16px]")
    p 會員編號 - 0912345678
  .pay-card-wrap
    .title-wrap
      .title.text-left(class="text-[#5789b1] px-[68px] py-[16px]")
        span(class="pl-[8px]") 商店編號 123123
    .modal-wrap.text-left(class="pb-[20px]")
      .shadow-line.flex(class="min-h-[68px] mb-[2px]")
        .flex.justify-center.items-center(class="px-[8px] w-[202px]")
          .flex.justify-center(class="w-[88px]")
            PayTag(
              :name="order.data.contractStatusText.text"
              :class-name="order.data.contractStatusText.className"
              :other-style="order.data.contractStatusText.otherStyle"
              :circle-color="order.data.contractStatusText.circleColor"
            )
        .flex.justify-center.items-start.flex-col(class="p-[8px] w-[220px]")
          p(class="text-[#363636]") 交易時間
          p(class="text-[#666666]") {{ order.data.orderTime }}
        .flex.justify-center.items-start.flex-col(class="p-[8px] w-[220px]")
          p(class="text-[#363636]") 交易金額
          p(class="text-[#666666]") ${{ setMoney(order.data.orderAmount) }}
        .flex.justify-center.items-start.flex-col(class="p-[8px] w-[220px]")
          p(class="text-[#363636]") 交易序號
          p(class="text-[#666666]") {{ order.data.serviceOrderSno }}
        .flex.justify-center.items-start.flex-col(class="p-[8px] w-[220px]")
          p(class="text-[#363636]") 付款序號
          p(class="text-[#666666]") {{ order.data.paymentNumber }}

      .shadow-line.flex.rounded-sm(class="min-h-[68px] mb-[2px]")
        .flex.justify-center.items-center(class="px-[8px] w-[202px]")
          .flex.justify-center(class="w-[88px]")

        .flex.justify-center.items-start.flex-col(class="p-[8px] w-[220px]")
          p(class="text-[#363636]") 所屬銀行
          p(class="text-[#666666]") {{ order.data.bank }}
        .flex.justify-center.items-start.flex-col(class="p-[8px] w-[220px]")
          p(class="text-[#363636]") 收款帳號
          p(class="text-[#666666]") {{ order.data.accountNumber }}
        .flex.justify-center.items-start.flex-col(class="p-[8px]")
          p(class="text-[#363636]") 付款帳號
          p(class="text-[#666666]") {{ order.data.transoutAccount }}

      .shadow-line.flex.rounded-sm(class="min-h-[68px]")
        .flex.justify-center.items-center(class="px-[8px] w-[202px]")
          .flex.justify-center(class="w-[88px]")

        .flex.justify-center.items-start.flex-col(class="p-[8px] w-[220px]")
          p(class="text-[#363636]") 付款人名稱
          p(class="text-[#666666]") {{ order.data.payName }}
        .flex.justify-center.items-start.flex-col(class="p-[8px]")
          p(class="text-[#363636]") 電子信箱
          p(class="text-[#666666]") {{ order.data.email }}
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { queryTransaction } from '@/api';
import { useCommonStore } from '@/stores/common';
import useCommon from '@/composables/common';

const common = useCommonStore();

const { setMoney, toast, errorIcon } = useCommon();

const order = reactive({
  data: {
    paymentState: '',
    orderTime: null,
    orderAmount: null,
    serviceOrderSno: '',
    paymentNumber: '',
    bank: '',
    accountNumber: '',
    transoutAccount: '',
    payName: '',
    email: '',
    merchantNumber: '',
    memberId: '',
    contractStatusText: {
      text: ''
    }
  }
});

const getQueryTransactionData = async () => {
  common.setLoading(true);

  const payload = { code: window.location.hash.split('=')[1] };
  const responseData = await queryTransaction(payload);
  const { rc, data } = responseData;

  if (rc !== '0') return;

  order.data = { ...data };

  common.setLoading(false);
};

onMounted(() => {
  getQueryTransactionData();
});

</script>

<style lang="scss" scoped>
.pay-card {
  background-color: #ffffff;
  border: 0.5px solid rgba(0, 0, 0, 0.05);

}

.pay-card-title {
  background-color: #e9eef2;
  border: 1px solid #cadeed;
  border-radius: 4px 4px 0 0;
}

.pay-card-wrap {

  .title {
    span {
      border-left: 4px solid #5789b1;
    }
  }

  .modal-wrap {
    background-color: #ffffff;
  }
}

.shadow-line {
  border-radius: 2px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
}
</style>
