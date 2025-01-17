import { formatXAxis, handleDiffMins } from '@/utils/common';
import { Tooltip } from 'antd';
import * as echarts from 'echarts';
import moment from 'moment';
import styles from './components/index.less';
/***
 * 页面请求轮询时间
 * */
export const INTERVALTIME = 1000 * 60 * 5;

// 典型响应分析---目前计划名称枚举
const enumName = ['调峰', '填谷'];
// 典型响应分析 --- table columns
export const typicalResponse = (type: string) => {
  // 根据类型调整中间三个column
  let column: any = [];
  switch (type) {
    case '负荷':
      column = [
        {
          name: '累计偏差值',
          key: 'totalDeviation',
          dataIndex: 'totalDeviation',
          width: '17%',
          render: (item: any, col: any) => {
            return (
              <td
                className={styles.tdContainer}
                key={`totalDeviation-${item.planId || item.substationName}`}
                style={{ width: col.width }}
              >
                <Tooltip title={item[col.dataIndex] || '未知'}>
                  {item[col.dataIndex] || '未知'}
                </Tooltip>
              </td>
            );
          },
        },
        {
          name: '响应偏差值',
          key: 'responseDeviationRate',
          dataIndex: 'responseDeviationRate',
          width: '17%',
          render: (item: any, col: any) => {
            return (
              <td
                className={styles.tdContainer}
                key={`responseDeviationRate-${item.planId || item.substationName}`}
                style={{ width: col.width }}
              >
                <Tooltip title={item[col.dataIndex] || '未知'}>
                  {item[col.dataIndex] || '未知'}
                </Tooltip>
              </td>
            );
          },
        },
        {
          name: '负荷偏差功率',
          key: 'deviationPower',
          dataIndex: 'deviationPower',
          width: '18%',
          render: (item: any, col: any) => {
            return (
              <td
                className={styles.tdContainer}
                key={`deviationPower-${item.planId || item.substationName}`}
                style={{ width: col.width }}
              >
                <Tooltip title={item[col.dataIndex] || '未知'}>
                  {parseFloat(item[col.dataIndex]).toFixed(2) || '未知'}
                </Tooltip>
              </td>
            );
          },
        },
        {
          name: '响应企业',
          key: 'enterprise',
          dataIndex: 'enterprise',
          width: '17%',
          render: (item: any, col: any) => {
            return (
              <td
                className={styles.tdContainer}
                key={`enterprise-${item.planId || item.substationName}`}
                style={{ width: col.width }}
              >
                <Tooltip title={item[col.dataIndex] || '未知'}>
                  {item[col.dataIndex] || '未知'}
                </Tooltip>
              </td>
            );
          },
        },
      ];
      break;
    case '时长':
      column = [
        {
          name: '偏差开始时间',
          key: 'deviationStartTime',
          dataIndex: 'deviationStartTime',
          width: '17%',
          render: (item: any, col: any) => {
            return (
              <td
                className={styles.tdContainer}
                key={`deviationStartTime-${item.planId || item.substationName}`}
                style={{ width: col.width }}
              >
                <Tooltip title={item[col.dataIndex] || '未知'}>
                  {item[col.dataIndex] || '未知'}
                </Tooltip>
              </td>
            );
          },
        },
        {
          name: '偏差结束时间',
          key: 'deviationEndTime',
          dataIndex: 'deviationEndTime',
          width: '17%',
          render: (item: any, col: any) => {
            return (
              <td
                className={styles.tdContainer}
                key={`deviationEndTime-${item.planId || item.substationName}`}
                style={{ width: col.width }}
              >
                <Tooltip title={item[col.dataIndex] || '未知'}>
                  {item[col.dataIndex] || '未知'}
                </Tooltip>
              </td>
            );
          },
        },
        {
          name: '累计偏差时间(h)',
          key: 'differenceInTime',
          dataIndex: 'differenceInTime',
          width: '18%',
          render: (item: any, col: any) => {
            return (
              <td
                className={styles.tdContainer}
                key={`differenceInTime-${item.planId || item.substationName}`}
                style={{ width: col.width }}
              >
                <Tooltip title={item[col.dataIndex] || '未知'}>
                  {parseFloat(item[col.dataIndex]).toFixed(2) || '未知'}
                </Tooltip>
              </td>
            );
          },
        },
        {
          name: '相关企业',
          key: 'enterprise',
          dataIndex: 'enterprise',
          width: '17%',
          render: (item: any, col: any) => {
            return (
              <td
                className={styles.tdContainer}
                key={`enterprise-${item.planId || item.substationName}`}
                style={{ width: col.width }}
              >
                <Tooltip title={item[col.dataIndex] || '未知'}>
                  {item[col.dataIndex] || '未知'}
                </Tooltip>
              </td>
            );
          },
        },
      ];
      break;
  }
  return [
    {
      name: '排名',
      key: 'index',
      dataIndex: 'index',
      width: '9%',
      render: (item: any, col: any, index: number) => {
        return (
          <td
            className={styles.tdContainer}
            key={`index-${item.planId || item.substationName}`}
            style={{ width: col.width }}
          >
            {index + 1}
          </td>
        );
      },
    },
    {
      name: `日前计划名称`,
      key: 'planType',
      dataIndex: 'planType',
      width: '18%',
      render: (item: any, col: any) => {
        return (
          <td
            className={styles.tdContainer}
            key={`planType-${item.planId || item.substationName}`}
            style={{ width: col.width }}
          >
            <Tooltip title={enumName[item[col.dataIndex]] || '未知'}>
              {enumName[item[col.dataIndex]] || '未知'}
            </Tooltip>
          </td>
        );
      },
    },
    ...column,
  ];
};

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
    return false;
  }
  // X轴
  let XData;
  if (type === '日') {
    XData = Object.keys(data.firstIndustryTimeValueMap).map((item) =>
      item.split(' ')[1].slice(0, 5),
    );
  } else if (type === '月') {
    XData = Object.keys(data.firstIndustryTimeValueMap).map(
      (item) => item.split(' ')[0].slice(8, 10) + '日',
    );
  } else {
    XData = Object.keys(data.firstIndustryTimeValueMap).map(
      (item) => item.split(' ')[0].slice(5, 7) + '月',
    );
  }
  // 第一产业
  const firstIndustry = Object.values(data.firstIndustryTimeValueMap);
  // 第二产业
  const secondIndustry = Object.values(data.secondIndustryTimeValueMap);
  // 第三产业
  const thirdIndustry = Object.values(data.thirdIndustryTimeValueMap);
  // 第四产业
  const residentIndustry = Object.values(data.residentIndustryTimeValueMap);

  return {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['第一产业', '第二产业', '第三产业', '第四产业'],
      textStyle: {
        color: '#d7eaef',
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
        rotate: 50, //设置倾斜角度，数值 可设置 正负 两种，
      },
      data: XData,
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
          width: 2, //刻度线粗细
        },
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
      containLabel: true,
    },
    series: [
      {
        data: firstIndustry,
        type: 'bar',
        stack: 'Search Engine',
        name: '第一产业',
        emphasis: {
          focus: 'series',
        },
      },
      {
        data: secondIndustry,
        type: 'bar',
        stack: 'Search Engine',
        name: '第二产业',
        emphasis: {
          focus: 'series',
        },
      },
      {
        data: thirdIndustry,
        type: 'bar',
        stack: 'Search Engine',
        name: '第三产业',
        emphasis: {
          focus: 'series',
        },
      },
      {
        data: residentIndustry,
        type: 'bar',
        stack: 'Search Engine',
        name: '第四产业',
        emphasis: {
          focus: 'series',
        },
      },
    ],
  };
};

