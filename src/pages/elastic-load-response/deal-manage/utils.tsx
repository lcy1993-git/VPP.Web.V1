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

// 出清明细
export const clearingDetailColumns: any = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (_: any, __: any, index: number) => index + 1, // 自动计算序号
    align: 'center',
  },
  {
    title: '中标主体',
    dataIndex: 'winningBidder',
    key: 'winningBidder',
    align: 'center',
  },
  {
    title: '中标时段',
    dataIndex: 'winningBidPeriod',
    key: 'winningBidPeriod',
    align: 'center',
  },
  {
    title: '中标容量(MW)',
    dataIndex: 'winningBidCapacity',
    key: 'winningBidCapacity',
    align: 'center',
  },
  {
    title: '中标价格(MW)',
    dataIndex: 'winningBidPrice',
    key: 'winningBidPrice',
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
export const declarationInfoColumns: any = (
  setModalType: Dispatch<SetStateAction<any>>,
  setOpen: Dispatch<SetStateAction<any>>,
  setModalId: Dispatch<SetStateAction<any>>,
) => {
  return [
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
      dataIndex: 'identificationNum',
      key: 'identificationNum',
      align: 'center',
    },
    {
      title: '运行日',
      dataIndex: 'runningDay',
      key: 'runningDay',
      align: 'center',
    },
    {
      title: '可调容量(MW)',
      dataIndex: 'dispatchCapacity',
      key: 'dispatchCapacity',
      align: 'center',
    },
    {
      title: '申报交易量(MWh)',
      dataIndex: 'declaredTradingVolume',
      key: 'declaredTradingVolume',
      align: 'center',
    },
    {
      title: '申报均价(元/MWh)',
      dataIndex: 'declaredAveragePrice',
      key: 'declaredAveragePrice',
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
      width: 120,
      key: 'status',
      render: (text: any) => {
        const status: any = { 1: '编制中', 2: '已申报' };
        const statusColors: any = { 1: '#FFD800', 2: '#01FF73' };
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
      render: (text: any) => {
        return text.status === 1 ? (
          <Space>
            <Button
              size="small"
              onClick={() => {
                setModalType('declare');
                setOpen(true);
                setModalId([text.identificationNum]);
              }}
            >
              申报
            </Button>
            <Button
              size="small"
              onClick={() => {
                setModalId([text.identificationNum]);
                setModalType('delete');
                setOpen(true);
              }}
            >
              删除
            </Button>
          </Space>
        ) : (
          <Button
            size="small"
            onClick={() => {
              setModalId([text.identificationNum]);
              setModalType('cancel');
              setOpen(true);
            }}
          >
            撤销
          </Button>
        );
      },
    },
  ];
};

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
        name: '调节',
        data: data?.regulateValueList,
        type: 'line',
        smooth: true,
      },
      {
        name: '计划',
        data: data?.planValueList,
        type: 'line',
        smooth: true,
      },
      {
        name: '基线',
        data: data?.baselineValueList,
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
    dataIndex: 'baseline',
    key: 'baseline',
    align: 'center',
    sorter: (a: any, b: any) => a.demandCapacity - b.demandCapacity,
    sortDirections: ['descend', 'ascend'],
  },
];

