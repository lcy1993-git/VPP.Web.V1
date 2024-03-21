import styles from '../index.less';
interface CurrentFileInfo {
  title: string; //标题
  value: string; //数值
  blockBackgroundValue: string; //方块背景颜色
  dataBackgroundValue: string; //数据背景颜色
  icon: any;
}

// 详情页面运行中横条数据组件
const RunAwayItem = (props: CurrentFileInfo) => {
  const { title, value, dataBackgroundValue, blockBackgroundValue, icon } = props;
  return (
    <div className={styles.itemContent}>
      <div className={styles.content}>
        <div className={styles.electricType} style={{ background: `${blockBackgroundValue}` }}>
          <i className="iconfont">{icon}</i>
        </div>
        <div className={styles.electricData} style={{ background: `${dataBackgroundValue}` }}>
          <span className={styles.electricTitle}>{title}</span>
          <span className={styles.value}>{value}</span>
        </div>
      </div>
    </div>
  );
};

export default RunAwayItem;
