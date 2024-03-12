import { ReactElement } from 'react';
import styles from './index.less'


interface propsType {
  headerRightRender?: () => ReactElement; // card header 右侧内容
  title: string; // card header 左侧标题
  children: ReactElement | string; // card 内容
}
/**
 * 特色场景大屏card
 * */
const BlockWrap = (props: propsType) => {

  const { title, headerRightRender } = props;

  return <div className={styles.itemComponent}>
    <div className={styles.componentHead}>
      <div className={styles.title}>{title}</div>
      <div className={styles.filter}>
        {
          headerRightRender && headerRightRender()
        }
      </div>
    </div>
    <div className={styles.componentBody}>
      { props.children }
    </div>
  </div>
}
export default BlockWrap
