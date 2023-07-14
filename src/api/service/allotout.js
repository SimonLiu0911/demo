import { allotOut } from '@/api/request/urlConfig';
import { kernelTypeColor } from '@/map/color';
import useCommon from '@/composables/common';
import request from '@/api/request/request';

const { timestampToDateString } = useCommon();

function getRequestUrl (urlType, payload = {}) {
  return request.post(allotOut[urlType], payload).then((response) => response.data);
}

async function handleDownload(reqUrl, payload) {
  const data = (await request.post(reqUrl, {reportSno: '23898'},
    {
      responseType: 'blob'
    }));
  const url = URL.createObjectURL(data.data);
  const link = document.createElement('a');
  const contentDisposition = data.headers['content-disposition'];
  const fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'unknown-file-name';
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function getAllotOutList (payload) {
  const { rc, rm, data } = await getRequestUrl('getAllotOutList', payload);

  data.list = data.list.map((item) => ({
    ...item,
    expAllotOutDate: timestampToDateString(item.expAllotOutDate).split(' ')[0],
    contractStatusText: kernelTypeColor[item.kernelType]
  }));

  return { rc, rm, data };
}

export async function downloadDetail (payload) {
  const reqUrl = allotOut.downloadDetail;

  handleDownload(reqUrl, payload);
}

export async function downloadTotal (payload) {
  const reqUrl = allotOut.downloadTotal;

  handleDownload(reqUrl, payload);
}
