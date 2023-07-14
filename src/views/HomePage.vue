<template lang="pug">
PayBasicLayout
  PayCard(class="mb-[20px]")
    template(#title)
      h3 今日統計
    template(#body)
      .title(class="py-[10px] pl-[32px]  bg-[#d4dfe7]") {{ formatDate([today]) }}
      section(class="py-[16px] pr-[32px]")
        .flex.justify-end
          .label.flex.items-center.inline-block(class="mr-[40px]")
            div(class="h-[3px] w-[19px] bg-[#666666] mr-[4px]")
            small(class="text-[#666666") 今日
          .label.flex.items-center.inline-block
            div(class="h-[3px] w-[5px] bg-[#666666] mr-[3px]")
            div(class="h-[3px] w-[5px] bg-[#666666] mr-[3px]")
            div(class="h-[3px] w-[5px] bg-[#666666] mr-[4px]")
            small(class="text-[#666666") 昨日
        .flex
          .left-body.flex-1(class="py-[18px]")
            .flex.items-center.justify-center
              .icon.flex.items-center.justify-center(class="bg-[#fdeece] w-[64px] h-[64px] rounded-[11px] mr-[8px]")
                PayIcon(
                  class="w-[24px] h-[24px]"
                  icon-name="ic-sso-number"
                )
              .text.flex.flex-col
                small 交易金額
                h3(class="text-[20px]") $
                  span.font-medium(
                    ref="count"
                    class="text-[30px] ml-[4px]"
                  ) {{ setMoney(todayStatistics.data.amount) }}
            .container(style="width: 100%; height:400px;")
              PayLineChart(:option="lineChartCount")
          .right-body.flex-1(class="py-[18px]")
            .flex.items-center.justify-center
              .icon.flex.items-center.justify-center(class="bg-[#daf5f1] w-[64px] h-[64px] rounded-[11px] mr-[8px]")
                PayIcon(
                  class="w-[24px] h-[24px]"
                  icon-name="ic-sso-amount"
                )
              .text.flex.flex-col
                small 交易筆數
                h3.font-medium(
                  ref="amount"
                  class="text-[30px]"
                ) {{ todayStatistics.data.number }}
                  span(class="text-[12px] ml-[4px]") 筆
            .container(style="width: 100%; height:400px;")
              PayLineChart(:option="lineChartAmount")

  PayCard(class="mb-[20px]")
    template(#title)
      h3 各銀行統計
    template(#body)
      .title-container.flex.justify-between(class="py-[7px] px-[32px]  bg-[#d4dfe7]")
        .left.flex.items-center
          span.vertical-middle {{ statisticsDate }}
          button(
            v-show="compareDates('prev')"
            @click="calculateDates('minus')"
          )
            PayIcon(
              icon-name="ic-back"
              class="ml-[12px] w-[14px] h-[14px] mr-[8px]"
            )
          button(
            v-show="compareDates('next')"
            class="ml-[12px] "
            @click="calculateDates('add')"
          )
            PayIcon(
              icon-name="ic-next"
              class="w-[14px] h-[14px]"
            )
        .right
          paySwitch(
            v-model="paySwitchList.category"
            :items="paySwitchList.options"
            :active="paySwitchList.category"
            @input="changeData"
          )
      section(class="py-[16px] px-[60px]")
        .flex
          .flex-1(
            class="py-[18px] mr-[26px]"
            v-for="(item, key, index) in statisticsList.data"
            :key="index"
          )
            .flex.items-end.total
              small(class="mb-[4px] mr-[4px] inline-block min-w-[70px] text-right") {{ !index ? '交易金額' : '交易筆數' }}
              h3(class="text-[14px]") {{!index ? '$ ' : ''}}
                span.font-medium(class="text-[24px] ml-[4px]") {{ setMoney(item.sum) }}
                | {{ index ? ' 筆' : '' }}
            template(
              v-for="(bank, idx) in item.bankList"
              :key="idx"
            )
              hr(class="my-[12px] border-[#e9e9e9]")
              .flex.items-center
                small(class="mb-[4px] mr-[4px] inline-block min-w-[70px] text-right") {{ bank.name }}
                small(class="mb-[4px] mr-[24px] inline-block min-w-[90px] text-right text-[#666666]") {{ index ? `${setMoney(bank[key])} 筆` : `$ ${setMoney(bank[key])}` }}
                .container(class="min-w-[302px]")
                  PayProgress(:options="{progress: setWidth(item.sum, bank[key]), color: bank.color}")

  PayCard
    template(#title)
      h3 最近已收款訂單
    template(#body)
      PayTable(
        :thead="recentOrderListColumn"
        :tbody="todaySipWithholdFailList.data"
        :has-tr-click="true"
        @tr-click="handlePopupModal"
      )
        template(#memberId="{ rowData }")
          .flex.items-center.justify-center
            span(class="mr-[4px]") {{ rowData.memberId }}
            PayTooltips
              template(#content)
                p 會員編號：{{ rowData.memberId }}
                p 付款人名稱：{{ rowData.payName }}
                p 電子信箱：{{ rowData.email }}
              template(#toggle)
                PayIcon(
                  icon-name="ic-info"
                  class="w-[14px] h-[14px]"
                )
        template(#accountNumber="{ rowData }")
          .flex.items-center.justify-center
            span(class="mr-[4px]") {{ rowData.memberId }}
            .flex.items-center.cursor-pointer(@click.stop="copyAccount(rowData.accountNumber)")
              PayTooltips
                template(#content)
                  p 複製帳號
                template(#toggle)
                  PayIcon(
                    icon-name="ic-copy"
                    class="w-[14px] h-[14px]"
                  )
        template(#action="{ rowData }")
          PayIcon(
            icon-name="ic-next"
            class="ml-[12px] w-[14px] h-[14px] mr-[8px]"
          )
        template(#contractStatusText="{ rowData }")
          PayTag(
            :name="rowData.contractStatusText.text"
            :class-name="rowData.contractStatusText.className"
            :other-style="rowData.contractStatusText.otherStyle"
            :circle-color="rowData.contractStatusText.circleColor"
          )
  .more-wrap
    .more
      span.cursor-pointer(
        class="text-[#5789b1]"
        @click="gotToPage('TransactionSearch')"
      ) 查詢更多
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { getProgressInfo, getLineInfo, getRecent, getSingleTransaction } from '@/api';
import { recentOrderListColumn } from '@/utils/tableColumns';
import { storeToRefs } from 'pinia';
import { useModalStore } from '@/stores/modal';
import { useCommonStore } from '@/stores/common';
import { useProgressCol } from '@/composables/progressColumn';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import useCommon from '@/composables/common';
import counterUp from 'counterup2';
import _ from 'lodash';

const common = useCommonStore();
const modalStore = useModalStore();
const user = useUserStore();

const router = useRouter();

const { paySwitchList, statisticsDate, calculateDate, formatDate, compareDates, today, dates, nowYear, nowMonth, resetDate } = useProgressCol();
const { copyAccount, setMoney, toast, errorIcon } = useCommon();
const { modal, modalContent } = storeToRefs(modalStore);
const { popupModal, storeModalContent } = modalStore;

const count = ref(null);
const amount = ref(null);

const todayStatistics = reactive({
  data: {
    amount: 0,
    number: 0
  }
});
const lineChartCount = reactive({
  data: {
    id: 'graph1',
    seriesColor: ['#ff920d', '#ffc47b'],
    gradientColor: ['rgba(255, 146, 13, 0.2)', 'rgba(255, 255, 255, 0.2)'],
    padding: [5, 0, 0, 0],
    data1: [],
    data2: [],
    xAxis: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
  }
});
const lineChartAmount = reactive({
  data: {
    id: 'graph2',
    seriesColor: ['#25bba9', '#77dace'],
    gradientColor: ['rgba(37, 187, 169, 0.2)', 'rgba(255, 255, 255, 0.2)'],
    padding: [5, 0, 0, 0],
    data1: [],
    data2: [],
    xAxis: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
  }
});
const statisticsList = reactive({ data: {} });
const todaySipWithholdFailList = reactive({ data: [] });
const modalDetail = reactive({
  data: {
    show: false,
    hasCloseBtn: true,
    canClickOutsideClose: true,
    modalClass: 'detail',
    header: 'detailHeader',
    body: 'detailBody',
    footer: ''
  }
});

const counterAnimated = (dom) => {
  counterUp(dom, {
    duration: 2000,
    delay: 16
  });
};

const handlePopupModal = async (rowData) => {
  const payload = { paymentNumber: rowData.paymentNumber };
  const { rc, data } = await getSingleTransaction(payload);

  if (rc !== '0') return;

  storeModalContent(data);

  popupModal({
    show: true,
    hasCloseBtn: true,
    canClickOutsideClose: true,
    modalClass: 'detail',
    header: 'detailHeader',
    body: 'detailBody',
    footer: ''
  });

};

const getProgressInfoData = _.debounce(async (dates) => {
  const payload = {
    startTime: new Date(dates[0]).getTime(),
    endTime: new Date(dates[1]).getTime()
  };

  const { rc, rm, result:data } = await getProgressInfo(payload);

  if (rc !== '0') return;

  statisticsList.data = data;

}, 500);

const getLineInfoData = async (dates) => {
  const { rc, data } = await getLineInfo();

  if (rc !== '0') return;

  lineChartAmount.data.data1 = data.numberLineToday;
  lineChartAmount.data.data2 = data.numberLineYesterday;
  lineChartCount.data.data1 = data.amountLineToday;
  lineChartCount.data.data2 = data.amountLineYesterday;

  todayStatistics.data = {
    amount: data.amount,
    number: data.number
  };
};

const getRecentData = async (dates) => {
  const { rc, data } = await getRecent();

  if (rc !== '0') return;

  todaySipWithholdFailList.data = data;
};

const setWidth = (sum = 0, data = 0) => {
  if (data === 0) return '0%';

  return (data / sum) * 100 > 100 ? '100%' : `${(data / sum) * 100}%`;
};

const changeData = async () => {
  dates.data = [today.value, today.value];
  dates.data[0] = resetDate();

  await getProgressInfoData(dates.data);
};

const calculateDates = async (type) => {
  dates.data[0] = calculateDate(dates.data[0], type, 0);
  dates.data[1] = calculateDate(dates.data[1], type, 1);

  await getProgressInfoData(dates.data);
};

const gotToPage = (name) => {
  router.push({ name });

  sessionStorage.setItem('fromHome', true);
};


onMounted(async () => {
  await user.hasUserDataPromise;
  await getProgressInfoData(dates.data);
  await getLineInfoData();
  await getRecentData();

  counterAnimated(count.value);
  counterAnimated(amount.value);

});
</script>

<style lang="scss" scoped>
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
}

.more-wrap {
  background-color: #fcfcfc;
  padding-top: 20px;

  .more {
    padding: 20px 0;
    border-top: 1px solid #dbdbdb;
    margin: 0 20px;
  }
}
</style>
