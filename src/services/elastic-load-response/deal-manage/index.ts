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
export const getUserList = () => {
  return request(`/sysApi/demand/response/transactionBidding/user`, {
    method: 'GET',
  });
};

// 邀约计划
export const getPlanList = (type: string) => {
  return request(`/sysApi/demand/response/regulationPlanManagement/list`, {
    method: 'GET',
    params: { type },
  });
};
