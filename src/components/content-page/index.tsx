import styles from './index.less';

/**
 * ContentPage 组件
 * @description 组件主要控制了页面的高度，结合Layout布局
 * */
const ContentPage = ({ children }: any) => {
  return (
    <div className={styles.layoutPage}>
      <div className={styles.layoutPageContainer} style={{background: 'pink'}}>{children}</div>
    </div>
  );
};
export default ContentPage;