// 申报详情表格-代理用户
export const userDetailColumns: any = (
  setUserModalOpen: Dispatch<SetStateAction<any>>,
  setInfo: Dispatch<SetStateAction<any>>,
  setModalType: Dispatch<SetStateAction<any>>,
  setOpen: Dispatch<SetStateAction<any>>,
  setModalId: Dispatch<SetStateAction<any>>,
) => {
  // 曲线icon
  const curveIcon = (record: any, isCapacity: boolean) => {
    return (
      <i
        className="iconfont"
        style={{ color: '#0084FF', cursor: 'pointer' }}
        onClick={() => {
          setUserModalOpen(true);
          const info: any = {
            substationCode: record.substationCode,
            identificationNum: record.identificationNum,
          };
          info.type = isCapacity ? 1 : 2;
          setInfo(info);
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
      dataIndex: 'substationName',
      key: 'substationName',
      align: 'center',
    },
    {
      title: '邀约计划',
      dataIndex: 'identificationNum',
      key: 'identificationNum',
      align: 'center',
    },
    {
      title: '可调容量(MW)',
      dataIndex: 'dispatchCapacity',
      key: 'dispatchCapacity',
      align: 'center',
    },
    {
      title: '申报交易量(MWh)',
      dataIndex: 'declaredTradingVolume',
      key: 'declaredTradingVolume',
      align: 'center',
    },
    {
      title: '申报容量曲线',
      align: 'center',
      render: (record: any) => curveIcon(record, true),
    },
    {
      title: '申报价格曲线',
      align: 'center',
      render: (record: any) => curveIcon(record, false),
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
      render: (text: any) => {
        return (
          <Space>
            <Button size="small">编辑</Button>
            <Button
              size="small"
              onClick={() => {
                setModalId([text.identificationNum]);
                setModalType('userDelete');
                setOpen(true);
              }}
            >
              删除
            </Button>
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
        name: '容量',
        data: data?.valueList,
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
      data: data?.xaxis,
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
        data: data?.valueList,
        type: 'line',
        smooth: true,
      },
    ],
  };
};

// 申报容量columns
export const capacityColumns: any = (isCapacity: boolean) => {
  return [
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
      title: isCapacity ? '容量(kW)' : '价格(元)',
      dataIndex: 'value',
      key: 'value',
      align: 'center',
    },
  ];
};

// 出清结果
export const clearingResultColumns: any = (
  setClearingVisible: Dispatch<SetStateAction<any>>,
  setClearingId: Dispatch<SetStateAction<any>>,
) => {
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
      dataIndex: 'identificationNum',
      key: 'identificationNum',
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
      dataIndex: 'responseType',
      key: 'responseType',
      align: 'center',
      render: (text: any) => {
        const res = ['削峰响应', '填谷响应'];
        return res[text];
      },
    },
    {
      title: '申报交易量(MWh)',
      dataIndex: 'declaredTradingVolume',
      key: 'declaredTradingVolume',
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
      dataIndex: 'participatingUsers',
      key: 'participatingUsers',
      align: 'center',
    },
    {
      title: '预估收益(元)',
      dataIndex: 'estimatedEarnings',
      key: 'estimatedEarnings',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: any) => {
        const status = ['未中标', '中标'];
        const statusColors = ['#01FF73', '#FFD800'];
        return <ColorCircleScript color={statusColors[text]} script={status[text]} />;
      },
      align: 'center',
    },
    {
      title: '操作',
      align: 'center' as any,
      render: (record: any) => {
        return (
          <Button
            size="small"
            onClick={() => {
              setClearingVisible(true);
              setClearingId(record.identificationNum);
            }}
          >
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
        name: '调节',
        data: data?.regulateValueList,
        type: 'line',
        smooth: true,
      },
      {
        name: '计划',
        data: data?.planValueList,
        type: 'line',
        smooth: true,
      },
      {
        name: '基线',
        data: data?.baselineValueList,
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
        name: '价格',
        data: data?.valueList,
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
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '设备名称',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '用户编号',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '计划电量\n(MWh)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '实际电量\n(MWh)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '结算电量\n(MW)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '偏差考核电量\n(MW)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '平均结算电价(元/MWh)',
    dataIndex: 'index',
    align: 'center' as any,
    width: 100,
    key: 'index',
  },
  {
    title: '结算费用\n(万元)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '分成比例\n(%)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '分成收益\n(万元)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '考核费用\n(万元)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '分摊比例\n(%)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '分摊费用\n(万元)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '流程',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
];
// 结算管理模态框图options
export const settlementChartOptions = () => {
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
        name: '实际调节电量（kWh）',
        smooth: true,
      },
      {
        data: [355, 865, 965, 854, 435, 665, 522, 111, 666, 854, 125, 523],
        type: 'line',
        name: '有效调节电量（kWh）',
        smooth: true,
      },
      {
        data: [745, 865, 965, 854, 335, 665, 656, 111, 666, 854, 125, 523],
        type: 'line',
        name: '考核电量（kWh）',
        smooth: true,
      },
      {
        data: [265, 865, 965, 854, 223, 665, 855, 111, 666, 854, 125, 523],
        type: 'line',
        name: '结算价格（元/MWh）',
        smooth: true,
      },
      {
        data: [654, 111, 523, 854, 223, 552, 855, 111, 985, 666, 122, 421],
        type: 'line',
        name: '考核价格（元/MWh）',
        smooth: true,
      },
    ],
  };
};

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
export const dayPlanChartOptions = () => {
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
        name: '邀约计划（kW）',
        smooth: true,
      },
      {
        data: [355, 865, 965, 854, 435, 665, 522, 111, 666, 854, 125, 523],
        type: 'line',
        name: '实时（kW）',
        smooth: true,
      },
      {
        data: [745, 865, 965, 854, 335, 665, 656, 111, 666, 854, 125, 523],
        type: 'line',
        name: '邀约调节（kW）',
        smooth: true,
      },
      {
        data: [265, 865, 965, 854, 223, 665, 855, 111, 666, 854, 125, 523],
        type: 'line',
        name: '基线（kW）',
        smooth: true,
      },
    ],
  };
};

