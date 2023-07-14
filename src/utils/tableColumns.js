export const recentOrderListColumn = [
  {
    name: '會員編號',
    slotBodyName: 'memberId',
    style: { width: '16%' }
  },
  {
    name: '收款帳號',
    slotBodyName: 'accountNumber',
    style: { width: '10%' }
  },
  {
    name: '所屬銀行',
    key: 'bank',
    style: { width: '10%' }
  },
  {
    name: '付款序號',
    key: 'paymentNumber',
    style: { width: '10%' }
  },
  {
    name: '交易時間',
    key: 'orderTime',
    style: { width: '14%' }
  },
  {
    name: '交易金額',
    key: 'orderAmount',
    money: true,
    style: { width: '10%' }
  },
  {
    name: '交易狀態',
    slotBodyName: 'contractStatusText',
    style: { width: '8%' }
  },
  {
    name: '',
    slotBodyName: 'action',
    style: { width: '10%' }
  }
];

export const appropriationListColumn = [
  {
    name: '撥款日期',
    key: 'expAllotOutDate',
    style: { width: '16%' }
  },
  {
    name: '撥款類別',
    slotBodyName: 'kernelType'
    // style: { width: '10%' }
  },
  {
    name: '撥款金額',
    slotBodyName: 'expAmount',
    style: { width: '20%' }
  },
  {
    name: '',
    slotBodyName: 'action',
    style: { width: '18%' }
  }
];

export const accountListColumn = [
  {
    name: '會員編號',
    key: 'memberId',
    style: { width: '14.28%' }
  },
  {
    name: '付款人名稱',
    key: 'payName',
    style: { width: '14.28%' }
  },
  {
    name: '電子信箱',
    key: 'email',
    style: { width: '14.28%' }
  },
  {
    name: '建立時間',
    key: 'createTime',
    style: { width: '14.28%' }
  },
  {
    name: '所屬銀行',
    key: 'bank',
    style: { width: '14.28%' }
  },
  {
    name: '收款帳號',
    key: 'accountNumber',
    slotBodyName: 'accountNumber',
    style: { width: '14.28%' }
  },
  {
    name: '',
    slotBodyName: 'action',
    style: { width: '14.28%' }
  }
];
