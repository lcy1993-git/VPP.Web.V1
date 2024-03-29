import { request } from '@umijs/max';

/** 储能电站 header  基础数据 */
export const getEssInformation = (substationCode: string) => {
  return request(`/api/ess/substation/essInformation`, {
    method: 'GET',
    params: { substationCode },
  });
};

/** SOC和充放电功率 */
export const getSocAndPower = (subStationCode: string) => {
  return request(`/api/ess/substation/SOCAndPower`, {
    method: 'GET',
    params: { subStationCode },
  });
};

/** 充放电量 */
export const getFullAndPutPower = (params: {
  date: string;
  substationCode: string;
  unit: string;
}) => {
  return request(`/api/ess/substation/charge/quantity`, {
    method: 'GET',
    params: params,
  });
};

/** 功率趋势 */
export const getPowerTrend = (params: { date: string; subStationCode: string }) => {
  return request(`/api/ess/substation/power/hour/list`, {
    method: 'GET',
    params: params,
  });
};

/** SOC趋势 */
export const getSocTrend = (params: { date: string; substationCode: string }) => {
  return request(`/api/ess/substation/SOC/hour/list`, {
    method: 'GET',
    params: params,
  });
};

/** PCS概览 */
export const getPcsOverview = (substationCode: string) => {
  return request(`/api/ess/substation/PCS/overview`, {
    method: 'GET',
    params: { substationCode },
  });
};

/** 并网表概览 */
export const getGridOverview = (substationCode: string) => {
  return request(`/api/ess/substation/girdConnectedMeter/overview`, {
    method: 'GET',
    params: { substationCode },
  });
};

/** 电池簇概览 */
export const getClusterOverview = (substationCode: string) => {
  return request(`/api/ess/substation/cluster/overview`, {
    method: 'GET',
    params: { substationCode },
  });
};

// 电量概览
export const getImportantDetails = (deviceCode: string | null) => {
  return request(`/api/ess/substation/girdConnectedMeter/importantDetails`, {
    method: 'GET',
    params: { deviceCode },
  });
};

// 电量统计
export const getEnergy = (params: any) => {
  return request(`/api/ess/substation/girdConnectedMeter/energy`, {
    method: 'GET',
    params,
  });
};

/** 空调概览 */
export const getAircondition = (substationCode: string) => {
  return request(`/api/ess/substation/airCondition/overview`, {
    method: 'GET',
    params: { substationCode },
  });
};

/** 概览数据 */
export const getOverviewData = (params: { type: string; substationCode: string }) => {
  const { type, substationCode } = params;
  switch (type) {
    case 'PCS概览':
      return getPcsOverview(substationCode);
    case '电池簇概览':
      return getClusterOverview(substationCode);
    case '电表概览':
      return getGridOverview(substationCode);
    case '空调概览':
      return getAircondition(substationCode);
  }
};

/** ------------------------------ PCS详情 ---------------------------------*/
/** header 圆环数据 */
export const getPcsBasisData = (deviceCode: string | null) => {
  return request(`/api/ess/substation/PCS/importantDetails`, {
    method: 'GET',
    params: { deviceCode },
  });
};

/** 充放电量 */
export const getPcsQuantity = (params: { date: string; deviceCode: string }) => {
  return request(`/api/ess/substation/PCS/quantity`, {
    method: 'GET',
    params: params,
  });
};

/** 功率曲线 */
export const getPowerCurve = (params: { date: string; deviceCode: string; type: number }) => {
  return request(`/api/ess/substation/device/hour/list`, {
    method: 'GET',
    params: params,
  });
};

/** 测点 */
export const getMeasurePoint = (deviceCode: string) => {
  return request(`/api/ess/substation/Device/details`, {
    method: 'GET',
    params: { deviceCode },
  });
};

/** ------------------------------------------电池簇详情 ------------------------------------------ **/
export const getClusterBasisData = (deviceCode: string | null) => {
  return request(`/api/ess/substation/cluster/importantDetails`, {
    method: 'GET',
    params: { deviceCode },
  });
};

// 获取电磁簇温度统计数据 type 1为温度，2为电压，3为SOC
export const getDeviceTemperature = (params: { date: string; deviceCode: string; type: 1 | 2 }) => {
  return request(`/api/ess/substation/cluster/temperature`, {
    method: 'GET',
    params: params,
  });
};

/** ------------------------------------------并网表详情 ------------------------------------------ **/
export const getOnGridBasisData = (deviceCode: string | null) => {
  return request(`/api/ess/substation/girdConnectedMeter/importantDetails`, {
    method: 'GET',
    params: { deviceCode },
  });
};
// 电量统计
export const getOnGridPowerCount = (params: { date: string; deviceCode: string }) => {
  return request(`/api/ess/substation/girdConnectedMeter/energy`, {
    method: 'GET',
    params: params,
  });
};

// 告警确认但不处理
export const alarmEvent = (eventIds: string[]) => {
  return request(`/api/ess/substation/addAlarmDealListWithOutDeal`, {
    method: 'POST',
    data: eventIds,
  });
};

// SVG 请求
export const getSvgMeasurements = (measurementValues: any[]) => {
  return request(`/api/solar/index/svg/measurements`, {
    method: 'POST',
    data: measurementValues,
  });
};
