export const statusticsChart = () => {
  return {
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'line', //指示器类型，属性值：line直线/shadow阴影/none/cross十字准星
        axis: 'auto', //指示器坐标轴，属性值：x/y/radius/angle
        snap: true, //坐标轴指示器是否自动吸附到点上。默认自动判断，布尔值
        z: 0, //坐标轴指示器z值，控制图形的前后顺序，属性值：num
      },
    },
    grid: {
      top: '1%',
      left: '1%',
      right: '1%',
      bottom: '10%',
    },
    legend: {
      data: ['日前削峰响应', '实时削峰响应', '日前填谷响应', '未受邀'],
      bottom: 0,
      left: 'center',
      textStyle: {
        color: '#E7FAFF',
        fontSize: '14px',
        fontWeight: 400,
      },
    },
    color: ['#00a2ff', '#37e2e7', '#ffc965', '#ababab'],
    series: [
      {
        type: 'pie',
        radius: ['50%', '60%'],
        labelLine: {
          show: true,
          position: 'outside',
          length: 10,
          length2: 70,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        padAngle: 3, // 间隙大小
        label: {
          normal: {
            position: 'outside',
            show: true,
            formatter: (d: any) => {
              return `${d.name}\n\n${10}%`;
            },
          },
        },
        data: [
          { value: 20, name: '日前削峰响应' },
          { value: 40, name: '实时削峰响应' },
          { value: 24, name: '日前填谷响应' },
          { value: 10, name: '未受邀' },
        ],
      },
    ],
  };
};


export const planChartOptions = () => {
  return {
    tooltip: {
      trigger: 'axis',
      // 图例过多被遮挡，强制超出显示
      appendToBody: true,
    },
    grid: {
      top: '20%',
      left: '3%',
      right: '4%',
      bottom: '2%',
      containLabel: true,
    },
    color: ['#39ffc5', '#0090ff', '#ffea00', '#fa8c44'],
    legend: {
      data: ['邀约计划', '实时', '邀约调节', '基线'],
      textStyle: {
        color: '#d7eaef',
      },
      top: 20
    },
    xAxis: {
      type: 'category',
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
        data: [110,125,160,182,658,695,457,123,855,120,565,865],
        type: 'line',
        name: '邀约计划',
        smooth: true
      },
      {
        data: [-125,865,965,854,435,665,522,111,666,854,125,523],
        type: 'line',
        name: '实时',
        smooth: true
      },
      {
        data: [-125,865,965,854,335,665,656,111,666,854,125,523],
        type: 'line',
        name: '邀约调节',
        smooth: true
      },
      {
        data: [-125,865,965,854,223,665,855,111,666,854,125,523],
        type: 'line',
        name: '基线',
        smooth: true
      },
    ],
  }
}
