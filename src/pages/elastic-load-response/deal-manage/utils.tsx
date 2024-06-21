import ColorCircleScript from '@/components/color-circle-script';
import { Button, Space } from 'antd';
import * as echarts from 'echarts';

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
export const userDetailColumns: any = [
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
  },
  {
    title: '申报价格曲线',
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
          <Button size="small">编辑</Button>
          <Button size="small">删除</Button>
        </Space>
      );
    },
  },
];




// 合同管理表格Columns
export const contractColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    align: 'center' as any,
    render: (_text: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '计划编号',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '合同名称',
    align: 'center' as any,
    dataIndex: 'index',
    key: 'index',
  },
  {
    align: 'center' as any,
    title: '合同类型',
    dataIndex: 'index',
    key: 'index',
    filters: [
      {
        text: '需求响应代理合同',
        value: '1',
      },
      {
        text: '电网结算合同',
        value: '2',
      },
    ],
    onFilter: (value: any, record: any) => record.address.startsWith(value as string),
  },
  {
    align: 'center' as any,
    title: '结算方式',
    dataIndex: 'index',
    key: 'index',
    filters: [
      {
        text: '收益与考核比例结算',
        value: '1',
      },
      {
        text: '电网结算',
        value: '2',
      },
    ],
    onFilter: (value: any, record: any) => record.address.startsWith(value as string),
  },
  {
    title: '签订对象',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
    filters: [
      {
        text: '收益与考核比例结算',
        value: '1',
      },
      {
        text: '电网结算',
        value: '2',
      },
    ],
    onFilter: (value: any, record: any) => record.address.startsWith(value as string),
  },
  {
    title: '开始时间',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '结束时间',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '状态',
    align: 'center' as any,
    dataIndex: 'index',
    key: 'index',
  },

]

// 合同管理新增模态框表格
export const addContractTableColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    align: 'center' as any,
    render: (_text: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '合同编号',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '合同名称',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '合同类型',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '结算方式',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '签订对象',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '开始时间',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '结束时间',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '操作',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
    width: 180,
    render: () => {
      return (
        <Space>
          <Button size="small">下载</Button>
          <Button size="small" danger>删除</Button>
        </Space>
      );
    },
  },
]
