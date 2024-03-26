// 报表管理
import { request } from '@umijs/max';

// 企业数据
export const getSubstationList = () => {
  return request(`/api/financial/report/substationList`, {
    method: 'GET',
  });
};

// 行业数据
export const getIndustryList = () => {
  return request(`/api/financial/report/getIndustry`, {
    method: 'GET',
  });
};

// 删除报表
export const deleteTemplate = (reportTemplateId: any) => {
  return request(`/api/financial/report/deleteTemplate`, {
    method: 'POST',
    data: reportTemplateId,
  });
};

// 获取报表数据
export const getReportData = (reportTemplateId: string, date: string) => {
  return request(`/api/financial/report/getReportData`, {
    method: 'GET',
    params: { date, reportTemplateId },
  });
};

// 获取批量报表数据
export const getReportDataList = (reportTemplateId: any) => {
  return request(`/api/financial/report/getReportDataList`, {
    method: 'POST',
    data: reportTemplateId,
  });
};

// 获取报表字段复选框
export const getReportListField = (deviceCodeList: any) => {
  return request(`/api/financial/report/options`, {
    method: 'POST',
    data: deviceCodeList,
  });
};

// 添加模板
export const addTemplate = (params: { reportTemplate: any }) => {
  return request(`/api/financial/report/addTemplate`, {
    method: 'POST',
    data: params,
  });
};

// 预览报表
export const previewReportData = (data: { reportTemplate: any }, date: string) => {
  return request(`/api/financial/report/previewReportData`, {
    method: 'POST',
    data,
    params: { date },
  });
};

// 获取电站设备树
export const getDeviceTree = () => {
  return request(`/api/substationInformation/device/tree`, {
    method: 'GET',
  });
};
