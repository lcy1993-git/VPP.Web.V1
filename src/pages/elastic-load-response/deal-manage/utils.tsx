import ColorCircleScript from '@/components/color-circle-script';
import { Badge, Button, Space } from 'antd';
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
export const demandCapacityOptions = (xAxis: any, data: any) => {
  if (!data || data.length === 0) return false;

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
      data: xAxis,
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
      data: data?.xaxis,
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
        data: data?.valueList,
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
    dataIndex: 'baseline',
    key: 'baseline',
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
];

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
          <Button size="small" danger>
            删除
          </Button>
        </Space>
      );
    },
  },
];

// 结算管理表格Columns
export const settlementColumns = [
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
    dataIndex: 'identificationNum',
    align: 'center' as any,
    ellipsis: true,
    key: 'identificationNum',
  },
  {
    title: '用户编号',
    dataIndex: 'userId',
    align: 'center' as any,
    ellipsis: true,
    key: 'userId',
  },
  {
    title: '计划电量\n(MWh)',
    dataIndex: 'scheduledElectricity',
    align: 'center' as any,
    key: 'scheduledElectricity',
  },
  {
    title: '实际电量\n(MWh)',
    dataIndex: 'actualAdjustedElectricity',
    align: 'center' as any,
    key: 'actualAdjustedElectricity',
  },
  {
    title: '结算电量\n(MW)',
    dataIndex: 'settlementElectricity',
    align: 'center' as any,
    key: 'settlementElectricity',
  },
  {
    title: '偏差考核电量\n(MW)',
    dataIndex: 'deviationSettlementElectricity',
    align: 'center' as any,
    key: 'deviationSettlementElectricity',
  },
  {
    title: '平均结算电价(元/MWh)',
    dataIndex: 'averageSettlementElectricity',
    align: 'center' as any,
    width: 100,
    key: 'averageSettlementElectricity',
  },
  {
    title: '结算费用\n(万元)',
    dataIndex: 'settlementFee',
    align: 'center' as any,
    key: 'settlementFee',
  },
  {
    title: '分成比例\n(%)',
    dataIndex: 'splitRatio',
    align: 'center' as any,
    key: 'splitRatio',
  },
  {
    title: '分成收益\n(万元)',
    dataIndex: 'sharedProfits',
    align: 'center' as any,
    key: 'sharedProfits',
  },
  {
    title: '考核费用\n(万元)',
    dataIndex: 'assessmentFees',
    align: 'center' as any,
    key: 'assessmentFees',
  },
  {
    title: '分摊比例\n(%)',
    dataIndex: 'apportionmentRatio',
    align: 'center' as any,
    key: 'apportionmentRatio',
  },
  {
    title: '分摊费用\n(万元)',
    dataIndex: 'apportionedCosts',
    align: 'center' as any,
    key: 'apportionedCosts',
  },
  {
    title: '流程',
    dataIndex: 'isConfirm',
    align: 'center' as any,
    key: 'isConfirm',
    render: (text: any) => {
      return text === Number(1) ? '已确认' : '未确认'
    }
  },
];
// 结算管理模态框图options
export const settlementChartOptions = (modalDetailData: any) => {

  if (!modalDetailData) return false;

  const {settlementPrice, reviewPrice, evaluatedElectricity, effectiveAdjustedElectricity, actualAdjustedElectricity, xaxis} = modalDetailData;

  if (!settlementPrice && !reviewPrice && !evaluatedElectricity && !effectiveAdjustedElectricity && !actualAdjustedElectricity && !xaxis) return false;

  const xAxisData = xaxis.map((item: string) => {
    return item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1]
  })

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
    color: ['#39ffc5', '#0090ff', '#fb8d44', '#ffea00', '#b37fe9'],
    legend: {
      data: [
        '实际调节电量（kWh）',
        '有效调节电量（kWh）',
        '考核电量（kWh）',
        '结算价格（元/MWh）',
        '考核价格（元/MWh）',
      ],
      textStyle: {
        color: '#d7eaef',
      },
      top: 20,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
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
          color: '#8396ad',
          width: 0.5,
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#8396ad',
        },
      },
    },
    series: [
      {
        data: actualAdjustedElectricity,
        type: 'line',
        name: '实际调节电量（kWh）',
        smooth: true,
      },
      {
        data: effectiveAdjustedElectricity,
        type: 'line',
        name: '有效调节电量（kWh）',
        smooth: true,
      },
      {
        data: evaluatedElectricity,
        type: 'line',
        name: '考核电量（kWh）',
        smooth: true,
      },
      {
        data: settlementPrice,
        type: 'line',
        name: '结算价格（元/MWh）',
        smooth: true,
      },
      {
        data: reviewPrice,
        type: 'line',
        name: '考核价格（元/MWh）',
        smooth: true,
      },
    ],
  };
};
// 结算管理模态框---电量统计columns
export const electricityTableColumns = [
  {
    title: '时段',
    dataIndex: 'dateTime',
    align: 'center' as any,
    key: 'dateTime',
  },
  {
    title: '实际调节电量（kWh）',
    dataIndex: 'actualAdjustedElectricity',
    align: 'center' as any,
    key: 'actualAdjustedElectricity',
  },
  {
    title: '有效调节电量（kWh）',
    dataIndex: 'effectiveAdjustedElectricity',
    align: 'center' as any,
    key: 'effectiveAdjustedElectricity',
  },
  {
    title: '考核电量（kWh）',
    dataIndex: 'evaluatedElectricity',
    align: 'center' as any,
    key: 'evaluatedElectricity',
  },
  {
    title: '结算价格（元/MWh）',
    dataIndex: 'settlementPrice',
    align: 'center' as any,
    key: 'settlementPrice',
  },
  {
    title: '考核价格（元/MWh）',
    dataIndex: 'reviewPrice',
    align: 'center' as any,
    key: 'reviewPrice',
  },
]
// 结算管理模态框---电量统计表格数据
export const electricityTableData = (data: any) => {
  if (!data) return [];
  const {settlementPrice, reviewPrice, evaluatedElectricity, effectiveAdjustedElectricity, actualAdjustedElectricity, xaxis} = data;
  if (!settlementPrice && !reviewPrice && !evaluatedElectricity && !effectiveAdjustedElectricity && !actualAdjustedElectricity && !xaxis) return [];
  const tableData = xaxis.map((item: any, index: any) => {
    return {
      key: item,
      actualAdjustedElectricity: actualAdjustedElectricity[index],
      dateTime: item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1],
      effectiveAdjustedElectricity: effectiveAdjustedElectricity[index],
      evaluatedElectricity: evaluatedElectricity[index],
      reviewPrice: reviewPrice[index],
      settlementPrice: settlementPrice[index]
    }
  })
  return tableData;
}

