import { request } from '@umijs/max';

// 获取设备所属厂站列表
export const getMeasurePoint = () => {
  return request(`/sysApi/deviceInfo/getDeviceStationOptions`, {
    method: 'GET',
  });
};

// 获取设备类型
export const getDevicesType = () => {
  return request(`/sysApi/deviceInfo/getDeviceTypeOptions`, {
    method: 'GET',
  });
};

// 获取设备信息
export const getDevicesInfo = (psrId: string) => {
  return request(`/sysApi/deviceInfo/getDeviceInfoDetailByPsrId`, {
    method: 'GET',
    params: { psrId },
  });
};

// 编辑设备信息
export const updateDeviceInfo = (params: any) => {
  return request(`/sysApi/deviceInfo/updateDeviceInfo`, {
    method: 'POST',
    data: params,
  });
};

//请求告警信息
export const getRealtimeAlarm = (params: any) => {
  return request(`/sysApi/alarm/getRealTimeAlarmEvent`, {
    method: 'GET',
    params,
  });
};
