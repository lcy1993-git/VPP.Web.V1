import CustomCharts from '@/components/custom-charts';
import SegmentedTheme from '@/components/segmented-theme';
import { disableDate } from '@/pages/big-screen/utils';
import { getDeviceTemperature } from '@/services/energy-station';
import { judgmentIsToday } from '@/utils/common';
import { useRequest } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import styles from '../index.less';
import { deviceTemperature } from './utils';

// middle 电磁簇 温度统计
const ClusterTemperature = (props: any) => {
  const isTodayRef = useRef<boolean>(true);
  const { deviceCode } = props;

  const options = ['温度', '电压'];

  // 当前设备
  const [clusterType, setClusterType] = useState<1 | 2>(1);

  // 当前选中时间
  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));

  // 请求温度数据
  const { run: fetchDeviceTemperature, data: tempData } = useRequest(getDeviceTemperature, {
    manual: true,
  });

  // 充放电统计 日期组件change
  const chargeDisDataPickChange = (date: any) => {
    if (!date || !deviceCode) {
      setCurrentDate(dayjs().format('YYYY-MM-DD'));
      return;
    }
    isTodayRef.current = judgmentIsToday(date);
    setCurrentDate(dayjs(date).format('YYYY-MM-DD'));
    fetchDeviceTemperature({
      deviceCode: deviceCode,
      date: dayjs(date).format('YYYY-MM-DD'),
      type: clusterType,
    });
  };

  // 第一次不做请求 设备类型发生变化重新请求数据
  useUpdateEffect(() => {
    fetchDeviceTemperature({
      deviceCode: deviceCode,
      date: currentDate,
      type: clusterType,
    });
  }, [clusterType]);

  useEffect(() => {
    if (deviceCode) {
      fetchDeviceTemperature({
        deviceCode: deviceCode, // 'cluster12',
        date: currentDate,
        type: clusterType,
      });
    }
  }, [deviceCode]);

  return (
    <div className={styles.echartsModule}>
      <div className={styles.echartsModuleTitle}>
        <div className={styles.echartTitle}>
          <span>设备</span>
          <span>{options[clusterType - 1]}</span>
          <span>统计</span>
        </div>
        <div>
          <SegmentedTheme
            defaultValue="温度"
            options={options}
            getSelectedValue={(value) => {
              const index = options.findIndex((item) => item === value) + 1;
              setClusterType(index as 1 | 2);
            }}
          />
        </div>
        <div>
          <DatePicker
            picker="date"
            value={dayjs(currentDate, 'YYYY-MM-DD')}
            onChange={chargeDisDataPickChange}
            disabledDate={disableDate}
          />
        </div>
      </div>
      <div className={styles.echartsModuleBody}>
        <div style={{ display: clusterType === 1 ? '' : 'none' }} className={styles.information}>
          <span>最大温度：{tempData?.maxTemperature}℃</span>
          <span>最小温度：{tempData?.minTemperature}℃</span>
          <span>平均温度：{tempData?.averageTemperature}℃</span>
          <span>最大温差：{tempData?.temDiffMaxAndMin}℃</span>
        </div>
        <CustomCharts
          options={deviceTemperature(
            tempData?.temperatureOrVoltageMap,
            clusterType,
            isTodayRef.current,
          )}
          height="200px"
        />
      </div>
    </div>
  );
};
export default ClusterTemperature;
