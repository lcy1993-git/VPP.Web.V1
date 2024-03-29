import { formatXAxis } from '@/utils/common';
import * as echarts from 'echarts';
import { Dispatch, SetStateAction } from 'react';

// columns
export const tableColumns = (
  unit: string,
  setVisible: Dispatch<SetStateAction<any>>,
  setElectricityVisible: Dispatch<SetStateAction<any>>,
  setSubstationCode: Dispatch<SetStateAction<any>>,
) => {
  const columns = [
    {
      title: '序号',
      dataIndex: '',
      key: 'index',
      width: 100,
      align: 'center' as any,
      render: (_text: any, _record: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: '企业名称',
      dataIndex: 'substationName',
      key: 'substationName',
      align: 'center' as any,
    },
    {
      title: '统计周期',
      dataIndex: 'statistical',
      key: 'statistical',
      align: 'center' as any,
    },
    {
      title: '总用量(MWh)',
      dataIndex: 'totalElectricity',
      key: 'totalElectricity',
      align: 'center' as any,
    },
    {
      title: '光伏总发电量(MWh)',
      dataIndex: 'totalGenerated',
      key: 'totalGenerated',
      align: 'center' as any,
    },
    {
      title: '区域排名',
      dataIndex: 'areaRanking',
      key: 'areaRanking',
      align: 'center' as any,
    },
    {
      title: '行业排名',
      dataIndex: 'substationRanking',
      key: 'substationRanking',
      align: 'center' as any,
    },
    {
      title: '实时负荷趋势',
      align: 'center' as any,
      render: (text: any) => (
        <span
          style={{ color: '#0084FF', cursor: 'pointer' }}
          onClick={() => {
            setVisible(true);
            setSubstationCode(text?.substationCode);
          }}
        >
          点击查询
        </span>
      ),
    },
    {
      title: '用量趋势',
      align: 'center' as any,
      render: (text: any) => (
        <span
          style={{ color: '#0084FF', cursor: 'pointer' }}
          onClick={() => {
            setElectricityVisible(true);
            setSubstationCode(text?.substationCode);
          }}
        >
          点击查询
        </span>
      ),
    },
  ];
  if (unit !== 'day') {
    // 如果 unit 不等于 "day"，则从列中移除"实时负荷趋势"这一列
    const index = columns.findIndex((column) => column.title === '实时负荷趋势');
    if (index !== -1) {
      columns.splice(index, 1);
    }
  }

  return columns;
};

// 实时负荷
export const chartOptions = (data: any) => {
  if (!data) return false;
  const keys = Object.keys(data);
  if (keys.length === 0) return false;

  return {
    tooltip: {
      trigger: 'axis',
      // 图例过多被遮挡，强制超出显示
      appendToBody: true,
    },
    grid: {
      top: '10%',
      left: '2%',
      right: '4%',
      bottom: '4%',
      containLabel: true,
    },
    color: ['#FF8F44'],
    xAxis: {
      type: 'category',
      name: '时',
      boundaryGap: false,
      data: formatXAxis(keys, 'day'),
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
        data: Object.values(data),
        type: 'line',
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: '#112654',
            },
            {
              offset: 0,
              color: '#664c4f',
            },
          ]),
        },
      },
    ],
  };
};

// 用电趋势
export const electricityOption = (data: any, unit: string) => {
  if (!data) {
    return false;
  }
  const keys = Object.keys(data);
  if (keys.length === 0) return false;

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
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: formatXAxis(keys, unit),
      axisLine: {
        show: true,
        lineStyle: {
          color: '#8396ad',
        },
      },
      axisLable: {
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      name: '电量/kWh',
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
        data: Object.values(data),
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color: '#2080D4',
            },
            {
              offset: 0,
              color: '#74D9FB',
            },
          ]),
        },
      },
    ],
  };
};
