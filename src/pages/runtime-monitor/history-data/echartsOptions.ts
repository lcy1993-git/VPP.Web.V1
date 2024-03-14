export const echartsOptions = (legendData: any, series: any, xAxisData: any) => {
  return {
    legend: {
      data: legendData,
      top: 10,
      textStyle: { color: '#ffffff' },
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '1%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#1990B6',
          width: 0.5,
        },
      },
      axisLine: {
        lineStyle: {
          color: '#1990B6',
        },
      },
      data: xAxisData,
    },
    yAxis: {
      splitLine: {
        show: true,
        lineStyle: {
          color: '#1990B6',
          width: 0.5,
        },
      },
      axisLine: {
        lineStyle: {
          color: '#1990B6',
        },
      },
      type: 'value',
    },
    series,
  };
};
