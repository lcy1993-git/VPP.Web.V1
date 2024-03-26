import CircleRingChart from '@/components/circle-ring-chart';
import ContainerPage from '@/components/container-page';
import CustomCard from '@/components/custom-card';
import CustomCharts from '@/components/custom-charts';
import CustomDatePicker from '@/components/custom-datePicker';
import SegmentedTheme from '@/components/segmented-theme';
import {
  getChargeOverview,
  getChargePileOverview,
  getChargePower,
  getChargeStation,
} from '@/services/charge-station';
import { useLocation, useRequest } from '@umijs/max';
import { Avatar, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { chargeOverviewChart } from '../dcs-energy-monitor/utils';
import styles from './index.less';
import { renderChargeList, renderList } from './utils';

const ChargingStation = () => {
  const { state }: { state: any } = useLocation();
  // 当前站点ID
  const [substationCode, setSubStationCode] = useState<string>('');
  // 当前用户可以访问的站点
  const [allSubStation, setAllSubStation] = useState<any>([]);
  // 充电功率趋势日期
  const [chargeDate, setChargeDate] = useState<string>(dayjs(`${new Date()}`).format('YYYY-MM-DD'));
  // 充电桩运行状态类型
  const [type, setType] = useState<string>('全部');
  // 充电功率趋势是否当天
  const [chargePowerIsToday, setChargePowerIsToday] = useState<boolean>(true);

  // 获取站点数据
  const {} = useRequest(getChargeStation, {
    manual: false,
    onSuccess: (result) => {
      if (result && result.length) {
        const substation = result.map((item: any) => {
          return {
            key: item.substationCode,
            label: (
              <span
                onClick={() => setSubStationCode(item.substationCode)}
                style={{ display: 'inline-block', width: '100%', paddingRight: '12px' }}
              >
                {item.name}
              </span>
            ),
            name: item.name,
          };
        });
        const siteId = state?.subStationCode ? state?.subStationCode : substation[0].key;
        setSubStationCode(siteId);
        setAllSubStation(substation);
      }
    },
  });

  // 获取header右侧数据
  const { run: fetchChargeOverview, data: chargeOverview } = useRequest(getChargeOverview, {
    manual: true,
  });

  // 充电功率趋势
  const { run: fetchChargePower, data: chargePower } = useRequest(getChargePower, {
    manual: true,
  });

  // 充电桩运行状态
  const { run: fetchChargePileOverview, data: chargePileOverview } = useRequest(
    getChargePileOverview,
    {
      manual: true,
    },
  );

  /** 电站名称处理 */
  const renderSiteName = (index = 0) => {
    const currentSite = allSubStation?.find((item: any) => item?.key === substationCode);
    if (index) {
      return currentSite?.name.slice(0, index) || '';
    }
    return currentSite?.name || '暂无数据';
  };

  // 充电功率趋势日期
  const renderDateRight = () => {
    return (
      <CustomDatePicker
        datePickerType="day"
        getDate={(value) => setChargeDate(value)}
        setIsToday={setChargePowerIsToday}
      />
    );
  };

  // 充电桩运行状态SegmentedTheme
  const renderSegmentedRight = () => {
    return (
      <SegmentedTheme
        options={['全部', '直流充电桩', '交流充电桩']}
        getSelectedValue={(value) => setType(value)}
      />
    );
  };

  // 充电功率趋势
  useEffect(() => {
    if (substationCode) fetchChargePower(substationCode, chargeDate);
  }, [substationCode, chargeDate]);

  // 充电桩运行状态
  useEffect(() => {
    if (substationCode) fetchChargePileOverview(substationCode, type);
  }, [substationCode, type]);

  // 使用功率
  useEffect(() => {
    if (substationCode) fetchChargeOverview(substationCode);
  }, [substationCode]);

  return (
    <ContainerPage>
      <div className={styles.pageContainer}>
        {/* header */}
        <div className={styles.wrapper}>
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
                      onChange={(value) => setSubStationCode(value)}
                      fieldNames={{ label: 'name', value: 'key' }}
                      options={allSubStation}
                    />
                  )}
                </div>
              </div>
              <div className={styles.headerRight}>
                {renderChargeList(substationCode ? chargeOverview : {})}
              </div>
            </div>
          </CustomCard>
        </div>
        {/* 圆环、图表 */}
        <div className={styles.charts}>
          <div className={styles.circleRingChart}>
            <CustomCard title="功率和使用率" isTitleCenter={false}>
              <div className={styles.row}>
                <div>
                  <CircleRingChart
                    textName="功率"
                    pathColor="#60ACFC"
                    value={substationCode ? chargeOverview?.power || 0 : 0}
                    circleRingChartRatio={
                      substationCode
                        ? (
                            (chargeOverview?.ratePower / chargeOverview?.ratePower || 0) * 100
                          ).toFixed(2)
                        : 0
                    }
                    subTitle="kW"
                    // breadth="210px"
                  />
                </div>
                <div style={{ marginLeft: '20px' }}>
                  <CircleRingChart
                    textName="使用率"
                    pathColor="#5BC49F"
                    value={substationCode ? chargeOverview?.utilizationRate || 0 : 0}
                    subTitle="%"
                    // breadth="210px"
                  />
                </div>
              </div>
            </CustomCard>
          </div>
          <div className={styles.charge}>
            <CustomCard title="充电功率趋势" isTitleCenter={false} renderRight={renderDateRight}>
              <CustomCharts
                options={chargeOverviewChart(
                  substationCode ? chargePower?.powerMap : {},
                  chargePowerIsToday,
                )}
              />
            </CustomCard>
          </div>
        </div>
        {/* 充电桩运行状态 */}
        <div className={styles.bottomContainer}>
          <CustomCard title="充电桩运行状态" renderRight={renderSegmentedRight}>
            {renderList(substationCode ? chargePileOverview : [], substationCode)}
          </CustomCard>
        </div>
      </div>
    </ContainerPage>
  );
};
export default ChargingStation;
