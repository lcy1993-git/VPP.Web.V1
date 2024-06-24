import CustomCharts from '@/components/custom-charts';
import { Modal, Table } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import styles from '../index.less';
import { demandDetailColumns, winningPowerOptions, winningPriceOptions } from '../utils';

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
          <div className={styles.charts}>
            <div className={styles.item}>
              <span className={styles.blueTitle} style={{ marginBottom: '5px' }}>
                中标功率
              </span>
              <CustomCharts
                options={winningPowerOptions([5, 20, 36, 10, 10])}
                width={555}
                height={285}
              />
            </div>
            <div className={styles.line} />
            <div className={styles.item}>
              <span className={styles.blueTitle} style={{ marginBottom: '5px' }}>
                中标价格
              </span>
              <CustomCharts
                options={winningPriceOptions([5, 20, 36, 10, 10])}
                width={555}
                height={285}
              />
            </div>
          </div>
        </div>
        <div className={styles.userContainer}>
          <div className={styles.titleText} style={{ marginTop: '18px' }}>
            代理用户出清结果
          </div>
          <Table
            columns={demandDetailColumns}
            dataSource={[{}]}
            scroll={{ y: 155 }}
            style={{ paddingTop: '15px' }}
            size="middle"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ClearingModal;
