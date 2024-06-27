import CustomCharts from '@/components/custom-charts';
import GeneralTable from '@/components/general-table';
import SegmentedTheme from '@/components/segmented-theme';
import { getInvitePlanCurve, getInvitePlanList, getInviteResponsePlanData } from '@/services/elastic-load-response/components';
import {
  DownOutlined,
  InsertRowAboveOutlined,
  LineChartOutlined,
  ReloadOutlined,
  SearchOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Collapse, Input, Modal, Select, Space, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from '../index.less';
import { responseChartOptions, responseDetalColumns, responsePlanTableData, responseTableColumns, responseTableData } from '../utils';

const DealControlManager = () => {
  // 详情模态框状态
  const [visibile, setVisibile] = useState<boolean>(false)
  // 邀约响应计划
  const [responseChartOrTable, setResponseChartOrTable] = useState<'line' | 'table'>('line');
  // 模态框图表和表格切换
  const [modalChartOrTable, setModalChartOrTable] = useState<'line' | 'table'>('line');
  // 邀约响应计划表格实例
  const responseTableRef = useRef(null);
  // 计划类型
  const [planType, setPlanType] = useState<1 | 2>(1);
  // 邀约计划列表
  const [collapseItems, setCollapseItems] = useState<any>(null);
  // 当前邀约计划ID
  const [invitePlanId, setInvitePlanId] = useState<string>('');
  // 响应计划数据
  const [responsePlanData, setResponsePlanData] = useState<any>(null);
  // 计划分解详情输入框
  const [content, setContent] = useState<string>('');
  // 计划分解详情图表数据
  const [planDetailData, setPlanDetailData] = useState<any>(null);


  const responseDetalTableColumns = [
    ...responseDetalColumns,
    {
      title: '调节曲线',
      dataIndex: 'planDecompositionDetailsId',
      align: 'center' as any,
      key: 'planDecompositionDetailsId',
      render: (text: string) => {
        return <Button
          size="small"
          icon={ <LineChartOutlined size={40} /> }
          onClick={async () => {
            setVisibile(true)
            await fetchInvitePlanCurve(text);
          }}
        />
      }
    },
    {
      title: '资源状态',
      dataIndex: 'status',
      align: 'center' as any,
      key: 'status',
      render: (text: number) => {
        return text === 0 ? '已确认' : '未确认'
      }
    },
  ]


  // 邀约计划列表请求
  const { run: fetchInvitePlanList, loading: invitePlanListLoading } = useRequest(getInvitePlanList, {
    manual: true,
    onSuccess: (result) => {
      const { code, data } = result;
      if (code === 200 && data) {
        setInvitePlanId(data[0]?.identificationNum)
        const listData = data.map((item: any, index: any) => {
          return {
            key: `invitePlanId-${index}`,
            label: item.identificationNum,
            children: (
              <div>
                <ul className={styles.planChildren}>
                  <li>
                    <span>计划开始时间：</span>
                    <span>{item.startTime.split(' ')[0]}</span>
                  </li>
                  <li>
                    <span>计划结束时间：</span>
                    <span>{item.endTime.split(' ')[0]}</span>
                  </li>
                  <li className={styles.borderBottom}>
                    <span>响应类型：</span>
                    <span>{item.responseType === 0 ? '削峰响应' : '填谷响应'}</span>
                  </li>
                </ul>
                <div className={styles.cardListItem}>
                  <div className={styles.listItemIcon}>
                    <i className="iconfont">&#xe679;</i>
                  </div>
                  <div className={styles.listItemContent}>
                    <span className={styles.label}>参与用户(家)</span>
                    <span className={styles.value}>{item.participatingUsers}</span>
                  </div>
                </div>
                <div className={styles.cardListItem}>
                  <div className={styles.listItemIcon}>
                    <i className="iconfont">&#xe668;</i>
                  </div>
                  <div className={styles.listItemContent}>
                    <span className={styles.label}>响应市场(h)</span>
                    <span className={styles.value}>{item.responseDuration}</span>
                  </div>
                </div>
                <div className={styles.cardListItem}>
                  <div className={styles.listItemIcon}>
                    <i className="iconfont">&#xe66f;</i>
                  </div>
                  <div className={styles.listItemContent}>
                    <span className={styles.label}>计算里程(MWh)</span>
                    <span className={styles.value}>{item.computedMilestone}</span>
                  </div>
                </div>
              </div>
            ),
          }
        })
        setCollapseItems(listData)
      }
    }
  });

  // 邀约响应计划数据请求
  const { run: fetchInviteResponsePlanData, loading: inviteResponsePlanLoading } = useRequest(getInviteResponsePlanData, {
    manual: true,
    onSuccess: (result) => {
      const { code, data } = result;
      if (code === 200 && data) {
        setResponsePlanData(data);
      }
    }
  });


  // 调控计划管理-计划分解详情-调节曲线
  const { run: fetchInvitePlanCurve, loading: invitePlanCurveLoading } = useRequest(getInvitePlanCurve, {
    manual: true,
    onSuccess: (result) => {
      const { code, data } = result;
      if (code === 200 && data) {
        setPlanDetailData(data);
      }
    }
  });


  // 面板切换--- 邀约计划列表切换
  const dayPlanCollapseChange = async (active: any) => {
    if (!active.length) return false;
    const exist = collapseItems.find((item: any) => item.key === active[0])
    if (exist) {
      setInvitePlanId((exist as any).label)
    }
  }

  // 计划分解详情---查询表格数据
  const searchTableData = () => {
    (responseTableRef.current as any)?.searchByParams({
      identificationNum: invitePlanId,
      content: content
    });
  }


  useEffect(() => {
    fetchInvitePlanList(planType)
  }, [planType])


  useEffect(() => {
    if (invitePlanId) {
      (responseTableRef.current as any)?.searchByParams({
        identificationNum: invitePlanId,
        content: content
      });
      fetchInviteResponsePlanData(invitePlanId)
    }
  }, [invitePlanId])

  return (
    <div className={styles.controlPage}>
      <div className={styles.controlPageSelect}>
        <Select
          defaultValue={1}
          style={{ width: 200 }}
          onChange={(value: 1 | 2) => setPlanType(value)}
          options={[
            { value: 1, label: '日前邀约计划' },
            { value: 2, label: '实时调度计划' },
          ]}
        />
      </div>
      <div className={styles.controlPageMain}>
        <div className={styles.controlPageMainTop}>
          <div className={styles.controlMenu}>
            <Spin spinning={invitePlanListLoading}>
            <Collapse
              bordered={false}
              expandIconPosition="end"
              accordion
              defaultActiveKey={'invitePlanId-0'}
              onChange={dayPlanCollapseChange}
              items={collapseItems}
              expandIcon={(e) => (e.isActive ? <UpOutlined /> : <DownOutlined />)}
            />
            </Spin>
          </div>
          <div className={styles.controlSide}>
            <div className={styles.controlSideTitle}>
              <div className={styles.wrapHeadSegmented}></div>
              <div className={styles.wrapHeadTitle}>2024-05-09 邀约响应计划</div>
              <div className={styles.wrapHeadSegmented}>
                <SegmentedTheme
                  defaultValue="line"
                  options={[
                    { label: '曲线', value: 'line', icon: <LineChartOutlined /> },
                    { label: '表格', value: 'table', icon: <InsertRowAboveOutlined /> },
                  ]}
                  getSelectedValue={(value: any) => setResponseChartOrTable(value)}
                />
              </div>
            </div>
            <div className={styles.chartsOrTable}>
              {responseChartOrTable === 'line' ? (
                <CustomCharts
                  options={responseChartOptions(responsePlanData)}
                  loading={inviteResponsePlanLoading}
                  height={280}
                  width={window.innerWidth - 574}
                />
              ) : (
                <GeneralTable
                  dataSource={responsePlanTableData(responsePlanData)}
                  rowKey="id"
                  size="middle"
                  hideSelect
                  loading={inviteResponsePlanLoading}
                  bordered={true}
                  columns={responseTableColumns}
                  scroll={{ y: 180 }}
                  hasPage={false}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.controlPageMainBottom}>
          <div className={styles.tableTitle}>
            <div className={styles.title}>计划分解详情</div>
            <Space>
              <Input
                value={content}
                placeholder="请输入查询内容"
                style={{ width: 200 }}
                onChange={(value) => setContent(value.target.value)}
              />
              <Button icon={<ReloadOutlined />} onClick={() => {
                (responseTableRef.current as any)?.searchByParams({
                  identificationNum: invitePlanId,
                  content: ''
                });
                setContent('')
              }}>重置</Button>
              <Button icon={<SearchOutlined />} onClick={searchTableData}>查询</Button>
            </Space>
          </div>
          <div className={styles.tableWrap}>
            <GeneralTable
              url="/sysApi/demand/response/regulationPlanManagement/planDecompositionDetails"
              ref={responseTableRef}
              columns={responseDetalTableColumns}
              rowKey="substationCode"
              hideSelect={true}
              size="middle"
              bordered={true}
              requestType="get"
              scroll={{
                y: window.innerHeight - 720,
              }}
              filterParams={{ identificationNum: invitePlanId, content: '' }}
            />
          </div>
        </div>
      </div>
      <Modal
        title="调节曲线"
        open={visibile}
        width="70%"
        centered
        footer={null}
        destroyOnClose
        onCancel={() => {
          setVisibile(false)
          setModalChartOrTable('line')
        }}
      >
        <div className={styles.modalMain} style={{ height: 500 }}>
          <div className={styles.modalMainHead}>
            <SegmentedTheme
              defaultValue="line"
              options={[
                { label: '曲线', value: 'line', icon: <LineChartOutlined /> },
                { label: '表格', value: 'table', icon: <InsertRowAboveOutlined /> },
              ]}
              getSelectedValue={(value: any) => setModalChartOrTable(value)}
            />
          </div>
          {
            modalChartOrTable === 'line' ? <CustomCharts
            options={responseChartOptions(planDetailData)}
            height={450}
            loading={invitePlanCurveLoading}
            width={window.innerWidth * 0.68}
          /> : <GeneralTable
                dataSource={responseTableData(planDetailData)}
                rowKey="id"
                size="middle"
                hideSelect
                loading={inviteResponsePlanLoading}
                bordered={true}
                columns={responseTableColumns}
                scroll={{ y: 400 }}
                hasPage={false}
              />
          }

        </div>
      </Modal>
    </div>
  );
};
export default DealControlManager;
