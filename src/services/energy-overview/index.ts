import { request } from '@umijs/max';

// 负荷概览
export const getPowerOverview = (date: string) => {
  return request(`/api/energy/overview/power/overview`, {
    method: 'get',
    params: { date },
  });
};

// 查询用能总览上方实时数据
export const getInformation = () => {
  return request(`/api/energy/overview/information`, {
    method: 'get',
  });
};

// 用电概览
export const getElectricOverview = (date: string, type: boolean, unit: string) => {
  return request(`api/energy/overview/electricity/usage/overview`, {
    method: 'get',
    params: {
      date,
      type: type ? 1 : 2,
      unit,
    },
  });
};
