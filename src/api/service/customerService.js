import { customerService } from '@/api/request/urlConfig';
import { paymentStatusColor } from '@/map/color';
import useCommon from '@/composables/common';
import request from '@/api/request/request';

const { timestampToDateString } = useCommon();

function getRequestUrl(urlType, form = {}) {
  return request.post(customerService[urlType], form).then((response) => response.data);
}

export async function queryTransaction(payload) {
  const responseData = await getRequestUrl('queryTransaction', payload);

  responseData.data = {
    ...responseData.data,
    contractStatusText: paymentStatusColor[responseData.data.paymentState],
    orderTime: timestampToDateString(responseData.data.orderTime)
  };

  return responseData;
}
