import { ReactElement } from 'react';
import styles from './index.less'


interface propsType {
  headerRightRender?: () => ReactElement; // card header 右侧内容
  title: string; // card header 左侧标题
  children: ReactElement | string; // card 内容
  isPaddingTop?: boolean; // 内容区域是否显示上边距
}
/**
 * 特色场景大屏card
 * */
const BlockWrap = (props: propsType) => {

  const { title, headerRightRender, isPaddingTop = true } = props;

  return <div className={styles.itemComponent}>
    <div className={styles.componentHead}>
      <div className={styles.title}>{title}</div>
      <div className={styles.filter}>
        {
          headerRightRender && headerRightRender()
        }
      </div>
    </div>
    <div className={styles.componentBody} style={{paddingTop: isPaddingTop ? '20px' : '0px'}}>
      { props.children }
    </div>
  </div>
}
export default BlockWrap