// 区域弹性负荷概览
export const elasticityOverviewOptions = (data: any) => {
  if (!data) {
    return false;
  }

  // x轴坐标数据
  const XData = Object.keys(data.basePowerTimeValueMap);

  // 实时负荷
  const realTimeLoad = Object.values(data.totalPowerTimeValueMap);

  // 基线负荷
  const baselineLoad = Object.values(data.basePowerTimeValueMap);

  return {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['实时负荷', '基线负荷'],
      bottom: 6,
      textStyle: {
        color: '#E7FAFF',
      },
    },
    color: ['#39ffc5', '#fb8d44'],
    grid: {
      top: '12%',
      left: '3%',
      right: '4%',
      bottom: '14%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#95a4ad',
          },
        },
        data: formatXAxis(XData, 'day'),
      },
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
            width: 2, //刻度线粗细
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#95a4ad',
          },
        },
        nameTextStyle: {
          align: 'right',
        },
        name: 'MW',
      },
    ],
    series: [
      {
        name: '实时负荷',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: 'rgba(39, 192, 179,0.1)',
            },
            {
              offset: 0,
              color: 'rgba(39, 192, 179, 0.7)',
            },
          ]),
        },
        smooth: true,
        data: realTimeLoad.slice(0, handleDiffMins() + 1),
      },
      {
        name: '基线负荷',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: 'rgba(251, 141, 68,0.1)',
            },
            {
              offset: 0,
              color: 'rgba(251, 141, 68, 0.7)',
            },
          ]),
        },
        smooth: true,
        data: baselineLoad.slice(0, handleDiffMins() + 1),
      },
    ],
  };
};

