import { Spin } from 'antd';
import ReactECharts from 'echarts-for-react';
import Empty from '../empty';
import styles from './index.less';
/**
 * 图表组件
 * @options 图表配置项，如果传false, 则显示空状态
 * @loading 图表加载状态
 * @width 图表组件宽度
 * @height 图表组件高度
 * */
interface propsType {
  options: any;
  loading?: boolean; // 图表加载状态
  width?: string | number;
  height?: string | number;
}

const CustomCharts = (props: propsType) => {
  const { options, loading, width, height } = props;
  return (
    <div
      className={styles.boxWrap}
      style={{ height: height ? `${height}px` : '100%', width: width ? `${width}px` : '100%' }}
    >
      {loading ? (
        <Spin size="large" className={styles.loadingStyle} />
      ) : options ? (
        <div className={styles.charts}>
          <ReactECharts
            option={options}
            notMerge={true}
            lazyUpdate={false}
            theme={'theme_name'}
            style={{
              width: width ? `${width}px` : '100%',
              height: height ? `${height}px` : '100%',
            }}
          />
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
};
export default CustomCharts;
