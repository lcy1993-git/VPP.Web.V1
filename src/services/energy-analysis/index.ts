import { request } from '@umijs/max';

// 企业数据
export const getSubstationList = () => {
  return request(`/api/energy/analysis/substation`, {
    method: 'GET',
  });
};

// 行业数据
export const getIndustryList = () => {
  return request(`/api/energy/analysis/industry`, {
    method: 'GET',
  });
};

// 区域数据
export const getAreaList = () => {
  return request(`/api/cleanEnergyConsumeManage/area`, {
    method: 'GET',
  });
};

// 能源结构排行
export const getEnergyRanking = (params: any) => {
  return request(`/api/energy/analysis/ranking`, {
    method: 'GET',
    params,
  });
};

// 用电量趋势分析
export const getTrendAnalysis = (params: any) => {
  return request(`/api/energy/analysis/trend/analysis`, {
    method: 'GET',
    params,
  });
};

// 企业用电指数分析
export const getTrendConsumption = (params: any) => {
  return request(`/api/energy/analysis/trend/consumption`, {
    method: 'GET',
    params,
  });
};
