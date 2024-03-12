import { Spin } from 'antd';
import ReactECharts from 'echarts-for-react';
import Empty from '../empty';
import styles from './index.less';
/**
 * 图表组件
 * @params options 图表配置项，如果传false, 则显示空状态
 * @params loading 图表加载状态
 * @params width 图表组件宽度
 * @params height 图表组件高度
 * */

interface propsType {
  options: any;
  loading: boolean; // 图表加载状态
  width?: string;
  height?: string;
}

const CustomCharts = (props: propsType) => {
  const { options, loading, width = '100%', height = '100%' } = props;

  return (
    <div className={styles.boxWrap}>
      {loading ? (
        <Spin size="large" className={styles.loadingStyle} />
      ) : options ? (
        <div className={styles.charts}>
          <ReactECharts
            option={options}
            notMerge={true}
            style={{ height: height, width: width }}
            lazyUpdate={false}
            theme={'theme_name'}
          />
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
};
export default CustomCharts;
