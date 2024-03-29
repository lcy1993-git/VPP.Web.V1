import { request } from '@umijs/max';

// 碳排放总览head部分数据
export const getCarbonOverviewHead = (params: any) => {
  return request(`/sysApi/cleanEnergyConsumeManage/carbonOverview/centerData`, {
    method: 'get',
    params,
  });
};

// 碳排放总览趋势数据
export const getCarbonTrend = (params: any) => {
  return request(`/sysApi/cleanEnergyConsumeManage/carbonOverview/carbonTrend`, {
    method: 'get',
    params,
  });
};

// 碳排放总览进度指标
export const getCarbonTargetProgress = (params: any) => {
  return request(`/sysApi/cleanEnergyConsumeManage/carbonOverview/carbonTargetProgress`, {
    method: 'get',
    params,
  });
};

// 碳排放总览热力图
export const getCarbonHeatMap = () => {
  return request(`/sysApi/cleanEnergyConsumeManage/carbonOverview/carbonHeatMap`, {
    method: 'get',
  });
};
