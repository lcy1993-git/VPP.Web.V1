import { formatXAxis } from '@/utils/common';
import * as echarts from 'echarts';

// 水波图配置
export const waterWaveOption = (data: any) => {
  return {
    title: {
      show: true,
      x: '50%',
      y: '70%',
      z: 10,
      textAlign: 'center', // 文字位置
      text: '剩余额度占比',
      textStyle: {
        // 文字样式设置
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 400,
      },
    },
    series: [
      {
        name: '水波图',
        type: 'liquidFill',
        radius: '60%',
        center: ['50%', '45%'],
        data: [
          {
            value: [(data?.unused / data?.total).toFixed(2)],
            label: {
              formatter: `${((data?.unused * 100) / data?.total).toFixed(2)}%`,
              show: true,
            },
          },
        ],
        label: {
          // 数值样式设置
          color: '#ffffff',
          fontSize: 26,
          fontFamily: 'DIN-Medium',
          fontWeight: 'bold',
        },
        color: [
          {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              // 水波颜色渐变
              {
                offset: 0,
                color: ['rgba(0, 161, 193,1)'], // 0% 处的颜色
              },
              {
                offset: 1,
                color: ['rgba(37, 250, 164,1)'], // 100% 处的颜色
              },
            ], // 水波纹颜色
          },
        ],
        backgroundStyle: {
          color: 'rgba(39,115,229,0.12)',
        },
        outline: {
          borderDistance: 0,
          itemStyle: {
            borderWidth: 2, // 边 宽度
            borderColor: 'rgba(49,102,255,0.5)',
          },
        },
      },
    ],
  };
};

// 能源碳排放趋势 chart 配置
export const carbonTrendsOption = (data: any, type: string) => {
  if (!data) {
    return false;
  }

  const emun: any = {
    hbTimeValueMap: '环比',
    tbTimeValueMap: '同比',
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
      name: emun[item],
      type: 'line',
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
        data: formatXAxis(Object.keys(data.carbonTimeValueMap), type),
        axisPointer: {
          type: 'shadow',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '碳排放量/吨',
        min: 0,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#1f2d45',
            width: 1,
          },
        },
        axisTick: {
          show: false, //是否显示刻度线
          alignWithLabel: true, //刻度线与刻度标签是否对齐
          lineStyle: {
            color: '#95a4ad', //刻度线颜色
            width: 2, //刻度线粗细
          },
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#95a4ad',
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
        axisTick: {
          show: true, //是否显示刻度线
          alignWithLabel: true, //刻度线与刻度标签是否对齐
          lineStyle: {
            color: '#95a4ad', //刻度线颜色
            width: 2, //刻度线粗细
          },
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#95a4ad',
          },
        },
        min: 0,
      },
    ],
    series: series,
  };
};
