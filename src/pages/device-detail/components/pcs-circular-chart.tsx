import CircleRingChart from '@/components/circle-ring-chart';
import Empty from '@/components/empty';
import styles from '../index.less';
// 圆环图
const CircularChart = (props: any) => {
  const { circleRingData } = props;

  return (
    <div className={styles.circleWrap}>
      {circleRingData.length ? (
        circleRingData.map((item: any) => {
          return (
            <div
              className={styles.circleItem}
              key={item.id}
              style={{ width: item.chartWidth || 200 }}
            >
              <div className={styles.circle}>
                <CircleRingChart
                  pathColor={item.pathColor}
                  value={item.circleRingChartRatio ? item.circleRingChartRatio : item.value}
                >
                  <div className={styles.circleTitle}>
                    <span>{item.name ? item.name : item.textName}</span>
                    <span>{item.subName}</span>
                  </div>
                </CircleRingChart>
              </div>

              <div className={styles.circleDes}>
                <span className={styles.circleDesTitle}>{item.textName}</span>
                <span className={styles.circleDesValue}>
                  {item.value === '0.00' ? '-' : item.value}
                </span>
                <span className={styles.circleDesUnit}>{item.subTitle}</span>
              </div>
            </div>
          );
        })
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default CircularChart;