// 执行更正--- 实时运行功率table columns
export const dayPlanTableColumns = [
  {
    title: '时段',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '邀约计划（kW）',
    dataIndex: 'belongSubstation',
    align: 'center' as any,
    key: 'belongSubstation',
  },
  {
    title: '实时（kW）',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '邀约调节（kW）',
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
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '资源商编号',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '计划调节里程（MWh)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '实际调节里程（MWh)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '状态',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
];

// 执行跟踪 --- 资源实时运行功率table columns
export const companyTableColumns = [
  {
    title: '时段',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '邀约计划（kW）',
    dataIndex: 'belongSubstation',
    align: 'center' as any,
    key: 'belongSubstation',
  },
  {
    title: '实时（kW）',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '邀约调节（kW）',
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
// 执行跟踪 --- 资源实时运行功率图表 options
export const companyChartOptions = () => {
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
        name: '邀约计划（kW）',
        smooth: true,
      },
      {
        data: [355, 865, 965, 854, 435, 665, 522, 111, 666, 854, 125, 523],
        type: 'line',
        name: '实时（kW）',
        smooth: true,
      },
      {
        data: [745, 865, 965, 854, 335, 665, 656, 111, 666, 854, 125, 523],
        type: 'line',
        name: '邀约调节（kW）',
        smooth: true,
      },
      {
        data: [265, 865, 965, 854, 223, 665, 855, 111, 666, 854, 125, 523],
        type: 'line',
        name: '基线（kW）',
        smooth: true,
      },
    ],
  };
};

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

// 辅助服务
export const supportOptions = (data: any) => {
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
      top: '8%',
      left: '4%',
      right: '4%',
      bottom: '4%',
      containLabel: true,
    },
    color: ['#D70303', '#2C88B6'],
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
        name: '上调',
        data: data?.upwardList,
        type: 'line',
        smooth: true,
      },
      {
        name: '下调',
        data: data?.downwardList,
        type: 'line',
        smooth: true,
      },
    ],
  };
};

// 辅助服务
export const supportColumns = [
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
    title: '中标时段',
    dataIndex: 'timePeriod',
    align: 'center' as any,
    key: 'timePeriod',
  },
  {
    title: '上调(kW)',
    dataIndex: 'up',
    align: 'center' as any,
    key: 'up',
  },
  {
    title: '下调(kW)',
    dataIndex: 'down',
    align: 'center' as any,
    key: 'down',
  },
];

// 新增交易申报
export const addDeclarationColumns = [
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
    title: '响应时段起点',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '响应时段终点',
    dataIndex: 'belongSubstation',
    align: 'center' as any,
    key: 'belongSubstation',
  },
  {
    title: '基线负荷(MW)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '申报容量(MW)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
  {
    title: '申报价格(元/MWh)',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
  },
];
