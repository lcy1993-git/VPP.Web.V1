import { formatXAxis, handleDiffMins } from '@/utils/common';
import styles from './index.less';
import Unit from './unit';
/** header区域 数据总览 */
export const renderOverviewData = (info: any) => {
  const { electricCharge, electricQuantity, load } = Unit;
  const overviewData = [
    {
      label: '实时负荷',
      unit: load,
      id: 1,
      value: info?.realTimePower,
      icon: '',
    },
    {
      label: '日用电量',
      unit: electricQuantity,
      id: 2,
      value: info?.dailyElectricityConsumption,
      icon: 'icon-riyongdianliang',
    },
    {
      label: '月用电量',
      unit: electricQuantity,
      id: 3,
      value: info?.monthlyElectricityConsumption,
      icon: 'icon-yueyongdianliang',
    },
    {
      label: '年用电量',
      unit: electricQuantity,
      id: 4,
      value: info?.annualElectricityConsumption,
      icon: 'icon-nianyongdianliang',
    },
    {
      label: '日电费',
      unit: electricCharge,
      id: 5,
      value: info?.dailyElectricityCost,
      icon: 'icon-ridianfei',
    },
    {
      label: '月电费',
      unit: electricCharge,
      id: 6,
      value: info?.monthlyElectricityCost,
      icon: 'icon-yuedianfei',
    },
    {
      label: '年电费',
      unit: electricCharge,
      id: 7,
      value: info?.annualElectricityCost,
      icon: 'icon-niandianfei',
    },
  ];

  return (
    <div className={styles.overviewList}>
      {overviewData.map((item) => {
        const listStyle = item.id > 4 ? styles.chargeFlex : styles.electricFlex;
        return (
          <div className={`${styles.listItem} ${listStyle}`} key={item.id}>
            <div className={styles.listItemIcon}>
              <i className={`${item.icon} iconfont ${styles.iconSize}`} />
            </div>
            <dl className={styles.listItemLabel}>
              <dt>
                {item.label}({item.unit})
              </dt>
              <dd>{item.value}</dd>
            </dl>
          </div>
        );
      })}
    </div>
  );
};

/* 用电概览-平均电价、电费 */
export const renderAverageData = (
  type: string,
  chargeOrQuantity: boolean,
  averageElectricityPrice: string,
  averageElectricityCost: string,
  averageElectricityConsumption: string,
) => {
  const { electricCharge, averageElectricPrice, electricQuantity } = Unit;
  const dateType = type === 'day' ? '日' : type === 'month' ? '月' : '年';
  const averageData = chargeOrQuantity
    ? [
        {
          label: '平均电价',
          unit: averageElectricPrice,
          id: 1,
          value: averageElectricityPrice,
          icon: 'icon-ripingjundianjia',
        },
        {
          label: '平均电费',
          unit: electricCharge,
          id: 2,
          value: averageElectricityCost,
          icon: 'icon-ripingjundianfei',
        },
      ]
    : [
        {
          label: '平均电价',
          unit: averageElectricPrice,
          id: 1,
          value: averageElectricityPrice,
          icon: 'icon-ripingjundianjia',
        },
        {
          label: '平均电量',
          unit: electricQuantity,
          id: 2,
          value: averageElectricityConsumption,
          icon: 'icon-dianliang',
        },
      ];

  return (
    <div className={styles.averageList}>
      {averageData.map((item) => {
        return (
          <div className={styles.averageListItem} key={item.id}>
            <div className={styles.listItemIcon}>
              <i className={`${item.icon} iconfont ${styles.iconSize}`} />
            </div>
            <dl className={styles.listItemLabel}>
              <dt>
                {dateType}
                {item.label} ({item.unit})
              </dt>
              <dd>{item.value}</dd>
            </dl>
          </div>
        );
      })}
    </div>
  );
};

