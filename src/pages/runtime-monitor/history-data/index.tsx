import ContentComponent from '@/components/content-component';
import ContentPage from '@/components/content-page';
import GeneralTable from '@/components/general-table';
import { getCurveHistoryList, getTableData } from '@/services/runtime-monitor/history';
import { handleDiffMins, judgmentIsToday } from '@/utils/common';
import { useRequest } from '@umijs/max';
import { Form, Spin } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import ReactECharts from 'echarts-for-react';
import { useEffect, useRef, useState } from 'react';
import { echartsOptions } from './echartsOptions';
import styles from './index.less';
import { RenderSearch } from './renderSearch';

const HistoryData = () => {
  // loading
  const [loading, setLoading] = useState<any>(false);
  const tableRef = useRef<HTMLDivElement>(null);
  // 表格容器
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const searchItemRef = useRef<HTMLDivElement>(null);
  // 表格高度
  const tableHeightRef = useRef<number>(200);
  const [form] = Form.useForm();
  // 选中表格数据
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  // 表格列表 columns
  const [tableColumns, setTableColumns] = useState<any>([]);
  // 表格数据 资源
  const [tableDataSource, setTableDataSource] = useState<any>([]);
  // 表格查询还是曲线查询
  const [tableQuery, setTableQuery] = useState<boolean>(true);
  // 曲线 echart options
  const [chartOptions, setChartOptions] = useState<object>({});
  // 点位数据
  const [pointOption, setPointOption] = useState([]);
  // table
  const columns: any = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      align: 'center' as any,
    },
  ];

  /** 请求表格数据 */
  const { run: fetchTableData } = useRequest(getTableData, {
    manual: true,
    onSuccess: (data) => {
      const dataSource: any = [];
      if (data.records && data.timeRange) {
        data.records.forEach((item: any) => {
          const itemData = item.data.map((itemValue: string, index: number) => {
            return {
              [item.name]: itemValue,
              time: data.timeRange[index],
            };
          });
          itemData.forEach((child: any) => {
            const exist = dataSource.findIndex((dataChild: any) => dataChild.time === child.time);
            if (exist === -1) {
              dataSource.push(child);
            } else {
              dataSource[exist] = Object.assign({}, dataSource[exist], child);
            }
          });
        });
      }
      setTableDataSource(dataSource);
    },
  });

  /** 点击表格、曲线查询 */
  const searchHistoryData = async (value: any, pointOption: any) => {
    setLoading(true);
    const measurementParams = value.measurementId.map((item: any) => {
      const point = pointOption.filter((itemPoint: any) => itemPoint.measurementId === item)[0];
      return {
        columnName: point.dataDesc,
        deviceCode: point.deviceCode,
        measurementId: point.measurementId,
        type: point.type,
        unit: point.unit,
      };
    });

    const params = {
      measurementParams: measurementParams.map((item: any) => {
        const itemPoint = {
          deviceCode: item.deviceCode,
          measurementId: item.measurementId,
          type: item.type,
          unit: item.unit,
        };
        return itemPoint;
      }),
      startTime: dayjs(value.date[0]).format('YYYY-MM-DD HH:mm:ss'),
      endTime: dayjs(value.date[1]).format('YYYY-MM-DD HH:mm:ss'),
      step: value.step,
      mutation: false,
    };
    if (tableQuery) {
      const selectCol: any = measurementParams.map((item: any) => {
        return {
          title: `${item.columnName} ${item.unit ? `(${item.unit})` : ''}`,
          dataIndex: item.columnName,
          key: item.columnName,
          align: 'center' as any,
          ellipsis: true,
          render: (text: string) => parseFloat(text).toFixed(2), // 保留两位小数
        };
      });
      setTableColumns([...columns, ...selectCol]);
      await fetchTableData(params);
    } else {
      // 曲线查询
      await getCurveHistoryList(params).then((resolve: any) => {
        const { code, data } = resolve;
        if (code !== 200) {
          return false;
        }
        let legendData = [],
          series = [],
          xAxisData = [];

        legendData = data.records.map((item: any) => item.name).filter((item: any) => item);
        xAxisData = data.timeRange;
        series = data.records.map((item: any) => {
          return {
            type: 'line',
            symbol: 'none',
            name: item.name,
            data: judgmentIsToday(dayjs(params.endTime, 'YYYY-MM-DD'))
              ? item.data
                  .slice(0, handleDiffMins(new Date(), new Date(params.startTime), params.step) + 1)
                  .map((item: any) => Number(item).toFixed(2))
              : item.data.map((item: any) => Number(item).toFixed(2)),
          };
        });
        const options = echartsOptions(legendData, series, xAxisData);
        setChartOptions(options);
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    setTableColumns(columns);
  }, []);

  // 测点高度变化事件监听
  const onValuesChange = () => {
    // 高度获取会延迟一步，使用setTimeout来确保获取到正确的高度
    setTimeout(() => {
      if (tableWrapRef.current?.offsetHeight && searchItemRef.current?.offsetHeight) {
        const height =
          tableWrapRef.current?.offsetHeight - searchItemRef.current?.offsetHeight - 50;
        tableHeightRef.current = height;
      }
    }, 0);
  };

  return (
    <ContentPage>
      <ContentComponent title="历史数据">
        <div className={styles.pageContainer}>
          <div className={styles.searchItem} ref={searchItemRef}>
            <RenderSearch
              form={form}
              searchHistoryData={searchHistoryData}
              tableSelectRows={tableSelectRows}
              setTableQuery={setTableQuery}
              pointOption={pointOption}
              setPointOption={setPointOption}
              onValuesChange={onValuesChange}
            />
          </div>
          <div className={styles.pageBody} ref={tableWrapRef}>
            {tableQuery ? (
              <GeneralTable
                ref={tableRef}
                initTableAjax={false}
                columns={tableColumns}
                dataSource={tableDataSource}
                rowKey="time"
                bordered={false}
                scroll={{ y: tableHeightRef.current }}
                getCheckData={(data) => setTableSelectRows(data)}
                type="checkbox"
                hasPage={false}
                loading={loading}
              />
            ) : loading ? (
              <Spin
                size="large"
                className={styles.loadingStyle}
                style={{ height: tableHeightRef.current }}
              />
            ) : (
              <ReactECharts
                option={chartOptions}
                notMerge={true}
                style={{ width: '100%', height: tableHeightRef.current }}
                lazyUpdate={false}
                theme={'theme_name'}
              />
            )}
          </div>
        </div>
      </ContentComponent>
    </ContentPage>
  );
};
export default HistoryData;
