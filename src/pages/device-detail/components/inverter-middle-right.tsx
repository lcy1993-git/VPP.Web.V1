import CustomCharts from '@/components/custom-charts';
import { disableDate } from '@/pages/big-screen/utils';
import { getDirectCurrent } from '@/services/power-station';
import { judgmentIsToday } from '@/utils/common';
import { useRequest } from '@umijs/max';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import styles from '../index.less';
import { directCurrentOptions } from './utils';
// PCS middle right render
const InverterMiddleRight = (props: any) => {
  const { deviceCode } = props;
  const isTodayRef = useRef<boolean>(true);

  // 逆变器详情 - 直流电趋势
  const { run: fetchDirectCurrent, data: directCurrent } = useRequest(getDirectCurrent, {
    manual: true,
  });

  //  日期组件change
  const chargeDisDataPickChange = (date: any) => {
    if (!date || !deviceCode) {
      return;
    }
    isTodayRef.current = judgmentIsToday(date);
    fetchDirectCurrent({
      deviceCode: deviceCode,
      date: dayjs(date).format('YYYY-MM-DD'),
    });
  };

  useEffect(() => {
    if (deviceCode) {
      fetchDirectCurrent({
        date: dayjs().format('YYYY-MM-DD'),
        deviceCode: deviceCode,
      });
    }
  }, [deviceCode]);

  return (
    <div className={styles.echartsModule}>
      <div className={styles.echartsModuleTitle}>
        <div className={styles.echartTitle}>直流电流趋势</div>
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
          options={directCurrentOptions(directCurrent, isTodayRef.current)}
          height={230}
        />
      </div>
    </div>
  );
};
export default InverterMiddleRight;
