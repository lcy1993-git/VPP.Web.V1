import { request } from '@umijs/max';

// 获取省份数据
export const getProvinceInfo = () => {
  return request(`/sysApi/substationInformation/getProvince`, {
    method: 'GET',
  });
};

// 删除站点信息
export const postDeleteSiteInfo = (siteId: string) => {
  return request(`/sysApi/substationInformation/deleteSubstation?id=${siteId}`, {
    method: 'POST',
  });
};

// 根据ID获取站点信息
export const getSiteById = (params: { substationCode: string }) => {
  return request(`/sysApi/substationInformation/getSubstationByCode`, {
    method: 'GET',
    params: params,
  });
};

// 更新站点信息
export const postUpDateSiteInfo = (params: any) => {
  return request(`/sysApi/substationInformation/updateSubstation`, {
    method: 'POST',
    data: params,
  });
};

// 更新电站电价信息
export const updatePriceTime = (params: any) => {
  return request(`/sysApi/substationInformation/updatePriceTime`, {
    method: 'POST',
    data: params,
  });
}

// 获取电站电价信息
export const getStationPriceInfo = (params: {substationCode: string, year: string}) => {
  return request(`/sysApi/substationInformation/getPriceTimeByYearAndSubstationCode`, {
    method: 'GET',
    params: params,
  });
}

// 新增站点
export const postAddSiteInfo = (params: any) => {
  return request(`/sysApi/substationInformation/addSubstation`, {
    method: 'POST',
    data: params,
  });
};
