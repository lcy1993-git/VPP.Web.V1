import { request } from '@umijs/max';

// 执行跟踪-列表
export const getTrackingPlanList = () => {
  return request(`/sysApi/demand/response/executionTracking/planList`, {
    method: 'GET',
  });
};

// 执行跟踪-实时运行功率曲线-日前邀约计划
export const getTrackingCure = (id: string) => {
  return request(`/sysApi/demand/response/executionTracking/curve`, {
    method: 'GET',
    params: {
      identificationNum: id
    }
  });
};

// 执行跟踪-资源实时运行功率曲线-XXX公司
export const getCompanyCurve = (id: string) => {
  return request(`/sysApi/demand/response/executionTracking/company/curve`, {
    method: 'GET',
    params: {
      planDecompositionDetailsId: id
    }
  });
};

// 结算管理-市场清算结果
export const getSettlementResult = (params: {date: string, type: 'day' | 'month'}) => {
  return request(`/sysApi/demand/response/settlementManagement/market`, {
    method: 'GET',
    params: params
  });
};

// 结算管理-modal数据
export const getModalDetail = () => {
  return request(`/sysApi/demand/response/settlementManagement/statistical`, {
    method: 'GET',
  });
};
