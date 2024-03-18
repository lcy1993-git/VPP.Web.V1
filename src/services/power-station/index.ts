import { request } from '@umijs/max';

// 获取当前用户的站点信息  52为光伏、53为储能
export const getSubstation = (siteType: 52 | 53) => {
  return request(`/api/substationInformation/getSubstationsByType`, {
    method: 'GET',
    params: { type: siteType },
  });
};

// 获取当前用户某一类型的电站列表
export const getSubstationsByType = (type: number) => {
  return request(`/api/substationInformation/getSubstationsByType`, {
    method: 'GET',
    params: { type },
  });
};

/** 光伏电站 header  数据统计 */
export const getSolarHeadInfoStatistics = (substationCode: string) => {
  return request(`/api/solar/substation/statistic`, {
    method: 'GET',
    params: { substationCode },
  });
};

// 功率及等效小时数
export const getPowerAndEquivalent = (substationCode: string) => {
  return request(`/api/solar/substation/circularGraph`, {
    method: 'GET',
    params: { substationCode },
  });
};

// 发电量
export const getPowerGeneration = (params: {
  date: string;
  substationCode: string;
  unit: string;
}) => {
  return request(`/api/solar/substation/powerGeneration`, {
    method: 'POST',
    data: params,
  });
};

// 发电趋势
export const getPowerGenerationTrends = (params: { date: string; substationCode: string }) => {
  return request(`/api/solar/substation/powerGeneration/trend`, {
    method: 'GET',
    params: params,
  });
};

// 逆变器概览
export const getInverterOverview = (substationCode: string) => {
  return request(`/api/solar/substation/inverter/overview`, {
    method: 'GET',
    params: { substationCode },
  });
};

// 并网表概览
export const getOnGridOverview = (substationCode: string) => {
  return request(`/api/solar/substation/girdConnectedMeter/overview`, {
    method: 'GET',
    params: { substationCode },
  });
};

// 逆变器详情 功率相关 圆环
export const getInverterPower = (deviceCode: string | null) => {
  return request(`/api/solar/substation/inverter/statistics`, {
    method: 'GET',
    params: { deviceCode },
  });
};

// 逆变器详情 功率相关 曲线
export const getInverterLine = (params: { deviceCode: string; date: string }) => {
  return request(`/api/solar/substation/inverter/power/curve`, {
    method: 'GET',
    params: params,
  });
};

// 逆变器详情 直流电趋势
export const getDirectCurrent = (params: { deviceCode: string; date: string }) => {
  return request(`/api/solar/substation/inverter/directCurrent/curve`, {
    method: 'GET',
    params: params,
  });
};

// 逆变器详情 测点数据
export const getMeasurePoint = (deviceCode: string) => {
  return request(`/api/solar/substation/inverter/details`, {
    method: 'GET',
    params: { deviceCode },
  });
};
