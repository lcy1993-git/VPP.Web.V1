import styles from './index.less'
import logo from "@/assets/image/icon/empty.png"
// 空数据组件
const Empty = () => {
    return (
        <div className={styles.empty}>
            <img src={logo} alt="" />
            <div className={styles.emptyText}>暂无数据</div>
        </div>
    );
};
export default Empty;
