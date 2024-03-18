import { request } from '@umijs/max';

// 根据用户查询 能访问的电站信息
export const getUserStation = () => {
  return request(`/api/substationInformation/getSubstations`, {
    method: 'GET',
    params: {
      userId: localStorage.getItem('userId'),
      pageSize: 1000,
      pageNum: 1,
    },
  });
};

// 查询表格数据
export const getTableData = (params: any) => {
  return request(`/api/historyData/dataList`, {
    method: 'POST',
    data: params,
  });
};

//查询历史数据（曲线）
export const getCurveHistoryList = (params: any) => {
  return request(`/api/historyData/dataList`, {
    method: 'POST',
    data: params,
  });
};

// 获取所有设备
export const getDevices = (deviceCode: string | null | undefined) => {
  return request(`/api/deviceInfo/getChildren`, {
    method: 'GET',
    params: { deviceCode },
  });
};

// 获取设备下面的测点
export const getMeasurePoint = (deviceCode: string) => {
  return request(`/api/historyData/measurementInfo/options`, {
    method: 'GET',
    params: { deviceCode },
  });
};

// 获取站点下的设备
export const getSubstationDevice = (substationId: string, type: number) => {
  return request(`/api/deviceInfo/getChildrenByDeviceCodeAndType`, {
    method: 'GET',
    params: { deviceCode: substationId, type },
  });
};
