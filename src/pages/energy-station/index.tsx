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
  getEssInformation,
  getFullAndPutPower,
  getOverviewData,
  getPowerTrend,
  getSocAndPower,
  getSocTrend,
} from '@/services/energy-station';
import { getSubstation } from '@/services/power-station';
import { judgmentIsToday } from '@/utils/common';
import { useLocation, useRequest } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { Avatar, Button, DatePicker, Divider, Popconfirm, Select, Space, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import AlarmModal from '../alarm-manage/realtime-alarm/alarmModal';
import { disableDate } from '../big-screen/utils';
import SvgModal from '../power-station/svgModal';
import { ALARMLEVEL, tableColumns } from '../power-station/utils';
import styles from './index.less';
import {
  batteryPowerOption,
  powerCountOptions,
  powerGenerationOptions,
  renderInverter,
  renderOverviewData,
  soCountOptions,
} from './utils';

// 充放电量枚举值
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

const EnergyStation = () => {
  const tableRef = useRef(null);

  const { state }: { state: any } = useLocation();

  // 当前站点ID
  const [substationId, setSubStationId] = useState<string>('');
  // 一致性接线图模态框状态
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // PCS 电池簇、并网 状态切换
  const [moduleStatus, setModuleStatus] = useState<string>('PCS概览');
  // 充放电 年月日 切换
  const [fullAndPutDate, setFullAndPutDate] = useState<string>('日');
  // 日期组件切换
  const [pickerType, setPickerType] = useState<'year' | 'month' | 'date'>('date');
  // PCS、电池簇、电表概览数据
  const [overviewData, setOverviewData] = useState<any[]>([]);
  // 当前用户可以访问的站点
  const [allSubStation, setAllSubStation] = useState<any>([]);
  // 表格选中数据
  const [selectData, setSelectData] = useState<any[]>([]);
  // @ 告警确认提示框
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  // 当前告警条目
  const [currentAlarmData, setCurrentAlarmData] = useState<any>(null);
  // 分段器告警等级
  const segmentedValueRef = useRef<any>(null);
  // 功率趋势日期是否是今天
  const powerTrenIsToday = useRef<boolean>(true);
  // soc趋势日期是否是今天
  const socTrenIsToday = useRef<boolean>(true);
  // svg文件
  const [svgPaths, setSvgPaths] = useState<any>([]);
  // 发电量日期
  const [dateValue, setDateValue] = useState<any>(dayjs(dayjs(`${new Date()}`), 'YYYY-MM-DD'));

  const [messageApi, contextHolder] = message.useMessage();

  // 获取站点数据
  const { run: fetchSubstation } = useRequest(getSubstation, {
    manual: true,
    onSuccess: (result) => {
      if (result && result.length) {
        const substation = result.map((item: any) => {
          return {
            key: item.substationCode,
            label: (
              <span
                onClick={() => setSubStationId(item.substationCode)}
                style={{ display: 'inline-block', width: '100%', paddingRight: '12px' }}
              >
                {item.name}
              </span>
            ),
            name: item.name,
          };
        });
        const siteId = state?.subStationCode ? state?.subStationCode : substation[0].key;
        setSubStationId(siteId);
        const svgPath = result.reduce((result: any, item: any) => {
          result[item.name] = item.svgImgUrl;
          return result;
        }, {});
        setSvgPaths(svgPath);
        setAllSubStation(substation);
      }
    },
  });

  /** SOC趋势 */
  const { run: fetchEssInformation, data: basisInfo } = useRequest(getEssInformation, {
    manual: true,
  });

  /** SOC和充放电功率 TODO:图表不知道怎么计算的 */
  const {
    run: fetchSocAndPower,
    data: socAndPowerData,
    loading: socLoading,
  } = useRequest(getSocAndPower, {
    manual: true,
  });

  /** 充放电量 */
  const {
    run: fetchFullAndPutPower,
    data: fullAndPutPowerData,
    loading: fullAndPutPowerLoading,
  } = useRequest(getFullAndPutPower, {
    manual: true,
  });

  /** 功率趋势 */
  const {
    run: fetchPowerTrend,
    data: powerTrendData,
    loading: powerTrendLoading,
  } = useRequest(getPowerTrend, {
    manual: true,
  });

  /** SOC趋势 */
  const {
    run: fetchSocTrend,
    data: socTrendData,
    loading: socTrendLoading,
  } = useRequest(getSocTrend, {
    manual: true,
  });

  /** PCS、电池簇、电表概览 */
  const { run: fetchOverviewData } = useRequest(getOverviewData, {
    manual: true,
    onSuccess: (result) => {
      setOverviewData(result);
    },
  });

  // 告警确认但不处理
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
    } catch (err) {}
  };

  /** 充放电量 日期改变  */
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
    fetchFullAndPutPower({
      date: fetchDate,
      substationCode: substationId,
      unit: pickerType === 'date' ? 'day' : pickerType,
    });
  };

  /** 功率趋势 时间改变 */
  const changeDatePowerCount = (date: string) => {
    if (!date) {
      return;
    }
    const fetchDate = dayjs(date).format('YYYY-MM-DD');
    powerTrenIsToday.current = judgmentIsToday(dayjs(date, 'YYYY-MM-DD'));
    fetchPowerTrend({
      date: fetchDate,
      subStationCode: substationId,
    });
  };

  /** SOC趋势 时间改变 */
  const changeDateSoc = (date: string) => {
    if (!date) {
      return;
    }
    const fetchDate = dayjs(date).format('YYYY-MM-DD');
    socTrenIsToday.current = judgmentIsToday(dayjs(date, 'YYYY-MM-DD'));
    fetchSocTrend({
      date: fetchDate,
      substationCode: substationId,
    });
  };

  /** 概览 -- 类型切换 */
  const overviewChange = (value: string) => {
    setModuleStatus(value);
    fetchOverviewData({
      type: value,
      substationCode: substationId,
    });
  };

  /** 电站名称处理 */
  const renderSiteName = (index = 0) => {
    const currentSite = allSubStation?.find((item: any) => item?.key === substationId);
    if (index) {
      return currentSite?.name.slice(0, index) || '';
    }
    return currentSite?.name || '暂无数据';
  };

  /** 告警详情 -- 告警等级切换 */
  const alarmLevelChange = (value: string) => {
    const level = ALARMLEVEL.findIndex((item: any) => item === value);
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

  // 获取功率数据
  const renderPowerHtml = () => {
    if (!socAndPowerData || !socAndPowerData.outPower) {
      return <Empty />;
    }
    return (
      <div style={{ width: 140, height: 140 }} className={styles.flex_center}>
        <CircleRingChart
          // textName={`${DEVICESRUNSTATUS[socAndPowerData?.status] || ''}功率`}
          textName={`储能总有功`}
          pathColor="#A96CFE"
          value={socAndPowerData?.outPower}
          subTitle="kW"
        />
      </div>
    );
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

    fetchFullAndPutPower({
      date: date,
      substationCode: substationId,
      unit: unit,
    });
  }, [fullAndPutDate, substationId]);

  /** 页面初始化请求数据 */
  useEffect(() => {
    if (substationId) {
      const params = {
        date: dayjs().format('YYYY-MM-DD'),
        subStationCode: substationId,
        substationCode: substationId,
      };
      fetchSocAndPower(substationId);
      fetchEssInformation(substationId);

      fetchPowerTrend(params);
      fetchSocTrend(params);
      // PCS、电池簇、电表概览
      fetchOverviewData({
        type: moduleStatus,
        substationCode: substationId,
      });
    }
  }, [substationId]);
  useUpdateEffect(() => {
    if (substationId) {
      //@ts-ignore
      tableRef.current?.searchByParams({
        substationID: substationId,
        eventLevel: segmentedValueRef.current,
      });
    }
  }, [substationId]);

  useEffect(() => {
    fetchSubstation(53);
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
                    style={{ background: '#1292FF', verticalAlign: 'middle', width: 50 }}
                  >
                    {renderSiteName(2)}
                  </Avatar>
                  <div className={styles.headerName}>
                    {allSubStation.length > 0 && (
                      <Select
                        style={{ width: 140 }}
                        defaultValue={allSubStation[0]?.key}
                        onChange={(value) => setSubStationId(value)}
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
                <div className={styles.headerRight}>{renderOverviewData(basisInfo)}</div>
              </div>
            </CustomCard>
          </div>
          {/* SOC和充放电功率\充放电量 */}
          <div className={styles.wapper}>
            <div className={styles.banner}>
              <div className={styles.bannerLeft}>
                <CustomCard>
                  <div className={styles.warp}>
                    <div className={styles.titleBase}>
                      <div className={styles.titleBaseText}>SOC和充放电功率</div>
                    </div>
                    <div className={styles.socContainer}>
                      <div className={styles.socEcharts}>
                        <div className={styles.socEchartsLeft}>
                          <CustomCharts
                            options={batteryPowerOption(socAndPowerData?.soc)}
                            height="180px"
                            loading={socLoading}
                          />
                        </div>
                        <div className={styles.socEchartsRight}>{renderPowerHtml()}</div>
                      </div>
                      <div className={styles.socDec}>
                        <dl style={{ paddingLeft: '15px' }}>
                          <dt>
                            <span>SOC上下限</span>
                          </dt>
                          <dd>
                            {socAndPowerData?.socLower && socAndPowerData?.socUpper
                              ? `${socAndPowerData?.socLower}/${socAndPowerData?.socUpper}`
                              : '/'}
                          </dd>
                        </dl>
                        <Divider style={{ height: 40, top: 2 }} type="vertical" />

                        <dl>
                          <dt>
                            <span>额定功率(kW)</span>
                          </dt>
                          <dd>{socAndPowerData?.ratedPower ?? '/'}</dd>
                        </dl>
                        <Divider style={{ height: 40, top: 2 }} type="vertical" />
                        <dl>
                          <dt>
                            <span>最大充电/放电功率(kW)</span>
                          </dt>
                          <dd>
                            {socAndPowerData?.maxChargePower && socAndPowerData?.maxDisChargePower
                              ? `${socAndPowerData?.maxChargePower}/${socAndPowerData?.maxDisChargePower}`
                              : '/'}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </CustomCard>
              </div>
              <div className={styles.bannerRight}>
                <CustomCard>
                  <div className={styles.warp}>
                    <div className={styles.titleBase}>
                      <div className={styles.titleBaseText}>充放电量</div>
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
                    <div className={styles.moduleMain}>
                      <CustomCharts
                        options={powerGenerationOptions(fullAndPutPowerData, fullAndPutDate)}
                        height="230px"
                        loading={fullAndPutPowerLoading}
                      />
                    </div>
                  </div>
                </CustomCard>
              </div>
            </div>
          </div>

          {/* 功率趋势、SOC趋势 */}
          <div className={styles.wapper}>
            <div className={styles.trend}>
              <div className={`${styles.trendEchartWrap} ${styles.mr20}`}>
                <CustomCard>
                  <div className={styles.powerCount}>
                    <div className={styles.titleBase}>
                      <div className={styles.titleBaseText}>功率趋势</div>
                      <Space>
                        <CustomDatePicker datePickerType={'day'} onChange={changeDatePowerCount} />
                      </Space>
                    </div>
                    <div className={`${styles.powerCountEchart}`}>
                      <CustomCharts
                        options={powerCountOptions(powerTrendData, powerTrenIsToday.current)}
                        height="230px"
                        loading={powerTrendLoading}
                      />
                    </div>
                  </div>
                </CustomCard>
              </div>
              <div className={styles.trendEchartWrap}>
                <CustomCard>
                  <div className={styles.powerCount}>
                    <div className={styles.titleBase}>
                      <div className={styles.titleBaseText}>SOC趋势</div>
                      <Space>
                        <CustomDatePicker datePickerType={'day'} onChange={changeDateSoc} />
                      </Space>
                    </div>
                    <div className={styles.powerCountEchart}>
                      <CustomCharts
                        options={soCountOptions(socTrendData, socTrenIsToday.current)}
                        height="230px"
                        loading={socTrendLoading}
                      />
                    </div>
                  </div>
                </CustomCard>
              </div>
            </div>
          </div>

          {/* PCS、电池簇、并网表、空调概览 */}
          <div className={styles.wapper}>
            <CustomCard>
              <div className={styles.inverter}>
                <div className={styles.inverterHead}>
                  <SegmentedTheme
                    options={['PCS概览', '电池簇概览', '电表概览', '空调概览']}
                    getSelectedValue={overviewChange}
                  />
                </div>
                {renderInverter(moduleStatus, overviewData, substationId)}
              </div>
            </CustomCard>
          </div>

          {/* 告警详情 */}
          <div className={styles.wapper}>
            <CustomCard>
              <div className={styles.titleBase}>
                <div className={styles.titleBaseText}>告警详情</div>
              </div>
              <div className={styles.flex_between} style={{ padding: '0 20px' }}>
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
export default EnergyStation;
