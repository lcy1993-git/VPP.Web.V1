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
