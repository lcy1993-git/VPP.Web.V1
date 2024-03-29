import CircleRingChart from '@/components/circle-ring-chart';
import ContainerPage from '@/components/container-page';
import CustomCard from '@/components/custom-card';
import CustomCharts from '@/components/custom-charts';
import CustomDatePicker from '@/components/custom-datePicker';
import CustomListItem from '@/components/custom-list-item';
import Empty from '@/components/empty';
import SegmentedTheme from '@/components/segmented-theme';
import {
  getBMSOverview,
  getChargeOverview,
  getChargePileOverview,
  getEssOverview,
  getInverterOverview,
  getOnline,
  getPCSOverview,
  getSingleChargeOverview,
  getSingleEssOverview,
  getSingleSolarOverview,
  getSolarOverview,
  getSubstation,
} from '@/services/dcs-energy-monitor';
import { useRequest } from '@umijs/max';
import { Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styles from './index.less';
import {
  chargeOverviewChart,
  essOverviewChart,
  handleChargeData,
  handleEssData,
  handleSolarData,
  onlineChart,
  renderChargeList,
  renderDeviceList,
  solarOverviewChart,
} from './utils';

const DcsEnergyMonitor = () => {
  // 当天
  const DATE = dayjs(`${new Date()}`).format('YYYY-MM-DD');
  // 分布式能源总览查询类型（默认光伏）
  const [energyOverviewType, setEnergyOverviewType] = useState<string>('光伏');
  // 分布式能源总览查询日期
  const [energyOverviewDate, setEnergyOverviewDate] = useState<string>(DATE);
  // 分布式能源总览查询日期是否当天
  const [energyOverviewIsToday, setEnergyOverviewIsToday] = useState<boolean>(true);
  // 企业概览查询类型（默认光伏）
  const [enterpriseOverviewType, setEnterpriseOverviewType] = useState<string>('光伏');
  // 企业概览查询日期
  const [enterpriseOverviewDate, setEnterpriseOverviewDate] = useState<string>(DATE);
  // 企业概览查询日期是否当天
  const [enterpriseOverviewIsToday, setEnterpriseOverviewIsToday] = useState<boolean>(true);
  // 企业概览查询电站Id
  const [substationCode, setSubstationCode] = useState<string>('');
  // 企业设备概览运行状态
  const [runStatus, setRunStatus] = useState<string>('全部');
  // 企业设备概览数据
  const [deviceData, setDeviceData] = useState<any>([]);
  // 储能类型
  const [essType, setEssType] = useState<string>('PCS');

  // 获得企业选项数据
  const { run: fetchStationNames, data: stationNames } = useRequest(getSubstation, {
    manual: true,
  });

  // 分布式能源总览-光伏
  const {
    run: fetchSolarOverview,
    data: solarOverview,
    loading: solarOverviewLoading,
  } = useRequest(getSolarOverview, {
    manual: true,
  });

  // 分布式能源总览-储能
  const {
    run: fetchEssOverview,
    data: essOverview,
    loading: essOverviewLoading,
  } = useRequest(getEssOverview, {
    manual: true,
  });

  // 分布式能源总览-充电
  const {
    run: fetchChargeOverview,
    data: chargeOverview,
    loading: chargeOverviewLoading,
  } = useRequest(getChargeOverview, {
    manual: true,
  });

  // 设备在线概况
  const { data: onlineData, loading: onlineLoading } = useRequest(getOnline, {
    manual: false,
  });

  // 企业概览-光伏
  const {
    run: fetchSingleSolarOverview,
    data: singleSolarOverview,
    loading: singleSolarOverviewLoading,
  } = useRequest(getSingleSolarOverview, {
    manual: true,
  });

  // 企业概览-储能
  const {
    run: fetchSingleEssOverview,
    data: singleEssOverview,
    loading: singleEssOverviewLoading,
  } = useRequest(getSingleEssOverview, {
    manual: true,
  });

  // 企业概览-充电
  const { run: fetchSingleChargeOverview, data: singleChargeOverview } = useRequest(
    getSingleChargeOverview,
    {
      manual: true,
    },
  );

  // 逆变器概览
  const { run: fetchInverterOverview } = useRequest(getInverterOverview, {
    manual: true,
    onSuccess: (res: any) => setDeviceData(res),
  });

  // pcs概览
  const { run: fetchPCSOverview } = useRequest(getPCSOverview, {
    manual: true,
    onSuccess: (res: any) => setDeviceData(res),
  });

  // bms概览
  const { run: fetchBMSOverview } = useRequest(getBMSOverview, {
    manual: true,
    onSuccess: (res: any) => setDeviceData(res),
  });

  // 充电桩概览
  const { run: fetchChargePileOverview } = useRequest(getChargePileOverview, {
    manual: true,
    onSuccess: (res: any) => setDeviceData(res),
  });

  // 分布式能源总览右侧日历
  const renderEnergyRight = () => {
    return (
      <CustomDatePicker
        datePickerType="day"
        setDate={setEnergyOverviewDate}
        setIsToday={setEnergyOverviewIsToday}
      />
    );
  };

  // 根据模块查询类型返回分布式能源总览数据列表
  const renderListItem = () => {
    if (energyOverviewType === '光伏') {
      return handleSolarData(solarOverview);
    } else if (energyOverviewType === '储能') {
      return handleEssData(essOverview);
    } else {
      return handleChargeData(chargeOverview);
    }
  };

  // 根据模块查询类型返回分布式能源总览图表
  const renderChart = () => {
    const res: any = {};
    switch (energyOverviewType) {
      case '光伏':
        res.chart = solarOverviewChart(
          solarOverview?.powerMap,
          solarOverview?.irradianceMap,
          energyOverviewIsToday,
        );
        res.loading = solarOverviewLoading;
        break;
      case '储能':
        res.chart = essOverviewChart(
          essOverview?.chargePower,
          essOverview?.disChargePower,
          energyOverviewIsToday,
        );
        res.loading = essOverviewLoading;
        break;
      default:
        res.chart = chargeOverviewChart(chargeOverview?.powerMap, energyOverviewIsToday);
        res.loading = chargeOverviewLoading;
    }
    return res;
  };

  // 根据模块查询类型返回企业概览数据列表
  const renderEnterpriseListItem = () => {
    if (enterpriseOverviewType === '光伏') {
      return handleSolarData(substationCode ? singleSolarOverview : {});
    } else {
      return handleEssData(substationCode ? singleEssOverview : {});
    }
  };

  // 根据模块查询类型返回企业概览图表
  const renderEnterpriseChart = () => {
    if (!substationCode) return <Empty />;
    const res: any = {};
    if (enterpriseOverviewType === '光伏') {
      res.chart = solarOverviewChart(
        singleSolarOverview?.powerMap,
        singleSolarOverview?.irradianceMap,
        enterpriseOverviewIsToday,
      );
      res.loading = singleSolarOverviewLoading;
    } else {
      res.chart = essOverviewChart(
        singleEssOverview?.chargePower,
        singleEssOverview?.disChargePower,
        enterpriseOverviewIsToday,
      );
      res.loading = singleEssOverviewLoading;
    }
    return res;
  };

  // 分布式能源概览根据日期、类型查询
  useEffect(() => {
    switch (energyOverviewType) {
      case '光伏':
        fetchSolarOverview(energyOverviewDate);
        break;
      case '储能':
        fetchEssOverview(energyOverviewDate);
        break;
      default:
        fetchChargeOverview(energyOverviewDate);
        break;
    }
  }, [energyOverviewType, energyOverviewDate]);

  // 企业概览根据日期、类型查询
  useEffect(() => {
    if (substationCode) {
      switch (enterpriseOverviewType) {
        case '光伏':
          fetchSingleSolarOverview(enterpriseOverviewDate, substationCode);
          break;
        case '储能':
          fetchSingleEssOverview(energyOverviewDate, substationCode);
          break;
        default:
          fetchSingleChargeOverview(energyOverviewDate, substationCode);
          break;
      }
    }
  }, [enterpriseOverviewDate, substationCode]);

  // 设备概览
  useEffect(() => {
    if (substationCode) {
      switch (enterpriseOverviewType) {
        case '光伏':
          fetchInverterOverview(runStatus, substationCode);
          break;
        case '储能':
          switch (essType) {
            case 'PCS':
              fetchPCSOverview(runStatus, substationCode);
              break;
            default:
              fetchBMSOverview(runStatus, substationCode);
              break;
          }
          break;
        default:
          fetchChargePileOverview(runStatus, substationCode);
          break;
      }
    } else {
      setDeviceData([]);
    }
  }, [substationCode, runStatus, essType]);

  // 默认选中第一个电站
  useEffect(() => {
    fetchStationNames(enterpriseOverviewType).then((data: any) => {
      if (data.length > 0) {
        setSubstationCode(data[0].substationCode);
      } else {
        setSubstationCode('');
      }
    });
    setEssType('PCS');
  }, [enterpriseOverviewType]);

  return (
    <ContainerPage>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <div className={styles.topContainer}>
            <CustomCard
              title="分布式能源总览"
              isTitleCenter={false}
              renderRight={renderEnergyRight}
            >
              <div className={styles.energyOverview}>
                <div className={styles.segmented}>
                  <SegmentedTheme
                    options={['光伏', '储能', '充电']}
                    getSelectedValue={(value) => setEnergyOverviewType(value)}
                  />
                </div>
                <div>
                  <CustomListItem data={renderListItem()} />
                </div>
                <CustomCharts options={renderChart().chart} loading={renderChart().loading} />
              </div>
            </CustomCard>
          </div>
          <div className={styles.bottomContainer}>
            <CustomCard title="设备在线概况" isTitleCenter={false}>
              <CustomCharts options={onlineChart(onlineData)} loading={onlineLoading} />
            </CustomCard>
          </div>
        </div>
        <div className={styles.rightContainer}>
          <CustomCard>
            <div className={styles.enterpriseContainer}>
              <div className={styles.select}>
                企业名称：
                <Select
                  options={stationNames}
                  placeholder="请选择企业"
                  allowClear={false}
                  fieldNames={{
                    label: 'name',
                    value: 'substationCode',
                  }}
                  value={substationCode}
                  onChange={(value) => setSubstationCode(value)}
                  style={{ width: '280px', height: '35px' }}
                />
              </div>
              <div className={styles.line} />
              {/* 企业概览 */}
              <div className={styles.title}>
                <span className={styles.titleText}>企业概览</span>
                <SegmentedTheme
                  options={['光伏', '储能', '充电']}
                  getSelectedValue={(value) => setEnterpriseOverviewType(value)}
                />
                <CustomDatePicker
                  datePickerType="day"
                  setDate={setEnterpriseOverviewDate}
                  setIsToday={setEnterpriseOverviewIsToday}
                />
              </div>
              <div className={styles.dataContainer}>
                {enterpriseOverviewType === '充电' ? (
                  <div className={styles.charge}>
                    <div className={styles.circleRingChart}>
                      <CircleRingChart
                        textName="功率"
                        pathColor="#60ACFC"
                        value={substationCode ? singleChargeOverview?.power || 0 : 0}
                        circleRingChartRatio={
                          substationCode
                            ? (
                                (singleChargeOverview?.ratePower /
                                  singleChargeOverview?.ratePower || 0) * 100
                              ).toFixed(2)
                            : 0
                        }
                        subTitle="kW"
                        breadth="210px"
                      />
                      <CircleRingChart
                        textName="使用率"
                        pathColor="#5BC49F"
                        value={substationCode ? singleChargeOverview?.utilizationRate || 0 : 0}
                        subTitle="%"
                        breadth="210px"
                      />
                    </div>
                    {renderChargeList(substationCode ? singleChargeOverview : {})}
                  </div>
                ) : (
                  <div className={styles.chart}>
                    <CustomListItem data={renderEnterpriseListItem()} />
                    <div className={styles.customCharts}>
                      <CustomCharts
                        options={renderEnterpriseChart().chart}
                        loading={renderEnterpriseChart().loading}
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* 企业设备状况 */}
              <div className={styles.title}>
                <span className={styles.titleText}>企业设备概况</span>
                {enterpriseOverviewType === '储能' && (
                  <SegmentedTheme
                    options={['PCS', 'BMS']}
                    getSelectedValue={(value) => setEssType(value)}
                  />
                )}
                <SegmentedTheme
                  options={
                    enterpriseOverviewType === '充电'
                      ? ['全部', '直流充电桩', '交流充电桩']
                      : ['全部', '运行', '非运行']
                  }
                  getSelectedValue={(value) => setRunStatus(value)}
                />
              </div>
              {renderDeviceList(enterpriseOverviewType, deviceData, essType, substationCode)}
            </div>
          </CustomCard>
        </div>
      </div>
    </ContainerPage>
  );
};
export default DcsEnergyMonitor;
