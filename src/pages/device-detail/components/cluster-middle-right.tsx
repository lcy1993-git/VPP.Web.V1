import CustomCharts from '@/components/custom-charts';
import { disableDate } from '@/pages/big-screen/utils';
import { soCountOptions } from '@/pages/energy-station/utils';
import { getSocTrend } from '@/services/energy-station';
import { judgmentIsToday } from '@/utils/common';
import { useRequest } from '@umijs/max';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import styles from '../index.less';

const ClusterMiddleRight = (props: any) => {
  const isTodayRef = useRef<boolean>(true);
  const { deviceCode } = props;

  // 功率曲线
  const { run: fetchPowerCurve, data: powerCurve } = useRequest(getSocTrend, {
    manual: true,
  });

  //  日期组件change
  const chargeDisDataPickChange = (date: any) => {
    if (!date || !deviceCode) {
      return;
    }
    isTodayRef.current = judgmentIsToday(date);
    fetchPowerCurve({
      substationCode: deviceCode,
      date: dayjs(date).format('YYYY-MM-DD'),
    });
  };

  useEffect(() => {
    if (deviceCode) {
      fetchPowerCurve({
        date: dayjs().format('YYYY-MM-DD'),
        substationCode: deviceCode,
      });
    }
  }, [deviceCode]);

  return (
    <div className={styles.echartsModule}>
      <div className={styles.echartsModuleTitle}>
        <div className={styles.echartTitle}>SOC趋势</div>
        <div>
          <DatePicker
            defaultValue={dayjs(dayjs(`${new Date()}`), 'YYYY-MM-DD')}
            onChange={chargeDisDataPickChange}
            disabledDate={disableDate}
          />
        </div>
      </div>
      <div className={styles.echartsModuleBody}>
        <CustomCharts
          options={soCountOptions(powerCurve, isTodayRef.current)}
          height={240}
          loading={false}
        />
      </div>
    </div>
  );
};
export default ClusterMiddleRight;
