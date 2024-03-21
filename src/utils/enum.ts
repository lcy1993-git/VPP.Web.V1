// 表单下拉框枚举值--- 事项状态
export const EVENTTYPES = [
  {
    label: '动作',
    value: 0,
  },
  {
    label: '复位',
    value: 1,
  },
  {
    label: '全部',
    value: '',
  },
];
// 告警等级
export const ALARMLEVEL = [
  { value: 1, label: '一级告警' },
  { value: 2, label: '二级告警' },
  { value: 3, label: '三级告警' },
  { value: 4, label: '预警' },
];

// 告警对应的颜色和文字
export const ALARMCOLORANDSCRIPT = [
  { color: '', script: '' },
  { color: '#FF0F00', script: '一级告警' },
  { color: '#FF7800', script: '二级告警' },
  { color: '#FFDE00', script: '三级告警' },
  { color: '#09b1ff', script: '预警' },
];

// 实时告警事项状态对应的颜色和文字
export const EVENTSTATUSCOLORANDSCRIPT = [
  { color: '#00FF96', script: '复位' },
  { color: '#FF0F00', script: '动作' },
];

// 处理状态
export const DEALSTATUS = [
  { value: 0, label: '未处理' },
  { value: 1, label: '已处理' },
];

// 站点设备类型
export const SUBSTASIONDEVICETYPE = [
  // { label: '电池簇', value: 'cluster', code: 104 },
  { label: '逆变器', value: 'inverter', code: 27 },
  { label: 'PCS', value: 'PCS', code: 108 },
  { label: 'BMS', value: 'BMS', code: 115 },
  { label: '直流充电桩', value: 'DC', code: 41 },
  { label: '交流充电桩', value: 'AC', code: 40 },
];
