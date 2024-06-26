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


// 合同管理 -- 删除合同
export const deleteContract = (contractId: string) => {
  return request(`/sysApi/demand/response/contractManagement/del`, {
    method: 'GET',
    params: {
      contractId
    }
  });
};

// 合同管理 --- 上传合同
export const fileUpload = (params: any) => {
  return request(`/sysApi/file/upload/getUrl`, {
    method: 'POST',
    data: params,
    ContentType: 'multipart/form-data',
  });
};

// 合同管理 --- 新增合同
export const addContractPost = (params: any) => {
  return request(`/sysApi/demand/response/contractManagement/add`, {
    method: 'POST',
    data: params
  });
};


// 调控计划管理 ---- 邀约计划类型列表
export const getInvitePlanList = (type: number) => {
  return request(`/sysApi/demand/response/regulationPlanManagement/list`, {
    method: 'GET',
    params: {
      type: type
    }
  });
};

// 调控计划管理-邀约响应计划
export const getInviteResponsePlanData = (id: string) => {
  return request(`/sysApi/demand/response/regulationPlanManagement/curve`, {
    method: 'GET',
    params: {
      identificationNum: id
    }
  });
};

// 调控计划管理-邀约响应计划
export const getInvitePlanCurve = (id: string) => {
  return request(`/sysApi/demand/response/regulationPlanManagement/planDecompositionDetails/curve`, {
    method: 'GET',
    params: {
      planDecompositionDetailsId: id
    }
  });
};
