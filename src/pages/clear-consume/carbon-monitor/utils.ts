
import * as echarts from 'echarts';

export const monitorOptions = (data?: any, selectDate?: string) => {
  if (!data) {
    return false;
  }
  let type = 'day'
  if (selectDate) {
    type = ['year','month', 'day'][selectDate?.split('-').length - 1]
  }
  // X轴
  let XData
  if (type === 'day') {
    XData = Object.keys(data.carbonTimeValueMap).map(item => item.split(' ')[1].slice(0, 5))
  } else if (type === 'month') {
    XData = Object.keys(data.carbonTimeValueMap).map(item => item.split(' ')[0].slice(8, 10) + '日')
  } else {
    XData = Object.keys(data.carbonTimeValueMap).map(item => item.split(' ')[0].slice(5, 7) + '月')
  }
  const emun: any = {
    hbTimeValueMap: '环比',
    tbTimeValueMap:  '同比'
  }
  const colorEmun: any = {
    hbTimeValueMap: '#39ffc5',
    tbTimeValueMap:  '#00a8ff'
 }
  const series = Object.keys(data).map(item => {
    if (item === 'carbonTimeValueMap') { // 碳排放柱状图
      return {
        name: '实际排碳量',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value: string) {
            return value + ' 吨';
          }
        },
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 1,
            color: '#eee41e'
          }, {
            offset: 0,
            color: '#fc7007'
          }])
        },
        data: Object.values(data[item])
      }
    }
    return {
      name: emun[item],
      type: 'line',
      color: colorEmun[item],
      tooltip: {
        valueFormatter: function (value: string) {
          return value + ' %';
        }
      },
      data: Object.values(data[item])
    }
  })

  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: '16%',
      left: '3%',
      right: '4%',
      bottom: '4%',
      containLabel: true
    },
    legend: {
      data: ['实际排碳量', '环比', '同比'],
      textStyle: {
        color: '#d7eaef'
      },
    },
    xAxis: [
      {
        type: 'category',
        data: XData,
        axisPointer: {
          type: 'shadow'
        }
      }
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
      }
    ],
    series: series
  }
}
