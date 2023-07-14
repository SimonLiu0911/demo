import * as url from '@/api/request/urlConfig';
import request from '@/api/request/request';

function getRequestUrl (urlType, payload = {}) {
  return request.post(url.domain[urlType], payload).then((response) => response.data);
}

export async function ifSSODomain (payload) {
  const responseData = await getRequestUrl('ifSSODomain', payload);
  const { rc, data } = responseData;
  const { testEnv, url } = data;

  return { testEnv, rc, url };
}
