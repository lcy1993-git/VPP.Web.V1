import { Button, Space } from 'antd';
// 计划信息数据类型
export interface planInfoType {
  dayAheadPlanned: string; // 日前计划里程
  endTime: string // 计划结束时间
  expectedRevenue: string // 预计收益
  identificationNum: string // 计划编号
  numParticipatingUsers: number; // 参与用户数量
  powerDeviation: string // 功率偏差
  realTimeCompleted: string // 实时完成里程
  startTime: string // 计划开始时间
}

// 计划执行情况数据类型
export interface executionStatusDataType {
  baseline: string[];
  invitationAdjustment: string[]; // 邀约调节
  invitationPlan: string[]; // 邀约计划值
  maxPower: string; // 最大功率
  minPower: string; // 最小功率
  realPower: string; // 实时功率
  realTimeValue: string[];
  xaxis: string[];
}


export const statusticsChart = (hisStatisticData: any) => {

  if (!hisStatisticData) {
    return;
  }

  const { dayAheadPeakShaving, realTimePeakShaving, dayAheadValleyFilling, uninvited, totalInvited  } = hisStatisticData;

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
      data: ['日前削峰响应', '实时削峰响应', '日前填谷响应', '未应邀'],
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
        minAngle: 10,
        labelLine: {
          show: true,
          position: 'outside',
          length: 10,
          length2: 100,
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
              const proporttion = ((Number(d.value) / totalInvited) * 100).toFixed(2).toString();
              return `${d.name}\n\n${proporttion}%`;
            },
          },
        },
        data: [
          { value: dayAheadPeakShaving || 0, name: '日前削峰响应' },
          { value: realTimePeakShaving || 0, name: '实时削峰响应' },
          { value: dayAheadValleyFilling || 0, name: '日前填谷响应' },
          { value: uninvited || 0, name: '未应邀' },
        ],
      },
    ],
  };
};

// 执行情况 -- 曲线options
export const planChartOptions = (executionStatusData: executionStatusDataType | null) => {
  if (!executionStatusData) {
    return false;
  }

  const {baseline, invitationAdjustment, invitationPlan, realTimeValue, xaxis } = executionStatusData;

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
      data: xAxisData,
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
        data: invitationPlan,
        type: 'line',
        name: '邀约计划',
        smooth: true
      },
      {
        data: realTimeValue,
        type: 'line',
        name: '实时',
        smooth: true
      },
      {
        data: invitationAdjustment,
        type: 'line',
        name: '邀约调节',
        smooth: true
      },
      {
        data: baseline,
        type: 'line',
        name: '基线',
        smooth: true
      },
    ],
  }
}

// 执行情况表格columns
export const executionStatusTableColumns = [
  {
    title: '时段',
    dataIndex: 'dateTime',
    align: 'center' as any,
    key: 'dateTime',
    sorter: (a: any ,b: any ) => {
      return Number(a.key.split(' ')[1].split(':')[0]) - Number(b.key.split(' ')[1].split(':')[0])
    },
  },
  {
    title: '邀约计划(kW)',
    dataIndex: 'invitationPlan',
    align: 'center' as any,
    key: 'invitationPlan',
    sorter: (a: any ,b: any ) => {
      return Number(a.invitationPlan) - Number(b.invitationPlan)
    },
  },
  {
    title: '实时值(kW)',
    dataIndex: 'realTimeValue',
    align: 'center' as any,
    key: 'realTimeValue',
    sorter: (a: any ,b: any ) => {
      return Number(a.realTimeValue) - Number(b.realTimeValue)
    },
  },
  {
    title: '邀约调节(kW)',
    dataIndex: 'invitationAdjustment',
    align: 'center' as any,
    key: 'invitationAdjustment',
    sorter: (a: any ,b: any ) => {
      return Number(a.invitationAdjustment) - Number(b.invitationAdjustment)
    },
  },
  {
    title: '基线(kW)',
    dataIndex: 'baseline',
    align: 'center' as any,
    key: 'baseline',
    sorter: (a: any ,b: any ) => {
      return Number(a.baseline) - Number(b.baseline)
    },
  },
]

// 执行情况表格数据处理
export const executionStatusDataSource = (executionStatusData: executionStatusDataType | null) => {
  if (!executionStatusData) {
    return [];
  }

  const {baseline, invitationAdjustment, invitationPlan, realTimeValue, xaxis } = executionStatusData;

  const tableData = xaxis.map((item, index) => {
    return {
      key: item,
      baseline: baseline[index],
      dateTime: item.split(' ')[1].split(':')[0] + ':' + item.split(' ')[1].split(':')[1],
      invitationPlan: invitationPlan[index],
      realTimeValue: realTimeValue[index],
      invitationAdjustment: invitationAdjustment[index]
    }
  })
  return tableData;
}

// 告警信息 columns
export const alarmTableColumns = [
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
    title: '告警等级',
    dataIndex: 'level',
    align: 'center' as any,
    key: 'level',
    render: (text: any) => {
      const levelLabel = ['一级告警','二级告警','三级告警']
      const levelColor = ['#FF0000', '#FF6B12', '#FFD800']
      return <Space>
        <i className='iconfont' style={{color: levelColor[text - 1]}}>&#xea77;</i>
        <span  style={{color: levelColor[text - 1]}}>{levelLabel[text - 1]}</span>
      </Space>;
    },
  },
  {
    title: '公司名称',
    dataIndex: 'companyName',
    align: 'center' as any,
    key: 'companyName',
  },
  {
    title: '告警时间',
    dataIndex: 'time',
    align: 'center' as any,
    key: 'time',
  },

  {
    title: '告警详情',
    dataIndex: 'index',
    align: 'center' as any,
    key: 'index',
    render: (_text: any, record: any) => {
      return `${record.companyName}公司：响应偏差率${record.variationAmount}, ${record.variationContent}`
    }
  },
]
