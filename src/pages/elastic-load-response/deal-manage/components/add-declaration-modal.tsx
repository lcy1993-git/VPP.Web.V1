import {
  getIdentificationNum,
  getPlanInfo,
  getUserList,
} from '@/services/elastic-load-response/deal-manage';
import { PlusOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Col, Collapse, Form, Input, Modal, Row, Select, message } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from '../index.less';
import { default as Label } from './label';

interface PropsType {
  open: boolean;
  modalInfo: any;
  setModalOpen: Dispatch<SetStateAction<boolean>>; // 修改派单模态框状态
}

const AddDeclarationModal = (props: PropsType) => {
  const { open, setModalOpen, modalInfo } = props;
  // 邀约计划
  const [form] = Form.useForm();
  // 计划
  const identificationNum = Form.useWatch('identificationNum', form);
  // 是否保存
  const [save, setSave] = useState<boolean>(false);

  // 邀约计划option
  const { data: planOptions } = useRequest(getIdentificationNum, {
    manual: false,
    onSuccess: (res) => form.setFieldValue('identificationNum', res[0]),
  });

  useEffect(() => {
    if (modalInfo?.isEdit) {
      form.setFieldValue('identificationNum', modalInfo?.identificationNum);
    }
  }, [modalInfo]);

  const [items, setItems] = useState<any>([]);
  const [activeKey, setActiveKey] = useState<any>([]);
  const [renderCount, setRenderCount] = useState<number>(0);

  // 获取计划信息
  const { run: fetchPlanInfo } = useRequest(getPlanInfo, {
    manual: true,
    onSuccess: (res) => form.setFieldsValue(res),
  });

  useEffect(() => {
    if (identificationNum) {
      fetchPlanInfo(identificationNum);
      getUserList(identificationNum).then((res) => {
        setSave(false);
        setRenderCount(renderCount + 1);
        setActiveKey(`1-${renderCount}`);
        setItems([
          {
            key: `1-${renderCount}`,
            children: (
              <Label
                data={res.data}
                identificationNum={identificationNum}
                setSave={setSave}
                modalInfo={modalInfo}
                save={save}
              />
            ),
          },
        ]);
      });
    }
  }, [identificationNum]);

  // 新增新的面板
  const addItem = () => {
    if (!save) return message.info('请对上一条数据进行保存');
    getUserList(identificationNum).then((res) => {
      const newKey = items.length + 1;
      const saveValue = false;
      setActiveKey(newKey);
      setSave(saveValue);
      const newItem = {
        key: newKey,
        children: (
          <Label
            data={res.data}
            setSave={setSave}
            save={saveValue}
            modalInfo={modalInfo}
            identificationNum={identificationNum}
          />
        ), // 或者其他动态生成的children内容
      };
      setItems([...items, newItem]);
    });
  };

  return (
    <Modal
      open={open}
      footer={null}
      width={1200}
      title="交易申报新增"
      onCancel={() => setModalOpen(false)}
      destroyOnClose
      centered
    >
      <div className={styles.addDeclarationModal}>
        <Form autoComplete="off" labelCol={{ span: 6 }} form={form}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="邀约计划信息："
                name="identificationNum"
                rules={[{ required: true, message: '请选择邀约计划' }]}
              >
                <Select
                  style={{ width: 360 }}
                  options={planOptions?.map((item: any) => ({
                    label: item,
                    value: item,
                  }))}
                  disabled={modalInfo?.isEdit}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="运行日" name="operatingDay">
                <Input style={{ width: 360 }} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="响应类型" name="responseType">
                <Select
                  style={{ width: 360 }}
                  disabled
                  options={[
                    { label: '削峰响应', value: 0 },
                    { label: '填谷响应', value: 1 },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="需求时段" name="demandPeriod">
                <Input style={{ width: 360 }} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="需求地区" name="demandArea">
                <Input style={{ width: 360 }} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="申报价格上限" name="maximumBidPrice">
                <Input style={{ width: 360 }} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="申报价格下限" name="minimumBidPrice">
                <Input style={{ width: 360 }} disabled />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className={styles.bottomContainer}>
          <div style={{ height: '400px', overflowY: 'auto' }}>
            <Collapse
              accordion
              items={items}
              collapsible="icon"
              activeKey={activeKey}
              onChange={(value) => setActiveKey(value)}
            />
          </div>
          {!modalInfo?.isEdit && (
            <Button onClick={addItem}>
              <PlusOutlined />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddDeclarationModal;
