import { request } from '@umijs/max';


// 特色场景-区域用能概览
export const getnergyUse = (params: any) => {
  return request(`/api/bigScreen/scene/energyUse`, {
    method: 'GET',
    params
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
}

// 特色场景-响应统计
export const getResponseStatistic = () => {
  return request(`/api/bigScreen/scene/responseStatistic`, {
    method: 'GET',
  });
}



// 特色场景-典型响应分析
export const getTypicalResponseAnalyse = () => {
  return request(`/api/bigScreen/scene/typicalResponseAnalyse`, {
    method: 'GET',
  });
}

