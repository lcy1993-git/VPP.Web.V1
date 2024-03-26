import CircleRingChart from '@/components/circle-ring-chart';
import ContentPage from '@/components/content-page';
import CustomCard from '@/components/custom-card';
import CustomCharts from '@/components/custom-charts';
import CustomDatePicker from '@/components/custom-datePicker';
import Empty from '@/components/empty';
import GeneralTable from '@/components/general-table';
import SegmentedTheme from '@/components/segmented-theme';
import {
  addAlarmDealListWithOutDeal,
  addAlarmDealWithOutDeal,
} from '@/services/alarm-manage/realtime';
import {
  getInverterOverview,
  getOnGridOverview,
  getPowerAndEquivalent,
  getPowerGeneration,
  getPowerGenerationTrends,
  getSolarHeadInfoStatistics,
  getSubstation,
} from '@/services/power-station';
import { INTERVALTIME, judgmentIsToday } from '@/utils/common';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useLocation, useRequest } from '@umijs/max';
import { Avatar, Button, DatePicker, Popconfirm, Select, Space, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import AlarmModal from '../alarm-manage/realtime-alarm/alarmModal';
import { disableDate } from '../big-screen/utils';
import styles from './index.less';
import SvgModal from './svgModal';
import {
  ALARMLEVEL,
  powerCountOptions,
  powerGenerationOptions,
  renderInverter,
  renderOverviewData,
  tableColumns,
} from './utils';

// 发电量枚举值
const datePickerEnum: any = [
  {
    type: 'date',
    name: '日',
    dayType: 'YYYY-MM-DD',
  },
  {
    type: 'month',
    name: '月',
    dayType: 'YYYY-MM',
  },
  {
    type: 'year',
    name: '年',
    dayType: 'YYYY',
  },
];

const PowerStation = () => {
  const { state }: { state: any } = useLocation();

  const tableRef = useRef(null);
  // 一致性接线图模态框状态
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 发电量 年月日 切换
  const [fullAndPutDate, setFullAndPutDate] = useState<string>('日');
  // 概览列表切换 逆变器、电表 状态切换
  const [moduleStatus, setModuleStatus] = useState<string>('逆变器概览');
  // 发电量 日期组件切换
  const [pickerType, setPickerType] = useState<'year' | 'month' | 'date'>('date');
  // 表格选中数据
  const [selectData, setSelectData] = useState<any[]>([]);
  // 当前用户可以访问的站点
  const [allSubStation, setAllSubStation] = useState<any>([]);
  // 当前站点Id
  const [substationId, setSubstationId] = useState<string>('');
  // @ 告警确认提示框
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  // 当前告警条目
  const [currentAlarmData, setCurrentAlarmData] = useState<any>(null);
  // 分段器告警等级
  const segmentedValueRef = useRef<any>(null);
  // 发电趋势：用户选择的日期是否是当天
  const isTodayRef = useRef<boolean>(true);
  // 发电量日期
  const [dateValue, setDateValue] = useState<any>(dayjs(dayjs(`${new Date()}`), 'YYYY-MM-DD'));

  const [messageApi, contextHolder] = message.useMessage();
  // svg文件
  const [svgPaths, setSvgPaths] = useState<any>([]);

  // 获取站点数据
  const { run: fetchSubstation } = useRequest(getSubstation, {
    manual: true,
    onSuccess: (result: any) => {
      if (result && result.length) {
        const substation = result.map((item: any) => {
          return {
            key: item.substationCode,
            label: (
              <span
                onClick={() => setSubstationId(item.substationCode)}
                style={{ display: 'inline-block', width: '100%', paddingRight: '12px' }}
              >
                {item.name}
              </span>
            ),
            name: item.name,
            capacity: item.capacity,
          };
        });
        const defaultStationId = substation.find((item: any) => item.name === '精鸿益光伏电站');
        let siteId;
        if (defaultStationId) {
          siteId = state?.subStationCode ? state?.subStationCode : defaultStationId?.key;
        } else {
          siteId = state?.subStationCode ? state?.subStationCode : substation[0].key;
        }
        //@ts-ignore
        tableRef.current?.searchByParams({
          substationID: substationId,
          eventLevel: segmentedValueRef.current,
        });
        setSubstationId(siteId);

        setAllSubStation(substation);
        const svgPath = result.reduce((result: any, item: any) => {
          result[item.name] = item.svgImgUrl;
          return result;
        }, {});
        setSvgPaths(svgPath);
      }
    },
  });

  // head 数据统计
  const { run: fetchSolarHeadInfoStatistics, data: statisticsHeaData } = useRequest(
    getSolarHeadInfoStatistics,
    {
      manual: true,
      pollingInterval: INTERVALTIME,
    },
  );
  // 站点概览
  const { run: fetchPowerAndEquivalent, data: powerAndEqData } = useRequest(getPowerAndEquivalent, {
    manual: true,
    pollingInterval: INTERVALTIME,
  });
  // 发电量
  const {
    run: fetchPowerGeneration,
    data: powerGeneration,
    loading: powerGenerationLoading,
  } = useRequest(getPowerGeneration, {
    manual: true,
    pollingInterval: INTERVALTIME,
  });
  // 发电趋势
  const {
    run: fetchPowerGenerationTrends,
    data: powerGenerationTrends,
    loading: powerTrendLoading,
  } = useRequest(getPowerGenerationTrends, {
    manual: true,
    pollingInterval: INTERVALTIME,
  });
  // 逆变器概览
  const { run: fetchInverterOverview, data: inverterData } = useRequest(getInverterOverview, {
    manual: true,
    pollingInterval: INTERVALTIME,
  });

  // 电表概览
  const { run: fetchOnGridOverview, data: onGridData } = useRequest(getOnGridOverview, {
    manual: true,
    pollingInterval: INTERVALTIME,
  });

  /** 设备概览列表 */
  /** 概览 -- 类型切换 */
  const overviewChange = (value: string) => {
    setModuleStatus(value);
    if (value === '逆变器概览') {
      fetchInverterOverview(substationId);
    } else {
      fetchOnGridOverview(substationId);
    }
  };

  /** 发电量 日期改变  */
  const datePickerChange = (date: string) => {
    if (!date) {
      return;
    }

    let fetchDate: any;
    datePickerEnum.forEach((item: any) => {
      if (item.name === fullAndPutDate) {
        fetchDate = dayjs(date).format(item.dayType);
        setDateValue(dayjs(fetchDate, item.dayType));
      }
    });

    fetchPowerGeneration({
      date: fetchDate,
      substationCode: substationId,
      unit: pickerType === 'date' ? 'day' : pickerType,
    });
  };

  /** 发电趋势 日期改变 */
  const powerTrendsDateChange = (date: string) => {
    if (!date) {
      return;
    }
    isTodayRef.current = judgmentIsToday(date);
    fetchPowerGenerationTrends({
      date: dayjs(date).format('YYYY-MM-DD'),
      substationCode: substationId,
    });
  };

  /** 电站名称处理 */
  const renderSiteName = (index = 0) => {
    const currentSite = allSubStation?.find((item: any) => item?.key === substationId);
    if (index) {
      return currentSite?.name.slice(0, index);
    }
    return currentSite?.name;
  };

  /** 告警详情 -- 告警等级切换 */
  const alarmLevelChange = (value: string) => {
    const level = ALARMLEVEL.findIndex((item) => item === value);
    if (level === -1 || level === 0) {
      // 全部
      segmentedValueRef.current = null;
      // @ts-ignore
      tableRef.current?.searchByParams({ substationID: substationId, eventLevel: null });
      return;
    }
    segmentedValueRef.current = level;
    // @ts-ignore
    tableRef.current?.searchByParams({ substationID: substationId, eventLevel: level });
  };

  // 确认事项按钮：告警确认但不处理
  const handleConfirmItem = async () => {
    if (!selectData.length) {
      messageApi.warning('请勾选确认条目');
      return;
    }

    try {
      const result = await addAlarmDealListWithOutDeal(selectData);
      if (result.code === 200) {
        messageApi.success('确认成功');
        // @ts-ignore
        tableRef.current?.searchByParams({
          substationID: substationId,
          eventLevel: segmentedValueRef.current,
        });
      }
    } catch (err) {
      console.log(err, '1212121');
    }
  };

  /** 分段控制器改变，请求充放电量数据 */
  useEffect(() => {
    let date: any = null;
    let unit: any = '';

    datePickerEnum.forEach((item: any) => {
      if (item.name === fullAndPutDate) {
        date = dayjs().format(item.dayType);
        setDateValue(dayjs(date, item.dayType));
        setPickerType(item.type);
        unit = item.type;
      }
    });
    fetchPowerGeneration({
      date: date,
      substationCode: substationId,
      unit: unit,
    });
  }, [fullAndPutDate, substationId]);

  useEffect(() => {
    if (substationId) {
      fetchSolarHeadInfoStatistics(substationId);
      fetchPowerAndEquivalent(substationId);
      fetchPowerGenerationTrends({
        date: dayjs().format('YYYY-MM-DD'),
        substationCode: substationId,
      });
      fetchInverterOverview(substationId);
      fetchOnGridOverview(substationId);
      //@ts-ignore
      tableRef.current?.searchByParams({
        substationID: substationId,
        eventLevel: segmentedValueRef.current,
      });
    }
  }, [substationId]);

  useEffect(() => {
    // 获取当前用户的站点信息  52为光伏、53为储能
    fetchSubstation(52);
  }, []);

  // 确认但不处理
  const alarmAcknowledgement = async (record: any) => {
    try {
      const result = await addAlarmDealWithOutDeal({ eventId: record.id });
      if (result.code === 200) {
        messageApi.success('确认成功');
        // @ts-ignore
        tableRef.current?.searchByParams({
          substationID: substationId,
          eventLevel: segmentedValueRef.current,
        });
      }
    } catch (err) {
      console.log(err, '1212121');
    }
  };

  // 告警处理
  const alarmHandling = (record: any) => {
    setCurrentAlarmData(record);
    setConfirmVisible(true);
  };

  const renderOverview = () => {
    if (moduleStatus === '逆变器概览')
      return renderInverter(inverterData, substationId, moduleStatus);
    else return renderInverter(onGridData, substationId, moduleStatus);
  };

  // 初始化columns
  const columns = [
    ...tableColumns,
    {
      title: '操作',
      dataIndex: 'typeNumber',
      key: 'typeNumber',
      align: 'center' as any,
      render: (_text: any, record: any) => {
        return (
          <Popconfirm
            placement="topLeft"
            title="告警确认"
            description="是否处理该条告警信息？"
            onConfirm={() => alarmHandling(record)}
            onCancel={() => alarmAcknowledgement(record)}
            okText="处理"
            cancelText="确认但不处理"
          >
            <Button size="small">告警确认</Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <ContentPage>
      <div className={styles.pageContainer}>
        <div className={styles.pageBody}>
          {/* header */}
          <div className={styles.wapper}>
            <CustomCard>
              <div className={styles.header}>
                <div className={styles.headerLeft}>
                  <Avatar
                    size={53}
                    gap={4}
                    style={{ background: '#1292FF', verticalAlign: 'middle', width: 70 }}
                  >
                    {renderSiteName(2)}
                  </Avatar>
                  <div className={styles.headerName}>
                    {allSubStation.length > 0 && (
                      <Select
                        style={{ width: 140 }}
                        defaultValue={allSubStation[0]?.key}
                        onChange={(value) => setSubstationId(value)}
                        fieldNames={{ label: 'name', value: 'key' }}
                        options={allSubStation}
                      />
                    )}
                    <Button
                      style={{ marginTop: '5px', width: 140 }}
                      onClick={() => setModalVisible(true)}
                    >
                      <i className="iconfont" style={{ fontSize: 14, marginRight: '6px' }}>
                        &#xe637;
                      </i>
                      一次主接线图
                    </Button>
                  </div>
                </div>
                <div className={styles.headerRight}>{renderOverviewData(statisticsHeaData)}</div>
              </div>
            </CustomCard>
          </div>
          {/* 站点概览\发电量 */}
          <div className={styles.wapper}>
            <div className={styles.banner}>
              <div className={styles.bannerLeft} style={{ width: '840px' }}>
                <CustomCard>
                  <div className={styles.warp}>
                    <div className={styles.titleBase}>
                      <div className={styles.titleBaseText}>站点概览</div>
                    </div>
                    <div className={styles.moduleMain}>
                      <div className={styles.moduleMainLeft}>
                        <div className={styles.echartMain}>
                          <CircleRingChart
                            textName=""
                            pathColor="#17cc8a"
                            value={powerAndEqData?.realTimePower}
                            circleRingChartRatio={(
                              (powerAndEqData?.realTimePower / allSubStation[0]?.capacity) *
                              100
                            ).toFixed(2)}
                            subTitle="kW"
                            breadth="160px"
                          />
                        </div>
                        <div className={styles.echartTitle}>实时功率</div>
                      </div>
                      <div className={styles.moduleMainRight}>
                        <div className={styles.echartMain}>
                          <CircleRingChart
                            textName=""
                            pathColor="#fa7f53"
                            value={powerAndEqData?.equivalentHours}
                            circleRingChartRatio={(
                              (powerAndEqData?.equivalentHours / 6) *
                              100
                            ).toFixed(2)}
                            subTitle="小时"
                            breadth="160px"
                          />
                        </div>
                        <div className={styles.echartTitle}>满发小时数</div>
                      </div>
                      {powerAndEqData?.showSystemEfficiency && (
                        <div className={styles.moduleMainRight}>
                          <div className={styles.echartMain}>
                            <CircleRingChart
                              textName=""
                              pathColor="#FFC300"
                              value={powerAndEqData?.systemEfficiency}
                              subTitle="％"
                              breadth="160px"
                            />
                          </div>
                          <div className={styles.echartTitle}>系统效率</div>
                        </div>
                      )}
                      <div className={styles.moduleMainRight}>
                        <div className={styles.echartMain}>
                          <CircleRingChart
                            textName=""
                            pathColor="#8174FF"
                            value={powerAndEqData?.daySelfUseRate}
                            subTitle="％"
                            breadth="160px"
                          />
                        </div>
                        <div className={styles.echartTitle}>自用消纳率</div>
                      </div>
                    </div>
                  </div>
                </CustomCard>
              </div>
              <div className={styles.bannerRight}>
                <CustomCard>
                  <div className={styles.powerCount}>
                    <div className={styles.titleBase}>
                      <div className={styles.titleBaseText}>发电功率</div>
                      <Space>
                        <CustomDatePicker datePickerType={'day'} onChange={powerTrendsDateChange} />
                      </Space>
                    </div>
                    <div className={styles.powerCountEchart}>
                      <CustomCharts
                        options={powerCountOptions(powerGenerationTrends, isTodayRef.current)}
                        height="250px"
                        loading={powerTrendLoading}
                      />
                    </div>
                  </div>
                </CustomCard>
              </div>
            </div>
          </div>

          {/* 发电趋势 */}
          <div className={styles.wapper}>
            <CustomCard>
              <div className={styles.warp}>
                <div className={styles.titleBase}>
                  <div className={styles.titleBaseText}>发电量</div>
                  <Space>
                    <SegmentedTheme
                      options={datePickerEnum.map((item: any) => item.name)}
                      getSelectedValue={(value) => setFullAndPutDate(value)}
                    />
                    <DatePicker
                      picker={pickerType}
                      onChange={datePickerChange}
                      value={dateValue}
                      disabledDate={disableDate}
                    />
                  </Space>
                </div>
                <div className={styles.moduleMain} style={{ height: '280px', paddingBottom: 20 }}>
                  <CustomCharts
                    options={powerGenerationOptions(powerGeneration, fullAndPutDate)}
                    loading={powerGenerationLoading}
                  />
                </div>
              </div>
            </CustomCard>
          </div>

          {/* 逆变器概览 */}
          <div className={styles.wapper}>
            <CustomCard>
              <div className={styles.inverter}>
                <div className={styles.inverterHead}>
                  <SegmentedTheme
                    options={['逆变器概览', '电表概览']}
                    getSelectedValue={overviewChange}
                  />
                  {substationId.startsWith('dl') && (
                    <Tooltip title={renderSiteName() + '：电表概述（光伏发电为正向有功）'}>
                      <QuestionCircleOutlined style={{ fontSize: '20px', color: '#08c' }} />
                    </Tooltip>
                  )}
                </div>
                {renderOverview()}
              </div>
            </CustomCard>
          </div>

          {/* 告警详情 */}
          <div className={styles.wapper}>
            <CustomCard>
              <div className={styles.titleBase}>
                <div className={styles.titleBaseText}>告警详情</div>
              </div>
              <div className={styles.flex_between}>
                <SegmentedTheme options={ALARMLEVEL} getSelectedValue={alarmLevelChange} />
                <Space>
                  <Button
                    onClick={() => {
                      localStorage.setItem('whetherPlay', '0');
                      localStorage.setItem('closeAudio', 'false');
                    }}
                  >
                    <i className="iconfont" style={{ fontSize: '13px', marginRight: '5px' }}>
                      &#xe649;
                    </i>
                    消音
                  </Button>
                  <Button onClick={handleConfirmItem}>
                    <i className="iconfont" style={{ fontSize: '13px', marginRight: '5px' }}>
                      &#xe63d;
                    </i>
                    确认事项
                  </Button>
                </Space>
              </div>
              {substationId ? (
                <GeneralTable
                  url="/api/alarm/getRealTimeAlarmEvent"
                  ref={tableRef}
                  columns={columns}
                  rowKey="id"
                  type="checkbox"
                  size="middle"
                  bordered={false}
                  getCheckData={(data) => {
                    if (!data) return;
                    // @ts-ignore
                    const ids = data.map((item) => item.id);
                    setSelectData(ids);
                  }}
                  requestType="get"
                  filterParams={{
                    substationID: substationId,
                    eventLevel: segmentedValueRef.current,
                  }}
                />
              ) : (
                <Empty />
              )}
            </CustomCard>
          </div>
        </div>
      </div>

      {contextHolder}

      <SvgModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        svgPath={svgPaths[renderSiteName()]}
      />

      {/* 告警确认模态框 */}
      <AlarmModal
        confirmVisible={confirmVisible}
        setConfirmVisible={setConfirmVisible}
        currentAlarmData={currentAlarmData}
        searchFormRef={{ substationID: substationId, eventLevel: segmentedValueRef.current }}
        messageApi={messageApi}
        tableRef={tableRef}
        isSubstation={true}
      />
    </ContentPage>
  );
};
export default PowerStation;
