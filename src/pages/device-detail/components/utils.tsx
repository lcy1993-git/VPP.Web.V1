import { formatXAxis, handleDiffMins } from '@/utils/common';
import * as echarts from 'echarts';

// PCS--充放电量统计
export const electricityStatisticsOptions = (pcsQuantity: any) => {
  let xAxisData: string[] = [];
  let timeChargeMap: any[] = []; // 充电
  let timeDischargeMap: any[] = []; // 放电
  if (pcsQuantity) {
    const xAxis = Object.keys(pcsQuantity?.timeChargeMap);
    xAxisData.push(...xAxis);
    timeChargeMap = [...Object.values(pcsQuantity?.timeChargeMap)];
    timeDischargeMap = [...Object.values(pcsQuantity?.timeDischargeMap)];
  }

  if (!xAxisData.length) {
    return false;
  }

  return {
    grid: {
      top: '14%',
      left: '2%',
      right: '4%',
      bottom: '1%',
      containLabel: true,
    },
    legend: {
      data: ['充电', '放电'],
      x: 'center',
      textStyle: {
        color: '#fff',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#0065D7',
          width: 0.5,
        },
      },
      data: formatXAxis(xAxisData, 'month'),
      name: '日',
    },
    yAxis: {
      splitLine: {
        show: false,
        lineStyle: {
          color: '#0065D7',
          width: 0.5,
        },
      },
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      name: '电量/kWh',
      type: 'value',
    },
    series: [
      {
        // @ts-ignore
        data: timeChargeMap,
        type: 'bar',
        barWidth: 10,
        name: '充电',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: '#00A19F' },
            { offset: 1, color: '#00E290' },
          ]),
        },
      },
      {
        // @ts-ignore
        data: timeDischargeMap,
        type: 'bar',
        barWidth: 10,
        name: '放电',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: '#5D4FEC' },
            { offset: 1, color: '#648CFF' },
          ]),
        },
      },
    ],
  };
};

// PCS -- 功率曲线
export const powerOptions = (powerCurve: any, type: number, isToday: boolean) => {
  let xAxisData: string[] = [];
  let powerCurveMap: any[] = []; //设备功率曲线值
  const powerTitle = type === 0 ? '直流功率' : '交流功率';

  if (powerCurve) {
    const xAxis = Object.keys(powerCurve?.acOrDcPower)
      .map((item) => item.split(' ')[1])
      .map((item) => `${item.split(':')[0]}:${item.split(':')[1]}`);
    xAxisData.push(...xAxis);
    powerCurveMap = [...Object.values(powerCurve?.acOrDcPower)];
  }

  if (!xAxisData.length) {
    return false;
  }

  return {
    grid: {
      top: '14%',
      left: '3%',
      right: '4%',
      bottom: '1%',
      containLabel: true,
    },
    legend: {
      data: [powerTitle],
      x: 'center',
      textStyle: {
        color: '#fff',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    color: ['#39FFC5'],
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#0065D7',
          width: 0.5,
        },
      },
      data: xAxisData,
    },
    yAxis: {
      splitLine: {
        show: true,
        lineStyle: {
          color: '#0065D7',
          width: 0.5,
        },
      },
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      name: '功率/kW',
      type: 'value',
    },
    series: [
      {
        data: isToday ? powerCurveMap.slice(0, handleDiffMins() + 1) : powerCurveMap,
        type: 'line',
        symbol: 'none',
        barWidth: 16,
        name: powerTitle,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: 'rgba(57, 255, 197, 0.1)' },
            { offset: 1, color: 'rgba(57, 255, 197, 0.6)' },
          ]),
        },
      },
    ],
  };
};

// 电磁簇--设备温度统计
export const deviceTemperature = (data: any, clusterType: number, isToday: boolean) => {
  if (!data || Object.keys(data).length === 0) {
    return false;
  }

  let xAxisData: any[] = [];
  let seriesData: any[] = [];
  let legendData: string[] = [];

  if (data) {
    if (clusterType === 1) {
      //TODO 温度
      xAxisData = Object.keys(data);
      seriesData = [
        {
          data: isToday ? Object.values(data).slice(0, handleDiffMins() + 1) : Object.values(data),
          type: 'line',
          barWidth: 10,
          name: '温度',
        },
      ];
      legendData = ['温度'];
    } else if (clusterType === 2) {
      // 电压
      xAxisData = Object.keys(data);
      legendData = ['电压'];
      seriesData = [
        {
          data: isToday ? Object.values(data).slice(0, handleDiffMins() + 1) : Object.values(data),
          type: 'line',
          barWidth: 10,
          color: ['#a76ffe'],
          name: '电压',
        },
      ];
    }
  }

  return {
    grid: {
      top: '14%',
      left: '3%',
      right: '4%',
      bottom: '1%',
      containLabel: true,
    },
    legend: {
      data: legendData,
      x: 'center',
      textStyle: {
        color: '#fff',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#0065D7',
          width: 0.5,
        },
      },
      // @ts-ignore
      data: xAxisData,
    },
    yAxis: {
      splitLine: {
        show: false,
        lineStyle: {
          color: '#0065D7',
          width: 0.5,
        },
      },
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      name: clusterType === 1 ? '温度/℃' : '电压/V',
      type: 'value',
    },
    series: seriesData,
  };
};

