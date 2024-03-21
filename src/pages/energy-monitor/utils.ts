import * as echarts from 'echarts';

// 用能详情charts options
export const energyDetail = (data: any, selectDate: any) => {

  if (!data) {
    return false
  }

  let type = 'day'
  if (selectDate) {
    type = ['year','month', 'day'][selectDate?.split('-').length - 1]
  }
  // X轴
  let XData
  if (type === 'day') {
    XData = Object.keys(data.eneryMap).map(item => item.split(' ')[1].slice(0, 5))
  } else if (type === 'month') {
    XData = Object.keys(data.eneryMap).map(item => item.split(' ')[0].slice(8, 10) + '日')
  } else {
    XData = Object.keys(data.eneryMap).map(item => item.split(' ')[0].slice(5, 7) + '月')
  }

  if (!XData.length) {
    return false;
  }


  return {
    tooltip: {
      trigger: 'axis',
      // 图例过多被遮挡，强制超出显示
      appendToBody: true,
    },
    grid: {
      top: '10%',
      left: '3%',
      right: '4%',
      bottom: '4%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: XData,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#8396ad',
        },
      },
      axisLable:{
        interval:0
      }
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
        data: Object.values(data.eneryMap),
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 1,
            color: '#2080D4'
          }, {
            offset: 0,
            color: '#74D9FB'
          }])
        },
      }
    ]
  };
}

// 能源结构 charts options
export const energyStructureOptions = (data: any) => {

  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 4,
      icon: 'circle',
      textStyle: {
        color: '#d7eaef'
      },
    },
    color: ['#63D058', '#0599FF'],
    grid: {
      top: '2%',
      left: '3%',
      right: '4%',
      bottom: '4%',
      containLabel: true
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: data?.cleanEnergyElectricity, name: '清洁能源' },
          { value: data?.conventionalEnergyElectricity, name: '传统能源' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}



// 负荷详情 charts options
export const loadDetail = (data: any) => {
  if (!data) {
    return false
  }

  if (!Object.keys(data.eneryMap).length) {
    return false
  }

  return {
    tooltip: {
      trigger: 'axis',
      // 图例过多被遮挡，强制超出显示
      appendToBody: true,
    },
    grid: {
      top: '10%',
      left: '3%',
      right: '4%',
      bottom: '4%',
      containLabel: true
    },
    color: ['#FF8F44'],
    xAxis: {
      type: 'category',
      name: '时',
      boundaryGap: false,
      data: Object.keys(data.eneryMap).map(item => item.split(' ')[1].slice(0, 5)),
      axisLine: {
        show: true,
        lineStyle: {
          color: '#8396ad',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'KW',
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
        data: Object.values(data.eneryMap),
        type: 'line',
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 1,
            color: '#112654'
          }, {
            offset: 0,
            color: '#664c4f'
          }])
        }
      }
    ]
  };
}
