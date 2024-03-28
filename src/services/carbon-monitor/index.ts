import { request } from '@umijs/max';

// 碳排放监测- card
export const getMonitorCenterData = (params: any) => {
  return request(`/api/cleanEnergyConsumeManage/carbonMonitor/centerData`, {
    method: 'GET',
    params,
  });
};

// 碳排放监测柱状图
export const getCarbonTrend = (params: any) => {
  return request(`/api/cleanEnergyConsumeManage/carbonMonitor/carbonTrend`, {
    method: 'GET',
    params,
  });
};
