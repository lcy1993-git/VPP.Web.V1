import { request } from '@umijs/max';

// 特色场景-区域用能概览
export const getEnergyUse = (params: any) => {
  return request(`/api/bigScreen/scene/energyUse`, {
    method: 'GET',
    params,
  });
};

// 特色场景-中间数据
export const getCenterData = () => {
  return request(`/api/bigScreen/scene/centerData`, {
    method: 'GET',
  });
};

// 特色场景-区域弹性负荷概览
export const getElasticEnergyOverView = () => {
  return request(`/api/bigScreen/scene/elasticEnergyOverView`, {
    method: 'GET',
  });
};

// 特色场景-响应统计
export const getResponseStatistic = () => {
  return request(`/api/bigScreen/scene/responseStatistic`, {
    method: 'GET',
  });
};

// 特色场景-典型响应分析
export const getTypicalResponseAnalysis = (type: string) => {
  return request(`/api/bigScreen/scene/typicalResponseAnalysis`, {
    method: 'GET',
    params: { type: type === '负荷' ? 0 : 1 },
  });
};

// 特色场景-大屏地图-电站数据
export const getsubstationData = () => {
  return request(`/api/bigScreen/scene/substationData`, {
    method: 'GET',
  });
};

/*--------------------------能源综合看板-------------------------------*/
// 综能看板--- 区域用能管理 --- 现状
export const getStatusQuo = () => {
  return request(`/api/bigScreen/energyBoard/energyManageCurrent`, {
    method: 'GET',
  });
};

// 综能看板--- 区域用能管理 --- 趋势
export const getEnergyTrend = (params: any) => {
  return request(`/api/bigScreen/energyBoard/energyManageTrend`, {
    method: 'GET',
    params,
  });
};

// 综能看板--- 区域用能管理 --- 特征
export const getEnergyManageFeature = (params: any) => {
  return request(`/api/bigScreen/energyBoard/energyManageFeature`, {
    method: 'GET',
    params,
  });
};

// 综能看板--- 企业用能监测
export const getEnterpriseEnergyMonitor = (params: any) => {
  return request(`/api/bigScreen/energyBoard/enterpriseEnergyMonitor`, {
    method: 'GET',
    params,
  });
};

// 综能看板--- 企业用能监测
export const getElasticEnergyManage = () => {
  return request(`/api/bigScreen/energyBoard/elasticEnergyManage`, {
    method: 'GET',
  });
};

// 综能看板--- 中间数据
export const getBoardCenterData = () => {
  return request(`/api/bigScreen/energyBoard/centerData`, {
    method: 'GET',
  });
};

// 综能看板--- 电站数据
export const getBoardSubstationData = (params: any) => {
  return request(`/api/bigScreen/energyBoard/substationData`, {
    method: 'GET',
    params
  });
};

// 综能看板--- 清洁能源管理
export const getCleanEnergyManageData = (params: any) => {
  return request(`/api/bigScreen/energyBoard/cleanEnergyManage`, {
    method: 'GET',
    params
  });
};

