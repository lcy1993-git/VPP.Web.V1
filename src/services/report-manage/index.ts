// 报表管理
import { request } from '@umijs/max';

// 获取报表列表
export const getReportList = (params: any) => {
  return request(`/api/report/listTemplate`, {
    method: 'GET',
    params,
  });
};

// 删除报表
export const deleteTemplate = (reportTemplateId: any) => {
  return request(`/api/report/deleteTemplate`, {
    method: 'POST',
    data: reportTemplateId,
  });
};

// 获取报表数据
export const getReportData = (reportTemplateId: string, date: string) => {
  return request(`/api/report/getReportData`, {
    method: 'GET',
    params: { date, reportTemplateId },
  });
};

// 获取批量报表数据
export const getReportDataList = (reportTemplateId: any) => {
  return request(`/api/report/getReportDataList`, {
    method: 'POST',
    data: reportTemplateId,
  });
};

// 获取报表字段复选框
export const getReportListField = (deviceCodeList: any) => {
  return request(`/api/report/options`, {
    method: 'POST',
    data: deviceCodeList,
  });
};

// 添加模板
export const addTemplate = (params: { reportTemplate: any }) => {
  return request(`/api/report/addTemplate`, {
    method: 'POST',
    data: params,
  });
};

// 预览报表
export const previewReportData = (data: { reportTemplate: any }, date: string) => {
  return request(`/api/report/previewReportData`, {
    method: 'POST',
    data,
    params: { date },
  });
};
