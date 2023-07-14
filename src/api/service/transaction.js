import { transaction } from '@/api/request/urlConfig';
import { paymentStatusColor } from '@/map/color';
import useCommon from '@/composables/common';
import request from '@/api/request/request';

const { timestampToDateString } = useCommon();

const defaultContractStatusText = {
  text: '',
  otherStyle: {}
};

function getRequestUrl (urlType, payload = {}) {
  return request.post(transaction[urlType], payload).then((response) => response.data);
}


export async function getSingleTransaction (payload) {
  const { rc, rm, data: responseData } = await getRequestUrl('getSingleTransaction', payload);

  const data = {
    ...responseData,
    orderTime: timestampToDateString(responseData.orderTime),
    contractStatusText: paymentStatusColor[responseData.paymentState] ?? defaultContractStatusText
  };

  return { rc, rm, data };
}

export async function getTransactionList (payload) {
  const { rc, rm, data } = await getRequestUrl('getTransactionList', payload);
  data.list = data.list.map((item) => {
    const newItem =  {
      ...item,
      orderTime: timestampToDateString(item.orderTime),
      contractStatusText: paymentStatusColor[item.paymentState] ?? defaultContractStatusText
    };

    return newItem;
  });

  return { rc, rm, data };
}
