/*
 * @Author: lzq 1204263312@qq.com
 * @Date: 2024-03-11 09:58:25
 * @LastEditors: lzq 1204263312@qq.com
 * @LastEditTime: 2024-03-13 16:21:21
 * @FilePath: \VPP.Web.V1\src\pages\energy-overview\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ContentPage from '@/components/content-page';
import CustomCard from '@/components/custom-card';
import CustomCharts from '@/components/custom-charts';
import { getElectricOverview, getInformation, getPowerOverview } from '@/services/energy-overview';
import { useRequest } from '@umijs/max';
import { DatePicker, Space } from 'antd';
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
          onClick={() => setChargeOrQuantity(true)}
        >
          <Space>
            {/* <i className="iconfont">&#xe620;</i> */}
            <span>电费</span>
          </Space>
        </div>
        <div
          className={`${styles.btn} ${chargeOrQuantity ? styles.btnRight : styles.btnRightActive} `}
          onClick={() => setChargeOrQuantity(false)}
        >
          <Space>
            {/* <i className="iconfont">&#xe621;</i> */}
            <span>电量</span>
          </Space>
        </div>
      </div>
    );
  };

  // 负荷概览日历
  const renderRight = () => {
    return (
      <DatePicker
        defaultValue={dayjs(date, 'YYYY-MM-DD')}
        onChange={(value) => fetchPowerOverview(dayjs(value).format('YYYY-MM-DD'))}
        allowClear={false}
      />
    );
  };

  useEffect(() => {
    fetchPowerOverview(date);
    fetchElectricOverview(date, 1, 'day');
  }, []);

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
                    electricOverview?.averageElectricityPrice,
                    electricOverview?.averageElectricityCost,
                  )}
                </div>
                {/* 尖峰平台占比 */}
                <div className={styles.proportion}>
                  <div className={styles.title}>日电量尖峰平谷占比（%）</div>
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
                <CustomCharts
                  options={stackedBarChart(
                    electricOverview?.peakElectricityMap,
                    electricOverview?.highElectricityMap,
                    electricOverview?.normalElectricityMap,
                    electricOverview?.valleyElectricityMap
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
              options={powerOverviewOptions(powerOverview)}
              loading={powerOverviewLoading}
            />
          </CustomCard>
        </div>
      </div>
    </ContentPage>
  );
};
export default EnergyOverview;
