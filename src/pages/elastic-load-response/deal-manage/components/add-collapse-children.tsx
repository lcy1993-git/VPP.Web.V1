import CustomCharts from '@/components/custom-charts';
import SegmentedTheme from '@/components/segmented-theme';
import { getAdjustable } from '@/services/elastic-load-response/deal-manage';
import { useRequest } from 'ahooks';
import { Input, Table } from 'antd';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import { adjustableColumns, adjustableOptions } from '../utils';
import { useMyContext } from './context';

const AddCollapseChildren = (props: any) => {
  const { label } = props;

  const { collapseItemData, tableInputDisable, collapseChildrenStatus } = useMyContext();

  // 表格数据
  const [dataSource, setDataSource] = useState([]);
  // 曲线数据
  const [adjustable, setAdjustable] = useState<any>({});
  // 曲线和表格切喊
  const [chartOrTable, setChartOrTable] = useState<'line' | 'table'>('line');
  // 表格 columnbs
  const addDeclarationColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      align: 'center' as any,
      render: (_text: any, _record: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: '响应时段起点',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '响应时段终点',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '基线负荷(MW)',
      dataIndex: 'baselineLoad',
      key: 'baselineLoad',
    },
    {
      title: '申报容量(MW)',
      render: (_: any, record: any, index: any) => (
        <Input
          value={record.declaredCapacity}
          type="number"
          disabled={tableInputDisable[label]}
          onChange={(e) => handleInputChange(index, 'declaredCapacity', e.target.value)}
        />
      ),
      key: 'declaredCapacity',
    },
    {
      title: '申报价格(元/MWh)',
      render: (_: any, record: any, index: any) => (
        <Input
          value={record.declaredPrice}
          type="number"
          disabled={tableInputDisable[label]}
          onChange={(e) => handleInputChange(index, 'declaredPrice', e.target.value)}
        />
      ),
      key: 'declaredPrice',
    },
  ];

  // 曲线数据
  const { run: fetchAdjustable } = useRequest(getAdjustable, {
    manual: true,
    onSuccess: (res) => {
      if (res.code === 200 && res.data) {
        setAdjustable(res.data);
      }
    },
  });

  useEffect(() => {
    if (
      collapseItemData[label] &&
      collapseItemData[label].userId &&
      !collapseItemData[label].isEdit
    ) {
      const tableData = collapseItemData[label].tableData || [];
      const userTableList = tableData.startTimeList.map((_: any, index: any) => ({
        startTime: tableData.startTimeList[index],
        endTime: tableData.endTimeList[index],
        baselineLoad: tableData.baselineLoadList[index],
        declaredCapacity: '',
        declaredPrice: '',
        key: `${label} - ${index}`,
      }));
      setDataSource(userTableList);
      // 请求曲线数据
      fetchAdjustable(collapseItemData[label].userId);
    }
  }, [JSON.stringify(collapseItemData)]);

  // 处理输入改变
  const handleInputChange = (index: number, field: any, value: string) => {
    setDataSource((prevData: any) =>
      prevData.map((item: any, i: number) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  useEffect(() => {
    collapseItemData[label] = {
      ...collapseItemData[label],
      tableData: dataSource,
      isEdit: true,
    };
  }, [dataSource]);

  return (
    <div style={{ height: 210 }}>
      {!collapseChildrenStatus[label] ? (
        <div className={styles.chart}>
          <div className={styles.chartHead}>
            <span className={styles.chartHeadItem}></span>
            <span className={styles.title}>{adjustable?.substationName}-可调节能力</span>
            <span className={styles.chartHeadItem}>
              <SegmentedTheme
                size="small"
                options={[
                  { label: '曲线', value: 'line', icon: <i className="iconfont">&#xe63a;</i> },
                  { label: '表格', value: 'table', icon: <i className="iconfont">&#xe639;</i> },
                ]}
                getSelectedValue={(value: any) => setChartOrTable(value)}
              />
            </span>
          </div>
          <div className={styles.chartContainer}>
            {chartOrTable === 'line' ? (
              <CustomCharts options={adjustableOptions(adjustable)} height={200} width={1100} />
            ) : (
              <Table
                columns={adjustableColumns}
                dataSource={adjustable?.xaxis.map((timePeriod: string, index: number) => ({
                  key: index,
                  timePeriod,
                  adjustableCapacity: adjustable?.adjustableCapacityList[index],
                  baselineLoad: adjustable?.baselineLoadList[index],
                  energyStorageDischargePrediction:
                    adjustable?.energyStorageDischargePredictionList[index],
                  loadForecasting: adjustable?.loadForecastingList[index],
                  powerGenerationForecasting: adjustable?.powerGenerationForecastingList[index],
                }))}
                rowKey="index"
                size="small"
                bordered
                scroll={{ y: 140 }}
                pagination={false}
                style={{ paddingTop: '5px' }}
              />
            )}
          </div>
          <div></div>
        </div>
      ) : (
        <Table
          dataSource={dataSource}
          columns={addDeclarationColumns}
          pagination={false}
          size="small"
          key="key"
          scroll={{ y: 200 }}
        />
      )}
    </div>
  );
};
export default AddCollapseChildren;
