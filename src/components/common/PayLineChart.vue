<template lang="pug">
.payLineChart(ref="refChart")
</template>

<script setup>
import { TooltipComponent, GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import * as echarts from 'echarts/core';

echarts.use([TooltipComponent, LineChart, CanvasRenderer, GridComponent]);

const props = defineProps({ option: Object });
const { option } = toRefs(props);

const refChart = ref(null);
const optionSetting = ref({});

let chartInstance = null; // chart實例不可為reactive
let tooltipDisplay = '';

const maxValue = computed(() => {
  const max = Math.max(...option.value.data.data1, ...option.value.data.data2, null);

  if (max <= 10) {
    if (max > 5) return 10;

    return 5;
  }

  const stringLength = String(max).length;
  const maxGap = Math.pow(10, stringLength - 1);
  const multiple = parseInt(max / maxGap);

  return max % maxGap > 0 ? (maxGap * (multiple + 1)) : maxGap * multiple;
});

const commaFormatTotal = (payload) => {
  const reg = /^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/;
  const fun = (all, pre, groupOf3Digital) => pre + groupOf3Digital.replace(/\d{3}/g, ',$&');

  return `${String(payload).replace(reg, fun)}`;
};

const hideTooltip = () => {
  tooltipDisplay = '';
};

const showTooltip = (params) => {
  if (params.componentSubType === 'line') {
    const { dataIndex } = params;
    const amountColor = ['#ff920d', '#ffc47b'];
    let context = '';

    context = `${params.seriesName} ${params.name} ： ${amountColor.includes(params.color) ? '$' : ''} ${commaFormatTotal(params.value)} ${amountColor.includes(params.color) ? '' : '筆'}`;
    if (+option.value.data.data1[dataIndex] === +option.value.data.data2[dataIndex]) {
      context = option.value.data.data1[dataIndex] === null
        ? `
              昨日 ${params.name} ：${amountColor.includes(params.color) ? '$' : ''} ${commaFormatTotal(params.value)} ${amountColor.includes(params.color) ? '' : '筆'}</br>
            `
        : `
              昨日 ${params.name} ：${amountColor.includes(params.color) ? '$' : ''} ${commaFormatTotal(params.value)} ${amountColor.includes(params.color) ? '' : '筆'}</br>
              今日 ${params.name} ：${amountColor.includes(params.color) ? '$' : ''} ${commaFormatTotal(params.value)} ${amountColor.includes(params.color) ? '' : '筆'}
            `;
    } else {
      context = `${params.seriesName} ${params.name} ： ${amountColor.includes(params.color) ? '$' : ''} ${commaFormatTotal(params.value)} ${amountColor.includes(params.color) ? '' : '筆'}`;
    }

    tooltipDisplay = `
        <div style="background-color: rgba(236, 236, 236, 0.3);color:#333;padding: 20px 32px">
          ${context}
        </div>
      `;
  }
};

const drawLine = () => {
  chartInstance = echarts.init(refChart.value);

  initChart();
  chartInstance.on('mousemove', showTooltip);
  chartInstance.on('mouseout', hideTooltip);
};

const initChart = () => {
  optionSetting.value.tooltip = {
    trigger: 'axis',
    triggerOn: 'mousemove',
    formatter: (params) => {
      const amountColor = ['#ff920d', '#ffc47b'];
      let tooltipDisplayAxis = '';
      let context = '';

      if (+option.value.data.data1[params[0].dataIndex] === +option.value.data.data2[params[1].dataIndex]) {
        context = typeof params[0].value === 'undefined' ? `
                昨日 ${params[1].name} ：${amountColor.includes(params[1].color) ? '$' : ''} ${commaFormatTotal(params[1].value)} ${amountColor.includes(params[1].color) ? '' : '筆'}
              `
          : `
                昨日 ${params[0].name} ：${amountColor.includes(params[0].color) ? '$' : ''} ${commaFormatTotal(params[0].value)} ${amountColor.includes(params[0].color) ? '' : '筆'}</br>
                今日 ${params[1].name} ：${amountColor.includes(params[1].color) ? '$' : ''} ${commaFormatTotal(params[1].value)} ${amountColor.includes(params[1].color) ? '' : '筆'}
              `;
      } else if (params[0].value === null) {
        context = `${params[1].seriesName} ${params[1].name} ： ${amountColor.includes(params[1].color) ? '$' : ''} ${commaFormatTotal(params[1].value)} ${amountColor.includes(params[1].color) ? '' : '筆'}`;
      } else {
        context = `${params[0].seriesName} ${params[0].name} ： ${amountColor.includes(params[0].color) ? '$' : ''} ${commaFormatTotal(params[0].value)} ${amountColor.includes(params[0].color) ? '' : '筆'}`;
      }

      tooltipDisplayAxis = `
          <div style="background-color: rgba(236, 236, 236, 0.3);color:#333;padding: 20px 32px">
            ${context}
          </div>
        `;

      return tooltipDisplay || tooltipDisplayAxis;
    },
    backgroundColor: 'rgba(236, 236, 236, 0.8)',
    borderRadius: 12,
    extraCssText: `border:2px solid ${option.value.data.seriesColor[0]}`,
    axisPointer: {
      type: 'line',
      snap: true,
      lineStyle: {
        type: 'solid',
        color: option.value.data.id === 'graph1' ? '#ff920d' : '#25bba9'
      }
    }
  };

  optionSetting.value.xAxis = {
    type: 'category',
    nameLocation: 'middle',
    axisLabel: {
      lineHeight: 16,
      fontWeight: 300,
      color: '#666'
    },
    data: option.value.data.xAxis.map((item) => `${item}\n時`),
    axisTick: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: ['#333'],
        type: 'solid'
      }
    }
  };

  optionSetting.value.yAxis = [
    {
      type: (!option.value.data.data1.length && !option.value.data.data2.length) ? 'category' : 'value',
      data: [1, 2, 3, 4, 5],
      axisLabel: {
        margin: 8,
        color: '#666666',
        verticalAlign: (!option.value.data.data1.length && !option.value.data.data2.length) ? 'bottom' : 'middle',
        padding: option.value.data.padding,
        formatter (value) {
          if (value === 0) return '';
          if (value >= 1000) return `${value / 1000}K`;
          return value;
        }
      },
      max: !option.value.data.data1.length && !option.value.data.data2.length ? null : maxValue.value,
      interval: maxValue.value / 5,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false,
        onZero: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['rgba(0, 0, 0, 0.1)'],
          type: 'dashed'
        }
      }
    }
  ];

  optionSetting.value.series = [
    {
      data: option.value.data.data1,
      name: '今日',
      type: 'line',
      symbol: 'circle',
      symbolSize: 9,
      itemStyle: {
        color: option.value.data.seriesColor[0],
        borderColor: '#fff',
        borderWidth: 1,
        opacity: 0
      },
      emphasis: {
        itemStyle: {
          opacity: 1
        }
      },
      lineStyle: {
        type: 'solid',
        color: option.value.data.seriesColor[0]
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: option.value.data.gradientColor[0] // color at 0%
            },
            {
              offset: 1,
              color: option.value.data.gradientColor[1] // color at 100%
            }
          ],
          global: false // default is false
        }
      }
    },
    {
      data: option.value.data.data2,
      type: 'line',
      name: '昨日',
      symbol: 'circle',
      symbolSize: 9,
      itemStyle: {
        color: option.value.data.seriesColor[1],
        borderColor: '#fff',
        borderWidth: 1,
        opacity: 0
      },
      emphasis: {
        itemStyle: {
          opacity: 1
        }
      },
      lineStyle: {
        type: 'dashed',
        color: option.value.data.seriesColor[1]
      }
    }
  ];
  chartInstance.setOption(optionSetting.value);
};

const resize = () => {
  chartInstance.resize();
};

onMounted(() => {
  drawLine();
  window.addEventListener('resize', resize);
});

watch(() => option.value.data, () => {
  initChart();
}, {
  deep: true
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
});
</script>

  <style lang="scss" scoped>
  $page-padding: 20px;
  .payLineChart {
    width: calc(100% - $page-padding);
    height: 100%;
  }
  </style>
