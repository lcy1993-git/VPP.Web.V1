import ColorCircleScript from '@/components/color-circle-script';
import { handleDiffMins } from '@/utils/common';
import { Badge, Button, Space } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
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
  setAddDeclarationOpen: Dispatch<SetStateAction<any>>,
  setAddDeclarationInfo: Dispatch<SetStateAction<any>>,
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
            <Button
              size="small"
              onClick={() => {
                setAddDeclarationOpen(true);
                setAddDeclarationInfo({
                  isEdit: true,
                  identificationNum: text.identificationNum,
                  substationCode: text.substationCode,
                });
              }}
            >
              编辑
            </Button>
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
      title: '响应类型',
      dataIndex: 'responseType',
      key: 'responseType',
      align: 'center',
      render: (text: any) => {
        const res = ['削峰响应', '填谷响应'];
        return res[text];
      },
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
    dataIndex: 'id',
    align: 'center' as any,
    key: 'id',
  },
  {
    title: '合同名称',
    align: 'center' as any,
    dataIndex: 'contractName',
    key: 'contractName',
  },
  {
    align: 'center' as any,
    title: '合同类型',
    dataIndex: 'contractType',
    key: 'contractType',
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
    render: (text: any) => {
      return Number(text) === 1 ? '电网结算合同' : '需求响应代理合同';
    },
  },
  {
    align: 'center' as any,
    title: '结算方式',
    dataIndex: 'settlementMethod',
    key: 'settlementMethod',
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
    render: (text: any) => {
      return Number(text) === 1 ? '电网结算' : '收益与考核比例结算';
    },
  },
  {
    title: '签订对象',
    dataIndex: 'contractingParty',
    align: 'center' as any,
    key: 'contractingParty',
    // filters: [
    //   {
    //     text: '收益与考核比例结算',
    //     value: '1',
    //   },
    //   {
    //     text: '电网结算',
    //     value: '2',
    //   },
    // ],
    // onFilter: (value: any, record: any) => record.address.startsWith(value as string),
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    align: 'center' as any,
    key: 'startTime',
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    align: 'center' as any,
    key: 'endTime',
  },
  {
    title: '状态',
    align: 'center' as any,
    dataIndex: 'status',
    key: 'status',
    render: (text: any) => {
      return (
        <Space>
          {Number(text) === 1 ? <Badge status="success" /> : <Badge status="error" />}
          {Number(text) === 1 ? (
            <span style={{ color: '#49aa19' }}>有效</span>
          ) : (
            <span style={{ color: '#dc0303' }}>到期</span>
          )}
        </Space>
      );
    },
  },
];