// 负荷概览
export const powerOverviewOptions = (data: any, isToday: boolean) => {
  if (!data) return false;
  // 截取y轴
  const handleYAxis = (data: any) => {
    if (isToday) {
      return data.slice(
        0,
        handleDiffMins(
          new Date(),
          new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
          60,
        ) + 1,
      );
    } else {
      return data;
    }
  };

  return {
    grid: {
      top: '14%',
      left: '2%',
      right: '2%',
      bottom: '5%',
      containLabel: true,
    },
    legend: {
      data: ['实时负荷', '可上调负荷', '可下调负荷'],
      x: 'center',
      textStyle: {
        color: '#E7FAFF',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    color: ['#39FFC5', '#FB8D44', '#0090FF'],
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.1)', // 设置 x 轴线颜色
        },
      },
      axisLabel: {
        textStyle: {
          fontSize: '10px',
          fontWeight: 400,
          color: 'rgba(231, 250, 255, 0.6)', // 设置 x 轴刻度文字颜色
        },
      },
      data: Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0') + ':00'),
    },
    yAxis: {
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.1)',
        },
      },
      axisLine: {
        lineStyle: {
          fontSize: '10px',
          fontWeight: 400,
          color: 'rgba(231, 250, 255, 0.6)', // 设置 y 轴文字颜色
        },
      },
      name: 'kWh',
      type: 'value',
    },
    series: [
      {
        data: handleYAxis(Object.values(data?.realTimePowerMap)),
        type: 'line',
        name: '实时负荷',
        showSymbol: false, // 隐藏数据点
      },
      {
        data: handleYAxis(Object.values(data?.upwardPowerMap)),
        type: 'line',
        name: '可上调负荷',
        showSymbol: false, // 隐藏数据点
      },
      {
        data: handleYAxis(Object.values(data?.downwardPowerMap)),
        type: 'line',
        name: '可下调负荷',
        showSymbol: false, // 隐藏数据点
      },
    ],
  };
};

// 用电概览平台占比饼图
export const pieChart = (
  peakElectricity: string,
  highElectricity: string,
  normalElectricity: string,
  valleyElectricity: string,
) => {
  const data = [
    { name: '尖值', value: peakElectricity, itemStyle: { color: '#3EADE4' } },
    { name: '峰值', value: highElectricity, itemStyle: { color: '#3AE6E6' } },
    { name: '平值', value: normalElectricity, itemStyle: { color: '#E0B437' } },
    { name: '谷值', value: valleyElectricity, itemStyle: { color: '#1CCB6E' } },
  ];
  return {
    legend: {
      orient: 'vertical',
      left: 280,
      top: 'middle',
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: '#FFFFFF', // 设置图例字体颜色
      },
      formatter: (name: string) => {
        const item = data.find((item) => item.name === name);
        if (item) {
          return `${name}  ${item.value}%`; // 返回图例名称和对应数值
        }
        return name;
      },
    },
    series: [
      {
        type: 'pie',
        radius: [17, 75],
        center: ['35%', '50%'],
        label: {
          show: false,
        },
        // emphasis: {
        //   scale: false, // 取消凸起效果
        // },
        data: data,
      },
    ],
    tooltip: {
      trigger: 'item',
    },
  };
};

// 用电概览柱状图
export const stackedBarChart = (
  type: string,
  peakElectricityMap: any,
  highElectricityMap: any,
  normalElectricityMap: any,
  valleyElectricityMap: any,
) => {
  if (!peakElectricityMap || !highElectricityMap || !normalElectricityMap || !valleyElectricityMap)
    return false;
  return {
    tooltip: {},
    legend: {
      data: ['尖值', '峰值', '平值', '谷值'],
      x: 'center',
      textStyle: {
        color: '#E7FAFF',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    color: ['#65BD35', '#D3B53A', '#26AD90', '#1877C8'],
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.1)', // 设置 x 轴线颜色
        },
      },
      axisLabel: {
        textStyle: {
          fontSize: '10px',
          fontWeight: 400,
          color: 'rgba(231, 250, 255, 0.6)', // 设置 x 轴刻度文字颜色
        },
      },
      data: formatXAxis(Object.keys(valleyElectricityMap), type),
    },
    yAxis: {
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.1)',
        },
      },
      axisLine: {
        lineStyle: {
          fontSize: '10px',
          fontWeight: 400,
          color: 'rgba(231, 250, 255, 0.6)', // 设置 y 轴文字颜色
        },
      },
      name: 'kWh',
      type: 'value',
    },
    series: [
      {
        name: '谷值',
        type: 'bar',
        stack: 'stackGroup',
        data: Object.values(valleyElectricityMap),
      },
      {
        name: '平值',
        type: 'bar',
        stack: 'stackGroup',
        data: Object.values(normalElectricityMap),
      },
      {
        name: '峰值',
        type: 'bar',
        stack: 'stackGroup',
        data: Object.values(highElectricityMap),
      },
      {
        name: '尖值',
        type: 'bar',
        stack: 'stackGroup',
        data: Object.values(peakElectricityMap),
      },
    ],
  };
};
