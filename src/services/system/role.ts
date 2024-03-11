import { request } from '@umijs/max';

//获取角色列表
export const getRoleList = (params: { sysRoleQuery: any }) => {
  return request(`/sysApi/sysrole/getSysRolePageList`, {
    method: 'post',
    data: params,
    params: {
      pageNum: 1,
      pageSize: 50,
    },
  });
};

//新增角色
export const addRole = (params: { sysRoleParam: any }) => {
  return request(`/sysApi/sysrole/addRole`, {
    method: 'POST',
    data: params,
  });
};

//编辑角色
export const updateRole = (params: { sysRoleParam: any }) => {
  return request(`/sysApi/sysrole/updateRole`, {
    method: 'POST',
    data: params,
  });
};

//删除角色
export const deleteRole = (roleId: string) => {
  return request(`/sysApi/sysrole/deleteRole?roleId=${roleId}`, {
    method: 'POST',
  });
};
