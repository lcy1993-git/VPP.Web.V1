import { request } from '@umijs/max';

//获取菜单列表
export const getMenuList = (userId: string) => {
  return request(`/sysApi/sysmenu/getAllMenus`, {
    method: 'GET',
    params: { userId },
  });
};

//新增菜单
export const addMenu = (params: { sysMenuParam: any }) => {
  return request(`/sysApi/sysmenu/addMenu`, {
    method: 'POST',
    data: params,
  });
};

//编辑菜单
export const updateMenu = (params: { sysMenuParam: any }) => {
  return request(`/sysApi/sysmenu/updateMenu`, {
    method: 'POST',
    data: params,
  });
};

//删除菜单
export const deleteMenu = (menuId: string) => {
  return request(`/sysApi/sysmenu/deleteMenu?menuId=${menuId}`, {
    method: 'POST',
  });
};
