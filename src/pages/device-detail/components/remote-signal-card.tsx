import styles from '../index.less'
interface CurrentFileInfo {
  title: string;//标题
  isDisplay?: boolean;//卡片是否展示
  isNormal: boolean;//状态是否正常
}

// 遥信值数据卡片
const RemoteSignalCard = (props: CurrentFileInfo) => {
  const { title, isDisplay = true, isNormal } = props;
  const backgroundColor = isNormal ? 'linear-gradient(270deg, #4879f8 0%, #2aa0d8 100%)' : 'linear-gradient(270deg, #c0174b 0%, #d72e62 100%)';
  return <div className={styles.remoteItem} style={{ display: isDisplay ? '' : 'none', background: backgroundColor }}>
    <span >{title}</span>
  </div>
}

export default RemoteSignalCard;
