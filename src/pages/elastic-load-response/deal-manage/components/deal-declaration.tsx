import CustomCharts from '@/components/custom-charts';
import GeneralTable from '@/components/general-table';
import SegmentedTheme from '@/components/segmented-theme';
import {
  FileTextOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Input, Select, Space, Table } from 'antd';
import { useState } from 'react';
import styles from '../index.less';
import {
  VPPDetailColumns,
  capacityColumns,
  capacityOptions,
  clearingResultColumns,
  declarationInfoColumns,
  declarationOptions,
  priceColumns,
  priceOptions,
  userDetailColumns,
} from '../utils';
import ClearingModal from './clearing-modal';
import DeclarationDetailModal from './declaration-detail-modal';
// 交易申报
const DealDeclaration = () => {
  // 曲线or表格
  const [curveOrTable, setCurveOrTable] = useState<boolean>(true);
  // 虚拟电厂or代理用户
  const [VPPOrUser, setVPPOrUser] = useState<boolean>(true);
  // 申报信息
  const infoTableData = [
    {
      index: 1,
      invitationPlan: '计划A',
      operatingDay: '2023-07-05',
      adjustableCapacity: 500,
      declaredTransactionVolume: 3000,
      declaredAveragePrice: 0.56,
      estimatedRevenue: 1680,
      status: 0,
      updateTime: '2023-07-04 10:20:00',
    },
    {
      index: 2,
      invitationPlan: '计划B',
      operatingDay: '2023-07-09',
      adjustableCapacity: 450,
      declaredTransactionVolume: 2800,
      declaredAveragePrice: 0.59,
      estimatedRevenue: 1652,
      status: 0,
      updateTime: '2023-07-03 14:30:00',
    },
    {
      index: 3,
      invitationPlan: '计划C',
      operatingDay: '2023-07-12',
      adjustableCapacity: 600,
      declaredTransactionVolume: 4000,
      declaredAveragePrice: 0.61,
      estimatedRevenue: 2440,
      status: 1,
      updateTime: '2023-07-02 09:15:00',
    },
    {
      index: 4,
      invitationPlan: '计划C',
      operatingDay: '2023-07-12',
      adjustableCapacity: 600,
      declaredTransactionVolume: 4000,
      declaredAveragePrice: 0.61,
      estimatedRevenue: 2440,
      status: 1,
      updateTime: '2023-07-02 09:15:00',
    },
  ];
  // 申报详情-虚拟电厂
  const [VPPDetailData, setVPPDetailData] = useState<any>([
    { timePeriod: '00:00:00', demandCapacity: '1200', adjust: 0, plan: 1000 },
    { timePeriod: '01:00:00', demandCapacity: '1200', adjust: 0, plan: 1000 },
    { timePeriod: '02:00:00', demandCapacity: '1200', adjust: 0, plan: 1000 },
    { timePeriod: '03:00:00', demandCapacity: '1000', adjust: 0, plan: 1000 },
    { timePeriod: '03:00:00', demandCapacity: '1000', adjust: 0, plan: 1000 },
    { timePeriod: '03:00:00', demandCapacity: '1000', adjust: 0, plan: 1000 },
    { timePeriod: '03:00:00', demandCapacity: '1000', adjust: 0, plan: 1000 },
    { timePeriod: '03:00:00', demandCapacity: '1000', adjust: 0, plan: 1000 },
    { timePeriod: '03:00:00', demandCapacity: '1000', adjust: 0, plan: 1000 },
    { timePeriod: '03:00:00', demandCapacity: '1000', adjust: 0, plan: 1000 },
    { timePeriod: '03:00:00', demandCapacity: '1000', adjust: 0, plan: 1000 },
    { timePeriod: '03:00:00', demandCapacity: '1000', adjust: 0, plan: 1000 },
    { timePeriod: '03:00:00', demandCapacity: '1000', adjust: 0, plan: 1000 },
  ]);
  // 申报容量弹框
  const [capacityVisible, setCapacityVisible] = useState<boolean>(false);
  // 申报容量曲线or表格
  const [capacityCurveOrTable, setCapacityCurveOrTable] = useState<boolean>(true);
  // 申报价格弹框
  const [priceVisible, setPriceVisible] = useState<boolean>(false);
  // 申报价格曲线or表格
  const [priceCurveOrTable, setPriceCurveOrTable] = useState<boolean>(true);
  // 交易类别
  const [detailType, setDetailType] = useState<any>(0);
  // 出清明细弹框
  const [clearingVisible, setClearingVisible] = useState<boolean>(false);

  return (
    <>
      <div className={styles.dealDeclarationPage}>
        <div className={styles.header}>
          <Space size={15}>
            <Select
              options={[
                { label: '需求响应', value: 0 },
                { label: '辅助服务', value: 1 },
              ]}
              defaultValue={0}
              style={{ width: 200 }}
            />
            <Select
              options={[
                { label: '公告中', value: 0 },
                { label: '已出清', value: 1 },
              ]}
              defaultValue={0}
              style={{ width: 200 }}
              onChange={(value) => setDetailType(value)}
            />
            <Input placeholder="请输入邀约计划" style={{ width: 200 }} />
          </Space>
          <Space size={15} className={styles.right}>
            <Button style={{ marginLeft: '40px' }}>
              <ReloadOutlined />
              重置
            </Button>
            <Button>
              <SearchOutlined />
              查询
            </Button>
          </Space>
        </div>
        <div className={styles.container}>
          {detailType === 0 ? (
            <>
              <div className={styles.topContainer}>
                <div className={styles.titleHeader}>
                  <div className={styles.left} />
                  <span className={styles.blueTitle}>申报信息</span>
                  <Space>
                    <Button>
                      <PlusCircleOutlined />
                      新增
                    </Button>
                    <Button>
                      <FileTextOutlined />
                      申报
                    </Button>
                  </Space>
                </div>
                <GeneralTable
                  // url="/api/financial/report/listTemplateByGov"
                  // ref={tableRef}
                  columns={declarationInfoColumns}
                  dataSource={infoTableData}
                  rowKey="id"
                  size="middle"
                  type="checkbox"
                  bordered={false}
                  requestType="get"
                  scroll={{ y: 200 }}
                  // getCheckData={(data) => setTableSelectRows(data)}
                  hasPage
                  // filterParams={{ date: dayjs(new Date()).format('YYYY-MM-DD'), type: 0, unit: 'day' }}
                />
              </div>
              <div className={styles.bottomContainer}>
                <div className={styles.titleHeader}>
                  <div className={styles.left}>
                    <SegmentedTheme
                      options={['虚拟电厂', '代理用户']}
                      getSelectedValue={(value) => {
                        const res = value === '虚拟电厂';
                        if (!res) setCurveOrTable(true);
                        setVPPOrUser(res);
                      }}
                    />
                  </div>
                  <span className={styles.blueTitle}>申报详情</span>
                  <div className={styles.right}>
                    {VPPOrUser && (
                      <SegmentedTheme
                        options={[
                          {
                            label: '曲线',
                            value: '曲线',
                            icon: <i className="iconfont">&#xe63a;</i>,
                          },
                          {
                            label: '表格',
                            value: '表格',
                            icon: <i className="iconfont">&#xe639;</i>,
                          },
                        ]}
                        getSelectedValue={(value) => setCurveOrTable(value === '曲线')}
                      />
                    )}
                  </div>
                </div>
                <div className={styles.tableOrChart}>
                  {VPPOrUser &&
                    (curveOrTable ? (
                      <CustomCharts options={declarationOptions([5, 20, 36, 10, 10])} />
                    ) : (
                      <GeneralTable
                        columns={VPPDetailColumns}
                        dataSource={VPPDetailData}
                        rowKey="id"
                        size="middle"
                        hideSelect
                        bordered={false}
                        scroll={{ y: 170 }}
                        hasPage={false}
                      />
                    ))}
                  {!VPPOrUser && (
                    <GeneralTable
                      columns={userDetailColumns(setCapacityVisible, setPriceVisible)}
                      dataSource={VPPDetailData}
                      rowKey="id"
                      size="middle"
                      type="checkbox"
                      bordered={false}
                      scroll={{ y: 170 }}
                      hasPage={false}
                    />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={styles.handledContainer}>
              <span className={styles.blueTitle}>申报信息</span>
              <Table
                columns={clearingResultColumns(setClearingVisible)}
                dataSource={[{}]}
                rowKey="id"
                size="middle"
                bordered={false}
                style={{ paddingTop: '15px', width: '100%' }}
              />
            </div>
          )}
        </div>
      </div>
      <DeclarationDetailModal
        visible={capacityVisible}
        setVisible={setCapacityVisible}
        options={capacityOptions([5, 20, 36, 10, 10])}
        setCurveOrTable={setCapacityCurveOrTable}
        curveOrTable={capacityCurveOrTable}
        columns={capacityColumns}
        dataSource={[
          { timePeriod: '00:00:00', capacity: '1200' },
          { timePeriod: '01:00:00', capacity: '1200' },
        ]}
        title="申报容量"
      />
      <DeclarationDetailModal
        visible={priceVisible}
        setVisible={setPriceVisible}
        options={priceOptions([5, 20, 36, 10, 10])}
        setCurveOrTable={setPriceCurveOrTable}
        curveOrTable={priceCurveOrTable}
        columns={priceColumns}
        dataSource={[
          { timePeriod: '00:00:00', price: '1200' },
          { timePeriod: '01:00:00', price: '1200' },
        ]}
        title="申报价格"
      />
      <ClearingModal visible={clearingVisible} setVisible={setClearingVisible} />
    </>
  );
};

export default DealDeclaration;
