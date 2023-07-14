import { account } from '@/api/request/urlConfig';
import request from '@/api/request/request';
import useCommon from '@/composables/common';

const { timestampToDateString } = useCommon();

function getRequestUrl(urlType, payload = {}) {
  return request.post(account[urlType], payload).then((response) => response.data);
}

export async function check(payload) {
  const responseData = await getRequestUrl('check', payload);

  return { ...responseData, isCreated: responseData.data.isCreated };
}

export async function create(payload) {
  const responseData = await getRequestUrl('create', payload);

  responseData.data = {
    ...responseData.data,
    createTime: timestampToDateString(responseData.data.createTime)
  };

  return responseData;
}

export async function getAccountList(payload) {
  const responseData = await getRequestUrl('getAccountList', payload);

  responseData.data.list = responseData.data.list.map((item) => {
    const newItem = {
      ...item,
      createTime: timestampToDateString(item.createTime)
    };

    return newItem;
  });

  return responseData;
}

export async function getSingleAccount(payload) {
  const responseData = await getRequestUrl('getSingleAccount', payload);

  responseData.data = {
    ...responseData.data,
    createTime: timestampToDateString(responseData.data.createTime)
  };

  return responseData;
}

export async function edit(payload) {
  const responseData = await getRequestUrl('edit', payload);

  return responseData;
}
