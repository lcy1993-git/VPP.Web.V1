import styles from './index.less';
/**
 * 日期日历组件
 * @params datePickerType 日历类型（day、month、year）
 * @params segmentedType 日历选择器类型（）
 * @params width 图表组件宽度
 * @params height 图表组件高度
 * */
interface propsType {
  datePickerType: string;
}

const CustomCharts = (props: propsType) => {
  const { options, loading, width = '100%', height = '100%' } = props;

  return <div className={styles.boxWrap}></div>;
};
export default CustomCharts;
