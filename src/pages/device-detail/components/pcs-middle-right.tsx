import CustomCharts from '@/components/custom-charts';
import SegmentedTheme from '@/components/segmented-theme';
import { getPowerCurve } from '@/services/energy-station';
import { judgmentIsToday } from '@/utils/common';
import { useRequest } from '@umijs/max';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import styles from '../index.less';
import { powerOptions } from './utils';

// PCS middle right render
const PcsMiddleRight = (props: any) => {
  const { deviceCode } = props;
  const isTodayRef = useRef<boolean>(true);

  // 功率趋势(交流功率或直流功率) 0为直流功率，1为交流功率
  const [curveType, setCurveType] = useState<number>(0);

  // PCS 功率曲线
  const { run: fetchPowerCurve, data: powerCurve } = useRequest(getPowerCurve, {
    manual: true,
  });

  //  日期组件change
  const chargeDisDataPickChange = (date: any) => {
    if (!date || !deviceCode) {
      return;
    }
    isTodayRef.current = judgmentIsToday(date);
    fetchPowerCurve({
      deviceCode: deviceCode,
      date: dayjs(date).format('YYYY-MM-DD'),
      type: curveType,
    });
  };

  useEffect(() => {
    if (deviceCode) {
      fetchPowerCurve({
        date: dayjs().format('YYYY-MM-DD'),
        deviceCode: deviceCode,
        type: curveType,
      });
    }
  }, [deviceCode, curveType]);

  return (
    <div className={styles.echartsModule}>
      <div className={styles.echartsModuleTitle}>
        <div className={styles.echartTitle}>功率统计</div>
        <Space>
          <SegmentedTheme
            options={['直流功率', '交流功率']}
            getSelectedValue={(value) => setCurveType(value === '直流功率' ? 0 : 1)}
          />
          <DatePicker
            defaultValue={dayjs(dayjs(`${new Date()}`), 'YYYY-MM-DD')}
            onChange={chargeDisDataPickChange}
          />
        </Space>
      </div>
      <div className={styles.echartsModuleBody}>
        <CustomCharts
          options={powerOptions(powerCurve, curveType, isTodayRef.current)}
          height="230px"
        />
      </div>
    </div>
  );
};
export default PcsMiddleRight;
