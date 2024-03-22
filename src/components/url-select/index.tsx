import React, { useEffect, useMemo } from 'react';

import { getDataByUrl } from '@/services/common';
import { useRequest } from 'ahooks';
import { Select } from 'antd';

export interface UrlSelectProps {
  /**option请求地址 */
  url?: string;

  /**label显示字段 */
  titlekey?: string;

  /**value字段 */
  valuekey?: string;

  /**请求参数 */
  extraParams?: object;

  /**默认option */
  defaultData?: any[];

  /**添加筛选 */
  needFilter?: boolean;

  requestSource?: 'api' | 'rbac' | 'sysApi';

  requestType?: 'post' | 'get';

  paramsMust?: string[];

  postType?: 'query' | 'body';

  /**显示“全部”选项 */
  needAll?: boolean;

  /**“全部”选项value值 */
  allValue?: string;

  manual?: boolean; //是否手动执行fetch数据

  trigger?: boolean; //用来触发fetch方法

  updateFlag?: boolean; // 调用接口拉取新数据的标识
}

const withUrlSelect =
  <P extends object>(WrapperComponent: React.ComponentType<P>) =>
    (props: P & UrlSelectProps) => {
      const {
        url = '',
        titlekey = 'text',
        valuekey = 'value',
        defaultData,
        extraParams = {},
        needFilter = true,
        requestSource = 'api',
        paramsMust = [],
        requestType = 'get',
        postType = 'body',
        needAll = false,
        allValue = '',
        updateFlag,
        ...rest
      } = props;

      // URL 有数值
      // defaultData 没有数值
      // 必须传的参数不为空
      const { data: resData, run } = useRequest(
        () => getDataByUrl(url, extraParams, requestSource, requestType, postType),
        {
          ready: !!(
            url &&
            !defaultData &&
            !(paramsMust.filter((item) => !extraParams[item]).length > 0)
          ),
          refreshDeps: [url, JSON.stringify(extraParams)],
          manual: true,
        },
      );

      const afterHanldeData = useMemo(() => {
        try {
          if (defaultData) {
            const copyData = [...defaultData];
            if (needAll) {
              const newObject = {};
              newObject[titlekey] = '全部';
              newObject[valuekey] = allValue;
              copyData.unshift(newObject);
            }
            return copyData.map((item: any) => {
              return { label: item[titlekey], value: item[valuekey] };
            });
          }
          if (
            !(url && !defaultData && !(paramsMust.filter((item) => !extraParams[item]).length > 0))
          ) {
            return [];
          }
          if (resData) {
            return resData.data.map((item: any) => {
              return { label: item[titlekey], value: item[valuekey] };
            });
          }
          return [];
        } catch (err) {
          return [];
        }
      }, [JSON.stringify(resData), JSON.stringify(defaultData)]);

      useEffect(() => {
        run();
      }, [updateFlag]);
      return (
        <WrapperComponent
          showSearch={needFilter}
          options={afterHanldeData}
          {...(rest as unknown as P)}
          filterOption={(input: string, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
      );
    };

export default withUrlSelect(Select);
