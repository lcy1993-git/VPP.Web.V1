import * as echarts from 'echarts';


export const chartOptions = () => {
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
      data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
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
        data: [820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 100],
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
