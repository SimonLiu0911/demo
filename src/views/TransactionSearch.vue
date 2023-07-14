<template lang="pug">
PayBasicLayout(:title="titles?.data")
  section.search-info-section(class="p-[20px]")
    .flex
      .dividing-line-right(class="pl-[12px] pr-[32px] mr-[20px]") 交易日期
      div(class="pb-[20px]")
        PayRadioBoxGroup(
          class="pb-[20px]"
          label="uud"
          v-model="orderRange"
          :items="orderRangeOptions"
          :error="false"
          @click="handleOrderRange"
        )
        .flex.items-center
          PayRadioBoxGroup.custom-radio(
            label="test"
            v-model="customRange"
            :items="customRangeOptions"
            :error="false"
            @click="handleOrderRange"
          )
          .flex.items-center
            PayDateTime(
              input-type="date"
              :settings="startDate"
              @change="changeStartDatePicker"
            )

            span(class="pl-[12px] pr-[12px]") 至

            PayDateTime(
              input-type="date"
              :settings="endDate"
              @change="changeEndDatePicker"
            )
    .flex.dividing-line-bottom(class="pb-[20px]")
      .dividing-line-right.account-title(class="pl-[12px] pr-[32px] mr-[20px]") 收款帳號
      PayInput(
        v-model:value="accountNumber.value"
        :input-object="accountNumber"
      )
    .flex.justify-center(class="pt-[20px]")
      div(class="pr-[10px]")
        PayButton(
          name='查詢'
          class-name='btn-primary'
          :disabled='common.btnDisabled'
          @click="clickSearchBtn"
        )
      div(class="pl-[10px]")
        PayButton(
          name='清除'
          class-name='btn-gray'
          @click="clickCleanBtn"
        )

  section(
    v-if="transactionList.data.length > 0"
    class="mt-[20px]"
  )
    PayTable(
      :meta="meta.data"
      :thead="recentOrderListColumn"
      :tbody="transactionList.data"
      :options="tablePageOptions"
      :has-tr-click="true"
      @tr-click="handlePopupModal"
      @change-page-size="changePageSize"
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
          span(class="mr-[4px]") {{ rowData.accountNumber }}
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
    .flex.justify-center(
      v-if="havePagination"
      class="mt-[12px]"
    )
      PayPagination(
        :total-page="pagination.totalPage"
        :current-page="pagination.currentPage"
        @change-page="changePage"
      )
</template>

<script setup>
import { reactive, ref, watch, computed, onMounted } from 'vue';
import { orderRangeOptions, customRangeOptions } from '@/map/options';
import { recentOrderListColumn } from '@/utils/tableColumns';
import { getTransactionList, getSingleTransaction } from '@/api';
import { storeToRefs } from 'pinia';
import { useCommonStore } from '@/stores/common';
import { useModalStore } from '@/stores/modal';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import tablePageOptions from '@/map/tablePageOption';
import useCommon from '@/composables/common';
import _ from 'lodash';


const currentRoute = useRoute();

const common = useCommonStore();
const modalStore = useModalStore();
const user = useUserStore();

const { modal, modalContent } = storeToRefs(modalStore);
const { popupModal, storeModalContent } = modalStore;

const { copyAccount, toast, errorIcon } = useCommon();

const today = new Date();
const payload = {
  accountNumber: '',
  startTime: null,
  endTime: null,
  currentPage: 1,
  pageSize: 100
};

const orderRange = ref('today');
const customRange = ref('');

const accountNumber = reactive({
  type: 'text',
  inputStyle: 'normalInput',
  maxLength: 16,
  width: '300px',
  disabled: false,
  placeholder: '請輸入收款帳號',
  value: '',
  error: false,
  replaceRule: /[^0-9]/g,
  style: {
    paddingLeft: '12px',
    paddingRight: '12px',
    fill: '#8C8C8C'
  }
});
const startDate = reactive({
  value: '',
  format: 'YYYY/MM/DD',
  placeholder: '日期',
  disabled: true,
  error: false,
  width: '150px',
  disabledDate: (date) => date > new Date() || date > new Date(endDate.value) || date < new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
});
const endDate = reactive({
  value: '',
  format: 'YYYY/MM/DD',
  placeholder: '日期',
  disabled: true,
  error: false,
  width: '150px',
  disabledDate: (date) => date > new Date() || date < new Date(startDate.value) || date < new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
});
const titles = reactive({
  data: [
    {
      name: '交易查詢',
      url: 'transactionSearch'
    }
  ]
});
const meta = reactive({
  data: {
    totalSize: 1,
    pageSize: 100
  }
});
const transactionList = reactive({
  data: []
});
const pagination = reactive({
  currentPage: 1,
  totalPage: 1
});

const havePagination = computed(() => pagination.totalPage > 1);

const disablePayDateTime = (value) => {
  startDate.disabled = value;
  endDate.disabled = value;
};

const handleOrderRange = (value) => {
  if (value === 'custom') {
    // 'other'只是用來區分是在 orderRange 還是 customRange
    orderRange.value = 'other';
    customRange.value = value;

    disablePayDateTime(false);
  } else {
    customRange.value = '';
    orderRange.value = value;

    disablePayDateTime(true);
  }
};

const clickSearchBtn = _.debounce(async () => {
  if (validateAccount()) return;

  pagination.currentPage = 1;
  meta.data.pageSize = 100;

  await getTransactionListData();
}, 500);

const validateAccount = () => {
  if (accountNumber?.value) {
    const reg = /^[0-9]+$/;
    accountNumber.error = !reg.test(accountNumber?.value) ? ' ' : accountNumber?.value.length > 16 ? ' ' : '';

    return accountNumber.error === '' ? false : true;
  }
};

const isLastDayOfMonth = () => {
  let flag = false;
  const year = today.getFullYear();
  const date = today.getDate();
  let month = today.getMonth() + 1;
  let newYear = year;
  let newMonth = month++;

  if (month > 12){
    newMonth -= 12;
    newYear++;
  }

  const newDate = new Date(newYear, newMonth, 1);
  const monthLastDay = (new Date(newDate.getTime() - (24 * 3600 * 1000))).getDate();

  if (date === monthLastDay) flag = true;

  return flag;
};

const getBackDate = (backMonth) => {
  if (isLastDayOfMonth()) {
    today.setMonth(today.getMonth() - 2);
    today.setDate(1);

    return today;
  }

  return new Date(new Date(today.getFullYear(), today.getMonth() - backMonth, today.getDate()).getTime() + (24 * 3600 * 1000));
};

const setTime = () => {
  const date = {
    today,
    week: new Date(today.getTime() - (7 * 24 * 3600 * 1000)),
    currentMonth: new Date(today.getFullYear(), today.getMonth() + 1),
    season: getBackDate(3),
    sixMonths: getBackDate(6)
  };

  if (orderRange.value === 'other') {
    payload.startTime = startDate.value ? new Date(startDate.value).getTime() : null;
    payload.endTime = endDate.value ? new Date(endDate.value).getTime() : null;
  } else {
    payload.startTime = timeFormat(date[orderRange.value]);
    payload.endTime = timeFormat(today);
  }
};

const changePage = async (page) => {
  pagination.currentPage = page;

  await getTransactionListData('getOldData', page);
};

const clickCleanBtn = () => {
  orderRange.value = 'today';
  customRange.value = '';
  accountNumber.value = '';
  startDate.value = '';
  startDate.disabled = true;
  endDate.value = '';
  endDate.disabled = true;
};

const changeStartDatePicker = (value) => {
  startDate.value = value ? value : '';
};

const changeEndDatePicker = (value) => {
  endDate.value = value ? value : '';
};

const getTransactionListData = async (action = 'getNewData', page = 1) => {
  if (action === 'getNewData') {
    setTime();
    payload.accountNumber = accountNumber.value || null;
  }

  payload.currentPage = page;
  payload.pageSize = meta.data.pageSize;

  const { rc, data } = await getTransactionList(payload);

  if (rc !== '0') return;

  transactionList.data = data.list;
  meta.data.totalSize = data.meta.totalSize;
  pagination.totalPage = data.meta.totalPage;

};

const timeFormat = (date) => {
  if (date === '' || date === undefined) return;

  const year = date.getFullYear().toString();
  const month = date.getMonth().toString();
  const day = date.getDate().toString();

  return new Date(year, month, day).getTime();
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

const changePageSize = async (value) => {
  pagination.currentPage = 1;
  await getTransactionListData('getOldData');
};

onMounted(async () => {
  await user.hasUserDataPromise;

  if (sessionStorage.getItem('fromHome')) {
    getTransactionListData('getNewData');

    sessionStorage.clear('fromHome');
  }
});
</script>

<style lang="scss" scoped>
.search-info-section {
  background-color: #fcfcfc;
}

.custom-radio::deep {
  .pay-checkbox-container {
    margin-right: 12px;
  }
}

.dividing-line {
  &-right {
    border-right: 1px solid #dbdbdb;
  }

  &-bottom {
    border-bottom: 1px solid #dbdbdb;
  }
}

.account-title {
  line-height: 47.2px;
}
</style>
