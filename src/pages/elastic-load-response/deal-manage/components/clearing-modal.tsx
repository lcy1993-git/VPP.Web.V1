import CustomCharts from '@/components/custom-charts';
import GeneralTable from '@/components/general-table';
import { getCapacityChart, getPriceChart } from '@/services/elastic-load-response/deal-manage';
import { useRequest } from '@umijs/max';
import { Modal } from 'antd';
import { Dispatch, SetStateAction, useEffect } from 'react';
import styles from '../index.less';
import { clearingDetailColumns, winningPowerOptions, winningPriceOptions } from '../utils';

interface PropsType {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<any>>;
  clearingId: string;
}

// 已出请详情弹框
const ClearingModal = (props: PropsType) => {
  const { visible, setVisible, clearingId } = props;

  // 功率
  const { run: fetchCapacityChart, data: capacityChart } = useRequest(getCapacityChart, {
    manual: true,
  });

  // 价格
  const { run: fetchPriceChart, data: priceChart } = useRequest(getPriceChart, {
    manual: true,
  });

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (visible && clearingId) {
      fetchPriceChart(clearingId);
      fetchCapacityChart(clearingId);
    }
  }, [clearingId]);

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
              <CustomCharts options={winningPowerOptions(capacityChart)} width={555} height={285} />
            </div>
            <div className={styles.line} />
            <div className={styles.item}>
              <span className={styles.blueTitle} style={{ marginBottom: '5px' }}>
                中标价格
              </span>
              <CustomCharts options={winningPriceOptions(priceChart)} width={555} height={285} />
            </div>
          </div>
        </div>
        <div className={styles.userContainer}>
          <div className={styles.titleText} style={{ marginTop: '18px' }}>
            代理用户出清结果
          </div>
          <GeneralTable
            url="/api/demand/response/transactionBidding/settled/result"
            columns={clearingDetailColumns}
            rowKey="identificationNum"
            size="middle"
            hideSelect
            bordered={false}
            requestType="get"
            scroll={{ y: 200 }}
            style={{ paddingTop: '15px', width: '100%' }}
            filterParams={{ identificationNum: clearingId }}
            hasPage
          />
        </div>
      </div>
    </Modal>
  );
};

export default ClearingModal;