// 计划分解详情
export const planDetailColumns: any = () => {
  return [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1, // 自动计算序号
      align: 'center',
    },
    {
      title: '资源商',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
    },
    {
      title: '资源商编号',
      dataIndex: 'invitationPlan',
      key: 'invitationPlan',
      align: 'center',
    },
    {
      title: '计划调节里程(MWh)',
      dataIndex: 'adjustableCapacity',
      key: 'adjustableCapacity',
      align: 'center',
    },
    {
      title: '日最大功率(MW)',
      dataIndex: 'declaredTransactionVolume',
      key: 'declaredTransactionVolume',
      align: 'center',
    },
    {
      title: '调节曲线',
      align: 'center',
      render: () => (
        <i className="iconfont" style={{ color: '#0084FF', cursor: 'pointer' }} onClick={() => {}}>
          &#xe63a;
        </i>
      ),
    },
    {
      title: '资源状态',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
    },
  ];
};

// 执行跟踪--- 实时运行功率图表options
export const dayPlanChartOptions = (data: any) => {
  if (!data) return false;

  const {baselineValueList, invitationAdjustmentList, invitationPlanList, realValueList, xaxis} = data;

  if (!baselineValueList && !invitationAdjustmentList && !invitationPlanList && !realValueList && !xaxis) return false;

  const xAxisData = xaxis.map((item: string) => {
    return item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1]
  })

  return {
    tooltip: {
      trigger: 'axis',
      // 图例过多被遮挡，强制超出显示
      appendToBody: true,
    },
    grid: {
      top: '14%',
      left: '3%',
      right: '4%',
      bottom: '6%',
      containLabel: true,
    },
    color: ['#39ffc5', '#0090ff', '#ffea00', '#fb8d44'],
    legend: {
      data: ['邀约计划（kW）', '实时（kW）', '邀约调节（kW）', '基线（kW）'],
      textStyle: {
        color: '#d7eaef',
      },
      top: 0,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
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
          color: '#8396ad',
          width: 0.5,
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#8396ad',
        },
      },
    },
    series: [
      {
        data: invitationPlanList,
        type: 'line',
        name: '邀约计划（kW）',
        smooth: true,
      },
      {
        data: realValueList,
        type: 'line',
        name: '实时（kW）',
        smooth: true,
      },
      {
        data: invitationAdjustmentList,
        type: 'line',
        name: '邀约调节（kW）',
        smooth: true,
      },
      {
        data: baselineValueList,
        type: 'line',
        name: '基线（kW）',
        smooth: true,
      },
    ],
  };
};

