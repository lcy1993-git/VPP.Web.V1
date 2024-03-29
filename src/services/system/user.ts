import { request } from '@umijs/max';

// 获取系统配置
export const getSystemConfig = () => {
  return request(`/sysApi/sys/config/get`, {
    method: 'GET',
  });
};

//新增用户
export const addUser = (params: { sysUserParam: any }) => {
  return request(`/sysApi/sysuser/addUserInfo`, {
    method: 'POST',
    data: params,
  });
};

//编辑用户
export const updateUser = (params: { sysUserParam: any }) => {
  return request(`/sysApi/sysuser/updateUserInfo`, {
    method: 'POST',
    data: params,
  });
};

//删除用户
export const deleteUser = (userId: string) => {
  return request(`/sysApi/sysuser/deleteUserInfo?userId=${userId}`, {
    method: 'POST',
  });
};

//admin更新密码或者审批密码
export const resetAuthPasswordByAdmin = (params: any) => {
  return request(`/sysApi/sysuser/resetPassword`, {
    method: 'POST',
    data: params,
  });
};

//获取电站信息
export const getSubstations = () => {
  return request(`/sysApi/substationInformation/list`, {
    method: 'GET',
    // params: { userId },
  });
};
//修改密码
export const resetPassword = (params: any) => {
  return request(`/sysApi/sys/user/resetPassword`, {
    method: 'POST',
    data: params,
  });
};
//修改审批密码
export const resetAuthPassword = (params: any) => {
  return request(`/sysApi/sys/user/resetAuthPassword`, {
    method: 'POST',
    data: params,
  });
};
