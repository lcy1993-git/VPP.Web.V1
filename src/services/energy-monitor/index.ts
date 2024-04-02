import { request } from '@umijs/max';

// 用能详情
export const getMonitorDetails = (params: any) => {
  return request(`/sysApi/energy/monitor/details`, {
    method: 'get',
    params,
  });
};

// 用能总览
export const getMonitorOverview = (params: any) => {
  return request(`/sysApi/energy/monitor/overview`, {
    method: 'get',
    params,
  });
};

// 能源结构
export const getEnergyStructure = (params: any) => {
  return request(`/sysApi/energy/monitor/structure`, {
    method: 'get',
    params,
  });
};

// 负荷详情
export const getLoadDetails = (params: any) => {
  return request(`/sysApi/energy/monitor/power/details`, {
    method: 'get',
    params,
  });
};

// 企业排名
export const getRanking = (params: any) => {
  return request(`/sysApi/energy/monitor/ranking`, {
    method: 'get',
    params,
  });
};

// select 获取企业名称
export const getEnterpriseName = () => {
  return request(`/sysApi/energy/monitor/substation`, {
    method: 'get',
  });
};

// select 获取行业
export const getIndustry = () => {
  return request(`/sysApi/energy/monitor/industry`, {
    method: 'get',
  });
};