// 执行跟踪 --- 实时运行功率table columns
export const dayPlanTableColumns = [
  {
    title: '时段',
    dataIndex: 'dateTime',
    align: 'center' as any,
    key: 'dateTime',
  },
  {
    title: '邀约计划（kW）',
    dataIndex: 'invitationAdjustment',
    align: 'center' as any,
    key: 'invitationAdjustment',
  },
  {
    title: '实时（kW）',
    dataIndex: 'realTimeValue',
    align: 'center' as any,
    key: 'realTimeValue',
  },
  {
    title: '邀约调节（kW）',
    dataIndex: 'invitationPlan',
    align: 'center' as any,
    key: 'invitationPlan',
  },
  {
    title: '基线（kW）',
    dataIndex: 'baseline',
    align: 'center' as any,
    key: 'baseline',
  },
];

// 执行跟踪 --- 表格数据
export const dayPlanTableData = (data: any) => {

  if (!data) return [];

  const {baselineValueList, invitationAdjustmentList, invitationPlanList, realValueList, xaxis } = data;

  if (!baselineValueList && !invitationAdjustmentList && !invitationPlanList && !realValueList && !xaxis) return [];

  const tableData = xaxis.map((item: any, index: any) => {
    return {
      key: item,
      baseline: baselineValueList[index],
      dateTime: item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1],
      invitationPlan: invitationPlanList[index],
      realTimeValue: realValueList[index],
      invitationAdjustment: invitationAdjustmentList[index]
    }
  })
  return tableData;
}

// 执行跟踪 ---- 邀约资源商信息
export const sourceTableColumns = [
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
    title: '资源商',
    dataIndex: 'companyName',
    align: 'center' as any,
    key: 'companyName',
  },
  {
    title: '资源商编号',
    dataIndex: 'resourceProviderNum',
    align: 'center' as any,
    ellipsis: true,
    key: 'resourceProviderNum',
  },
  {
    title: '计划调节里程（MWh)',
    dataIndex: 'planAdjustmentMilestone',
    align: 'center' as any,
    key: 'planAdjustmentMilestone',
  },
  {
    title: '实际调节里程（MWh)',
    dataIndex: 'actualAdjustmentMilestone',
    align: 'center' as any,
    key: 'actualAdjustmentMilestone',
  },
  {
    title: '状态',
    dataIndex: 'onlineNum',
    align: 'center' as any,
    key: 'onlineNum',
    render: (text: any) => {
      return <Space>
        { text === 0 ? <Badge status="error" /> : <Badge status="success" />}
        { text === 0 ? <span style={{color: '#dc0303'}}>离线</span> : <span style={{color: '#49aa19'}}>在线</span> }
      </Space>
    }
  },
];

