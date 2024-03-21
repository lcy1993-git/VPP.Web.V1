import Empty from '@/components/empty';
import styles from '../index.less';
import RunAwayItem from './runAway-item';

// 设备运行状态数据
const DeviceRunTime = (props: any) => {
  const { runTimeData } = props;
  return (
    <>
      {runTimeData.length ? (
        <div className={styles.boxWrap}>
          <div className={styles.runTimeWrap}>
            {runTimeData.map((item: any) => {
              return (
                <div className={styles.itemRunStatus} key={item.id}>
                  <RunAwayItem
                    icon={item.icon}
                    title={item.title}
                    value={item.value}
                    blockBackgroundValue={item.blockBackgroundValue}
                    dataBackgroundValue={item.dataBackgroundValue}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={styles.emptyStyle}>
          <Empty />
        </div>
      )}
    </>
  );
};
export default DeviceRunTime;
