import ColorCircleScript from '@/components/color-circle-script';
import { Button, Space } from 'antd';
import * as echarts from 'echarts';
import { Dispatch, SetStateAction } from 'react';

// 邀约需求容量详情
export const demandDetailColumns: any = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (_: any, __: any, index: number) => index + 1, // 自动计算序号
    align: 'center',
  },
  {
    title: '时段',
    dataIndex: 'timePeriod',
    key: 'timePeriod',
    align: 'center',
  },
  {
    title: '需求容量(MW)',
    dataIndex: 'demandCapacity',
    key: 'demandCapacity',
    align: 'center',
  },
];

// 邀约需求容量柱状图
export const demandCapacityOptions = (data: any) => {
  if (!data) return false;

  return {
    grid: {
      top: '16%',
      left: '2%',
      right: '3%',
      bottom: '0%',
      containLabel: true,
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.6)',
        },
      },
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
      name: '时',
    },
    yAxis: {
      splitLine: {
        show: true,
        lineStyle: {
          color: '#284377',
          width: 1,
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.6)',
        },
      },
      name: 'MW',
      type: 'value',
    },
    series: [
      {
        name: '容量',
        type: 'bar',
        data,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}', // 直接显示数值
          textStyle: {
            color: '#E7FAFF',
          },
        },
        itemStyle: {
          borderRadius: [2, 2, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: '#0084FF' },
            { offset: 1, color: '#0EC3FF' },
          ]),
        },
      },
    ],
  };
};

// 基线负荷
export const loadOptions = (data: any) => {
  if (!data) {
    return false;
  }

  return {
    // title: {
    //   text: '2024-05-10虚拟电厂基线负荷',
    //   left: 'center',
    //   textStyle: {
    //     color: '#fff',
    //   },
    // },
    legend: {
      data: ['基线'],
      textStyle: {
        color: '#E7FAFF',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: '8%',
      left: '1%',
      right: '4%',
      bottom: '4%',
      containLabel: true,
    },
    color: ['#FF8F44'],
    xAxis: {
      type: 'category',
      name: '时',
      boundaryGap: false,
      data: ['00:00', '00:00', '00:00', '00:00', '00:00'],
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.6)',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'kW',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#284377',
          width: 1,
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.6)',
        },
      },
    },
    series: [
      {
        name: '基线',
        data: data,
        type: 'line',
        smooth: true,
      },
    ],
  };
};

// 基线负荷表格
export const loadDetailColumns: any = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (_: any, __: any, index: number) => index + 1, // 自动计算序号
    align: 'center',
  },
  {
    title: '时段',
    dataIndex: 'timePeriod',
    key: 'timePeriod',
    align: 'center',
  },
  {
    title: '基线(kW)',
    dataIndex: 'demandCapacity',
    key: 'demandCapacity',
    align: 'center',
  },
];

// 申报信息
export const declarationInfoColumns: any = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 60,
    render: (_: any, __: any, index: number) => index + 1, // 自动计算序号
  },
  {
    title: '邀约计划',
    dataIndex: 'invitationPlan',
    key: 'invitationPlan',
    align: 'center',
  },
  {
    title: '运行日',
    dataIndex: 'operatingDay',
    key: 'operatingDay',
    align: 'center',
  },
  {
    title: '可调容量(MW)',
    dataIndex: 'adjustableCapacity',
    key: 'adjustableCapacity',
    align: 'center',
    width: 140,
  },
  {
    title: '申报交易量(MWh)',
    dataIndex: 'declaredTransactionVolume',
    key: 'declaredTransactionVolume',
    width: 140,
    align: 'center',
  },
  {
    title: '申报均价(元/MWh)',
    dataIndex: 'declaredAveragePrice',
    key: 'declaredAveragePrice',
    width: 150,
    align: 'center',
  },
  {
    title: '预估收益(元)',
    dataIndex: 'estimatedRevenue',
    key: 'estimatedRevenue',
    width: 150,
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    key: 'status',
    render: (text: any) => {
      const status = ['编制中', '已申报'];
      const statusColors = ['#FFD800', '#01FF73'];
      return <ColorCircleScript color={statusColors[text]} script={status[text]} />;
    },
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    align: 'center',
  },
  {
    title: '操作',
    align: 'center' as any,
    render: () => {
      return (
        <Space>
          <Button size="small">申报</Button>
          <Button size="small">删除</Button>
          <Button size="small">撤销</Button>
        </Space>
      );
    },
  },
];