// 合同管理新增模态框表格
export const addTableColumns = [
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
    dataIndex: 'contractNum',
    align: 'center' as any,
    key: 'contractNum',
  },
  {
    title: '合同名称',
    dataIndex: 'contractName',
    align: 'center' as any,
    key: 'contractName',
  },
  {
    title: '合同类型',
    dataIndex: 'contractType',
    align: 'center' as any,
    key: 'contractType',
    render: (text: number) => {
      return text === 0 ? <span>需求响应代理合同</span> : <span>电网结算合同</span>;
    },
  },
  {
    title: '结算方式',
    dataIndex: 'settlementMethod',
    align: 'center' as any,
    key: 'settlementMethod',
    render: (text: number) => {
      return text === 0 ? <span>收益与考核比例结算</span> : <span>电网结算</span>;
    },
  },
  {
    title: '签订对象',
    dataIndex: 'contractingParty',
    align: 'center' as any,
    key: 'contractingParty',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    align: 'center' as any,
    key: 'startTime',
    render: (text: any) => {
      return <span>{dayjs(text).format('YYYY-MM-DD')}</span>;
    },
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    align: 'center' as any,
    key: 'endTime',
    render: (text: any) => {
      return <span>{dayjs(text).format('YYYY-MM-DD')}</span>;
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
      return text === Number(1) ? '已确认' : '未确认';
    },
  },
];
// 结算管理模态框图options
export const settlementChartOptions = (modalDetailData: any) => {
  if (!modalDetailData) return false;

  const {
    settlementPrice,
    reviewPrice,
    evaluatedElectricity,
    effectiveAdjustedElectricity,
    actualAdjustedElectricity,
    xaxis,
  } = modalDetailData;

  if (
    !settlementPrice &&
    !reviewPrice &&
    !evaluatedElectricity &&
    !effectiveAdjustedElectricity &&
    !actualAdjustedElectricity &&
    !xaxis
  )
    return false;

  const xAxisData = xaxis.map((item: string) => {
    return item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1];
  });

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
];
// 结算管理模态框---电量统计表格数据
export const electricityTableData = (data: any) => {
  if (!data) return [];
  const {
    settlementPrice,
    reviewPrice,
    evaluatedElectricity,
    effectiveAdjustedElectricity,
    actualAdjustedElectricity,
    xaxis,
  } = data;
  if (
    !settlementPrice &&
    !reviewPrice &&
    !evaluatedElectricity &&
    !effectiveAdjustedElectricity &&
    !actualAdjustedElectricity &&
    !xaxis
  )
    return [];
  const tableData = xaxis.map((item: any, index: any) => {
    return {
      key: item,
      actualAdjustedElectricity: actualAdjustedElectricity[index],
      dateTime: item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1],
      effectiveAdjustedElectricity: effectiveAdjustedElectricity[index],
      evaluatedElectricity: evaluatedElectricity[index],
      reviewPrice: reviewPrice[index],
      settlementPrice: settlementPrice[index],
    };
  });
  return tableData;
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
export const dayPlanChartOptions = (data: any) => {
  if (!data) return false;

  const { baselineValueList, invitationAdjustmentList, invitationPlanList, realValueList, xaxis } =
    data;

  if (
    !baselineValueList &&
    !invitationAdjustmentList &&
    !invitationPlanList &&
    !realValueList &&
    !xaxis
  )
    return false;

  const xAxisData = xaxis.map((item: string) => {
    return item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1];
  });

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
        data: realValueList.slice(
          0,
          handleDiffMins(
            new Date(),
            new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            60,
          ) + 1,
        ),
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

  const { baselineValueList, invitationAdjustmentList, invitationPlanList, realValueList, xaxis } =
    data;

  if (
    !baselineValueList &&
    !invitationAdjustmentList &&
    !invitationPlanList &&
    !realValueList &&
    !xaxis
  )
    return [];

  const tableData = xaxis.map((item: any, index: any) => {
    return {
      key: item,
      baseline: baselineValueList[index],
      dateTime: item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1],
      invitationPlan: invitationPlanList[index],
      realTimeValue: realValueList[index],
      invitationAdjustment: invitationAdjustmentList[index],
    };
  });
  return tableData;
};

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
      return (
        <Space>
          {text === 0 ? <Badge status="error" /> : <Badge status="success" />}
          {text === 0 ? (
            <span style={{ color: '#dc0303' }}>离线</span>
          ) : (
            <span style={{ color: '#49aa19' }}>在线</span>
          )}
        </Space>
      );
    },
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

  const { baselineValueList, invitationAdjustmentList, invitationPlanList, realValueList, xaxis } =
    companySourceData;

  if (
    !baselineValueList &&
    !invitationAdjustmentList &&
    !invitationPlanList &&
    !realValueList &&
    !xaxis
  )
    return false;

  const xAxisData = xaxis.map((item: string) => {
    return item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1];
  });
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
        data: realValueList.slice(
          0,
          handleDiffMins(
            new Date(),
            new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            60,
          ) + 1,
        ),
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

  const { baselineValueList, invitationAdjustmentList, invitationPlanList, realValueList, xaxis } =
    data;

  if (
    !baselineValueList &&
    !invitationAdjustmentList &&
    !invitationPlanList &&
    !realValueList &&
    !xaxis
  )
    return [];

  const tableData = xaxis.map((item: any, index: any) => {
    return {
      key: item,
      baseline: baselineValueList[index],
      dateTime: item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1],
      invitationPlan: invitationPlanList[index],
      realTimeValue: realValueList[index],
      invitationAdjustment: invitationAdjustmentList[index],
    };
  });
  return tableData;
};

// 交易调控计划管理 --- 图表optionss
export const responseChartOptions = (responsePlanData: any) => {
  if (!responsePlanData) return false;

  const { baselineValueList, planValueList, regulateValueList, xaxis } = responsePlanData;

  if (!baselineValueList && !planValueList && !regulateValueList && !xaxis) return false;

  const xAxisData = xaxis.map((item: string) => {
    return item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1];
  });

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
        data: regulateValueList,
        type: 'line',
        name: '调节(kW)',
        smooth: true,
      },
      {
        data: planValueList,
        type: 'line',
        name: '计划(kW)',
        smooth: true,
      },
      {
        data: baselineValueList,
        type: 'line',
        name: '基线(kW)',
        smooth: true,
      },
    ],
  };
};