// 执行跟踪 --- 资源实时运行功率table columns
export const companyTableColumns = [
  {
    title: '时段',
    dataIndex: 'dateTime',
    align: 'center' as any,
    key: 'dateTime',
  },
  {
    title: '邀约计划（kW）',
    dataIndex: 'invitationAdjustment',
    align: 'center' as any,
    key: 'invitationAdjustment',
  },
  {
    title: '实时（kW）',
    dataIndex: 'realTimeValue',
    align: 'center' as any,
    key: 'realTimeValue',
  },
  {
    title: '邀约调节（kW）',
    dataIndex: 'invitationPlan',
    align: 'center' as any,
    key: 'invitationPlan',
  },
  {
    title: '基线（kW）',
    dataIndex: 'baseline',
    align: 'center' as any,
    key: 'baseline',
  },
];
// 执行跟踪 --- 资源实时运行功率图表 options
export const companyChartOptions = (companySourceData: any) => {
  if (!companySourceData) return false;

  const {baselineValueList, invitationAdjustmentList, invitationPlanList, realValueList, xaxis} = companySourceData;

  if (!baselineValueList && !invitationAdjustmentList && !invitationPlanList && !realValueList && !xaxis) return false;

  const xAxisData = xaxis.map((item: string) => {
    return item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1]
  })
  return {
    tooltip: {
      trigger: 'axis',
      // 图例过多被遮挡，强制超出显示
      appendToBody: true,
    },
    grid: {
      top: '14%',
      left: '3%',
      right: '4%',
      bottom: '6%',
      containLabel: true,
    },
    color: ['#39ffc5', '#0090ff', '#ffea00', '#fb8d44'],
    legend: {
      data: ['邀约计划（kW）', '实时（kW）', '邀约调节（kW）', '基线（kW）'],
      textStyle: {
        color: '#d7eaef',
      },
      top: 0,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
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
          color: '#8396ad',
          width: 0.5,
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#8396ad',
        },
      },
    },
    series: [
      {
        data: invitationPlanList,
        type: 'line',
        name: '邀约计划（kW）',
        smooth: true,
      },
      {
        data: realValueList,
        type: 'line',
        name: '实时（kW）',
        smooth: true,
      },
      {
        data: invitationAdjustmentList,
        type: 'line',
        name: '邀约调节（kW）',
        smooth: true,
      },
      {
        data: baselineValueList,
        type: 'line',
        name: '基线（kW）',
        smooth: true,
      },
    ],
  };
};

export const companyTableData = (data: any) => {
  if (!data) return [];

  const {baselineValueList, invitationAdjustmentList, invitationPlanList, realValueList, xaxis } = data;

  if (!baselineValueList && !invitationAdjustmentList && !invitationPlanList && !realValueList && !xaxis) return [];

  const tableData = xaxis.map((item: any, index: any) => {
    return {
      key: item,
      baseline: baselineValueList[index],
      dateTime: item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1],
      invitationPlan: invitationPlanList[index],
      realTimeValue: realValueList[index],
      invitationAdjustment: invitationAdjustmentList[index]
    }
  })
  return tableData;
}


// 交易调控计划管理 --- 图表optionss
export const responseChartOptions = () => {
  return {
    tooltip: {
      trigger: 'axis',
      // 图例过多被遮挡，强制超出显示
      appendToBody: true,
    },
    grid: {
      top: '14%',
      left: '3%',
      right: '4%',
      bottom: '6%',
      containLabel: true,
    },
    color: ['#39ffc5', '#0090ff', '#ffea00', '#fb8d44'],
    legend: {
      data: ['调节(kW)', '计划(kW)', '基线(kW)'],
      textStyle: {
        color: '#d7eaef',
      },
      top: 0,
    },
    xAxis: {
      type: 'category',
      data: [
        '00:00',
        '02:00',
        '04:00',
        '06:00',
        '08:00',
        '10:00',
        '12:00',
        '14:00',
        '16:00',
        '18:00',
        '20:00',
        '22:00',
        '24:00',
      ],
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
          color: '#8396ad',
          width: 0.5,
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#8396ad',
        },
      },
    },
    series: [
      {
        data: [110, 125, 160, 182, 658, 695, 457, 123, 855, 120, 565, 865],
        type: 'line',
        name: '调节(kW)',
        smooth: true,
      },
      {
        data: [355, 865, 965, 854, 435, 665, 522, 111, 666, 854, 125, 523],
        type: 'line',
        name: '计划(kW)',
        smooth: true,
      },
      {
        data: [265, 865, 965, 854, 223, 665, 855, 111, 666, 854, 125, 523],
        type: 'line',
        name: '基线(kW)',
        smooth: true,
      },
    ],
  };
};

// 交易调控计划管理 ---- table columns
export const responseTableColumns = [
  {
    title: '时段',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '调节（kW）',
    dataIndex: 'belongSubstation',
    align: 'center' as any,
    key: 'belongSubstation',
  },
  {
    title: '计划（kW）',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '基线（kW）',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
];

// 交易调控计划管理 --- 计划分解详情
export const responseDetalTableColumns = [
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
    title: '资源商',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '资源商编号',
    dataIndex: 'belongSubstation',
    align: 'center' as any,
    key: 'belongSubstation',
  },
  {
    title: '计划调节里程(MWh)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '日最大功率(MW)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '调节曲线',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '资源状态',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
];
