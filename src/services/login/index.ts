import { request } from '@umijs/max';
import { cRequest } from '../common';

// 登录接口
export const loginRequest = (params: { name: string; password: string }) => {
  return request(`/sysApi/common/accountLogin`, {
    method: 'POST',
    data: params,
  });
};

// 获取用户权限
export const getUserAuth = (userId: string) => {
  return cRequest<any>(() =>
    request(`/sysApi/common/getUserRoleMenus`, {
      method: 'GET',
      params: { userId: userId },
    }),
  );
};
