
import styles from './index.less';

interface ContentProps {
  children?: React.ReactNode; //传入组件的内容
  title?: string; //顶部标题
  renderTitleRight?: () => React.ReactNode | undefined; //标题按钮渲染
  renderSearch?: () => React.ReactNode; //查询区域渲染
  hasTree?: boolean; //是否有左侧树
  renderTitleLeft?: () => React.ReactNode | null; // 标题栏左侧内容区域
  renderTree?: () => React.ReactNode | null; // 左侧树显示的内容区域
}

const ContentComponent: React.FC<ContentProps> = (props) => {
  const {
    title,
    renderTitleRight,
    renderSearch,
    renderTitleLeft = null, // header 左侧渲染内容
    hasTree = false,
    renderTree = null
  } = props;

  return (
    <div className={`${styles.contentPage}`}>
      <div className={styles.leftContent} style={{ display: hasTree ? 'block' : 'none' }}>
        {renderTree && renderTree?.()}
      </div>
      <div className={`${styles.rightContent}`}>
        {/* 标题和按钮区域 */}
        <div className={styles.title}>
          <div className={styles.titleLeft}>
            {renderTitleLeft && renderTitleLeft?.()}
          </div>
          <div className={styles.titleContent}>
            {title}
          </div>
          <div className={styles.titleRight}>
            {renderTitleRight?.()}
          </div>
        </div>
        {/* 搜索和内容区域 */}
        <div className={styles.searchAnd}>
          {renderSearch && <div className={styles.search}>{renderSearch?.()}</div>}
          <div className={styles.content}>{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default ContentComponent;
