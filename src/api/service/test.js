import * as url from '@/api/request/urlConfig.js';
import request from '@/api/request/request.js';

function getRequestUrl (urlType, form = {}, config = {}) {
  if (!Object.keys(config).length) {
    return request
      .post(url.test[urlType], form)
      .then((response) => response.data);
  }
  return request
    .post(url.test[urlType], form, config)
    .then((response) => response);
}

export async function download (form) {
  const data = (await getRequestUrl('download', form, {
    responseType: 'blob'
  }
  ));
  const url = URL.createObjectURL(data.data);
  const link = document.createElement('a');
  const fileName = `${data.headers['content-disposition'].split('filename=')[1]}`;
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
