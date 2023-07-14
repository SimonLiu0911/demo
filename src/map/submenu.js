const icons = {
  FIX01: 'ic-icon-11', // 產生收款帳號
  FIX02: 'ic-search', // 收款帳號查詢
  FIX03: 'ic-notepen', // 交易查詢
  FIX04: 'ic-payment-managment', // 撥款管理
};

const map = {
  FIX01: 'AccountCreate',
  FIX010001: 'AccountCreate,AccountInfo',
  FIX02: 'AccountSearch',
  FIX020001: 'AccountSearch,AccountDetail', //這個 key 目前 SSO 沒有回
  FIX03: 'TransactionSearch',
  FIX030001: 'TransactionSearch,TransactionDetail', //這個 key 目前 SSO 沒有回
  FIX04: 'AppropriationManage'
};

export { map, icons };
