import { Tooltip } from 'antd';
import styles from '../index.less'
interface CurrentFileInfo {
  dataType: string;//左上角数据类型
  dataUnit?: string;//右上角数据单位
  cardBackgroundValue?: string;//卡片背景颜色
  value: string;//数值
  isDisplay?: boolean;//卡片是否展示
}

// 遥测值或电度值数据卡片
const TelemetryCard = (props: CurrentFileInfo) => {
  const { dataType, dataUnit, cardBackgroundValue, value, isDisplay = true } = props;
  return <div className={styles.listItem} style={{ background: `${cardBackgroundValue}`, display: isDisplay ? '' : 'none' }}>
    <div className={styles.title}>
      <span>{dataType}</span>
      <span>{dataUnit}</span>
    </div>
    <div className={styles.itemContent}>
      <Tooltip title={value}>
        <span className={styles.value}>{value}</span>
      </Tooltip>
    </div>
  </div>
}

export default TelemetryCard;
