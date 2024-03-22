import CustomCharts from '@/components/custom-charts';
import { disableDate } from '@/pages/big-screen/utils';
import { getChargePower } from '@/services/device-detail';
import { getInverterLine } from '@/services/power-station';
import { judgmentIsToday } from '@/utils/common';
import { useRequest } from '@umijs/max';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import styles from '../index.less';
import { chargePowerOptions, powerCountOptions } from './utils';
// 逆变器或充电桩 功率曲线
const InverterPowerCurve = (props: any) => {
  const { deviceCode, type } = props;
  const isTodayRef = useRef<boolean>(true);

  // 逆变器详情 - 功率趋势
  const { run: fetchInverterLine, data: inverterLineData } = useRequest(getInverterLine, {
    manual: true,
  });

  // 充电桩详情 - 功率趋势
  const { run: fetchChargePower, data: chargePower } = useRequest(getChargePower, {
    manual: true,
  });

  // 逆变器功率曲线 日期组件change
  const chargeDisDataPickChange = (date: any) => {
    if (!date || !deviceCode) {
      return;
    }
    isTodayRef.current = judgmentIsToday(date);
    const params = {
      deviceCode: deviceCode,
      date: dayjs(date).format('YYYY-MM-DD'),
    };
    if (type === 'charge') fetchChargePower(params);
    else fetchInverterLine(params);
  };

  useEffect(() => {
    if (deviceCode) {
      const params = {
        date: dayjs().format('YYYY-MM-DD'),
        deviceCode: deviceCode,
      };
      if (type === 'charge') fetchChargePower(params);
      else fetchInverterLine(params);
    }
  }, [deviceCode]);

  return (
    <div className={styles.echartsModule}>
      <div className={styles.echartsModuleTitle}>
        <div className={styles.echartTitle}>功率曲线</div>
        <div>
          <DatePicker
            defaultValue={dayjs(dayjs(`${new Date()}`), 'YYYY-MM')}
            onChange={chargeDisDataPickChange}
            disabledDate={disableDate}
          />
        </div>
      </div>
      <div className={styles.echartsModuleBody}>
        <CustomCharts
          options={
            type === 'charge'
              ? chargePowerOptions(chargePower, isTodayRef.current)
              : powerCountOptions(inverterLineData, isTodayRef.current)
          }
          height="230px"
        />
      </div>
    </div>
  );
};
export default InverterPowerCurve;
