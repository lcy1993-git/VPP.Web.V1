/**乌兰察布 通用表格组件 */
import { tableRequest } from '@/utils/tableRequest';
import { useRequest } from 'ahooks';
import { ConfigProvider, Pagination, Table } from 'antd';
import type { Ref, SetStateAction } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import Empty from '../empty';
import styles from './index.less';

interface TableProps {
  /** 表格初始化是否发起请求 */
  initTableAjax?: boolean;
  /** 请求url */
  url?: string;
  /** 表头 */
  columns: any[];
  /** 请求方法 */
  postType?: 'body' | 'query';
  /** 获取当前选择数据 */
  getCheckData?: (values: object[]) => void;
  /** 表键 */
  rowKey?: string;
  /** 是否单选 */
  type?: TableSelectType;
  /** 是否显示页码 */
  hasPage?: boolean;
  /** 表格标题 */
  title?: string;
  /** 是否显示选择列 */
  hideSelect?: boolean;
  /** 查询参数 */
  filterParams?: object;
  /** 默认页码 */
  defaultPageSize?: number;
  /** 请求方式 */
  requestType?: 'get' | 'post';
  /** 获取表格完整数据 */
  getTableRequestData?: (data: any) => void;
}

type TableSelectType = 'radio' | 'checkbox';

