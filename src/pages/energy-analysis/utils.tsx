import { SpaceContext } from 'antd/es/space';
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
}

// 鼠标移入 tooptip 提示
const handleTooltip = () => {
  return {
    appendToBody: true,
    trigger: 'item',
    axisPointer: {
      type: 'shadow',
    },
    formatter: function ({ name, value }: any) {
      return `${name}-${value}kW`
    },
  }
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
}

// 能源结构排行 chart options
export const energyRankOptions = (dataList: any[] = []) => {
  // 站点名称
  const stationData: any = [];
  // 站点数据
  const values: any = [];
  // 用于添加排名图标
  const yAxisRich: any = {}

  dataList = [
    {
      "substationName": "德龙钢铁1",
      "substationCode": "dl_substation",
      "alarmCount": 285,
      "deviceAlarmCountVOS": [
        {
          "deviceName": "逆变器",
          "alarmCount": 285
        }
      ]
    },
    {
      "substationName": "华皓总站测试",
      "substationCode": "hh_substation",
      "alarmCount": 96,
      "deviceAlarmCountVOS": [
        {
          "deviceName": "逆变器",
          "alarmCount": 96
        }
      ]
    },
    {
      "substationName": "华皓总站2",
      "substationCode": "hh_substation",
      "alarmCount": 110,
      "deviceAlarmCountVOS": [
        {
          "deviceName": "逆变器",
          "alarmCount": 96
        }
      ]
    },
    {
      "substationName": "华皓总站3",
      "substationCode": "hh_substation",
      "alarmCount": 120,
      "deviceAlarmCountVOS": [
        {
          "deviceName": "逆变器",
          "alarmCount": 96
        }
      ]
    },
    {
      "substationName": "华皓总站4",
      "substationCode": "hh_substation",
      "alarmCount": 160,
      "deviceAlarmCountVOS": [
        {
          "deviceName": "逆变器",
          "alarmCount": 96
        }
      ]
    },
    {
      "substationName": "华皓总站5",
      "substationCode": "hh_substation",
      "alarmCount": 190,
      "deviceAlarmCountVOS": [
        {
          "deviceName": "逆变器",
          "alarmCount": 96
        }
      ]
    }
  ]

  if (!dataList || dataList.length === 0) {
    return false;
  }

  dataList.forEach((item: any, index: number) => {
    stationData.push(item.substationName);
    values.push(item.alarmCount);
    yAxisRich[`nt${index + 1}`] = {
      color: '#fff',
      backgroundColor: (index) < 3 ? '#00bc9b' : 'transparent',
      width: 20,
      height: 18,
      fontSize: 12,
      align: 'center',
      borderRadius: 50,
      padding: [2, 0, 0, 0],
    }
  });


  return {
    tooltip: handleTooltip(),
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
          verticalAlign : 'middle',
          rich: yAxisRich,
          formatter: function (value: string) {
            const index = contains(stationData, value);
            if (Object.prototype.toString.call(index) === '[object Number]') {
              const _index = index + 1;
              return [
                '{nt' + _index + '|' + _index + '}',
                `{b|${value}}`
              ].join(' ')
            } else {
              return ''
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
        name: '',
        type: 'bar',
        barWidth: 18,
        data: dataFormat(values),
        barCategoryGap: '10%',
        align: 'center',
        itemStyle: {
          barBorderRadius: [0, 10, 10, 0],
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 1, color: 'rgba(0, 161, 159, 1)' },
            { offset: 0, color: 'rgba(0, 226, 144, 1)' },
          ]),
        },
        label: {
          show: true,
          fontSize: 10,
          color: '#fff', //条装中字体颜色
          position: 'insideLeft',
          formatter: () => {
            return '';
          },
        },
      },
    ],
  };
};


// 用电量趋势 chart options
export const powerTrendOptions = () => {
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
      containLabel: true
    },
    color: ['#39FFC5', '#0090FF'],
    legend: {
      data: ['同比增长率', '环比增长率'],
      textStyle: {
        color: '#d7eaef'
      },
      bottom: 6,
    },
    xAxis: {
      type: 'category',
      name: '月',
      data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#8396ad',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'kWh',
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
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'line',
        name: '同比增长率'
      },
      {
        data: [100, 220, 10, 90, 170, 10, 330],
        type: 'line',
        name: '环比增长率'
      }
    ]
  };
}


// 用电指数
export const powerIndexOptions = () => {
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
      containLabel: true
    },
    color: ['#39FFC5', '#0090FF'],
    legend: {
      data: ['同比增长率', '环比增长率'],
      textStyle: {
        color: '#d7eaef'
      },
      bottom: 6,
    },
    xAxis: {
      type: 'category',
      name: '月',
      data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      axisLine: {
        show: true,
        lineStyle: {
          color: '#8396ad',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'kWh',
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
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'line',
        name: '同比增长率'
      },
      {
        data: [100, 220, 10, 90, 170, 10, 330],
        type: 'line',
        name: '环比增长率'
      }
    ]
  };
}
