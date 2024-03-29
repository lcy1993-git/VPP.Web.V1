import UrlSelect from '@/components/url-select';
import { getDevicesInfo, updateDeviceInfo } from '@/services/devices-manage';
import { downloadFile, getQRCode } from '@/utils/utils';
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Col, Form, Input, Modal, Row, Space, message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './index.less';
import { SIMBasicInfo, basicInfo, deviceParams, factoryInfo } from './utlis';

interface propsType {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>; // 修改模态框状态
  isModalOpen: boolean; // 模态框状态
  messageApi: MessageInstance; // 信息提示框
  currDeviceInfo: any; // 当前设备信息
  isEdit?: boolean;
  refresh: () => void;
}

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
};

const { TextArea } = Input;

const DeviceModal = (props: propsType) => {
  const { isModalOpen, setIsModalOpen, currDeviceInfo, isEdit, refresh } = props;
  // loading
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  // 设备参数表单
  const [deviceParamsFormItem, setDeviceParamsFormItem] = useState<any[]>([]);
  // 基本信息表单
  const [basicInfoFormItem, setBasicInfoFormItem] = useState<any[]>(basicInfo);
  // 二维码地址
  const [QRcodeUrl, setQRcodeUrl] = useState<{ codeUrl: string; name: string } | null>(null);

  /** 请求设备详情 */
  const { run: fetchDevicesInfo } = useRequest(() => getDevicesInfo(currDeviceInfo?.deviceCode), {
    manual: true,
    onSuccess: (result) => {
      if (result.type === '114') setBasicInfoFormItem(SIMBasicInfo);
      else setBasicInfoFormItem(basicInfo);
      // 处理设备参数的表单
      const paramsFormItem = deviceParams.filter((item) => {
        return item.devicesType.find((type) => type === result.type);
      });
      if (paramsFormItem.length) {
        setDeviceParamsFormItem(paramsFormItem);
      } else {
        const other = deviceParams.filter((item) => {
          return item.devicesType.find((type) => type === 'OTHER');
        });
        setDeviceParamsFormItem(other);
      }
      form.setFieldsValue({
        ...result,
      });
    },
  });

  // 生成二维码
  const createQRCode = async () => {
    const landingPageUrl = JSON.stringify({ id: currDeviceInfo?.deviceCode });
    const code = await getQRCode(landingPageUrl, currDeviceInfo?.name);
    setQRcodeUrl(code);
  };

  //保存
  const saveEvent = async () => {
    form.validateFields().then(async (values: any) => {
      setLoading(true);
      const submitInfo = Object.assign({
        deviceCode: currDeviceInfo?.deviceCode,
        ...values,
      });
      await updateDeviceInfo(submitInfo);
      message.success('修改成功');
      refresh();
      form.resetFields();
      setIsModalOpen(false);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (currDeviceInfo && isModalOpen) {
      fetchDevicesInfo();
    }
  }, [currDeviceInfo, isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      createQRCode();
    }
  }, [isModalOpen]);

  return (
    <>
      <Modal
        title={isEdit ? '编辑' : '查看'}
        open={isModalOpen}
        width={1600}
        footer={false}
        destroyOnClose
        centered
        onCancel={() => setIsModalOpen(false)}
      >
        <div className={styles.modalBody}>
          <div className={styles.container}>
            <Form {...layout} name="basic" autoComplete="off" form={form}>
              <div className={styles.title}>基础信息</div>
              <Row>
                {basicInfoFormItem.map((item) => {
                  return (
                    <Col span={8} key={item.id}>
                      <Form.Item
                        label={item.label}
                        name={item.name}
                        rules={[
                          { required: item.isRequired, message: '请输入内容' },
                          { pattern: item.pattern, message: item.message },
                        ]}
                      >
                        {item.htmlLabel && item.htmlLabel === 'textArea' ? (
                          <TextArea rows={2} disabled={!isEdit} style={{ resize: 'none' }} />
                        ) : item.name === 'type' ? (
                          <UrlSelect
                            showSearch={false}
                            style={{ width: '100%' }}
                            url="/deviceInfo/getDeviceTypeOptions"
                            titlekey="description"
                            valuekey="typeId"
                            placeholder="请选择设备类型"
                            allowClear
                            requestSource="sysApi"
                            disabled
                          />
                        ) : item.name === 'substationCode' ? (
                          <UrlSelect
                            showSearch={false}
                            style={{ width: '100%' }}
                            url="/substationInformation/getSubstationNoParam"
                            titlekey="name"
                            valuekey="substationCode"
                            placeholder="请选择站点"
                            allowClear
                            disabled={!isEdit}
                            requestSource="sysApi"
                          />
                        ) : item.name === 'deviceNumber' ? (
                          <Input disabled />
                        ) : (
                          <Input disabled={!isEdit} />
                        )}
                      </Form.Item>
                    </Col>
                  );
                })}
              </Row>
              <div className={styles.title}>厂商信息</div>
              <Row>
                {factoryInfo.map((item) => {
                  return (
                    <Col span={8} key={item.id}>
                      <Form.Item
                        label={item.label}
                        name={item.name}
                        rules={[
                          { required: item.isRequired, message: '请输入内容' },
                          { pattern: item.pattern, message: item.message },
                        ]}
                      >
                        <Input disabled={!isEdit} />
                      </Form.Item>
                    </Col>
                  );
                })}
              </Row>
              {deviceParamsFormItem.length > 0 && <div className={styles.title}>设备参数</div>}
              {
                <Row>
                  {deviceParamsFormItem.map((item) => {
                    return (
                      <>
                        <Col span={8} key={item.id}>
                          <Form.Item
                            label={item.label}
                            name={item.name}
                            rules={[
                              { required: item.isRequired, message: '请输入内容' },
                              { pattern: item.pattern, message: item.message },
                            ]}
                          >
                            {item.label === '备注' ? (
                              <TextArea rows={2} disabled={!isEdit} style={{ resize: 'none' }} />
                            ) : (
                              <Input disabled={!isEdit} />
                            )}
                          </Form.Item>
                        </Col>
                      </>
                    );
                  })}
                </Row>
              }
            </Form>
            <div className={styles.qrcodeUrl}>
              <img src={QRcodeUrl?.codeUrl} alt="" />
              <Button onClick={() => downloadFile(QRcodeUrl?.codeUrl, currDeviceInfo.name)}>
                下载二维码
              </Button>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <Space>
              <Button icon={<CloseCircleOutlined />} onClick={() => setIsModalOpen(false)}>
                取消
              </Button>
              {isEdit && (
                <Button icon={<SaveOutlined />} onClick={() => saveEvent()} loading={loading}>
                  保存
                </Button>
              )}
            </Space>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default DeviceModal;