/**-----------------------------------能源综合看板--------------------------------------**/
export const statusQuoChartOptions = (params: any) => {
  const { currentView, data, type } = params;

  if (!data) {
    return false;
  }

  if (currentView === '现状') {
    const nameEnum: any = {
      actualPowerTimeValueMap: '实际负荷曲线',
      basePowerTimeValueMap: '基线负荷曲线',
      downElasticTimeValueMap: '可下调弹性负荷曲线',
      downEssPowerTimeValueMap: '可下调储能功率曲线',
      upElasticPowerTimeValueMap: '可上调弹性负荷曲线',
      upEssPowerTimeValueMap: '可上调储能功率曲线',
    };
    // X轴
    const XData = Object.keys(data.actualPowerTimeValueMap).map((item) =>
      item.split(' ')[1].slice(0, 5),
    );

    // series
    const series = Object.keys(data).map((item: string) => {
      return {
        data: Object.values(data[item]).slice(
          0,
          handleDiffMins(
            new Date(),
            new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            60,
          ) + 1,
        ),
        type: 'line',
        name: nameEnum[item],
      };
    });

    return {
      tooltip: {
        trigger: 'axis',
        // 图例过多被遮挡，强制超出显示
        appendToBody: true,
      },
      legend: {
        textStyle: {
          color: '#d7eaef',
        },
      },
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
          rotate: 50, //设置倾斜角度，数值 可设置 正负 两种，
        },
        data: XData,
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
            width: 2, //刻度线粗细
          },
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#95a4ad',
          },
        },
        name: currentView === '现状' ? '单位：MW' : '',
      },
      grid: {
        top: '22%',
        left: '3%',
        right: '4%',
        bottom: '2%',
        containLabel: true,
      },
      series: series,
    };
  } else if (currentView === '趋势') {
    // X轴
    let XData;
    if (type === '日') {
      XData = Object.keys(data.trendTimeValueMap).map((item) => item.split(' ')[1].slice(0, 5));
    } else if (type === '月') {
      XData = Object.keys(data.trendTimeValueMap).map(
        (item) => item.split(' ')[0].slice(8, 10) + '日',
      );
    } else {
      XData = Object.keys(data.trendTimeValueMap).map(
        (item) => item.split(' ')[0].slice(5, 7) + '月',
      );
    }

    const series = Object.keys(data).map((item) => {
      if (item === 'trendTimeValueMap') {
        return {
          data: Object.values(data[item]),
          type: 'bar',
          name: '用电量',
        };
      }
      return {
        data: Object.values(data[item]),
        type: 'line',
        name: '增长率',
      };
    });

    return {
      tooltip: {
        trigger: 'axis',
        // 图例过多被遮挡，强制超出显示
        appendToBody: true,
      },
      legend: {
        data: ['第一产业', '第二产业', '第三产业', '第四产业'],
        textStyle: {
          color: '#d7eaef',
        },
      },
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
          rotate: 50, //设置倾斜角度，数值 可设置 正负 两种，
        },
        data: XData,
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
            width: 2, //刻度线粗细
          },
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
        containLabel: true,
      },
      series: series,
    };
  } else {
    // X轴
    let XData;
    if (type === '月') {
      XData = Object.keys(data.firstIndustryTimeValueMap).map(
        (item) => item.split(' ')[0].slice(8, 10) + '日',
      );
    } else {
      XData = Object.keys(data.firstIndustryTimeValueMap).map(
        (item) => item.split(' ')[0].slice(5, 7) + '月',
      );
    }

    const nameEnum: any = {
      firstIndustryTimeValueMap: '第一产业柱状图',
      secondIndustryTimeValueMap: '第二产业柱状图',
      thirdIndustryTimeValueMap: '第三产业柱状图',
    };

    const series = Object.keys(data).map((item) => {
      return {
        data: Object.values(data[item]),
        type: 'bar',
        name: nameEnum[item],
      };
    });
    return {
      tooltip: {
        trigger: 'axis',
        // 图例过多被遮挡，强制超出显示
        appendToBody: true,
      },
      legend: {
        data: ['第一产业', '第二产业', '第三产业', '第四产业'],
        textStyle: {
          color: '#d7eaef',
        },
      },
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
          rotate: 50, //设置倾斜角度，数值 可设置 正负 两种，
        },
        data: XData,
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
            width: 2, //刻度线粗细
          },
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
        containLabel: true,
      },
      series: series,
    };
  }
};

