import { request } from '@umijs/max';

// 获取省份数据
export const getSubstationName = () => {
  return request(`/api/enterprise/panel/substation/name`, {
    method: 'GET',
  });
};

// 实时负荷趋势
export const getSubstationPower = (date: string, substationCode: string) => {
  return request(`/api/enterprise/panel/substation/power`, {
    method: 'GET',
    params: { date, substationCode },
  });
};

// 用量趋势
export const getSubstationElectricity = (date: string, substationCode: string, unit: string) => {
  return request(`/api/enterprise/panel/substation/electricity`, {
    method: 'GET',
    params: { date, substationCode, unit },
  });
};
