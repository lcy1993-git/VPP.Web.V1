import styles from './index.less';
/**
 * 通用列表数据展示组件（如分布式能源总览实时功率、日发电量、累计发电量）
 * @params data 展示数据
 * */
interface propsType {
  data: any;
}

const CustomListItem = (props: propsType) => {
  const { data } = props;

  return (
    <div className={styles.list}>
      {data.map((item: any) => {
        return (
          <div className={styles.listItem} key={item.id}>
            <div className={styles.listItemIcon}>
              <i className={`${item.icon} iconfont ${styles.iconSize}`} />
            </div>
            <dl className={styles.listItemLabel}>
              <dt>
                {item.label} ({item.unit})
              </dt>
              <dd>{item.value || '-'}</dd>
            </dl>
          </div>
        );
      })}
    </div>
  );
};
export default CustomListItem;
