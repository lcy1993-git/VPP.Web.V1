import CustomCharts from '@/components/custom-charts';
import SegmentedTheme from '@/components/segmented-theme';
import {
  addDeclaration,
  getAdjustable,
  getUserCapacity,
  getUserTableData,
} from '@/services/elastic-load-response/deal-manage';
import { CloseOutlined, LineChartOutlined, SaveOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Input, Row, Select, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import { adjustableColumns, adjustableOptions } from '../utils';

// 初始化label
const InitLabel = (props: any) => {
  const { data, identificationNum, save, setSave, modalInfo } = props;
  const [substationCode, setSubstationCode] = useState<string>('');
  const [curve, setCurve] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [curveOrTable, setCurveOrTable] = useState<boolean>(true);
  const [adjustable, setAdjustable] = useState<any>({});

  // 获取可调容量
  const { run: fetchUserCapacity, data: capacity } = useRequest(getUserCapacity, {
    manual: true,
  });

  // 获取表格数据
  const { run: fetchUserTableData, data: userTableList } = useRequest(getUserTableData, {
    manual: true,
  });

  // 曲线数据
  const { run: fetchAdjustable } = useRequest(getAdjustable, {
    manual: true,
    onSuccess: (res) => setAdjustable(res),
  });

  // 保存
  const { run: fetchAddDeclaration } = useRequest(addDeclaration, {
    manual: true,
  });

  useEffect(() => {
    if (substationCode) {
      fetchUserCapacity(substationCode);
    }
  }, [substationCode]);

  // 表格数据
  useEffect(() => {
    if (identificationNum && substationCode && !save) {
      fetchUserTableData(identificationNum, substationCode);
    }
  }, [identificationNum, substationCode]);

  // 初始化申报数据数组
  const [declarationData, setDeclarationData] = useState<any>([]);

  useEffect(() => {
    if (userTableList) {
      setDeclarationData(
        userTableList.startTimeList.map((_: any, index: any) => ({
          startTime: userTableList.startTimeList[index],
          endTime: userTableList.endTimeList[index],
          baselineLoad: userTableList.baselineLoadList[index],
          declaredCapacity: '',
          declaredPrice: '',
        })),
      );
    }
  }, [userTableList]);

  // 处理输入改变
  const handleInputChange = (
    index: number,
    field: keyof (typeof declarationData)[0],
    value: string,
  ) => {
    setDeclarationData((prevData) =>
      prevData.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  // 保存处理函数
  const handleSave = () => {
    if (substationCode) {
      // 确保所有输入都有值
      const allFilled = declarationData.every(
        (item: any) => item.declaredCapacity && item.declaredPrice,
      );
      if (allFilled) {
        const capacities = declarationData.map((item: any) => item.declaredCapacity);
        const prices = declarationData.map((item: any) => item.declaredPrice);
        fetchAddDeclaration({
          substationCode: substationCode,
          declaredPriceList: prices,
          declaredCapacityList: capacities,
        });
        setDisabled(true);
        setSave(true);
      } else {
        message.error('请确保所有申报容量和申报价格都已填写！');
      }
    }
  };

  const addDeclarationColumns = [
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '基线负荷',
      dataIndex: 'baselineLoad',
      key: 'baselineLoad',
    },
    {
      title: '申报容量',
      render: (_: any, record: any, index: any) => (
        <Input
          value={record.declaredCapacity}
          type="number"
          disabled={disabled}
          onChange={(e) => handleInputChange(index, 'declaredCapacity', e.target.value)}
        />
      ),
      key: 'declaredCapacity',
    },
    {
      title: '申报价格',
      render: (_: any, record: any, index: any) => (
        <Input
          value={record.declaredPrice}
          type="number"
          disabled={disabled}
          onChange={(e) => handleInputChange(index, 'declaredPrice', e.target.value)}
        />
      ),
      key: 'declaredPrice',
    },
  ];

  useEffect(() => {
    if (modalInfo?.isEdit) {
      setSubstationCode(modalInfo?.substationCode);
    }
  }, [modalInfo]);

  return (
    <>
      <div className={styles.header}>
        <Row>
          用户：
          <Select
            style={{ width: 220 }}
            options={data}
            fieldNames={{ label: 'name', value: 'substationCode' }}
            onChange={(value) => setSubstationCode(value)}
            value={substationCode}
            disabled={disabled || modalInfo?.isEdit}
          />
          容量：
          <Input style={{ width: 220 }} disabled value={capacity} />
        </Row>
        <Space>
          <Button
            onClick={async () => {
              if (substationCode) {
                await fetchAdjustable(substationCode);
                setCurve(true);
              } else {
                message.info('请选择用户后在进行查看');
              }
            }}
          >
            <LineChartOutlined />
            曲线
          </Button>
          <Button onClick={handleSave}>
            <SaveOutlined />
            保存
          </Button>
        </Space>
      </div>
      <div style={{ height: '230px', paddingTop: '5px' }}>
        {curve ? (
          <>
            <div className={styles.chart}>
              <div style={{ width: '160px' }} />
              <span className={styles.title}>{adjustable?.substationName}-可调节能力</span>
              <div>
                <SegmentedTheme
                  options={[
                    { label: '曲线', value: '曲线', icon: <i className="iconfont">&#xe63a;</i> },
                    { label: '表格', value: '表格', icon: <i className="iconfont">&#xe639;</i> },
                  ]}
                  getSelectedValue={(value: string) => setCurveOrTable(value === '曲线')}
                />
                <CloseOutlined
                  onClick={() => setCurve(false)}
                  style={{ marginLeft: '10px', color: '#05BCF3', fontSize: '20px' }}
                />
              </div>
            </div>
            {curveOrTable ? (
              <CustomCharts options={adjustableOptions(adjustable)} />
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
          </>
        ) : (
          <Table
            dataSource={declarationData}
            columns={addDeclarationColumns}
            pagination={false}
            size="small"
            scroll={{ y: '180' }}
          />
        )}
      </div>
    </>
  );
};

export default InitLabel;
