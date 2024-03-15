import { request } from '@umijs/max';

// 登录接口
export const loginRequest = (params: { name: string; password: string }) => {
  return request(`/sysApi/common/accountLogin`, {
    method: 'POST',
    data: params,
  });
};
