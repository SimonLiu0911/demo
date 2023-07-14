<template lang="pug">
PayBasicLayout(:title="titles")
  PayCard
    template(#title)
      p(class="text-[16px] font-medium") 收款帳號資訊
    template(#body)
      section(class="py-[20px] px-[68px]")
        .flex.items-center
          .flex(class="w-[131px] text-[14px] text-[#363636] mb-[36px]")
            p 會員編號
          .flex(class="pl-[17px] border-l-[1px] border-[#e9e9e9]")
            span(class="text-[#eb5b2c]") *
            .flex.flex-col
              .flex.items-center
                PayInput(
                  v-model:value="accountInfoData.memberId.value"
                  :input-object="accountInfoData.memberId"
                  @blur="checkAccount"
                )
                span(
                  v-if="isCreatedMsg"
                  class="ml-[12px] text-[#eb5b2c]"
                ) {{ isCreatedMsg }}
              span(class="text-[#eb5b2c] mb-[20px]") *可輸入手機號碼...等相關資訊來辨識該會員資料
        .flex.items-center
          .flex(class="w-[131px] text-[14px] text-[#363636] mb-[24px]")
            p 付款人名稱
          .flex(class="pl-[24px] border-l-[1px] border-[#e9e9e9]")
            PayInput(
              class="mb-[20px]"
              v-model:value="accountInfoData.payName.value"
              :input-object="accountInfoData.payName"
            )
        .flex.items-center
          .flex(class="w-[131px] text-[14px] text-[#363636] mb-[24px]")
            p 電子信箱
          .flex(class="pl-[24px] border-l-[1px] border-[#e9e9e9]")
            PayInput(
              class="mb-[20px]"
              v-model:value="accountInfoData.email.value"
              :input-object="accountInfoData.email"
            )
        .flex.items-center
          .flex(class="w-[131px] text-[14px] text-[#363636]")
            p 所屬銀行
          .flex(class="pl-[24px] border-l-[1px] border-[#e9e9e9]")
            PayMultiSelector.mr-12(
              v-model="bank.bankValue"
              btn-width="auto"
              :options="bank.options"
              :multiple-choice="true"
              @switch-value="setBank"
            )
      template(v-if="user.merchantInfo.presetCheck === 'd'")
        .border-b(class="border-[#dbdbdb] mx-[20px]")
        .flex.justify-center(class="py-[20px]")
          PayButton(
            class="w-[100px]"
            name="建立"
            class-name="btn-primary"
            :disabled="common.btnDisabled"
            @click="createFn"
          )
  PayCard(v-if="user.merchantInfo.presetCheck === 'e'")
    template(#title)
      p(class="text-[16px] font-medium") 付款帳號資訊
    template(#body)
      section(class="py-[20px] px-[68px]")
        .flex.items-center(class="mb-[20px]")
          p(class="text-[14px] text-[#363636] mr-[4px]") 請輸入預計付款的轉出帳號資料（最多 12 組）
          p(
            v-if="user.merchantInfo.presetCheckMode === 'a' && atLeastOnePredictAccount"
            class="text-[14px] text-[#eb5b2c]"
          ) *請最少設定一組付款帳號
        .flex.items-center.text-center(
          class="border-l-[1px] border-[#e9e9e9] pb-[20px]"
          v-for="(item, index) in predictAccountInfoList"
          :key="item"
        )
          .flex(class="ml-[24px] mr-[20px] text-[14px] text-[#363636]")
            p 所屬銀行
          .flex.flex-col
            PaySelect(
              v-model="item.bank.value"
              :options="allBank.options"
              :settings="{ ...allBankSettings, error: item.bank.error }"
              :customStyle="{ width:'302px' }"
            )
          .flex(class="ml-[24px] mr-[20px] text-[14px] text-[#363636]")
            p 帳號
          .flex.flex-col
            PayInput(
              v-model:value="item.account.value"
              :input-object="item.account"
            )
        .flex.add-account-btn(class="border-l-[1px] border-[#e9e9e9]")
          PayButton(
            v-if="showAddAccountBtn"
            name="新增帳號"
            class="btn-behavior h-[40px] ml-[20px]"
            @click="addMoreAccountInfo(6)"
          )
            template(#prefix)
              .inline-block.bg-white(class="mr-[8px] rounded-[5px] w-[28px] h-[28px]")
                PayIcon(
                  icon-name="ic-plus"
                  class="w-[28px] h-[28px]"
                )
      .border-b(class="border-[#dbdbdb] mx-[20px]")
      .flex.justify-center(class="py-[20px]")
        PayButton(
          class="w-[100px]"
          name="建立"
          class-name="btn-primary"
          :disabled="common.btnDisabled"
          @click="createFn"
        )

PayModal(
  :modal="modalMerchantStatus"
  @close="handleModalShow(modalMerchantStatus, false)"
)
  template(#modalMerchantStatusHeader)
    .flex.items-center.justify-center
      PayIcon(
        icon-name="ic-notice"
        class="w-[24px] h-[24px] mr-[4px]"
      )
      p.text-center.font-medium(class="text-[363636] text-[16px]") 商店服務暫停
  template(#body)
    .flex.flex-col(class="py-[20px] text-[14px]")
      .text-center
        p.break-words(class="mb-[20px] max-w-[228px] mx-auto") 如有任何疑問，請聯繫客服人員
        PayButton(
          name="確認"
          class-name="btn-primary"
          class="w-[100px] h-[40px]"
          :disabled="false"
          @click="handleModalShow(modalMerchantStatus, false)"
        )
</template>

<script setup>
import { create, check, getBankList } from '@/api';
import { storeToRefs } from 'pinia';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { useModalStore } from '@/stores/modal';
import useCommon from '@/composables/common';
import _ from 'lodash';

const $schema = inject('schema');

const common = useCommonStore();
const user = useUserStore();
const modalStore = useModalStore();

const { modal } = storeToRefs(modalStore);
const { popupModal, storeModalContent } = modalStore;

const { toast, errorIcon } = useCommon();

const allBankSettings = {
  placeholder: '請選擇銀行',
  searchable: true,
  clearable: true,
  disabled: false
};

const isCreatedMsg = ref('');
const atLeastOnePredictAccount = ref(false);

const titles = reactive(
  [
    {
      name: '產生收款帳號',
      url: 'AccountCreate'
    }
  ]
);
const accountInfoData = reactive({
  memberId: {
    type: 'text',
    inputStyle: 'normalInput',
    maxLength: 30,
    width: '302px',
    disabled: false,
    required: true,
    placeholder: '請輸入會員編號',
    value: '',
    error: false,
    replaceRule: /[^a-zA-Z0-9\-_/－＿]/g,
    message: '',
    rules: 'memberId'
  },
  payName: {
    type: 'text',
    inputStyle: 'normalInput',
    maxLength: 30,
    width: '302px',
    disabled: false,
    required: false,
    placeholder: '請輸入付款人名稱',
    value: '',
    error: false,
    message: '',
    rules: 'name'
  },
  email: {
    type: 'text',
    inputStyle: 'normalInput',
    maxLength: 50,
    width: '302px',
    disabled: false,
    required: false,
    placeholder: '請輸入電子信箱',
    value: '',
    error: false,
    replaceRule: /[\u4E00-\u9FFF]+/g,
    message: '',
    rules: 'email'
  }
});
const bank = reactive({
  options: [],
  bankValue: ''
});
const allBank = reactive({
  options: []
});
const modalMerchantStatus = reactive({
  show: false,
  canClickOutsideClose: false,
  width: '400px',
  header: 'modalMerchantStatusHeader'
});
const predictAccountInfoList = reactive([]);

const showAddAccountBtn = computed(() => predictAccountInfoList.length === 6);

const setBank = async ($event) => {
  bank.bankValue = $event;
  await checkAccount();
};

const checkAccount = async () => {
  try {
    const form = {
      memberId: accountInfoData.memberId.value,
      bank: bank.value
    };
    const { rc, rm, isCreated } = await check(form);
    if (+rc !== 0) {
      toast.error(rm, { icon: errorIcon });
      return;
    }
    isCreatedMsg.value = isCreated ? rm : '';
    accountInfoData.memberId.error = isCreated;
  } catch (error) {
    toast.error('系統錯誤', { icon: errorIcon });
  }
};

const getBankListFn = async () => {
  const { rc, rm, data } = await getBankList();

  if (+rc !== 0) {
    toast.error(rm, { icon: errorIcon });

    return;
  }

  bank.options = data.banks;
  bank.bankValue = bank.options[0].value;
};

const getAllBanksFn = (async () => {
  await common.getAllBanks();

  allBank.options = common.allBankList;

  addMoreAccountInfo(0);
});

const addMoreAccountInfo = ((currentLength) => {
  for (let i = currentLength; i < currentLength + 6; i++) {
    predictAccountInfoList.push({
      bank: {
        error: false,
        options: allBank.options,
        value: ''
      },
      account: {
        type: 'text',
        inputStyle: 'normalInput',
        maxLength: 16,
        width: '302px',
        disabled: false,
        placeholder: '請輸入帳號',
        value: '',
        error: false,
        replaceRule: /[^0-9]/g
      }
    });
  }
});

const clearError = () => {
  predictAccountInfoList.forEach((item, index) => {
    Object.keys(item).forEach((key) => {
      predictAccountInfoList[index][key].error = false;
    });
  });
  Object.keys(accountInfoData).forEach((key) => {
    accountInfoData[key].error = false;
  });
};

const validateAccountInfoData = async () => {
  const form = {};
  let error = false;

  for (const key in accountInfoData) {
    form[key] = {
      rules: accountInfoData[key].rules,
      value: accountInfoData[key].value
    };
    const { rules, value } = form[key];

    try {
      await $schema.accountSchema.validateAt(
        rules,
        { [rules]: value },
        { abortEarly: false }
      );
    } catch (err) {
      err.inner.forEach(() => {
        accountInfoData[key].error = true;
      });
      error = true;
    }
  }

  return error;
};

const validatePredictAccountInfoList = (async () => {
  let error = false;
  const predictAccountInfoListArray = {
    accInfoList: predictAccountInfoList.map((item) => ({
      bank: item.bank.value,
      account: item.account.value
    }))
  };

  try {
    await $schema.accountSchema.validate(
      predictAccountInfoListArray,
      { abortEarly: false }
    );
  } catch (err) {
    err.inner.forEach(({ path }) => {
      const index = parseInt(path.split('[')[1]);
      const field = path.split('.')[1];
      if (field) {
        predictAccountInfoList[index][field].error = true;
        error = true;
      }
    });
  }

  return error;
});

const createFn = (async () => {
  clearError();

  const accountInfoError = await validateAccountInfoData();
  const predictAccountInfoListError = await validatePredictAccountInfoList();

  if (user.merchantInfo.presetCheck === 'e' && user.merchantInfo.presetCheckMode === 'a') {
    atLeastOnePredictAccount.value = predictAccountInfoList.every((obj) => obj.bank.value === '' || obj.account.value === '');
  }

  if (accountInfoError || predictAccountInfoListError || atLeastOnePredictAccount.value) return;

  common.setLoading(true);

  const predictAccounts = predictAccountInfoList
    .filter((item) => item.bank.value && item.account.value)
    .map((item) => `${item.bank.value}${item.account.value}`);

  const form = {
    memberId: accountInfoData.memberId.value,
    payName: accountInfoData.payName.value,
    email: accountInfoData.email.value,
    bank: bank.bankValue,
    merchantNumber: user.merchantInfo.merchantNumber,
    predictAccounts
  };

  if (user.merchantInfo.presetCheck !== 'e') {
    delete form.predictAccounts;
  }

  await createApiCallFn(form);
});

const createApiCallFn = _.debounce(async (form) => {
  const { rc, rm, data } = await create(form);

  // 商店暫停
  if (+rc === 103) {
    handleModalShow(modalMerchantStatus, true);
    return;
  }
  if (+rc !== 0) return;

  if (data.isCreated) {
    isCreatedMsg.value = rm;
    accountInfoData.memberId.error = true;
    return;
  }

  clearAllFn();

  storeModalContent(data);
  popupModal({
    show: true,
    hasCloseBtn: true,
    canClickOutsideClose: false,
    modalClass: 'detail',
    header: 'detailHeader',
    body: 'detailBodyAccountCreate',
    footer: ''
  });

  common.setLoading(false);
}, 500);

const clearAllFn = () => {
  accountInfoData.memberId.value = '';
  accountInfoData.payName.value = '';
  accountInfoData.email.value = '';
  bank.bankValue = bank.options[0].value;

  Object.values(predictAccountInfoList).forEach((item) => {
    item.bank.value = '';
    item.account.value = '';
  });
};

const handleModalShow = (modalMerchantStatus, show) => {
  modalMerchantStatus.show = show;
};

onMounted(async () => {
  common.setLoading(true);

  await user.hasUserDataPromise;
  await getAllBanksFn();
  await getBankListFn();

  common.setLoading(false);
});
</script>

<style lang="scss" scoped>
.add-account-btn {
  :deep() {
    .pay-btn {
      padding: 6px 8px;
    }
  }
}
</style>
