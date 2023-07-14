import { indexApi } from '@/api/request/urlConfig';
import { bankColor, paymentStatusColor } from '@/map/color';
import useCommon from '@/composables/common';
import request from '@/api/request/request';

const { timestampToDateString } = useCommon();

function getRequestUrl (urlType, payload = {}) {
  return request.post(indexApi[urlType], payload).then((response) => response.data);
}

export async function getProgressInfo (payload) {
  const { rc, rm, data } = await getRequestUrl('getProgressInfo', payload);

  const result = {
    amount: {
      sum: data.totalAmount,
      bankList: []
    },
    count: {
      sum: data.totalCount,
      bankList: []
    }
  };

  Object.keys(data).forEach((item) => {
    const listObj = {
      amountList: 'amount',
      countList: 'count'
    };

    if (typeof data[item] !== 'object') return;

    data[item].forEach((payment) => {
      result[listObj[item]].bankList.push({
        ...payment,
        color: bankColor[payment.code]
      });
    });

  });

  return { rc, rm, result };
}

export async function getLineInfo () {
  const { rc, rm, data } = await getRequestUrl('getLineInfo');

  data.amount = data?.amountLineToday.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  ) ?? 0;
  data.number = data?.numberLineToday.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  ) ?? 0;

  return { rc, rm, data };
}

export async function getRecent () {
  const { rc, rm, data } = await getRequestUrl('getRecent');

  data.forEach((item) => {
    item.contractStatusText = paymentStatusColor[item.paymentState];
    item.period = (item.totalPeriod === -1 ? '-' : `${String(item.withholdPeriod).padStart(2, 0)} / ${String(item.totalPeriod).padStart(2, 0)}`);
    item.orderTime = timestampToDateString(item.orderTime);
  });

  return { rc, rm, data };
}
