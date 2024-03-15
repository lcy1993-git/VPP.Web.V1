import { request } from '@umijs/max';

// 事项类型列表查询
export const getEventTypeList = () => {
  return request(`/api/alarm/getEventTypeList`, {
    method: 'GET',
  });
};

// 新增告警处理
export const addAlarmDeal = (params: any) => {
  return request(`/api/alarmDeal/addAlarmDeal`, {
    method: 'POST',
    ContentType: 'multipart/form-data',
    data: params,
  });
};
// 告警确认但不处理
export const addAlarmDealWithOutDeal = (params: any) => {
  return request(`/api/alarmDeal/addAlarmDealWithOutDeal`, {
    method: 'GET',
    params: params,
  });
};
// 批量告警确认但不处理
export const addAlarmDealListWithOutDeal = (eventIds: string[]) => {
  return request(`/api/alarmDeal/addAlarmDealListWithOutDeal`, {
    method: 'POST',
    data: eventIds,
  });
};

//获取设备列表
export const fileUpload = (params: any) => {
  return request(`/api/file/upload/getUrl`, {
    method: 'POST',
    data: params,
    ContentType: 'multipart/form-data',
  });
};

//查询专家运维建议表数据
export const getExpertDevOps = (params: any) => {
  return request(`/api/expertAdvice/detail`, {
    method: 'GET',
    params: params,
  });
};
