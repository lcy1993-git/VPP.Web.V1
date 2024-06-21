import CustomCharts from '@/components/custom-charts';
import { getPcsQuantity } from '@/services/energy-station';
import { useRequest } from '@umijs/max';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import styles from '../index.less';
import { electricityStatisticsOptions } from './utils';
// PCS充放电量统计
const PowerStatistics = (props: any) => {
  const { deviceCode } = props;
  // 充放电量统计
  const { run: fetchPcsQuantity, data: pcsQuantity } = useRequest(getPcsQuantity, {
    manual: true,
  });

  // 充放电统计 日期组件change
  const chargeDisDataPickChange = (date: any) => {
    if (!date || !deviceCode) {
      return;
    }
    fetchPcsQuantity({
      deviceCode: deviceCode,
      date: dayjs(date).format('YYYY-MM'),
    });
  };

  useEffect(() => {
    if (deviceCode) {
      fetchPcsQuantity({
        date: dayjs().format('YYYY-MM'),
        deviceCode: deviceCode,
      });
    }
  }, [deviceCode]);

  return (
    <div className={styles.echartsModule}>
      <div className={styles.echartsModuleTitle}>
        <div className={styles.echartTitle}>充放电量统计</div>
        <div>
          <DatePicker
            picker="month"
            defaultValue={dayjs(dayjs(`${new Date()}`), 'YYYY-MM')}
            onChange={chargeDisDataPickChange}
          />
        </div>
      </div>
      <div className={styles.echartsModuleBody}>
        <CustomCharts options={electricityStatisticsOptions(pcsQuantity)} height={230} />
      </div>
    </div>
  );
};
export default PowerStatistics;
