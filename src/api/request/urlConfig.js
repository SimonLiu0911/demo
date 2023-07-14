// const serverRoot = '/test';
const serverRoot = '/FixedVAP';
const SSORoot = '/SSO';

export const SSO = {
  verify: `${SSORoot}/VerifyServlet`,
  changeRole: `${SSORoot}/ChangeRoleServlet`,
  getUserInfo: `${SSORoot}/UserinfoServlet`,
  getSystemName: `${SSORoot}/querySystemName`,
  getSSODomain: `${SSORoot}/GetDomainServlet`
};

export const test = {
  download: `${serverRoot}/download`
};

export const domain = {
  ifSSODomain: `${serverRoot}/common/ifSSODomain`
};

export const indexApi = {
  getProgressInfo: `${serverRoot}/index/getProgressInfo`,
  getLineInfo: `${serverRoot}/index/getLineInfo`,
  getRecent: `${serverRoot}/index/getRecent`
};

export const transaction = {
  getSingleTransaction: `${serverRoot}/transaction/getSingleTransaction`,
  getTransactionList: `${serverRoot}/transaction/getTransactionList`
};

export const account = {
  create: `${serverRoot}/account/create`,
  getAccountList: `${serverRoot}/account/getAccountList`,
  getSingleAccount: `${serverRoot}/account/getSingleAccount`,
  edit: `${serverRoot}/account/edit`,
  check: `${serverRoot}/account/check`
};

export const customerService = {
  queryTransaction: `${serverRoot}/customerService/queryTransaction`
};

export const allotOut = {
  getAllotOutList: `${serverRoot}/allotOut/getAllotOutList`,
  downloadDetail: `${serverRoot}/allotOut/downloadDetail`,
  downloadTotal: `${serverRoot}/allotOut/downloadTotal`
};

export const common = {
  getBankList: `${serverRoot}/common/getBankList`,
  getAllBanks: `${serverRoot}/common/getAllBanks`,
  getMerchantInfo: `${serverRoot}/common/getMerchantInfo`
};
