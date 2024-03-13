import * as echarts from 'echarts';
import moment from 'moment';

/***
 * 页面请求轮询时间
 * */
export const INTERVALTIME = 1000 * 60 * 5
//
// 区域用能枚举值
export const datePickerEnum: any = [
  {
    type: 'date',
    name: '日',
    dayType: 'YYYY-MM-DD',
  },
  {
    type: 'month',
    name: '月',
    dayType: 'YYYY-MM',
  },
  {
    type: 'year',
    name: '年',
    dayType: 'YYYY',
  },
];

// 区域用能限制日期选择
export const disableDate = (current: any) => {
  // 获取当前日期
  const today = moment().startOf('day');
  // 将被选中的日期也转换为日期对象
  const selectedDate = moment(current).startOf('day');
  // 当前日期及之后的日期将被禁用
  return selectedDate > today;
};

// 区域用能概览 charts 数据
export const energyOverviewOptions = (data: any, type: any) => {
  if (!data) {
    return false
  }
  // X轴
  let XData
  if (type === '日') {
    XData =  Object.keys(data.firstIndustryTimeValueMap).map(item => item.split(' ')[1].slice(0, 5))
  } else if (type === '月') {
    XData =  Object.keys(data.firstIndustryTimeValueMap).map(item => item.split(' ')[0].slice(8, 10) + '日')
  } else {
    XData =  Object.keys(data.firstIndustryTimeValueMap).map(item => item.split(' ')[0] + '月')
  }
  // 第一产业
  const firstIndustry =  Object.values(data.firstIndustryTimeValueMap)
  // 第二产业
  const secondIndustry = Object.values(data.secondIndustryTimeValueMap)
  // 第三产业
  const thirdIndustry =  Object.values(data.thirdIndustryTimeValueMap)
  // 第四产业
  const residentIndustry = Object.values(data.residentIndustryTimeValueMap)

  return {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['第一产业', '第二产业', '第三产业', '第四产业'],
      textStyle: {
        color: '#d7eaef'
      },
    },
    color: ['#1877c8', '#26ad90', '#d3b53a', '#65bd35'],
    xAxis: {
      type: 'category',

      axisTick: {
        show: false, //是否显示刻度线
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#38465d',
        },
      },
      axisLabel: {
        color: '#95a4ad',
        interval: 0, // 显示所有刻度
        rotate: 50 //设置倾斜角度，数值 可设置 正负 两种，
      },
      data: XData
    },
    yAxis: {
      type: 'value',
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
            width: 2 //刻度线粗细
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#95a4ad',
          },
        },
    },
    grid: {
      top: '12%',
      left: '3%',
      right: '4%',
      bottom: '2%',
      containLabel: true
    },
    series: [
      {
        data: firstIndustry,
        type: 'bar',
        stack:"Search Engine",
        name: '第一产业'
      },
      {
        data: secondIndustry,
        type: 'bar',
        stack:"Search Engine",
        name: '第二产业'
      },
      {
        data: thirdIndustry,
        type: 'bar',
        stack:"Search Engine",
        name: '第三产业'
      },
      {
        data: residentIndustry,
        type: 'bar',
        stack:"Search Engine",
        name: '第四产业'
      },
    ]
  }
}

// 区域弹性负荷概览
export const elasticityOverviewOptions = (data: any) => {
  if (!data) {
    return false;
  }

  // x轴坐标数据
  const XData = Object.keys(data.basePowerTimeValueMap).map(item => item.split(' ')[1].slice(0, 5)).filter((item, index) => (index + 1) % 2 === 0)
  // 实时负荷
  const realTimeLoad = Object.values(data.totalPowerTimeValueMap).filter((item, index) => (index + 1) % 2 === 0);
  // 基线负荷
  const baselineLoad = Object.values(data.basePowerTimeValueMap).filter((item, index) => (index + 1) % 2 === 0);

  return {
    tooltip: {
      trigger: 'axis',
      // axisPointer: {
      //   type: 'cross',
      //   label: {
      //     backgroundColor: '#6a7985'
      //   }
      // }
    },
    legend: {
      data: ['实时负荷', '基线负荷'],
      bottom: 6,
      textStyle: {
        color: '#E7FAFF'
      },
    },
    color: ['#39ffc5', '#fb8d44'],
    grid: {
      top: '12%',
      left: '3%',
      right: '4%',
      bottom: '14%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          interval: 0 // 显示所有刻度
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#95a4ad',
          },
        },
        data: XData
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false,
          lineStyle: {
            color: '#95a4ad',
            width: 1,
          },
        },
        axisTick: {
          show: true, //是否显示刻度线
          alignWithLabel: true, //刻度线与刻度标签是否对齐
          lineStyle: {
            color: '#95a4ad', //刻度线颜色
            width: 2 //刻度线粗细
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#95a4ad',
          },
        },
        nameTextStyle: {
          align: 'right'
        },
        name: 'MW',
      }
    ],
    series: [
      {
        name: '实时负荷',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 1,
            color: 'rgba(39, 192, 179,0.1)'
          }, {
            offset: 0,
            color: 'rgba(39, 192, 179, 0.7)'
          }])
        },
        smooth: true,
        data: realTimeLoad,
      },
      {
        name: '基线负荷',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 1,
            color: 'rgba(251, 141, 68,0.1)'
          }, {
            offset: 0,
            color: 'rgba(251, 141, 68, 0.7)'
          }])
        },
        smooth: true,
        data: baselineLoad,
      },
    ]
  };
}
