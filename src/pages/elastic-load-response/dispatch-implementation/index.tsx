import ContentPage from "@/components/content-page";
import CustomCard from "@/components/custom-card";
import CustomCharts from "@/components/custom-charts";
import SegmentedTheme from "@/components/segmented-theme";
import { getExecutionStatus, getHisStatistic, getPlanInfo, getRealList } from "@/services/elastic-load-response/dispatch-implementation";
import { InsertRowAboveOutlined, LineChartOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import { useRequest } from "ahooks";
import { DatePicker, Empty, Select, Spin, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import styles from './index.less';
import { alarmTableColumns, executionStatusDataSource, executionStatusDataType, executionStatusTableColumns, planChartOptions, planInfoType, statusticsChart } from "./utils";
import GeneralTable from "@/components/general-table";
import { companyTableColumns } from "../deal-manage/utils";




// 调度实施
const DispatchImplementation = () => {
  // 告警信息列表实例
  const alarmTableRef = useRef(null);
  // 历史计划统计数据
  const [historyData, setHistoryData] = useState({} as any);
  // 当前选中的时间
  const [currentDate, setCurrentDate] = useState<string>('');
  // 邀约计划ID
  const [currentInvitationId, setCurrentInvitationId] = useState<string>('');
  // 计划信息
  const [planInfo, setPlanInfo] = useState<planInfoType | null>(null);
  // 计划情况 展示表格还是曲线
  const [showLineOrTable, setShowLineOrTable] = useState<'line' | 'table'>('line');
  // 执行情况数据
  const [executionStatusData, setexecutionStatusData] = useState<executionStatusDataType | null>(null);
  // 日前邀约计划列表数据
  const [realList, setRealList] = useState<{ realTimeDispatchPlan: string[], dayAheadInvitationPlan: string[] }>({ realTimeDispatchPlan: [], dayAheadInvitationPlan: [] });

  // 日期组件 change
  const datePickerChange = (date: Dayjs | null) => {
    const dateFormat = dayjs(date).format('YYYY-MM-DD');
    setCurrentDate(dateFormat);
  };

  // 历史计划统计数据 页面Head数据
  const { run: fetchHisStatistic, loading: hisStatisticLoading } = useRequest(getHisStatistic, {
    manual: true,
    onSuccess: (result) => {
      const { data, code } = result;
      if (code === 200 && data) {
        setHistoryData(data)
      }
    }
  });
  // 日前邀约计划列表
  const { run: fetchRealList, loading: realListLoading } = useRequest(getRealList, {
    manual: true,
    onSuccess: (result) => {
      const { data, code } = result;
      if (code === 200 && data) {
        setRealList(data)
        try {
          const firstId = data.dayAheadInvitationPlan[0]
          if (firstId) {
            setCurrentInvitationId(firstId)
          }
        } catch {
          setCurrentInvitationId('')
        }
      }
    }
  });

  // 请求计划信息
  const { run: fetchPlanInfo, loading: planInfoLoading } = useRequest(getPlanInfo, {
    manual: true,
    onSuccess: (result) => {
      const { code, data } = result;
      if (code === 200 && data) {
        setPlanInfo(data)
      }
    }
  });

  // 请求执行情况
  const { run: fetchExecutionStatus, loading: executionStatusLoading } = useRequest(getExecutionStatus, {
    manual: true,
    onSuccess: (result) => {
      const { code, data } = result;
      if (code === 200 && data) {
        setexecutionStatusData(data);
      }
    }
  });

  // 告警等级切换，重新请求表格数据
  const alarmGradeChange = (value: string) => {
    console.log(value, '告警等级')
    if (alarmTableRef && alarmTableRef.current) {
      (alarmTableRef.current as any)?.searchByParams({
        identificationNum: currentInvitationId,
        level: value
      });
    }
  }

  // 获取历史计划统计数据
  useEffect(() => {
    fetchHisStatistic()
  }, [])

  // 日期发生变化 请求列表
  useEffect(() => {
    const date = currentDate ? currentDate : dayjs(new Date()).format('YYYY-MM-DD');
    fetchRealList({ date })
  }, [currentDate])

  // 计划ID发生变化请求基本信息、执行情况、告警信息数据
  useEffect(() => {
    if (currentInvitationId) {
      fetchPlanInfo(currentInvitationId)
      fetchExecutionStatus(currentInvitationId)
      if (alarmTableRef && alarmTableRef.current) {
        (alarmTableRef.current as any)?.searchByParams({
          identificationNum: currentInvitationId,
          level: 0
        });
      }
    }
  }, [currentInvitationId])


  return <ContentPage>
    <div className={styles.historyPlan}>
      <CustomCard title="历史计划统计">
        <div className={styles.wrapper}>
          <div className={styles.statistics}>
            <div className={styles.statisticsLabel}>
              <span className={styles.labelValue}>{historyData?.totalInvited}</span>
              <span className={styles.labelText}>总受邀</span>
              <span className={styles.labelText}>(次)</span>
            </div>
            <CustomCharts options={statusticsChart(historyData)} loading={hisStatisticLoading} />
          </div>
          <div className={styles.cardList}>
            <div className={styles.cardListItem}>
              <div className={styles.listItemIcon}>
                <i className="iconfont">&#xe676;</i>
              </div>
              <div className={styles.listItemContent}>
                <span className={styles.label}>累计调节电量(MWh)</span>
                <span className={styles.value}>{historyData?.energyAdjustment}</span>
              </div>
            </div>
            <div className={styles.cardListItem}>
              <div className={styles.listItemIcon}>
                <i className="iconfont">&#xe667;</i>
              </div>
              <div className={styles.listItemContent}>
                <span className={styles.label}>累计补贴金额(万元)</span>
                <span className={styles.value}>{historyData?.subsidyAmount}</span>
              </div>
            </div>
            <div className={styles.cardListItem}>
              <div className={styles.listItemIcon}>
                <i className="iconfont">&#xe66f;</i>
              </div>
              <div className={styles.listItemContent}>
                <span className={styles.label}>日前响应交易里程(MWh)</span>
                <span className={styles.column}>
                  <span className={styles.label}>削峰：</span>
                  <span className={styles.value}>{historyData?.dayAheadTransactionPeakShaving}</span>
                </span>
                <span className={styles.column}>
                  <span className={styles.label}>填谷：</span>
                  <span className={styles.value}>{historyData?.dayAheadTransactionValleyFilling}</span>
                </span>
              </div>
            </div>
            <div className={styles.cardListItem}>
              <div className={styles.listItemIcon}>
                <i className="iconfont">&#xe66f;</i>
              </div>
              <div className={styles.listItemContent}>
                <span className={styles.label}>实时响应交易里程(MWh)</span>
                <span className={styles.column}>
                  <span className={styles.label}>削峰：</span>
                  <span className={styles.value}>{historyData?.realTimeTransactionPeakShaving}</span>
                </span>
                <span className={styles.column}>
                  <span className={styles.label}>填谷：</span>
                  <span className={styles.value}>{historyData?.realTimeTransactionValleyFilling}</span>
                </span>
              </div>
            </div>
            <div className={styles.cardListItem}>
              <div className={styles.listItemIcon}>
                <i className="iconfont">&#xe66e;</i>
              </div>
              <div className={styles.listItemContent}>
                <span className={styles.label}>实时响应交易收益(万元)</span>
                <span className={styles.column}>
                  <span className={styles.label}>削峰：</span>
                  <span className={styles.value}>{historyData?.realTimeTransactionRevenuePeakShaving}</span>
                </span>
                <span className={styles.column}>
                  <span className={styles.label}>填谷：</span>
                  <span className={styles.value}>{historyData?.realTimeTransactionRevenueValleyFilling}</span>
                </span>
              </div>
            </div>
            <div className={styles.cardListItem}>
              <div className={styles.listItemIcon}>
                <i className="iconfont">&#xe66e;</i>
              </div>
              <div className={styles.listItemContent}>
                <span className={styles.label}>日前响应交易收益(万元)</span>
                <span className={styles.column}>
                  <span className={styles.label}>削峰：</span>
                  <span className={styles.value}>{historyData?.dayAheadTransactionRevenuePeakShaving}</span>
                </span>
                <span className={styles.column}>
                  <span className={styles.label}>填谷：</span>
                  <span className={styles.value}>{historyData?.dayAheadTransactionRevenueValleyFilling}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </CustomCard>
    </div>

    <div className={styles.planList}>
      <CustomCard>
        <div className={styles.planDate}>
          <DatePicker
            defaultValue={dayjs(new Date())}
            onChange={datePickerChange}
          />
        </div>
        <div className={styles.planContent}>
          <div className={styles.planContentWrap}>
            <Spin spinning={realListLoading} delay={500}>
              <div className={`${styles.planMenu}`}>
                <div className={styles.planMenuDay}>日前邀约计划</div>
                <div className={styles.planMenuDayList}>
                  {
                    (realList?.dayAheadInvitationPlan || []).map(item => {
                      return <p
                        key={item}
                        className={`${[...realList?.realTimeDispatchPlan, ...realList?.dayAheadInvitationPlan].includes(currentInvitationId) ? styles.listActive : null}`}
                        style={{ background: currentInvitationId === item ? '#0084FF' : '' }}
                        onClick={() => setCurrentInvitationId(item)}
                      >{item}</p>
                    })
                  }
                </div>
                <div className={`${styles.planMenuDay} ${styles.realtime}`}>实时调度计划</div>
                <div className={styles.planMenuDayList}>
                  {
                    (realList?.realTimeDispatchPlan || []).map(item => {
                      return <p
                        key={item}
                        style={{ background: currentInvitationId === item ? '#0084FF' : '' }}
                        onClick={() => setCurrentInvitationId(item)}>
                        {item}
                      </p>
                    })
                  }
                </div>
              </div>
            </Spin>
            <div className={styles.planInfo}>
              <div className={styles.planInfoTitle}>
                计划信息：{planInfo?.identificationNum}
              </div>
              <div className={styles.planInfoBasic}>
                <p>计划开始时间：{planInfo?.startTime}</p>
                <p>计划结束时间：{planInfo?.endTime}</p>
                <p>日前计划里程：{planInfo?.dayAheadPlanned}</p>
                <p>实际完成里程：{planInfo?.realTimeCompleted}</p>
                <p>参与有用户：{planInfo?.numParticipatingUsers}家</p>
                <p>功率偏差：{planInfo?.powerDeviation}%</p>
                <p>预计收益：{planInfo?.expectedRevenue}万元</p>
              </div>
              <div className={styles.planCharts}>
                <div className={styles.planChartsHead}>
                  <div className={styles.title}>执行情况</div>
                  <SegmentedTheme
                    defaultValue="line"
                    options={[
                      { label: '曲线', value: 'line', icon: <LineChartOutlined /> },
                      { label: '表格', value: 'table', icon: <InsertRowAboveOutlined /> },
                    ]}
                    getSelectedValue={(value: any) => setShowLineOrTable(value)}
                  />
                </div>
                <div className={styles.planCard}>
                  <div className={styles.cardItem}>
                    <div className={styles.cardIcon}>
                      <i className="iconfont">&#xe677;</i>
                    </div>
                    <div className={styles.cardContent}>
                      <span className={styles.label}>实时功率(MW）</span>
                      <span className={styles.value}>{executionStatusData?.realPower}</span>
                    </div>
                  </div>
                  <div className={styles.cardItem}>
                    <div className={styles.cardIcon}>
                      <i className="iconfont">&#xe675;</i>
                    </div>
                    <div className={styles.cardContent}>
                      <span className={styles.label}>最大功率(MW）</span>
                      <span className={styles.value}>{executionStatusData?.maxPower}</span>
                    </div>
                  </div>
                  <div className={styles.cardItem}>
                    <div className={styles.cardIcon}>
                      <i className="iconfont">&#xe66a;</i>
                    </div>
                    <div className={styles.cardContent}>
                      <span className={styles.label}>最小功率(MW）</span>
                      <span className={styles.value}>{executionStatusData?.minPower}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.planChart}>
                  {
                    showLineOrTable === 'line' ?
                      <CustomCharts
                        options={planChartOptions(executionStatusData)}
                        loading={false}
                        height={300}
                      />
                      :
                      <GeneralTable
                        dataSource={executionStatusDataSource(executionStatusData)}
                        rowKey="id"
                        size="middle"
                        hideSelect
                        bordered={false}
                        columns={executionStatusTableColumns}
                        scroll={{ y: 260 }}
                        hasPage={false}
                      />
                  }
                </div>
              </div>

              <div className={styles.planTable}>
                <div className={styles.planTableHead}>
                  <div className={styles.title}>告警信息</div>
                  <Select
                    defaultValue="全部"
                    style={{ width: 120 }}
                    options={[
                      { value: 0, label: '全部' },
                      { value: 1, label: '一级告警' },
                      { value: 2, label: '二级告警' },
                      { value: 3, label: '三级告警' },
                    ]}
                    onChange={alarmGradeChange}
                  />
                </div>
                <div className={styles.planTableWrap}>
                    <GeneralTable
                      url="/sysApi/demand/response/alarm"
                      ref={alarmTableRef}
                      columns={alarmTableColumns}
                      rowKey="uuid"
                      size="middle"
                      hideSelect={true}
                      bordered={true}
                      initTableAjax={false}
                      requestType="get"
                      scroll={{
                        y: 340
                      }}
                      filterParams={{ identificationNum: currentInvitationId }}
                    />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomCard>
    </div>
  </ContentPage>
};
export default DispatchImplementation;
