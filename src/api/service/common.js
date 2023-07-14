import { common } from '@/api/request/urlConfig';
import useCommon from '@/composables/common';
import request from '@/api/request/request';

const { timestampToDateString } = useCommon();

function getRequestUrl(urlType, payload = {}) {
  return request.post(common[urlType], payload).then((response) => response.data);
}

export async function getBankList(payload) {
  const responseData = await getRequestUrl('getBankList', payload);
  responseData.data.banks = responseData.data.banks.filter((item) => item.status === '1');

  return responseData;
}

export async function getAllBanks(payload) {
  const responseData = await getRequestUrl('getAllBanks', payload);
  responseData.data.banks = responseData.data.banks.map((item) => ({
    code: item.value,
    label: item.name
  }));
  return responseData;
}

export async function getMerchantInfo(payload) {
  const responseData = await getRequestUrl('getMerchantInfo', payload);

  responseData.data = {
    ...responseData.data,
    timeCreated: timestampToDateString(responseData.data.timeCreated).split(' ')[0]
  };

  return responseData;
}