// 企业用能监测枚举
const monitorEnum = ['第一产业', '第二产业', '第三产业', '居民产业'];

// 企业用能监测 table
export const monitorColumns = [
  {
    name: '企业名称',
    dataIndex: 'substationName',
    key: 'substationName',
    width: '16%',
    render: (item: any, col: any) => {
      return (
        <td
          className={styles.tdContainer}
          key={`substationName-${item.planId || item.substationName}`}
          style={{ width: col.width }}
        >
          <Tooltip title={item[col.dataIndex] || '未知'}>{item[col.dataIndex] || '未知'}</Tooltip>
        </td>
      );
    },
  },
  {
    name: '所属行业',
    dataIndex: 'industryType',
    key: 'industryType',
    width: '16%',
    render: (item: any, col: any) => {
      return (
        <td
          className={styles.tdContainer}
          key={`industryType-${item.planId || item.substationName}`}
          style={{ width: col.width }}
        >
          <Tooltip title={monitorEnum[item[col.dataIndex] - 1] || '未知'}>
            {monitorEnum[item[col.dataIndex] - 1] || '未知'}
          </Tooltip>
        </td>
      );
    },
  },
  {
    name: '日用电量(万kWh)',
    dataIndex: 'energyUseDay',
    key: 'energyUseDay',
    width: '16%',
    render: (item: any, col: any) => {
      return (
        <td
          className={styles.tdContainer}
          key={`energyUseDay-${item.planId || item.substationName}`}
          style={{ width: col.width }}
        >
          <Tooltip title={item[col.dataIndex] || '未知'}>{item[col.dataIndex] || '未知'}</Tooltip>
        </td>
      );
    },
  },
  {
    name: '月用电量(万kWh)',
    dataIndex: 'energyUseMonth',
    key: 'energyUseMonth',
    width: '16%',
    render: (item: any, col: any) => {
      return (
        <td
          className={styles.tdContainer}
          key={`energyUseMonth-${item.planId || item.substationName}`}
          style={{ width: col.width }}
        >
          <Tooltip title={item[col.dataIndex] || '未知'}>{item[col.dataIndex] || '未知'}</Tooltip>
        </td>
      );
    },
  },
  {
    name: '年用电量(万kWh)',
    dataIndex: 'energyUseYear',
    key: 'energyUseYear',
    width: '16%',
    render: (item: any, col: any) => {
      return (
        <td
          className={styles.tdContainer}
          key={`energyUseYear-${item.planId || item.substationName}`}
          style={{ width: col.width }}
        >
          <Tooltip title={item[col.dataIndex] || '未知'}>{item[col.dataIndex] || '未知'}</Tooltip>
        </td>
      );
    },
  },
  {
    name: '实时负荷(kW)',
    dataIndex: 'power',
    key: 'power',
    width: '16%',
    render: (item: any, col: any) => {
      return (
        <td
          className={styles.tdContainer}
          key={`power-${item.planId || item.substationName}`}
          style={{ width: col.width }}
        >
          <Tooltip title={item[col.dataIndex] || '未知'}>{item[col.dataIndex] || '未知'}</Tooltip>
        </td>
      );
    },
  },
];

