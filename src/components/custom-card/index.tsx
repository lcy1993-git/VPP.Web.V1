import { ReactNode } from 'react';
import styles from './index.less';

interface PropsType {
  title?: string; // 标题
  isTitleCenter?: boolean; // 标题样式(默认true标题居中样式，false为左侧竖线标题样式)
  renderCenter?: () => React.ReactNode | null; // 标题栏居中内容区域（isTitleCenter为false生效）
  renderRight?: () => React.ReactNode | null; // 标题栏居中内容区域（isTitleCenter为false生效）
  children: ReactNode; // 内容区域
  style?: any; // 最外层样式
  bodyStyle?: any; // 内容区域样式
}

const CustomCard = (props: PropsType) => {
  const {
    title = '',
    children,
    style = {},
    bodyStyle = {},
    isTitleCenter,
    renderCenter,
    renderRight,
  } = props;
  return (
    <div className={styles.module_container} style={{ ...style }}>
      {/* 标题 */}
      {title ? (
        isTitleCenter ? (
          <div className={styles.module_container_title}>
            <p>{title}</p>
          </div>
        ) : (
          <div className={styles.module_container_title2}>
            <p>{title}</p>
            <div className={styles.renderCenter}>{renderCenter && renderCenter?.()}</div>
            <div className={styles.renderRight}>{renderRight && renderRight?.()}</div>
          </div>
        )
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
export default CustomCard;
