import ContentPage from '@/components/content-page';
import CustomCard from '@/components/custom-card';
import CustomCharts from '@/components/custom-charts';
import CustomDatePicker from '@/components/custom-datePicker';
import { getElectricOverview, getInformation, getPowerOverview } from '@/services/energy-overview';
import { useRequest } from '@umijs/max';
import { Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styles from './index.less';
import {
  pieChart,
  powerOverviewOptions,
  renderAverageData,
  renderOverviewData,
  stackedBarChart,
} from './utils';

// 用能总览
const EnergyOverview = () => {
  const date = dayjs(new Date()).format('YYYY-MM-DD');
  // 用电概览按钮组（默认电费）
  const [chargeOrQuantity, setChargeOrQuantity] = useState<boolean>(true);
  // 用电概览日期
  const [dateValue, setDateValue] = useState<string>('');
  // 用电概览日期类型
  const [type, setType] = useState<string>('');
  // 负荷概览是否当天
  const [powerOverviewIsToday, setPowerOverviewIsToday] = useState<boolean>(true);

  // 查询上方信息
  const { data: information } = useRequest(getInformation, {
    manual: false,
  });

  // 用电概览
  const {
    data: electricOverview,
    run: fetchElectricOverview,
    loading: electricOverviewLoading,
  } = useRequest(getElectricOverview, {
    manual: true,
  });

  // 负荷概览
  const {
    data: powerOverview,
    run: fetchPowerOverview,
    loading: powerOverviewLoading,
  } = useRequest(getPowerOverview, {
    manual: true,
  });

  // 用电概览按钮组
  const renderCenter = () => {
    return (
      <div className={styles.buttons}>
        <div
          className={`${styles.btn} ${chargeOrQuantity ? styles.btnLeftActive : styles.btnLeft} `}
          style={{ paddingLeft: '10px' }}
          onClick={() => setChargeOrQuantity(true)}
        >
          <Space>
            <i className="iconfont">&#xe63d;</i>
            <span>电费</span>
          </Space>
        </div>
        <div
          className={`${styles.btn} ${chargeOrQuantity ? styles.btnRight : styles.btnRightActive} `}
          onClick={() => setChargeOrQuantity(false)}
          style={{ paddingRight: '10px' }}
        >
          <Space>
            <i className="iconfont">&#xe644;</i>
            <span>电量</span>
          </Space>
        </div>
      </div>
    );
  };

  // 负荷概览日历
  const renderRight = () => {
    return (
      <CustomDatePicker
        datePickerType={'day'}
        onChange={(value: string) => fetchPowerOverview(dayjs(value).format('YYYY-MM-DD'))}
        setIsToday={setPowerOverviewIsToday}
      />
    );
  };

  useEffect(() => {
    fetchPowerOverview(date);
  }, []);

  // 电费/电量切换
  useEffect(() => {
    if (date && type) fetchElectricOverview(dateValue, chargeOrQuantity, type);
  }, [chargeOrQuantity, dateValue, type]);

  return (
    <ContentPage>
      <div className={styles.overviewPage}>
        {/* 数据总览 */}
        <div className={styles.header}>
          <CustomCard>
            <div>{renderOverviewData(information)}</div>
          </CustomCard>
        </div>
        {/* 用电概览 */}
        <div className={styles.centerContainer}>
          <CustomCard title="用电概览" isTitleCenter={false} renderCenter={renderCenter}>
            <div className={styles.centerBody}>
              {/* 左侧 */}
              <div className={styles.leftContainer}>
                {/* 平均电价及电费 */}
                <div>
                  {renderAverageData(
                    type,
                    chargeOrQuantity,
                    electricOverview?.averageElectricityPrice,
                    electricOverview?.averageElectricityCost,
                    electricOverview?.averageElectricityConsumption,
                  )}
                </div>
                {/* 尖峰平台占比 */}
                <div className={styles.proportion}>
                  <div className={styles.title}>
                    {type === 'day' ? '日' : type === 'month' ? '月' : '年'}电量尖峰平谷占比（%）
                  </div>
                  <CustomCharts
                    options={pieChart(
                      electricOverview?.peakElectricity,
                      electricOverview?.highElectricity,
                      electricOverview?.normalElectricity,
                      electricOverview?.valleyElectricity,
                    )}
                    loading={electricOverviewLoading}
                  />
                </div>
              </div>
              {/* 右侧柱状 */}
              <div className={styles.rightContainer}>
                <div className={styles.datePicker}>
                  <CustomDatePicker datePickerType={''} setUnit={setType} setDate={setDateValue} />
                </div>
                <CustomCharts
                  options={stackedBarChart(
                    type,
                    chargeOrQuantity,
                    electricOverview?.peakElectricityMap,
                    electricOverview?.highElectricityMap,
                    electricOverview?.normalElectricityMap,
                    electricOverview?.valleyElectricityMap,
                  )}
                  loading={electricOverviewLoading}
                />
              </div>
            </div>
          </CustomCard>
        </div>
        {/* 负荷概览 */}
        <div className={styles.bottomContainer}>
          <CustomCard title="负荷概览" isTitleCenter={false} renderRight={renderRight}>
            <CustomCharts
              options={powerOverviewOptions(powerOverview, powerOverviewIsToday)}
              loading={powerOverviewLoading}
            />
          </CustomCard>
        </div>
      </div>
    </ContentPage>
  );
};
export default EnergyOverview;
