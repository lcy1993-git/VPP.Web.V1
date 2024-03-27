import { formatXAxis } from '@/utils/common';
import * as echarts from 'echarts';

// 计算排名编号
const contains = (arr: any[], dst: string): number => {
  let i = arr.length;
  while ((i -= 1)) {
    if (arr[i] === dst) {
      return i;
    }
  }
  return 0;
};

// 赋值每行数据
const dataFormat = (data: any) => {
  const arr: any = [];
  data.forEach(function (item: any) {
    arr.push({
      value: item,
    });
  });
  return arr;
};

// 能源结构排行 chart options
export const energyRankOptions = (dataList: any[] = []) => {
  // 站点名称
  const stationData: any = [];
  // 站点总数据
  const values: any = [];
  // 清洁能源用电量
  const cleanEnergyElectricity: any = [];
  // 传统能源用电量
  const conventionalEnergyElectricity: any = [];
  // 用于添加排名图标
  const yAxisRich: any = {};

  if (!dataList || dataList.length === 0) {
    return false;
  }

  dataList.forEach((item: any, index: number) => {
    stationData.push(item.companyName);
    values.push(item.energyElectricity);
    cleanEnergyElectricity.push(item.cleanEnergyElectricity);
    conventionalEnergyElectricity.push(item.conventionalEnergyElectricity);
    yAxisRich[`nt${index + 1}`] = {
      color: '#fff',
      backgroundColor: index < 3 ? '#00bc9b' : 'transparent',
      width: 20,
      height: 18,
      fontSize: 12,
      align: 'center',
      borderRadius: 50,
      padding: [2, 0, 0, 0],
    };
  });

  return {
    tooltip: {
      appendToBody: true,
      trigger: 'item',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function ({ name, value, seriesName }: any) {
        if (seriesName === '清洁能源用电量') {
          return `${name}-清洁能源用电量  ${value}kW`;
        } else if (seriesName === '传统能源用电量') {
          return `${name}-传统能源用电量  ${value}kW`;
        }
      },
    },
    grid: {
      left: '0%',
      right: '2%',
      bottom: '3%',
      top: '2%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    },
    yAxis: [
      {
        type: 'category',
        inverse: true,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        data: stationData,
        axisLabel: {
          // 排序序号
          margin: 30,
          fontSize: 14,
          align: 'right',
          padding: [0, 0, 0, 0],
          color: '#fff',
          width: 100,
          lineHeight: 40,
          overflow: 'truncate',
          verticalAlign: 'middle',
          rich: yAxisRich,
          formatter: function (value: string) {
            const index = contains(stationData, value);
            if (Object.prototype.toString.call(index) === '[object Number]') {
              const _index = index + 1;
              return ['{nt' + _index + '|' + _index + '}', `{b|${value}}`].join(' ');
            } else {
              return '';
            }
          },
        },
      },
      {
        type: 'category',
        inverse: true,
        axisTick: 'none',
        axisLine: 'none',
        show: true,
        axisLabel: {
          textStyle: {
            color: '#FFFFFF',
            fontSize: '16',
          },
          formatter: '{value}kW', // 在数值后面加上"h"
        },
        data: dataFormat(values),
      },
    ],
    dataZoom: [
      {
        type: 'slider',
        realtime: true, // 拖动时，是否实时更新系列的视图
        startValue: 0,
        endValue: 5,
        width: 5,
        height: '90%',
        top: '5%',
        right: 0,
        brushSelect: false,
        yAxisIndex: [0, 1], // 控制y轴滚动
        fillerColor: '#00338B', // 滚动条颜色
        borderColor: 'transparent',
        backgroundColor: '#04225b', //两边未选中的滑动条区域的颜色
        handleSize: 0, // 两边手柄尺寸
        showDataShadow: false, //是否显示数据阴影 默认auto
        showDetail: false, // 拖拽时是否展示滚动条两侧的文字
        zoomLock: true,
        moveHandleStyle: {
          opacity: 0,
        },
      },
      {
        type: 'inside',
        startValue: 0,
        endValue: 10,
        minValueSpan: 10,
        yAxisIndex: [0],
        zoomOnMouseWheel: false, // 关闭滚轮缩放
        moveOnMouseWheel: true, // 开启滚轮平移
        moveOnMouseMove: true, // 鼠标移动能触发数据窗口平移
      },
    ],
    series: [
      {
        zlevel: 1,
        name: '清洁能源用电量',
        type: 'bar',
        stack: 'total', // 设置堆叠的标识
        barWidth: 18,
        data: dataFormat(cleanEnergyElectricity), // 第一类数据
        barCategoryGap: '10%',
        align: 'center',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 1, color: 'rgba(0, 161, 159, 1)' },
            { offset: 0, color: 'rgba(0, 226, 144, 1)' },
          ]),
        },
        label: {
          show: true,
          fontSize: 10,
          color: '#fff',
          position: 'insideLeft',
          formatter: '{c}', // 显示数值
        },
      },
      {
        zlevel: 1,
        name: '传统能源用电量',
        type: 'bar',
        stack: 'total', // 设置堆叠的标识（与第一类数据相同）
        barWidth: 18,
        data: dataFormat(conventionalEnergyElectricity), // 第二类数据
        barCategoryGap: '10%',
        itemStyle: {
          barBorderRadius: [0, 10, 10, 0],
          color: 'rgba(0, 226, 144, 0.3)', // 设置另一类数据的颜色
        },
        label: {
          show: true,
          fontSize: 10,
          color: '#fff',
          position: 'insideRight',
          formatter: '{c}', // 显示数值
        },
      },
    ],
  };
};