export const responseTableData = (data: any) => {
  if (!data) return [];
  const { baselineValueList, planValueList, regulateValueList, xaxis } = data;

  if (!baselineValueList && !planValueList && !regulateValueList && !xaxis) return [];

  const tableData = xaxis.map((item: any, index: any) => {
    return {
      key: item,
      baselineValueList: baselineValueList[index],
      dateTime: item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1],
      planValueList: planValueList[index],
      regulateValueList: regulateValueList[index],
    };
  });
  return tableData;
};

// 交易调控计划管理 --- 表格数据
export const responsePlanTableData = (data: any) => {
  if (!data) return [];

  const { baselineValueList, planValueList, regulateValueList, xaxis } = data;

  if (!baselineValueList && !planValueList && !regulateValueList && !xaxis) return [];

  const tableData = xaxis.map((item: any, index: any) => {
    return {
      key: item,
      baselineValueList: baselineValueList[index],
      dateTime: item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1],
      planValueList: planValueList[index],
      regulateValueList: regulateValueList[index],
    };
  });
  return tableData;
};

// 交易调控计划管理 ---- table columns
export const responseTableColumns = [
  {
    title: '时段',
    dataIndex: 'dateTime',
    align: 'center' as any,
    key: 'dateTime',
  },
  {
    title: '调节（kW）',
    dataIndex: 'regulateValueList',
    align: 'center' as any,
    key: 'regulateValueList',
  },
  {
    title: '计划（kW）',
    dataIndex: 'planValueList',
    align: 'center' as any,
    key: 'planValueList',
  },
  {
    title: '基线（kW）',
    dataIndex: 'baselineValueList',
    align: 'center' as any,
    key: 'baselineValueList',
  },
];

// 交易调控计划管理 --- 计划分解详情
export const responseDetalColumns = [
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
    title: '计划调节里程(MWh)',
    dataIndex: 'planAdjustmentMilestone',
    align: 'center' as any,
    key: 'planAdjustmentMilestone',
  },
  {
    title: '日最大功率(MW)',
    dataIndex: 'dailyMaximumPower',
    align: 'center' as any,
    key: 'dailyMaximumPower',
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

// 可调节
export const adjustableOptions = (data: any) => {
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
      appendToBody: true,
    },
    grid: {
      top: '14%',
      left: '4%',
      right: '4%',
      bottom: '18%',
      containLabel: true,
    },
    color: ['#39FFC5', '#0090FF', '#B37FE9', '#FB8D44', '#FFEA00'],
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
        name: '发电预测',
        data: data?.powerGenerationForecastingList,
        type: 'line',
        smooth: true,
      },
      {
        name: '负荷预测',
        data: data?.loadForecastingList,
        type: 'line',
        smooth: true,
      },
      {
        name: '储能放电计划',
        data: data?.energyStorageDischargePredictionList,
        type: 'line',
        smooth: true,
      },
      {
        name: '基线负荷',
        data: data?.baselineLoadList,
        type: 'line',
        smooth: true,
      },
      {
        name: '可调节容量',
        data: data?.adjustableCapacityList,
        type: 'line',
        smooth: true,
      },
    ],
  };
};

// 可调节
export const adjustableColumns = [
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
    title: '时段',
    dataIndex: 'timePeriod',
    align: 'center' as any,
    key: 'timePeriod',
  },
  {
    title: '发电预测(kW)',
    dataIndex: 'powerGenerationForecasting',
    align: 'center' as any,
    key: 'powerGenerationForecasting',
  },
  {
    title: '负荷预测(kW)',
    dataIndex: 'loadForecasting',
    align: 'center' as any,
    key: 'loadForecasting',
  },
  {
    title: '储能放电计划(kW)',
    dataIndex: 'energyStorageDischargePrediction',
    align: 'center' as any,
    key: 'energyStorageDischargePrediction',
  },
  {
    title: '基线负荷(kW)',
    dataIndex: 'baselineLoad',
    align: 'center' as any,
    key: 'baselineLoad',
  },
  {
    title: '可调节容量(kW)',
    dataIndex: 'adjustableCapacity',
    align: 'center' as any,
    key: 'adjustableCapacity',
  },
];
