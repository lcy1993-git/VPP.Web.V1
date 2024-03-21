import CircleRingChart from '@/components/circle-ring-chart';
import ContentPage from '@/components/content-page';
import CustomCard from '@/components/custom-card';
import CustomCharts from '@/components/custom-charts';
import CustomDatePicker from '@/components/custom-datePicker';
import SegmentedTheme from '@/components/segmented-theme';
import { getChargePileOverview, getChargePower, getChargeStation } from '@/services/charge-station';
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
  const [substationId, setSubStationId] = useState<string>('');
  // 当前用户可以访问的站点
  const [allSubStation, setAllSubStation] = useState<any>([]);
  // 充电功率趋势日期
  const [chargeDate, setChargeDate] = useState<string>(dayjs(`${new Date()}`).format('YYYY-MM-DD'));
  // 充电桩运行状态类型
  const [type, setType] = useState<string>('全部');

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
        setAllSubStation(substation);
      }
    },
  });

  // 获取header右侧数据

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
    const currentSite = allSubStation?.find((item: any) => item?.key === substationId);
    if (index) {
      return currentSite?.name.slice(0, index) || '';
    }
    return currentSite?.name || '暂无数据';
  };

  // 充电功率趋势日期
  const renderDateRight = () => {
    return <CustomDatePicker datePickerType="day" getDate={(value) => setChargeDate(value)} />;
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
    if (substationId) fetchChargePower(substationId, chargeDate);
  }, [substationId, chargeDate]);

  // 充电桩运行状态
  useEffect(() => {
    if (substationId) fetchChargePileOverview(substationId, type);
  }, [substationId, type]);

  return (
    <ContentPage>
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
                      onChange={(value) => setSubStationId(value)}
                      fieldNames={{ label: 'name', value: 'key' }}
                      options={allSubStation}
                    />
                  )}
                </div>
              </div>
              <div className={styles.headerRight}>{renderChargeList({})}</div>
            </div>
          </CustomCard>
        </div>
        {/* 圆环、图表 */}
        <div className={styles.charts}>
          <div className={styles.circleRingChart}>
            <CustomCard title="功率和使用率" isTitleCenter={false}>
              <div className={styles.row}>
                <CircleRingChart
                  textName="功率"
                  pathColor="#60ACFC"
                  value={0}
                  circleRingChartRatio={0}
                  subTitle="kW"
                  breadth="210px"
                />
                <CircleRingChart
                  textName="使用率"
                  pathColor="#5BC49F"
                  value={20}
                  subTitle="%"
                  breadth="210px"
                />
              </div>
            </CustomCard>
          </div>
          <div className={styles.charge}>
            <CustomCard title="充电功率趋势" isTitleCenter={false} renderRight={renderDateRight}>
              <CustomCharts
                options={chargeOverviewChart(substationId ? chargePower?.powerMap : {})}
              />
            </CustomCard>
          </div>
        </div>
        {/* 充电桩运行状态 */}
        <div className={styles.bottomContainer}>
          <CustomCard title="充电桩运行状态" renderRight={renderSegmentedRight}>
            {renderList(substationId ? chargePileOverview : [])}
          </CustomCard>
        </div>
      </div>
    </ContentPage>
  );
};
export default ChargingStation;
