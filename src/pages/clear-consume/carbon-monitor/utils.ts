import { formatXAxis } from '@/utils/common';
import * as echarts from 'echarts';

export const monitorOptions = (data: any, unit: string) => {
  if (!data) {
    return false;
  }

  const nameEnum: any = {
    hbTimeValueMap: '环比',
    tbTimeValueMap: '同比',
  };

  const colorEnum: any = {
    hbTimeValueMap: '#39ffc5',
    tbTimeValueMap: '#00a8ff',
  };
  const series = Object.keys(data).map((item) => {
    if (item === 'carbonTimeValueMap') {
      // 碳排放柱状图
      return {
        name: '实际排碳量',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value: string) {
            return value + ' 吨';
          },
        },
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: '#eee41e',
            },
            {
              offset: 0,
              color: '#fc7007',
            },
          ]),
        },
        data: Object.values(data[item]),
      };
    }
    return {
      name: nameEnum[item],
      type: 'line',
      color: colorEnum[item],
      tooltip: {
        valueFormatter: function (value: string) {
          return value + ' %';
        },
      },
      data: Object.values(data[item]),
    };
  });

  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: '16%',
      left: '3%',
      right: '4%',
      bottom: '4%',
      containLabel: true,
    },
    legend: {
      data: ['实际排碳量', '环比', '同比'],
      textStyle: {
        color: '#d7eaef',
      },
    },
    xAxis: [
      {
        type: 'category',
        data: formatXAxis(Object.keys(data.carbonTimeValueMap), unit),
        axisPointer: {
          type: 'shadow',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '碳排放量/吨',
        splitLine: {
          show: true,
          lineStyle: {
            color: '#1f2d45',
            width: 1,
          },
        },
      },
      {
        type: 'value',
        name: '同环比/%',
        splitLine: {
          show: true,
          lineStyle: {
            color: '#193772',
            width: 1,
          },
        },
      },
    ],
    series: series,
  };
};
