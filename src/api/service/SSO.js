import * as url from '@/api/request/urlConfig.js';
import request from '@/api/request/request.js';
import { useUserStore } from '@/stores/user';

const { protocol, host } = window.location; // 協議、主機

const reg = /^localhost+/;
function ssoDomain () {
  const user = useUserStore();
  return user.isAtUAT
    ? user.SSOTestDomain
    : reg.test(host)
      ? 'localhost:8012'
      : `${host}`;
}

function getRequestUrl (urlType, form = {}) {
  return request
    .post(`${protocol}//${ssoDomain()}${url.SSO[urlType]}`, form)
    .then((response) => response.data);
}

// 取得目前環境的 SSO domain
export async function getSSODomain (form) {
  const { domain, rc, rm } = (await getRequestUrl('getSSODomain', form));
  return { domain, rc, rm };
}

export async function verify () {
  const sendData = {};
  if (window.location.href.split('?')[1]) {
    const urlParamsList = {};
    const urlParams = window.location.href.split('?')[1];
    urlParams.split('&').forEach((param) => {
      const key = param.split('=')[0];
      const val = param.split('=')[1];
      urlParamsList[key] = val;
      sendData.ticket = urlParamsList.ticket;
    });
    sessionStorage.setItem('simulation', urlParamsList.simulation);
    request.defaults.headers.common.simulation = urlParamsList.simulation;
  }
  sendData.token = localStorage.getItem('token');
  const { token, rc, rm } = (await getRequestUrl('verify', sendData));
  if (+rc === 0) {
    window.location.href = window.location.href.split('?')[0];
  }
  if (token) {
    localStorage.setItem('token', token);
    request.defaults.headers.common.Authorization = token;
  }
  return { token, rc, rm };
}

export async function getUserInfo (form) {
  const data = (await getRequestUrl('getUserInfo', form));
  // console.log(data)
  const result = {
    menu: data.menu,
    function: data.function,
    rc: data.rc,
    rm: data.rm,
    header: data.header,
    userdata: data.userdata
  };
  return result;
}

export async function changeRole (form) {
  const { rc, rm } = (await getRequestUrl('changeRole', form));
  console.log(rc, rm);
  return { rc, rm };
}

export async function getSystemName (form) {
  const { data, rc, rm } = (await getRequestUrl('getSystemName', form));
  return { data, rc, rm };
}
