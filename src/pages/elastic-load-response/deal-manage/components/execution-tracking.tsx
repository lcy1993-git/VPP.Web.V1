import CustomCharts from '@/components/custom-charts';
import GeneralTable from '@/components/general-table';
import SegmentedTheme from '@/components/segmented-theme';
import {
  getCompanyCurve,
  getTrackingCure,
  getTrackingPlanList,
} from '@/services/elastic-load-response/components';
import {
  DownOutlined,
  InsertRowAboveOutlined,
  LineChartOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Collapse, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from '../index.less';
import {
  companyChartOptions,
  companyTableColumns,
  companyTableData,
  dayPlanChartOptions,
  dayPlanTableColumns,
  dayPlanTableData,
  sourceTableColumns,
} from '../utils';

const ExecutionTracking = () => {
  // 资源商信息table实例
  const sourceTableRef = useRef(null);
  // 模态框表格和图表进行切换
  const [dayPlanModalSegmend, setDayPlanModalSegmend] = useState<'line' | 'table'>('line');
  // 资源实时运行功率--公司切换
  const [companyModalSegmend, setCompanyModalSegmend] = useState<'line' | 'table'>('line');
  // 日前邀约计划列表
  const [dayPlanList, setDayPlanList] = useState([]);
  // 日前邀约计划列表
  const [companyPlanList, setCompanyPlanList] = useState([]);
  // 当前计划ID
  const [currentPlanId, setCurrtntPlanId] = useState<string>('');
  // 实时运行功率数据---日前邀约计划
  const [realtimeOperationData, setRealtimeOperationData] = useState<any>(null);
  // 资源实时运行功率数据 --- xx公司
  const [companySourceData, setCompanySourceData] = useState<any>(null);
  // 请求执行情况
  const { run: fetchTrackingPlanList, loading: trackingPlanListLoading } = useRequest(
    getTrackingPlanList,
    {
      manual: true,
      onSuccess: (result) => {
        const { code, data } = result;
        if (code === 200 && data) {
          const { realTimeDispatchPlan, dayAheadInvitationPlan } = data;
          const dayPlanData = dayAheadInvitationPlan.map((item: any, index: number) => {
            return {
              key: `dayPlanData-${index}`,
              label: item.identificationNum,
              children: (
                <ul className={styles.planChildren}>
                  <li>
                    <span>计划开始时间：</span>
                    <span>{item.startTime.split(' ')[0]}</span>
                  </li>
                  <li className={styles.borderBottom}>
                    <span>计划结束时间：</span>
                    <span>{item.endTime.split(' ')[0]}</span>
                  </li>
                  <li>
                    <span>日前计划里程：</span>
                    <span>{item.planMilestone}MWh</span>
                  </li>
                  <li>
                    <span>实时完成里程：</span>
                    <span>{item.actualMilestone}MWh</span>
                  </li>
                  <li>
                    <span>参与用户：</span>
                    <span>{item.participatingUsers}家</span>
                  </li>
                  <li>
                    <span>功率偏差：</span>
                    <span>{item.powerDeviation}%</span>
                  </li>
                  <li>
                    <span>预计收益：</span>
                    <span>{item.estimatedEarnings}万元</span>
                  </li>
                </ul>
              ),
            };
          });
          const realtimePlanData = realTimeDispatchPlan.map((item: any, index: number) => {
            return {
              key: `realtimePlanData-${index}`,
              label: item.identificationNum,
              children: (
                <ul className={styles.planChildren}>
                  <li className={styles.borderBottom}>
                    <span>指令下发时间：</span>
                    <span>{item.commandIssuingTime.split(' ')[0]}</span>
                  </li>
                  <li>
                    <span>调度开始时间：</span>
                    <span>{item.startTime.split(' ')[0]}</span>
                  </li>
                  <li>
                    <span>调度结束时间：</span>
                    <span>{item.endTime.split(' ')[0]}</span>
                  </li>
                  <li>
                    <span>调度计划里程：</span>
                    <span>{item.planMilestone}MWh</span>
                  </li>
                  <li>
                    <span>实际调控里程：</span>
                    <span>{item.actualMilestone}MWh</span>
                  </li>
                  <li>
                    <span>参与用户：</span>
                    <span>{item.participatingUsers}家</span>
                  </li>
                  <li>
                    <span>资源在线状态：</span>
                    <span>{item.resourceOnline}台</span>
                  </li>
                  <li>
                    <span>功率偏差：</span>
                    <span>{item.powerDeviation}%</span>
                  </li>
                  <li>
                    <span>预计收益：</span>
                    <span>{item.estimatedEarnings}万元</span>
                  </li>
                </ul>
              ),
            };
          });
          setDayPlanList(dayPlanData);
          setCompanyPlanList(realtimePlanData);
          // 默认日前邀约计划第一个返回数据
          setCurrtntPlanId(dayPlanData[0].label);
        }
      },
    },
  );

  // 执行跟踪-实时运行功率曲线-日前邀约计划
  const { run: fetchTrackingCure, loading: trackingCureLoading } = useRequest(getTrackingCure, {
    manual: true,
    onSuccess: (result) => {
      const { code, data } = result;
      if (code === 200 && data) {
        setRealtimeOperationData(data);
      }
    },
  });

  // 执行跟踪-资源实时运行功率曲线-XXX公司
  const { run: fetchCompanyCurve, loading: companyCurveLoading } = useRequest(getCompanyCurve, {
    manual: true,
    onSuccess: (result) => {
      const { code, data } = result;
      if (code === 200 && data) {
        console.log(data, '123456');
        setCompanySourceData(data);
      }
    },
  });

  // 面板切换
  const dayPlanCollapseChange = (active: any) => {
    if (!active.length) return;
    const planListIds = [...dayPlanList, ...companyPlanList];
    const exist = planListIds.find((item: any) => item.key === active[0]);
    if (exist) {
      setCurrtntPlanId((exist as any).label);
    }
  };

  useEffect(() => {
    fetchTrackingPlanList();
  }, []);

  useEffect(() => {
    if (currentPlanId) {
      fetchTrackingCure(currentPlanId);
      fetchCompanyCurve(currentPlanId);
      if (sourceTableRef && sourceTableRef.current) {
        (sourceTableRef.current as any)?.searchByParams({
          identificationNum: currentPlanId,
          level: 0,
        });
      }
    }
  }, [currentPlanId]);

  return (
    <div className={styles.tractingPage}>
      <div className={styles.tractingMenu}>
        <Spin spinning={trackingPlanListLoading}>
          <div className={styles.tractingMenuSide}>
            <div className={styles.menuBg}>日前邀约计划</div>
            <div className={styles.menuMain} style={{ height: (window.innerHeight - 280) / 2 }}>
              {currentPlanId && (
                <Collapse
                  bordered={false}
                  expandIconPosition="end"
                  accordion={true}
                  items={dayPlanList}
                  defaultActiveKey={'dayPlanData-0'}
                  onChange={dayPlanCollapseChange}
                  expandIcon={(e) => (e.isActive ? <UpOutlined /> : <DownOutlined />)}
                />
              )}
            </div>
          </div>
          <div className={styles.tractingMenuSide}>
            <div className={styles.menuBg}>实时调度计划</div>
            <div className={styles.menuMain} style={{ height: (window.innerHeight - 280) / 2 }}>
              <Collapse
                bordered={false}
                expandIconPosition="end"
                accordion
                onChange={dayPlanCollapseChange}
                items={companyPlanList}
                expandIcon={(e) => (e.isActive ? <UpOutlined /> : <DownOutlined />)}
              />
            </div>
          </div>
        </Spin>
      </div>
      <div className={styles.tractingMain} style={{ height: window.innerHeight - 198 }}>
        <div className={styles.tractingWrap}>
          <div className={styles.wrapHead}>
            <div className={styles.wrapHeadSegmented}></div>
            <div className={styles.wrapHeadTitle}>实时运行功率曲线-日前邀约计划</div>
            <div className={styles.wrapHeadSegmented}>
              <SegmentedTheme
                defaultValue="line"
                options={[
                  { label: '曲线', value: 'line', icon: <LineChartOutlined /> },
                  { label: '表格', value: 'table', icon: <InsertRowAboveOutlined /> },
                ]}
                getSelectedValue={(value: any) => setDayPlanModalSegmend(value)}
              />
            </div>
          </div>
          <div className={styles.modalChartOrTable} style={{ height: 368 }}>
            {dayPlanModalSegmend === 'line' ? (
              <CustomCharts
                options={dayPlanChartOptions(realtimeOperationData)}
                loading={trackingCureLoading}
                height={360}
                width={window.innerWidth - 574}
              />
            ) : (
              <GeneralTable
                dataSource={dayPlanTableData(realtimeOperationData)}
                rowKey="id"
                size="middle"
                hideSelect
                bordered={true}
                columns={dayPlanTableColumns}
                scroll={{ y: 300 }}
                hasPage={false}
              />
            )}
          </div>
        </div>
        <div className={styles.tractingWrap} style={{ margin: '20px 0' }}>
          <div className={styles.sourceInfoTitle}>邀约资源商信息</div>
          <GeneralTable
            url="/sysApi/demand/response/executionTracking/companyInfo"
            ref={sourceTableRef}
            columns={sourceTableColumns}
            rowKey="substationCode"
            hideSelect
            size="middle"
            bordered={true}
            getCheckData={(data) => {}}
            requestType="get"
            scroll={{
              y: 260,
            }}
            filterParams={{ identificationNum: currentPlanId }}
          />
        </div>
        <div className={styles.tractingWrap}>
          <div className={styles.wrapHead}>
            <div className={styles.wrapHeadSegmented}></div>
            <div className={styles.wrapHeadTitle}>资源实时运行功率曲线-公司</div>
            <div className={styles.wrapHeadSegmented}>
              <SegmentedTheme
                defaultValue="line"
                options={[
                  { label: '曲线', value: 'line', icon: <LineChartOutlined /> },
                  { label: '表格', value: 'table', icon: <InsertRowAboveOutlined /> },
                ]}
                getSelectedValue={(value: any) => setCompanyModalSegmend(value)}
              />
            </div>
          </div>
          <div className={styles.modalChartOrTable} style={{ height: 368 }}>
            {companyModalSegmend === 'line' ? (
              <CustomCharts
                options={companyChartOptions(companySourceData)}
                loading={companyCurveLoading}
                height={360}
                width={window.innerWidth - 574}
              />
            ) : (
              <GeneralTable
                dataSource={companyTableData(companySourceData)}
                rowKey="id"
                size="middle"
                hideSelect
                bordered={true}
                columns={companyTableColumns}
                scroll={{ y: 300 }}
                hasPage={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExecutionTracking;
