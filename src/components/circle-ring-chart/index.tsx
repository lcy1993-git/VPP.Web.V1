import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styles from './index.less';

interface PropsType {
  pathColor?: string; // 圆环颜色
  value?: number | string; // 值
  textName?: string; // 标题
  subTitle?: string; // 副标题
  children?: any;
  circleRingChartRatio?: number | string; // 圆环比例
  breadth?: any;
  size?: number;
}
/** 圆环组件
  @params pathColor?: string; 圆环颜色
  @params value: number; 值
  @params textName?: string; 标题
  @params subTitle?: string; 副标题
*/
const CircleRingChart = (props: PropsType) => {
  const {
    pathColor = '#1cc078', // 圆环颜色
    value = 10, // 值
    textName = '名称', // 名称
    subTitle = 'kW', // 副标题
    children,
    circleRingChartRatio,
    breadth = '100%',
    size = 32,
  } = props;

  return (
    <div style={{ width: breadth, height: '100%' }} className={styles.flex_center}>
      <CircularProgressbarWithChildren
        styles={buildStyles({
          pathTransitionDuration: 0.1,
          pathColor: pathColor,
          trailColor: '#003299',
          strokeLinecap: 'round',
        })}
        value={Number(circleRingChartRatio ? circleRingChartRatio : value)}
        strokeWidth={9}
      >
        {children ? (
          children
        ) : (
          <div className={styles.circleTitle}>
            <span className={styles.titleH1}>{textName}</span>
            <span className={styles.titleValue} style={{ fontSize: size + 'px' }}>
              {value}
            </span>
            <span className={styles.titleH6}>{subTitle}</span>
          </div>
        )}
      </CircularProgressbarWithChildren>
    </div>
  );
};
export default CircleRingChart;