// 逆变器 --功率曲线
export const powerCountOptions = (inverterLineData: any, isToday: boolean) => {
  let xAxisData: string[] = [];
  let photovoltaic: any[] = []; // 功率
  let irradiation: any[] = []; // 辐照
  if (inverterLineData) {
    const xAxis = Object.keys(inverterLineData?.powerMap)
      .map((item) => item.split(' ')[1])
      .map((item) => `${item.split(':')[0]}:${item.split(':')[1]}`);
    xAxisData.push(...xAxis);
    photovoltaic = [...Object.values(inverterLineData?.powerMap)];
    irradiation = [...Object.values(inverterLineData?.irradianceMap)];
  }
  if (!xAxisData.length) {
    return false;
  }
  return {
    grid: {
      top: '20%',
      left: '3%',
      right: '4%',
      bottom: '1%',
      containLabel: true,
    },
    legend: {
      data: irradiation.length === 0 ? ['功率'] : ['功率', '辐照度'],
      x: 'center',
      textStyle: {
        color: '#fff',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    color: ['#FF8F44', '#39FFC5'],
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#0065D7',
          width: 0.5,
        },
      },
      // @ts-ignore
      data: xAxisData,
    },
    yAxis: {
      splitLine: {
        show: true,
        lineStyle: {
          color: '#0065D7',
          width: 0.5,
        },
      },
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      name: '功率/kW',
      type: 'value',
    },
    series: [
      {
        data: isToday ? photovoltaic.slice(0, handleDiffMins() + 1) : photovoltaic,
        type: 'line',
        symbol: 'none',
        barWidth: 16,
        smooth: true,
        name: '功率',
      },
      {
        data: isToday ? irradiation.slice(0, handleDiffMins() + 1) : irradiation,
        type: 'line',
        symbol: 'none',
        barWidth: 16,
        smooth: true,
        name: '辐照度',
      },
    ],
  };
};

// 逆变器 --- 直流电流趋势
export const directCurrentOptions = (directCurrent: any, isToday: boolean) => {
  let xAxisData: string[] = [];
  let seriesData: any[] = [];
  let name: any[] = [];
  if (directCurrent) {
    const initData = directCurrent?.directCurrentMap;
    const seriesLength = Object.keys(initData);
    // 将每个元素的数字提取出来并进行排序
    seriesLength.sort(function (a, b) {
      const numA = a.match(/\d+/);
      const numB = b.match(/\d+/);
      if (numA === null || numB === null) {
        return numA === null ? 1 : -1; // 返回较大或较小的值
      }
      return parseInt(numA[0]) - parseInt(numB[0]);
    });
    if (seriesLength[0] && initData[seriesLength[0]] && Object.keys(initData[seriesLength[0]])) {
      const xAxis = Object.keys(initData[seriesLength[0]])
        .map((item) => item.split(' ')[1])
        .map((item) => `${item.split(':')[0]}:${item.split(':')[1]}`);
      xAxisData.push(...xAxis);
      seriesLength.forEach((item) => {
        const seriesItem = {
          data: isToday
            ? Object.values(initData[item]).slice(0, handleDiffMins() + 1)
            : Object.values(initData[item]),
          type: 'line',
          symbol: 'none',
          barWidth: 16,
          name: item,
          smooth: true,
        };
        name.push(item);
        seriesData.push(seriesItem);
      });
    }
  }

  if (!xAxisData.length) {
    return false;
  }

  return {
    grid: {
      top: '20%',
      left: '4%',
      right: '4%',
      bottom: '1%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      // 图例过多被遮挡，强制超出显示
      appendToBody: true,
    },
    legend: {
      type: 'scroll',
      data: name,
      left: 40,
      textStyle: {
        color: '#fff',
        fontSize: '12px',
        fontWeight: 400,
      },
      pageIconColor: 'white',
      pageIconInactiveColor: '#aaa',
      pageTextStyle: {
        color: 'white', // 箭头中间文字的颜色为白色
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#0065D7',
          width: 0.5,
        },
      },
      data: xAxisData,
    },
    yAxis: {
      splitLine: {
        show: true,
        lineStyle: {
          color: '#0065D7',
          width: 0.5,
        },
      },
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      name: '电流/A',
      nameTextStyle: {
        padding: [0, 40, 0, 0],
      },
      type: 'value',
    },
    series: seriesData,
  };
};

// 测点表格 columns
export const measurePointColumns = [
  {
    title: '测点名称',
    dataIndex: 'dataDesc',
    key: 'dataDesc',
    align: 'center' as any,
  },
  {
    title: '测点值',
    dataIndex: 'data',
    key: 'data',
    align: 'center' as any,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
    align: 'center' as any,
  },
];
