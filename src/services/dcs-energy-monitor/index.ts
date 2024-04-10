import { request } from '@umijs/max';

// 根据电站类型查询用户所属电站 52光伏，53储能，54充电
export const getSubstation = (type: string) => {
  return request(`/api/distributed/monitor/substation`, {
    method: 'get',
    params: { type: type === '光伏' ? 52 : type === '储能' ? 53 : 54 },
  });
};

// 分布式能源总览-充电
export const getChargeOverview = (date: string) => {
  return request(`/api/distributed/monitor/charge/overview`, {
    method: 'get',
    params: { date },
  });
};

// 分布式能源总览-储能
export const getEssOverview = (date: string) => {
  return request(`/api/distributed/monitor/ess/overview`, {
    method: 'get',
    params: { date },
  });
};

// 分布式能源总览-光伏
export const getSolarOverview = (date: string) => {
  return request(`/api/distributed/monitor/solar/overview`, {
    method: 'get',
    params: { date },
  });
};

// 单个-分布式能源总览-充电
export const getSingleChargeOverview = (date: string, substationCode: string) => {
  return request(`/api/distributed/monitor/charge/overview/single`, {
    method: 'get',
    params: { date, substationCode },
  });
};

// 单个-分布式能源总览-储能
export const getSingleEssOverview = (date: string, substationCode: string) => {
  return request(`/api/distributed/monitor/ess/overview/single`, {
    method: 'get',
    params: { date, substationCode },
  });
};

// 单个-分布式能源总览-光伏
export const getSingleSolarOverview = (date: string, substationCode: string) => {
  return request(`/api/distributed/monitor/solar/overview/single`, {
    method: 'get',
    params: { date, substationCode },
  });
};

// 设备在线率
export const getOnline = () => {
  return request(`/api/distributed/monitor/online`, {
    method: 'get',
  });
};

// TODO status未定
// 逆变器概览
export const getInverterOverview = (status: string, substationCode: string) => {
  return request(`/api/distributed/monitor/inverter/overview`, {
    method: 'get',
    params: { status: status === '全部' ? null : status === '运行' ? 2 : 1, substationCode },
  });
};

// BMS概览
export const getBMSOverview = (status: string, substationCode: string) => {
  return request(`/api/distributed/monitor/bms/overview`, {
    method: 'get',
    params: { status: status === '全部' ? null : status === '运行' ? 2 : 1, substationCode },
  });
};

// 充电桩概览
export const getChargePileOverview = (type: string, substationCode: string) => {
  return request(`/api/distributed/monitor/charge/pile/overview`, {
    method: 'get',
    params: {
      type: type === '全部' ? null : type === '直流充电桩' ? 41 : 40,
      substationCode,
    },
  });
};

// Pcs概览
export const getPCSOverview = (status: string, substationCode: string) => {
  return request(`/api/distributed/monitor/pcs/overview`, {
    method: 'get',
    params: { status: status === '全部' ? null : status === '运行' ? 2 : 1, substationCode },
  });
};
