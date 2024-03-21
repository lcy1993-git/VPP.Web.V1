import { request } from '@umijs/max';

//获取站点列表
export const getStationList = () => {
  return request(`/sysApi/sysuser/getUserSubstation`, {
    method: 'GET',
    params: {
      pageNum: 1,
      pageSize: 1000,
      userId: localStorage.getItem('userId'),
    },
  });
};

// 更新用户站点信息
export const modifyUserSite = (params: any) => {
  return request(`/sysApi/sysuser/updateUserInfo`, {
    method: 'POST',
    data: params,
  });
};

// 保存系统配置
export const saveSystemConfig = (params: any) => {
  return request(`/sysApi/sys/config/save`, {
    method: 'POST',
    data: params,
  });
};
