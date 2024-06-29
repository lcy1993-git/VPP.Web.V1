import CustomCharts from '@/components/custom-charts';
import GeneralTable from '@/components/general-table';
import SegmentedTheme from '@/components/segmented-theme';
import {
  getAncillaryChart,
  getUserDetail,
  getVPPCurve,
} from '@/services/elastic-load-response/deal-manage';
import {
  FileTextOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Input, Select, Space, Table, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from '../index.less';
import {
  VPPDetailColumns,
  clearingResultColumns,
  declarationInfoColumns,
  declarationOptions,
  supportColumns,
  supportOptions,
  userDetailColumns,
} from '../utils';
import AddDeclarationModal from './add-declaration-modal';
import ClearingModal from './clearing-modal';
import DeclarationDetailModal from './declaration-detail-modal';
import DeleteModal from './deleteModal';

// 交易申报
const DealDeclaration = () => {
  // 申报信息表格
  const tableRef = useRef(null);
  // 已出请
  const clearingTableRef = useRef(null);
  // 查询input值
  const [inputValue, setInputValue] = useState<string>('');
  // 删除/撤销/申报弹框
  const [open, setOpen] = useState<boolean>(false);
  // 删除/撤销/申报弹框类型
  const [modalType, setModalType] = useState<
    'delete' | 'cancel' | 'declare' | 'userDelete' | 'batchDeclare'
  >('delete');
  // 删除/撤销/申报弹框类型id
  const [modalId, setModalId] = useState<any>([]);
  // 申报详情-曲线or表格
  const [curveOrTable, setCurveOrTable] = useState<boolean>(true);
  // 申报详情-虚拟电厂or代理用户
  const [VPPOrUser, setVPPOrUser] = useState<boolean>(true);
  // 申报详情-查看计划id
  const [identificationNum, setIdentificationNum] = useState<string | null>(null);
  // 申报详情-代理用户容量/价格弹框
  const [userModalOpen, setUserModalOpen] = useState<boolean>(false);
  // 申报详情-代理用户数据(type,code,id)
  const [userModalInfo, setUserModalInfo] = useState<any>(null);
  // 交易类别(公告中/已出请)
  const [dealType, setDealType] = useState<number>(0);
  // 申报类别(需求响应/辅助服务)
  const [declarationType, setDeclarationType] = useState<number>(0);
  // 辅助服务-曲线or表格
  const [supportCurveOrTable, setSupportCurveOrTable] = useState<boolean>(true);
  // 已出清明细弹框
  const [clearingVisible, setClearingVisible] = useState<boolean>(false);
  // 已出请明细查看id
  const [clearingId, setClearingId] = useState<string>('');
  // 新增申报弹框
  const [addDeclarationOpen, setAddDeclarationOpen] = useState<boolean>(false);
  // 新增申报弹框类型
  const [addDeclarationInfo, setAddDeclarationInfo] = useState<any>({});
  // 表格 checkbox 被选中
  const [tableSelectRows, setTableSelectRows] = useState<any>([]);

  // 申报详情-虚拟电厂
  const { run: fetchVPPCurve, data: VPPCurve } = useRequest(getVPPCurve, {
    manual: true,
  });

  // 申报详情-代理用户
  const { run: fetchUserDetail, data: userDetail } = useRequest(getUserDetail, {
    manual: true,
  });

  // 辅助服务
  const { run: fetchAncillaryChart, data: ancillaryChart } = useRequest(getAncillaryChart, {
    manual: true,
  });

  // 筛选公告中-申报信息-表格数据
  const searchTableData = () => {
    if (declarationType === 0) {
      // @ts-ignore
      tableRef?.current?.searchByParams({
        identificationNum: inputValue,
      });
    } else {
      fetchAncillaryChart(inputValue);
    }
  };

  const refresh = () => {
    if (modalType === 'userDelete') {
      if (identificationNum) fetchUserDetail(identificationNum);
    } else {
      if (tableRef && tableRef.current) {
        //@ts-ignore
        tableRef.current.refresh();
      }
    }
  };

  // 申报按钮
  const handleDeclare = () => {
    if (tableSelectRows && tableSelectRows.length > 0) {
      setModalType('batchDeclare');
      setOpen(true);
      setModalId(tableSelectRows.map((item: any) => item.identificationNum));
    } else {
      message.warning('请选择数据后进行操作！');
    }
  };

  // 点击申报信息行请求虚拟电厂/代理用户
  useEffect(() => {
    if (identificationNum) {
      if (VPPOrUser) {
        fetchVPPCurve(identificationNum);
      } else {
        fetchUserDetail(identificationNum);
      }
    }
  }, [identificationNum, VPPOrUser]);

  useEffect(() => {
    setInputValue('');
    if (declarationType === 1) {
      fetchAncillaryChart();
    }
  }, [declarationType]);

  useEffect(() => {
    if (dealType === 1) {
      if (clearingTableRef && clearingTableRef.current) {
        //@ts-ignore
        clearingTableRef.current.refresh();
      }
    } else {
      if (tableRef && tableRef.current) {
        //@ts-ignore
        tableRef.current.refresh();
      }
    }
  }, [dealType]);

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
              onChange={(value) => setDeclarationType(value)}
            />
            {declarationType === 0 && (
              <Select
                options={[
                  { label: '公告中', value: 0 },
                  { label: '已出清', value: 1 },
                ]}
                value={dealType}
                style={{ width: 200 }}
                onChange={(value) => setDealType(value)}
              />
            )}
            <Input
              placeholder="请输入邀约计划"
              style={{ width: 200 }}
              onChange={(e: any) => setInputValue(e.target.value)}
              value={inputValue}
            />
          </Space>
          <Space size={15} className={styles.right}>
            <Button style={{ marginLeft: '40px' }} onClick={() => setInputValue('')}>
              <ReloadOutlined />
              重置
            </Button>
            <Button onClick={searchTableData}>
              <SearchOutlined />
              查询
            </Button>
          </Space>
        </div>
        <div className={styles.container}>
          {declarationType === 0 ? (
            dealType === 0 ? (
              <>
                <div className={styles.topContainer}>
                  <div className={styles.titleHeader}>
                    <div className={styles.left} />
                    <span className={styles.blueTitle}>申报信息</span>
                    <Space>
                      <Button
                        onClick={() => {
                          setAddDeclarationOpen(true);
                          setAddDeclarationInfo({ isEdit: false });
                        }}
                      >
                        <PlusCircleOutlined />
                        新增
                      </Button>
                      <Button onClick={handleDeclare}>
                        <FileTextOutlined />
                        申报
                      </Button>
                    </Space>
                  </div>
                  <GeneralTable
                    url="/api/demand/response/transactionBidding/demandResponse/list"
                    ref={tableRef}
                    columns={declarationInfoColumns(setModalType, setOpen, setModalId)}
                    rowKey="identificationNum"
                    size="middle"
                    type="checkbox"
                    bordered={false}
                    requestType="get"
                    scroll={{ y: 200 }}
                    onRow={(record) => {
                      return {
                        onClick: () => setIdentificationNum(record.identificationNum), // 点击行
                      };
                    }}
                    getCheckData={(data) => setTableSelectRows(data)}
                    hasPage
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
                      {identificationNum && VPPOrUser && (
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
                    {identificationNum &&
                      (VPPOrUser ? (
                        curveOrTable ? (
                          <CustomCharts options={declarationOptions(VPPCurve)} />
                        ) : (
                          <Table
                            columns={VPPDetailColumns}
                            dataSource={VPPCurve?.xaxis.map(
                              (timePeriod: string, index: number) => ({
                                key: index,
                                timePeriod,
                                plan: VPPCurve?.planValueList[index],
                                adjust: VPPCurve?.regulateValueList[index],
                                baseline: VPPCurve?.baselineValueList[index],
                              }),
                            )}
                            rowKey="id"
                            size="middle"
                            bordered={false}
                            scroll={{ y: 170 }}
                            pagination={false}
                          />
                        )
                      ) : (
                        <Table
                          columns={userDetailColumns(
                            setUserModalOpen,
                            setUserModalInfo,
                            setModalType,
                            setOpen,
                            setModalId,
                            setAddDeclarationOpen,
                            setAddDeclarationInfo,
                          )}
                          dataSource={userDetail}
                          // rowKey="agentId"
                          size="middle"
                          bordered
                          scroll={{ y: 170 }}
                          pagination={false}
                        />
                      ))}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.handledContainer}>
                <span className={styles.blueTitle}>申报信息</span>
                <GeneralTable
                  ref={clearingTableRef}
                  url="/api/demand/response/transactionBidding/settled"
                  columns={clearingResultColumns(setClearingVisible, setClearingId)}
                  rowKey="identificationNum"
                  size="middle"
                  type="checkbox"
                  bordered={true}
                  requestType="get"
                  scroll={{ y: 200 }}
                  style={{ paddingTop: '15px', width: '100%' }}
                  hasPage
                />
              </div>
            )
          ) : (
            <div className={styles.handledContainer} style={{ alignItems: 'end' }}>
              <SegmentedTheme
                options={[
                  { label: '曲线', value: '曲线', icon: <i className="iconfont">&#xe63a;</i> },
                  { label: '表格', value: '表格', icon: <i className="iconfont">&#xe639;</i> },
                ]}
                getSelectedValue={(value) => setSupportCurveOrTable(value === '曲线')}
              />
              {supportCurveOrTable ? (
                <CustomCharts options={supportOptions(ancillaryChart)} />
              ) : (
                <Table
                  columns={supportColumns}
                  dataSource={ancillaryChart?.xaxis.map((timePeriod: string, index: number) => ({
                    key: index,
                    timePeriod,
                    down: ancillaryChart?.downwardList[index],
                    up: ancillaryChart?.upwardList[index],
                  }))}
                  bordered
                  scroll={{ y: 490 }}
                  pagination={false}
                  style={{ paddingTop: '15px' }}
                />
              )}
            </div>
          )}
        </div>
      </div>
      {/* 代理用户--申报详情容量/价格曲线弹框 */}
      <DeclarationDetailModal
        open={userModalOpen}
        setOpen={setUserModalOpen}
        info={userModalInfo}
      />
      {/* 已出请-详情弹框 */}
      <ClearingModal
        visible={clearingVisible}
        setVisible={setClearingVisible}
        clearingId={clearingId}
      />
      {/* 需求响应-公告中-申报/删除/撤销弹框 */}
      <DeleteModal
        open={open}
        setModalOpen={setOpen}
        modalType={modalType}
        ids={modalId}
        refresh={refresh}
      />
      {/* 新增申报 */}
      <AddDeclarationModal
        open={addDeclarationOpen}
        setModalOpen={setAddDeclarationOpen}
        modalInfo={addDeclarationInfo}
      />
    </>
  );
};

export default DealDeclaration;
