import {
  cancelPlan,
  deletePlan,
  deleteUser,
  submissPlan,
} from '@/services/elastic-load-response/deal-manage';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { Button, Modal, Space, message } from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';
import styles from '../index.less';

interface propsType {
  ids: any; // id数组
  setModalOpen: Dispatch<SetStateAction<boolean>>; // 修改派单模态框状态
  open: boolean; // 模态框状态
  modalType: 'delete' | 'cancel' | 'declare' | 'userDelete'; // 模态框类型
  refresh: any; // 成功后操作
}

// 信息删除/申报/撤销，详情删除弹框
const DeleteModal = (props: propsType) => {
  const { setModalOpen, open, modalType, ids, refresh } = props;
  const ModalTitle: any = { delete: '删除', cancel: '撤销', declare: '申报', userDelete: '删除' };
  // 保存loading
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  // 确认按钮
  const handleConfirm = async () => {
    setLoading(true);
    try {
      switch (modalType) {
        case 'delete':
          await deletePlan(ids);
          break;
        case 'cancel':
          await cancelPlan(ids);
          break;
        case 'declare':
          await submissPlan(ids);
          break;
        case 'userDelete':
          await deleteUser(ids);
          break;
      }
      messageApi.success(`${ModalTitle[modalType]}成功`);
      setModalOpen(false);
      refresh();
    } catch (error) {
      messageApi.error(`${ModalTitle[modalType]}失败`);
    }
    setLoading(false);
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        footer={null}
        title={ModalTitle[modalType]}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
        centered
      >
        <div className={styles.deleteModal}>
          <div
            className={styles.header}
            style={{ display: 'flex', padding: 0, justifyContent: 'center', height: '90px' }}
          >
            <ExclamationCircleOutlined
              style={{ marginRight: '10px', color: '#E09400', fontSize: '24px' }}
            />
            是否确认{ModalTitle[modalType]}邀约计划?
          </div>
          <div className={styles.modalFooter}>
            <Space>
              <Button icon={<MinusCircleOutlined />} onClick={() => setModalOpen(false)}>
                取消
              </Button>
              <Button
                icon={<CheckCircleOutlined />}
                onClick={handleConfirm}
                style={{ marginLeft: '10px' }}
                loading={loading}
              >
                确定
              </Button>
            </Space>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteModal;
