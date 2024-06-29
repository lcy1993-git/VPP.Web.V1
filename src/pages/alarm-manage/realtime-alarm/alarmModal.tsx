import { addAlarmDeal, fileUpload, getExpertDevOps } from '@/services/alarm-manage/realtime';
import { useRequest } from '@umijs/max';
import { Button, Col, Form, Input, Modal, Row, Select, Upload, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styles from './index.less';
const { TextArea } = Input;

const AlarmModal = (props: any) => {
  const {
    confirmVisible,
    setConfirmVisible,
    currentAlarmData,
    searchFormRef,
    messageApi,
    tableRef,
    isSubstation = false,
  } = props;
  // 处理方式 select options
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  // 表单实例
  const [form] = Form.useForm();
  // 处理方式是否能编辑
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const defaultValue = () => {
    // 无运维建议，默认选择新增处理方式
    const eventType = [{ id: '', dealAdvice: '新增处理方式', isAdd: true }];
    setEventTypes(eventType);
    setIsDisabled(!eventType[0].isAdd);
    form.setFieldsValue({
      eventType: eventType[0].id,
      content: '',
    });
  };

  // 获取事件类型
  const { run: fetchExpertDevOps } = useRequest(getExpertDevOps, {
    manual: true,
    onSuccess: (result) => {
      if (result.length) {
        setEventTypes(result.concat([{ id: '', dealAdvice: '新增处理方式', isAdd: true }]));
        setIsDisabled(!result[0].isAdd);
        form.setFieldsValue({
          eventType: result[0].id,
          content: result[0].isAdd ? '' : result[0].dealAdvice,
        });
      } else {
        defaultValue();
      }
    },
  });

  // 处理方式发生变化
  const handleSuggestSelect = (value: any, record: any) => {
    let content: string = '';
    // 新增处理方式，处理方式内容为空
    if (record.isAdd) content = '';
    else content = record.dealAdvice;
    setIsDisabled(!record.isAdd);
    form.setFieldsValue({ content });
  };

  // 点击完成
  const handleSaveClick = () => {
    form.validateFields().then(async (values) => {
      if (values.content === '') return message.error('请正确填写处理方式');
      if (isSubstation) {
        try {
          const files = values.upload?.fileList ?? [];
          const imgFile = new FormData();
          files.forEach((f: any) => imgFile.append('files', f.originFileObj, f.name));
          const imageUrls = files.length > 0 && (await fileUpload(imgFile));

          const params = {
            content: values.content,
            dealPeople: localStorage.getItem('userId'),
            id: Number(currentAlarmData.id),
            imageUrl: JSON.stringify(imageUrls.code === 200 ? imageUrls.data : []),
            isNewAdvice: true,
            dataDesc: currentAlarmData.eventName || '',
          };
          await addAlarmDeal(params);
          messageApi.success('保存成功!');
          if (tableRef && tableRef.current) {
            setConfirmVisible(false);
            //@ts-ignore
            tableRef.current?.searchByParams({
              substationID: searchFormRef.substationID,
              eventLevel: searchFormRef.eventLevel,
            });
          }
        } catch (err) {
          setConfirmVisible(false);
          //@ts-ignore
          tableRef.current?.searchByParams({
            substationID: searchFormRef.substationID,
            eventLevel: searchFormRef.eventLevel,
          });
        }
      } else {
        const searchValues = searchFormRef.getFieldsValue();
        let beginTime, endTime;
        if (searchValues.time) {
          beginTime = dayjs(searchValues.time[0]).format('YYYY-MM-DD HH:mm:ss');
          endTime = dayjs(searchValues.time[1]).format('YYYY-MM-DD HH:mm:ss');
        }
        try {
          const files = values.upload?.fileList ?? [];

          const imgFile = new FormData();
          files.forEach((f: any) => imgFile.append('files', f.originFileObj, f.name));
          const imageUrls = files.length > 0 && (await fileUpload(imgFile));

          const params = {
            content: values.content,
            dealPeople: localStorage.getItem('userId'),
            id: Number(currentAlarmData.id),
            imageUrl: JSON.stringify(imageUrls.code === 200 ? imageUrls.data : []),
            isNewAdvice: true,
            dataDesc: currentAlarmData.eventName || '',
          };
          await addAlarmDeal(params);
          messageApi.success('保存成功!');
          if (tableRef && tableRef.current) {
            setConfirmVisible(false);
            //@ts-ignore
            tableRef.current?.searchByParams({
              beginTime,
              endTime,
              eventStatus: searchValues.eventStatus,
            });
          }
        } catch (err) {
          setConfirmVisible(false);
          //@ts-ignore
          tableRef.current?.searchByParams({
            beginTime,
            endTime,
            eventStatus: searchValues.eventStatus,
          });
        }
      }
    });
  };

  // 监听当前告警信息是否改变， 获取事件类型
  useEffect(() => {
    if (currentAlarmData && currentAlarmData.adviceList) {
      const dataDesc = currentAlarmData.eventName || '';
      fetchExpertDevOps({ dataDesc });
    } else {
      defaultValue();
    }
  }, [currentAlarmData]);

  return (
    <Modal
      title="告警处理"
      open={confirmVisible}
      width={600}
      centered
      footer={null}
      destroyOnClose
      onCancel={() => {
        setConfirmVisible(false);
      }}
    >
      <div className={styles.alarmHandleModalWrap}>
        <Form
          name="basic"
          layout="inline"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          form={form}
        >
          <Row gutter={[16, 16]}>
            <Col span={24} style={{ marginTop: '10px' }}>
              <Form.Item label="告警设备" name="device">
                <span>{currentAlarmData?.subStationName}</span>
              </Form.Item>
            </Col>
            <Col span={24} style={{ marginTop: '10px' }}>
              <Form.Item label="事项名称" name="eventName">
                <span>{currentAlarmData?.eventName}</span>
              </Form.Item>
            </Col>
            <Col span={24} style={{ marginTop: '10px' }}>
              <Form.Item label="处理方式" name="eventType">
                <Select
                  options={eventTypes}
                  allowClear
                  fieldNames={{
                    value: 'id',
                    label: 'dealAdvice',
                  }}
                  onSelect={handleSuggestSelect}
                />
              </Form.Item>
            </Col>
            <Col span={24} style={{ marginTop: '10px' }}>
              <Form.Item label="" name="content" wrapperCol={{ span: 18, offset: 6 }}>
                <TextArea rows={4} style={{ width: '100%' }} disabled={isDisabled} />
              </Form.Item>
            </Col>
            <Col span={24} style={{ marginTop: '10px' }}>
              <Form.Item label="上传照片" name="upload">
                <Upload name="file" accept="image/*">
                  <Button>上传图片</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <div className={styles.modalFooter}>
        <Button onClick={handleSaveClick}>完成</Button>
      </div>
    </Modal>
  );
};
export default AlarmModal;
