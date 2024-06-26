import { request } from '@umijs/max';

// 调度实施 -- 历史计划统计
export const getHisStatistic = () => {
  return request(`/sysApi/demand/response/hisStatistic`, {
    method: 'GET',
  });
};

// 调度实施 -- 实时调度列表接口
export const getRealList = (params: {date: string}) => {
  return request(`/sysApi/demand/response/real/list`, {
    method: 'GET',
    params
  });
}

// 调度实施 -- 计划信息详情
export const getPlanInfo = (planId: string) => {
  return request(`/sysApi/demand/response/real/details`, {
    method: 'GET',
    params: {
      identificationNum: planId
    }
  });
}

// 调度实施 -- 执行情况
export const getExecutionStatus = (planId: string) => {
  return request(`/sysApi/demand/response/executionStatus`, {
    method: 'GET',
    params: {
      identificationNum: planId
    }
  });
}
