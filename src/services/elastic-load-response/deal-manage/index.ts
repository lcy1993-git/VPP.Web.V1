import { request } from '@umijs/max';

// 交易公告披露-列表
export const getAnnouncementList = (params: any) => {
  return request(`/sysApi/demand/response/announcement/list`, {
    method: 'GET',
    params,
  });
};

// 交易公告披露-信息
export const getAnnouncementDetails = (identificationNum: string) => {
  return request(`/sysApi/demand/response/announcement/details`, {
    method: 'GET',
    params: { identificationNum },
  });
};

// 基线负荷管理-虚拟电厂
export const getVPPLoadDetails = (date: string) => {
  return request(`/sysApi/demand/response/baseline/load/vpp`, {
    method: 'GET',
    params: { date },
  });
};

// 基线负荷管理-代理用户
export const getUserLoadDetails = (date: string, substationCode: string) => {
  return request(`/sysApi/demand/response/baseline/load/agent/user`, {
    method: 'GET',
    params: { date, substationCode },
  });
};

// 用户列表
export const getUserList = (identificationNum?: string) => {
  return request(`/sysApi/demand/response/transactionBidding/user`, {
    method: 'GET',
    params: { identificationNum },
  });
};

// 邀约计划
export const getPlanList = (type: string) => {
  return request(`/sysApi/demand/response/regulationPlanManagement/list`, {
    method: 'GET',
    params: { type },
  });
};

// 交易申报（需求响应）- 虚拟电厂曲线
export const getVPPCurve = (identificationNum: string) => {
  return request(`/sysApi/demand/response/transactionBidding/vpp/curve`, {
    method: 'GET',
    params: { identificationNum },
  });
};

// 交易申报（需求响应）- 代理用户表格
export const getUserDetail = (identificationNum: string) => {
  return request(`/sysApi/demand/response/transactionBidding/agent/user`, {
    method: 'GET',
    params: { identificationNum },
  });
};

// 交易申报（需求响应）- 代理用户-容量（价格）曲线
export const getUserCurve = (identificationNum: string, substationCode: string, type: string) => {
  return request(`/sysApi/demand/response/transactionBidding/agent/user/curve`, {
    method: 'GET',
    params: { identificationNum, substationCode, type },
  });
};

// 交易申报（需求响应）-信息删除
export const deletePlan = (identificationNums: any) => {
  return request(`/sysApi/demand/response/transactionBidding/del`, {
    method: 'POST',
    data: identificationNums,
  });
};

// 交易申报（需求响应）-信息撤销
export const cancelPlan = (identificationNums: any) => {
  return request(`/sysApi/demand/response/transactionBidding/invited/cancel`, {
    method: 'POST',
    data: identificationNums,
  });
};

// 交易申报（需求响应）-信息申报
export const submissPlan = (identificationNums: any) => {
  return request(`/sysApi/demand/response/transactionBidding/invited/submission`, {
    method: 'POST',
    data: identificationNums,
  });
};

// 交易申报（需求响应）-代理用户删除
export const deleteUser = (planDecompositionDetailsIds: any) => {
  return request(`/sysApi/demand/response/transactionBidding/agent/user/del`, {
    method: 'POST',
    data: planDecompositionDetailsIds,
  });
};

// 新增交易申报-邀约计划信息 -- 所有列表
export const getIdentificationNum = () => {
  return request(`/sysApi/demand/response/getIdentificationNum`, {
    method: 'GET',
  });
};

// 新增交易申报-获取计划信息
export const getPlanInfo = (identificationNum: string) => {
  return request(`/sysApi/demand/response/transactionBidding/agent/user/invited`, {
    method: 'GET',
    params: { identificationNum },
  });
};

// 新增交易申报-获取可调容量
export const getUserCapacity = (substationCode: string) => {
  return request(`/sysApi/demand/response/transactionBidding/user/dispatchCapacity`, {
    method: 'GET',
    params: { substationCode },
  });
};

// 新增交易申报-获取响应时段起点等表格数据
export const getUserTableData = (identificationNum: string, substationCode: string) => {
  return request(`/sysApi/demand/response/transactionBidding/user/invited`, {
    method: 'GET',
    params: { identificationNum, substationCode },
  });
};

// 已出清明细-中标功率
export const getCapacityChart = (identificationNum: string) => {
  return request(`/sysApi/demand/response/transactionBidding/settled/vpp`, {
    method: 'GET',
    params: { identificationNum },
  });
};

// 已出清明细-中标价格
export const getPriceChart = (identificationNum: string) => {
  return request(`/sysApi/demand/response/transactionBidding/settled/winningBidPrice`, {
    method: 'GET',
    params: { identificationNum },
  });
};

// 辅助服务
export const getAncillaryChart = (identificationNum?: string) => {
  return request(`/sysApi/demand/response/transactionBidding/ancillary/curve`, {
    method: 'GET',
    params: { identificationNum },
  });
};

// 可调节
export const getAdjustable = (substationCode: string) => {
  return request(`/sysApi/demand/response/transactionBidding/adjustable/capability`, {
    method: 'GET',
    params: { substationCode },
  });
};

// 新增申报
export const addDeclaration = (data: any) => {
  return request(`/sysApi/demand/response/transactionBidding/agent/user/details/add`, {
    method: 'POST',
    data,
  });
};