// 用电量趋势 chart options
export const powerTrendOptions = (data: any, unit: string) => {
  if (!data) return false;

  // 同比
  const yearOnYearKeys = Object.keys(data?.yearOnYearMap);
  // 环比
  const quarterOnQuarterKeys = Object.keys(data?.quarterOnQuarter);

  // x轴均无数据，false
  if (yearOnYearKeys.length === 0 && quarterOnQuarterKeys.length === 0) return false;
  return {
    tooltip: {
      trigger: 'axis',
      // 图例过多被遮挡，强制超出显示
      appendToBody: true,
    },
    grid: {
      top: '14%',
      left: '3%',
      right: '4%',
      bottom: '12%',
      containLabel: true,
    },
    color: ['#39FFC5', '#0090FF'],
    legend: {
      data: ['同比增长率', '环比增长率'],
      textStyle: {
        color: '#d7eaef',
      },
      bottom: 6,
    },
    xAxis: {
      type: 'category',
      data: formatXAxis(yearOnYearKeys || quarterOnQuarterKeys, unit),
      axisLine: {
        show: true,
        lineStyle: {
          color: '#8396ad',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '增长率',
      nameTextStyle: {
        align: 'right',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#16336a',
          width: 1,
        },
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#8396ad',
        },
      },
    },
    series: [
      {
        data: yearOnYearKeys ? Object.values(data?.yearOnYearMap) : [],
        type: 'line',
        name: '同比增长率',
      },
      {
        data: quarterOnQuarterKeys ? Object.values(data?.quarterOnQuarter) : [],
        type: 'line',
        name: '环比增长率',
      },
    ],
  };
};

// 用电指数
export const powerIndexOptions = (data: any, unit: string) => {
  if (!data) return false;
  // 	用电活跃指数
  const activityIndexKeys = Object.keys(data?.activityIndexMap);
  const electricityIndexKeys = Object.keys(data?.electricityIndexMap);
  const expectationIndexKeys = Object.keys(data?.expectationIndexMap);
  const growthIndexKeys = Object.keys(data?.growthIndexMap);
  if (
    activityIndexKeys.length === 0 &&
    electricityIndexKeys.length === 0 &&
    expectationIndexKeys.length === 0 &&
    growthIndexKeys.length === 0
  )
    return false;
  return {
    tooltip: {
      trigger: 'axis',
      // 图例过多被遮挡，强制超出显示
      appendToBody: true,
    },
    grid: {
      top: '14%',
      left: '3%',
      right: '4%',
      bottom: '12%',
      containLabel: true,
    },
    color: ['#39FFC5', '#0090FF'],
    legend: {
      data: ['用电增长指数', '用电活跃指数', '用电预期指数', '综合用电指数'],
      textStyle: {
        color: '#d7eaef',
      },
      bottom: 6,
    },
    xAxis: {
      type: 'category',
      data: formatXAxis(
        activityIndexKeys || electricityIndexKeys || expectationIndexKeys || growthIndexKeys,
        unit,
      ),
      axisLine: {
        show: true,
        lineStyle: {
          color: '#8396ad',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '增长指数',
      nameTextStyle: {
        align: 'right',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#16336a',
          width: 1,
        },
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#8396ad',
        },
      },
    },
    series: [
      {
        data: growthIndexKeys ? Object.values(data?.growthIndexMap) : [],
        type: 'line',
        name: '用电增长指数',
      },
      {
        data: activityIndexKeys ? Object.values(data?.activityIndexMap) : [],
        type: 'line',
        name: '用电活跃指数',
      },
      {
        data: expectationIndexKeys ? Object.values(data?.expectationIndexMap) : [],
        type: 'line',
        name: '用电预期指数',
      },
      {
        data: electricityIndexKeys ? Object.values(data?.electricityIndexMap) : [],
        type: 'line',
        name: '综合用电指数',
      },
    ],
  };
};
