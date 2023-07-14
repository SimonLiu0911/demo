export const statisticsListColor = {
  creditCard: '#808fd0',
  mmk: '#6391c8',
  vap: '#765bc9',
  each: '#b7c285'
};

export const bankColor = {
  '007': '#4258bb',
  '009': '#6391c8',
  '013': '#765bc9'
};

export const paymentStatusColor = {
  1: {
    text: '已付款',
    otherStyle: {
      backgroundColor: 'rgba(22, 158, 66, 0.1)',
      color: '#062d13',
      display: 'flex',
      justifyContent: 'center'
    }
  },
  9: {
    text: '交易異常',
    otherStyle: {
      backgroundColor: 'rgba(235, 91, 44, 0.1)',
      color: '#eb5b2c',
      display: 'flex',
      justifyContent: 'center'
    }
  }
};

export const kernelTypeColor = {
  // 0: {
  //   text: '信用卡',
  //   otherStyle: {}
  // },
  1: {
    text: '非信用卡',
    otherStyle: {
      backgroundColor: '#778ba3',
      color: '#ffffff',
      display: 'flex',
      justifyContent: 'center',
      paddingLeft: '23.5px',
      paddingRight: '23.5px'
    }
  }
};