// 申报详情图表-虚拟电厂
export const declarationOptions = (data: any) => {
  if (!data) {
    return false;
  }

  return {
    legend: {
      textStyle: {
        color: '#E7FAFF',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: '12%',
      left: '1%',
      right: '4%',
      bottom: '4%',
      containLabel: true,
    },
    color: ['#39FFC5', '#FFEA00', '#FB8D44'],
    xAxis: {
      type: 'category',
      name: '时',
      boundaryGap: false,
      data: ['00:00', '00:00', '00:00', '00:00', '00:00'],
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.6)',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'kW',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#284377',
          width: 1,
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.6)',
        },
      },
    },
    series: [
      {
        name: '调节',
        data: data,
        type: 'line',
        smooth: true,
      },
      {
        name: '计划',
        data: data,
        type: 'line',
        smooth: true,
      },
      {
        name: '基线',
        data: data,
        type: 'line',
        smooth: true,
      },
    ],
  };
};

// 申报详情表格-虚拟电厂
export const VPPDetailColumns: any = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (_: any, __: any, index: number) => index + 1, // 自动计算序号
    align: 'center',
  },
  {
    title: '时段',
    dataIndex: 'timePeriod',
    key: 'timePeriod',
    align: 'center',
  },
  {
    title: '调节(kW)',
    dataIndex: 'adjust',
    key: 'adjust',
    align: 'center',
    sorter: (a: any, b: any) => a.adjust - b.adjust,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: '计划(kW)',
    dataIndex: 'plan',
    key: 'plan',
    align: 'center',
    sorter: (a: any, b: any) => a.plan - b.plan,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: '基线(kW)',
    dataIndex: 'demandCapacity',
    key: 'demandCapacity',
    align: 'center',
    sorter: (a: any, b: any) => a.demandCapacity - b.demandCapacity,
    sortDirections: ['descend', 'ascend'],
  },
];

// 申报详情表格-代理用户
export const userDetailColumns: any = (
  setCapacityVisible: Dispatch<SetStateAction<any>>,
  setPriceVisible: Dispatch<SetStateAction<any>>,
) => {
  const curveIcon = (isCapacity: boolean) => {
    return (
      <i
        className="iconfont"
        style={{ color: '#0084FF', cursor: 'pointer' }}
        onClick={() => {
          if (isCapacity) {
            setCapacityVisible(true);
          } else {
            setPriceVisible(true);
          }
        }}
      >
        &#xe63a;
      </i>
    );
  };
  return [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1, // 自动计算序号
      align: 'center',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
    },
    {
      title: '邀约计划',
      dataIndex: 'invitationPlan',
      key: 'invitationPlan',
      align: 'center',
    },
    {
      title: '可调容量(MW)',
      dataIndex: 'adjustableCapacity',
      key: 'adjustableCapacity',
      align: 'center',
    },
    {
      title: '申报交易量(MWh)',
      dataIndex: 'declaredTransactionVolume',
      key: 'declaredTransactionVolume',
      align: 'center',
    },
    {
      title: '申报容量曲线',
      align: 'center',
      render: () => curveIcon(true),
    },
    {
      title: '申报价格曲线',
      align: 'center',
      render: () => curveIcon(false),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center' as any,
      render: () => {
        return (
          <Space>
            <Button size="small">编辑</Button>
            <Button size="small">删除</Button>
          </Space>
        );
      },
    },
  ];
};

// 申报容量曲线
export const capacityOptions = (data: any) => {
  if (!data) {
    return false;
  }

  return {
    legend: {
      textStyle: {
        color: '#E7FAFF',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: '15%',
      left: '1%',
      right: '4%',
      bottom: '0%',
      containLabel: true,
    },
    color: ['#FB8D44'],
    xAxis: {
      type: 'category',
      name: '时',
      boundaryGap: false,
      data: ['00:00', '00:00', '00:00', '00:00', '00:00'],
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.6)',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'kW',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#284377',
          width: 1,
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.6)',
        },
      },
    },
    series: [
      {
        name: '容量',
        data: data,
        type: 'line',
        smooth: true,
      },
    ],
  };
};

