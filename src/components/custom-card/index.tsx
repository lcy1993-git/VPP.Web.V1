import { ReactNode } from 'react';
import styles from './index.less';


interface Propstype {
  title?: string;  // 标题
  children: ReactNode; // 内容区域
  style?: any; // 最外层样式
  bodyStyle?: any; // 内容区域样式
}


const CustomCard = (props: Propstype) => {
  const { title = '', children, style = {}, bodyStyle = {} } = props;
  return (
    <div className={styles.module_container} style={{ ...style }}>
      {/* 标题 */}
      {title ? (
        <div className={styles.module_container_title}>
          {' '}
          <p>{title}</p>{' '}
        </div>
      ) : null}
      {/* 内容区 */}
      <div className={styles.module_container_body} style={{ ...bodyStyle }}>
        {children}
      </div>

      {/* 上边框样式 */}
      <i className={styles.module_container_border_left}></i>
      <i className={styles.module_container_border_right}></i>
    </div>
  );
};
export default CustomCard
