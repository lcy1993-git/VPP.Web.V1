import CustomCharts from '@/components/custom-charts';
import { Modal } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import styles from '../index.less';
import { winningPowerOptions, winningPriceOptions } from '../utils';

interface PropsType {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<any>>;
}

// 已出请详情弹框
const ClearingModal = (props: PropsType) => {
  const { visible, setVisible } = props;

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      title={'出清明细'}
      centered
      width={1200}
      open={visible}
      footer={false}
      onCancel={handleCancel}
    >
      <div className={styles.clearingModalBody}>
        <div className={styles.vppContainer}>
          <div className={styles.titleText}>虚拟电厂出清结果</div>
          {/* <div className={styles.header}>
            <span className={styles.blueTitle}>中标功率</span>
            <span className={styles.blueTitle}>中标价格</span>
          </div> */}
          <div className={styles.charts}>
            <CustomCharts
              options={winningPowerOptions([5, 20, 36, 10, 10])}
              width={555}
              height={295}
            />
            <div className={styles.line} />
            <CustomCharts
              options={winningPriceOptions([5, 20, 36, 10, 10])}
              width={555}
              height={295}
            />
          </div>
        </div>
        <div className={styles.userContainer}>
          <span className={styles.titleText}>代理用户出清结果</span>
        </div>
      </div>
    </Modal>
  );
};

export default ClearingModal;