// 弹性负荷管理--完成状态枚举
const completionStateEnum = ['待完成', '执行中', '已完成'];
// 弹性负荷管理
export const elasticEnergyColumns = [
  {
    name: '日前计划名称',
    dataIndex: 'planName',
    key: 'planName',
    width: '16%',
    render: (item: any, col: any) => {
      return (
        <td
          className={styles.tdContainer}
          key={`planName-${item.planId || item.substationName}`}
          style={{ width: col.width }}
        >
          <Tooltip title={item[col.dataIndex] || '未知'}>{item[col.dataIndex] || '未知'}</Tooltip>
        </td>
      );
    },
  },
  {
    name: '企业名称',
    dataIndex: 'enterpriseName',
    key: 'enterpriseName',
    width: '16%',
    render: (item: any, col: any) => {
      return (
        <td
          className={styles.tdContainer}
          key={`enterpriseName-${item.planId || item.substationName}`}
          style={{ width: col.width }}
        >
          <Tooltip title={item[col.dataIndex] || '未知'}>{item[col.dataIndex] || '未知'}</Tooltip>
        </td>
      );
    },
  },
  {
    name: '日前计划里程(MWh)',
    dataIndex: 'planEnergy',
    key: 'planEnergy',
    width: '16%',
    render: (item: any, col: any) => {
      return (
        <td
          className={styles.tdContainer}
          key={`planEnergy-${item.planId || item.substationName}`}
          style={{ width: col.width }}
        >
          <Tooltip title={item[col.dataIndex] || '未知'}>{item[col.dataIndex] || '未知'}</Tooltip>
        </td>
      );
    },
  },
  {
    name: '实际完成里程(MWh)',
    dataIndex: 'completeEnergy',
    key: 'completeEnergy',
    width: '16%',
    render: (item: any, col: any) => {
      return (
        <td
          className={styles.tdContainer}
          key={`completeEnergy-${item.planId || item.substationName}`}
          style={{ width: col.width }}
        >
          <Tooltip title={item[col.dataIndex] || '未知'}>{item[col.dataIndex] || '未知'}</Tooltip>
        </td>
      );
    },
  },
  {
    name: '响应偏差(%)',
    dataIndex: 'deviationRate',
    key: 'deviationRate',
    width: '16%',
    render: (item: any, col: any) => {
      return (
        <td
          className={styles.tdContainer}
          key={`deviationRate-${item.planId || item.substationName}`}
          style={{ width: col.width }}
        >
          <Tooltip title={item[col.dataIndex] || '未知'}>{item[col.dataIndex] || '未知'}</Tooltip>
        </td>
      );
    },
  },
  {
    name: '完成状态',
    dataIndex: 'status',
    key: 'status',
    width: '16%',
    render: (item: any, col: any) => {
      return (
        <td
          className={styles.tdContainer}
          key={`status-${item.planId || item.substationName}`}
          style={{ width: col.width }}
        >
          <Tooltip title={completionStateEnum[item[col.dataIndex] - 1] || '未知'}>
            {completionStateEnum[item[col.dataIndex] - 1] || '未知'}
          </Tooltip>
        </td>
      );
    },
  },
];