// 申报价格曲线
export const priceOptions = (data: any) => {
  if (!data) {
    return false;
  }

  return {
    legend: {
      textStyle: {
        color: '#E7FAFF',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: '15%',
      left: '1%',
      right: '4%',
      bottom: '0%',
      containLabel: true,
    },
    color: ['#FB8D44'],
    xAxis: {
      type: 'category',
      name: '时',
      boundaryGap: false,
      data: ['00:00', '00:00', '00:00', '00:00', '00:00'],
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.6)',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '元',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#284377',
          width: 1,
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.6)',
        },
      },
    },
    series: [
      {
        name: '价格',
        data: data,
        type: 'line',
        smooth: true,
      },
    ],
  };
};

// 申报容量columns
export const capacityColumns: any = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (_: any, __: any, index: number) => index + 1, // 自动计算序号
    align: 'center',
  },
  {
    title: '时段',
    dataIndex: 'timePeriod',
    key: 'timePeriod',
    align: 'center',
  },
  {
    title: '容量(kW)',
    dataIndex: 'capacity',
    key: 'capacity',
    align: 'center',
  },
];

// 申报价格columns
export const priceColumns: any = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (_: any, __: any, index: number) => index + 1, // 自动计算序号
    align: 'center',
  },
  {
    title: '时段',
    dataIndex: 'timePeriod',
    key: 'timePeriod',
    align: 'center',
  },
  {
    title: '价格(元)',
    dataIndex: 'price',
    key: 'price',
    align: 'center',
  },
];

// 出清结果
export const clearingResultColumns: any = (setClearingVisible: Dispatch<SetStateAction<any>>) => {
  return [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1, // 自动计算序号
    },
    {
      title: '邀约计划',
      dataIndex: 'invitationPlan',
      key: 'invitationPlan',
      align: 'center',
    },
    {
      title: '运行日',
      dataIndex: 'operatingDay',
      key: 'operatingDay',
      align: 'center',
    },
    {
      title: '相应类型',
      dataIndex: '',
      key: '',
      align: 'center',
    },
    {
      title: '申报交易量(MWh)',
      dataIndex: 'declaredTransactionVolume',
      key: 'declaredTransactionVolume',
      align: 'center',
    },
    {
      title: '申报均价(元/MWh)',
      dataIndex: 'declaredAveragePrice',
      key: 'declaredAveragePrice',
      align: 'center',
    },
    {
      title: '代理用户数',
      dataIndex: '',
      key: '',
      align: 'center',
    },
    {
      title: '预估收益(元)',
      dataIndex: 'estimatedRevenue',
      key: 'estimatedRevenue',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',

      key: 'status',
      render: (text: any) => {
        const status = ['中标', '未中标'];
        const statusColors = ['#FFD800', '#01FF73'];
        return <ColorCircleScript color={statusColors[text]} script={status[text]} />;
      },
      align: 'center',
    },
    {
      title: '操作',
      align: 'center' as any,
      render: () => {
        return (
          <Button size="small" onClick={() => setClearingVisible(true)}>
            查看明细
          </Button>
        );
      },
    },
  ];
};

// 出清明细-中标功率
export const winningPowerOptions = (data: any) => {
  if (!data) {
    return false;
  }

  return {
    legend: {
      textStyle: {
        color: '#E7FAFF',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: '12%',
      left: '1%',
      right: '6%',
      bottom: '4%',
      containLabel: true,
    },
    color: ['#39FFC5', '#FFEA00', '#FB8D44'],
    xAxis: {
      type: 'category',
      name: '时',
      boundaryGap: false,
      data: ['00:00', '00:00', '00:00', '00:00', '00:00'],
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.6)',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'kW',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#284377',
          width: 1,
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.6)',
        },
      },
    },
    series: [
      {
        name: '调节',
        data: data,
        type: 'line',
        smooth: true,
      },
      {
        name: '计划',
        data: data,
        type: 'line',
        smooth: true,
      },
      {
        name: '基线',
        data: data,
        type: 'line',
        smooth: true,
      },
    ],
  };
};

// 出清明细-中标价格
export const winningPriceOptions = (data: any) => {
  if (!data) {
    return false;
  }

  return {
    legend: {
      textStyle: {
        color: '#E7FAFF',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: '12%',
      left: '1%',
      right: '6%',
      bottom: '4%',
      containLabel: true,
    },
    color: ['#B37FE9'],
    xAxis: {
      type: 'category',
      name: '时',
      boundaryGap: false,
      data: ['00:00', '00:00', '00:00', '00:00', '00:00'],
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.6)',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'kW',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#284377',
          width: 1,
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.6)',
        },
      },
    },
    series: [
      {
        name: '价格',
        data: data,
        type: 'line',
        smooth: true,
      },
    ],
  };
};
