import { request } from '@umijs/max';

//获取设备名称
export const getDevicesName = (params: any) => {
  return request(`/api/deviceInfo/getChildren`, {
    method: 'GET',
    params: params,
  });
};

//查询设备信息
export const getDevicesInfo = (params: { deviceCode: string }) => {
  return request(`/api/realTimeData/byDeviceCode`, {
    method: 'GET',
    params,
  });
};
