import { request } from '@umijs/max';

// 使用功率以及总充电量等。
export const getChargeOverview = (substationCode: string) => {
  return request(`/api/charge/overview`, {
    method: 'get',
    params: { substationCode },
  });
};

// 充电电站
export const getChargeStation = () => {
  return request(`/api/charge/substation`, {
    method: 'get',
  });
};

// 充电桩运行状态
export const getChargePileOverview = (substationCode: string, type: string) => {
  return request(`/api/charge/pile/overview`, {
    method: 'get',
    params: {
      type: type === '全部' ? null : type === '直流充电桩' ? 41 : 40,
      substationCode,
    },
  });
};

// 充电功率趋势
export const getChargePower = (substationCode: string, date: string) => {
  return request(`/api/charge/power`, {
    method: 'get',
    params: {
      substationCode,
      date,
    },
  });
};