const withGeneralTable =
  <P extends object>(WrapperComponent: React.ComponentType<P>) =>
  (props: P & TableProps, ref: Ref<any>) => {
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]); // 树形列表展开收起功能
    const [requestParams, setRequestParams] = useState<any>(null);

    const {
      initTableAjax = true,

      url = '',

      columns = [],

      getCheckData,

      rowKey = 'id',

      type = 'radio',

      hideSelect = false,

      postType = 'body',

      // defaultPageSize = 10,

      getTableRequestData,

      filterParams,

      requestType = 'post',

      hasPage = true,

      ...rest
    } = props;

    const {
      data: tableData,
      run,
      loading,
    } = useRequest(tableRequest, {
      manual: true,
      onSuccess: () => {
        getTableRequestData?.(tableData!);
      },
    });

    //处理树结构没有children时不显示加号
    const mapTreeData = (data: any) => {
      return data?.map((item: any) => {
        if (item.children && item.children.length === 0) {
          delete item['children'];
          return item;
        }
        return mapTreeData(item.children);
      });
    };

    //表格数据处理
    const tableResultData = useMemo(() => {
      if (hasPage) {
        if (
          tableData &&
          tableData?.data &&
          Object.prototype.toString.call(tableData.data.dataList) === '[object Array]'
        ) {
          const {
            dataList: data,
            pageNum: currentPage,
            pageSize,
            totalCount,
          } = tableData.data ?? {};
          return {
            items: data ?? [],
            currentPage,
            pageSize,
            totalCount,
            dataStartIndex: Math.floor((currentPage - 1) * pageSize + 1),
            dataEndIndex: Math.floor((currentPage - 1) * pageSize + (data ?? []).length),
          };
        }
        return {
          items: [],
          currentPage: 1,
          pageSize: 20,
          totalCount: 0,
          dataStartIndex: 0,
          dataEndIndex: 0,
        };
      }
      if (
        tableData &&
        tableData.data &&
        Object.prototype.toString.call(tableData.data) === '[object Array]'
      ) {
        const copyData = [...tableData.data];
        mapTreeData(copyData);
        return {
          items: copyData ?? [],
        };
      }
      return {
        items: [],
      };
    }, [JSON.stringify(tableData)]);

    //暴露给父组件的方法
    useImperativeHandle(ref, () => ({
      /**刷新列表 */
      refresh: () => {
        run({
          url,
          filterParams: filterParams,
          pageSize: pageSize,
          pageNum: currentPage,
          postType,
          requestType,
          hasPage,
        });
        setSelectedRowKeys([]);
      },

      /**筛选查询 */
      searchByParams: (params: any = {}, hasPage = true) => {
        setRequestParams(params);

        //处理参数传空字符串的情况
        const filteredParams = Object.keys(params).reduce((acc: any, key) => {
          if (params[key] !== '') {
            acc[key] = params[key];
          }
          return acc;
        }, {});

        setCurrentPage(1);
        const searchPar = hasPage
          ? {
              url,
              filterParams: filteredParams,
              pageSize: pageSize,
              pageNum: 1,
              postType,
              requestType,
              hasPage: true,
            }
          : {
              url,
              filterParams: filteredParams,
              postType,
              requestType,
              hasPage: false,
            };
        run(searchPar);
        setSelectedRowKeys([]);
        getCheckData?.([]);
      },

      /** 重置表格 */
      reset: () => {
        setCurrentPage(1);
        setSelectedRowKeys([]);
        getCheckData?.([]);
      },

      /**重置当前页 */
      resetCurrentPage: () => {
        setSelectedRowKeys([]);
        getCheckData?.([]);
      },
      /**展开树形列表 */
      expandTable: () => {
        const data = tableData?.data ?? [];
        const recursionData = (list: any, keys: any[] = []) => {
          list.forEach((element: any) => {
            if (element?.children) {
              keys.push(element?.id);
              recursionData(element?.children, keys);
            }
          });
        };
        const keys: SetStateAction<any[]> | undefined = [];
        recursionData(data, keys);
        setExpandedRowKeys(keys);
      },
      /**折叠树形列表 */
      foldTable: () => {
        setExpandedRowKeys([]);
      },
    }));

    //获取选中项目和id
    const rowSelection = {
      onChange: (values: any[], selectedRows: any[]) => {
        setSelectedRowKeys(selectedRows.map((item) => item[rowKey]));
        getCheckData?.(selectedRows);
      },
    };

    /**翻页 */
    const currentPageChange = (page: any, size: any) => {
      // 判断当前page是否改变, 没有改变代表是change页面触发
      if (pageSize === size) {
        setCurrentPage(page === 0 ? 1 : page);
      }
    };

    /**切换页码 */
    const pageSizeChange = (page: any, size: any) => {
      setCurrentPage(1);
      setPageSize(size);
    };

    //渲染表格
    useEffect(() => {
      try {
        if (url === '' || !initTableAjax) return;
        run({
          url,
          filterParams: requestParams || filterParams,
          postType,
          requestType,
          hasPage: hasPage,
          pageSize: pageSize,
          pageNum: currentPage,
        });
      } catch (error) {
        console.log(error);
      }
    }, [pageSize, currentPage]);

    return (
      <div className={styles.generalTable}>
        <div className={styles.tableContent}>
          <ConfigProvider
            theme={{
              token: {
                borderRadius: 2,
                colorPrimaryHover: '#10a2fa',
                colorTextPlaceholder: '#0143cc',
                controlOutline: 'transparent', // 输入组件 激活边框颜色
                colorBorder: '#16489f', // checkout 边框
                colorBgBase: '#032566', // 所有组件的基础背景色
                colorBgContainer: 'transparent',
                colorPrimary: '#1292ff', // 主色调
                colorError: '#ff0000',
                colorBgElevated: ' #001d51', // 模态框、悬浮框背景色
                controlItemBgActiveHover: 'rgba(0, 84, 255, 0.2)', // 控制组件项在鼠标悬浮且激活状态下的背景颜色
                controlItemBgHover: 'rgba(0, 84, 255, 0.2)', // 下拉框，手鼠hover背景色
                controlItemBgActive: 'rgba(0, 84, 255, 0.3)', // 控制组件项在激活状态下的背景颜色
              },
            }}
          >
            <WrapperComponent
              bordered={true}
              dataSource={tableResultData?.items || []}
              pagination={false}
              rowKey={rowKey}
              columns={columns}
              loading={loading}
              locale={{
                emptyText: (
                  <div style={{ marginTop: 25 }}>
                    <Empty />{' '}
                  </div>
                ),
              }}
              rowSelection={
                !hideSelect
                  ? {
                      type: type,
                      columnWidth: '38px',
                      selectedRowKeys,
                      ...rowSelection,
                    }
                  : null
              }
              expandable={{
                expandedRowKeys: expandedRowKeys,
                onExpand: (_expanded: any, record: { id: any }) => {
                  const isExist = expandedRowKeys.find((item) => item === record.id);
                  if (isExist) {
                    const expandeds = expandedRowKeys.filter((item) => item !== record.id);
                    setExpandedRowKeys(expandeds);
                  } else {
                    const expandeds = [...expandedRowKeys, record.id];
                    setExpandedRowKeys(expandeds);
                  }
                },
              }}
              rowClassName={(_record: any, index: number) => {
                return index % 2 === 0 ? 'singleRow' : 'doubleRow';
              }}
              {...(rest as unknown as P)}
            />
          </ConfigProvider>
        </div>

        {hasPage && (
          <div className={styles.tablePage}>
            <div className={styles.tablePageLeft}>
              <span>显示第</span>
              <span className={styles.pageTips}>{tableResultData?.dataStartIndex || 1}</span>
              <span>到第</span>
              <span className={styles.pageTips}>{tableResultData?.dataEndIndex || 0}</span>
              <span>条记录,总共</span>
              <span className={styles.pageTips}>{tableResultData?.totalCount || 0}</span>
              <span>条记录</span>
            </div>
            <div>
              <ConfigProvider
                theme={{
                  token: {
                    colorTextDisabled: '#136db7',
                    colorBgContainer: '#052972',
                    colorPrimaryHover: '#10a2fa', // 组件激活边框颜色
                    controlOutline: 'transparent', // 输入组件 激活边框颜色
                    controlItemBgActive: '#1365b1', // 控制组件项在激活状态下的背景颜色
                    controlItemBgActiveHover: '#0f5694', // 控制组件项在鼠标悬浮且激活状态下的背景颜色
                  },
                }}
              >
                <Pagination
                  pageSize={pageSize}
                  onChange={currentPageChange}
                  size="small"
                  total={tableResultData?.totalCount || 0}
                  current={currentPage}
                  showSizeChanger
                  showQuickJumper
                  onShowSizeChange={pageSizeChange}
                />
              </ConfigProvider>
            </div>
          </div>
        )}
      </div>
    );
  };

export default forwardRef(withGeneralTable(Table));
