import { request } from '@umijs/max';

// 充电桩详情 充电功率趋势
export const getChargePower = (params: { deviceCode: string; date: string }) => {
  return request(`/api/device/details/charge/power`, {
    method: 'GET',
    params: params,
  });
};
