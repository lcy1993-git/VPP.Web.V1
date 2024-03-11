import { request } from '@umijs/max';
import qs from 'qs';

interface TableCommonRequestParams {
  url: string;
  filterParams?: object;
  postType?: string;
  requestType?: string;
  pageNum?: number;
  pageSize?: number;
  hasPage?: boolean;
}

export interface TableRequestResult {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  data: any;
}

export const tableRequest = (params: TableCommonRequestParams): Promise<TableRequestResult> => {
  if (params.requestType === 'post') {
    if (params.hasPage) {
      return request(`${params.url}?pageNum=${params.pageNum}&pageSize=${params.pageSize}`, {
        method: 'POST',
        data: {
          ...params.filterParams,
          pageNum: params.pageNum,
          pageSize: params.pageSize,
        },
      });
    }
    return request(`${params.url}`, {
      method: 'POST',
      data: params.filterParams,
    });
  } else {
    // 判断hasPage是否存在，如果存在的情况下，需要显示页面，并且pagesize和pageNum以query的方式进行传递
    const pageParams = params.hasPage
      ? `?pageNum=${params.pageNum}&pageSize=${params.pageSize}`
      : '';

    if (pageParams) {
      // 判断参数序列化后是否存在
      const requestUrl = qs.stringify(params.filterParams)
        ? `&${qs.stringify(params.filterParams)}`
        : '';
      // 拼接地址
      return request(`${params.url}${pageParams}${requestUrl}`, {
        method: 'GET',
      });
    }
    // 判断参数序列化后是否存在
    const requestUrl = qs.stringify(params.filterParams)
      ? `?${qs.stringify(params.filterParams)}`
      : '';
    // 拼接地址
    return request(`${params.url}${requestUrl}`, {
      method: 'GET',
    });
  }
};
