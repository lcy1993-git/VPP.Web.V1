import ContentComponent from '@/components/content-component';
import ContentPage from '@/components/content-page';
import GeneralTable from '@/components/general-table';
import { getEventTypeList } from '@/services/alarm-manage/realtime';
import {
  ALARMCOLORANDSCRIPT,
  ALARMLEVEL,
  DEALSTATUS,
  EVENTSTATUSCOLORANDSCRIPT,
  EVENTTYPES,
} from '@/utils/enum';
import { exportExcel } from '@/utils/xlsx';
import { DownloadOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Col, DatePicker, Form, Image, Input, Row, Select, Space, message } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useEffect, useRef, useState } from 'react';
import { fetchColumns } from './columns';
const { RangePicker } = DatePicker;

const HistoryEvent = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  // 搜素表单实例
  const [searchForm] = Form.useForm();
  // 事项类型
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  // 表格中的图片
  const [images, setImages] = useState<string[]>([]);
  // 表格 checkbox 被选中
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  // 预览图片是否显示
  const [visible, setVisible] = useState(false);

  // 请求事项类型
  const { run: fetchEventTypes } = useRequest(getEventTypeList, {
    manual: true,
    onSuccess: (result) => {
      setEventTypes(result || []);
    },
  });

  // 点击表格 查看处理图片
  const handleViewClick = async (imageUrl: string) => {
    if (imageUrl) {
      const imagePath = JSON.parse(imageUrl);
      setImages(imagePath);
      setVisible(true);
    }
  };

  /** 点击  查询  搜索 */
  const handleSearchClick = () => {
    searchForm.validateFields().then(async (values) => {
      let beginTime, endTime;
      if (values.time) {
        beginTime = dayjs(values.time[0]).format('YYYY-MM-DD HH:mm:ss');
        endTime = dayjs(values.time[1]).format('YYYY-MM-DD HH:mm:ss');
      }
      delete values.time;
      if (values.eventStatus === '') {
        delete values.eventStatus;
      }
      if (tableRef && tableRef.current) {
        //@ts-ignore
        tableRef.current?.searchByParams({ ...values, beginTime, endTime });
      }
    });
  };

  /** 点击重置 */
  const handleResetClick = () => {
    searchForm.resetFields();
    searchForm.setFieldsValue({
      time: [
        dayjs(new Date(new Date().getFullYear(), 0, 1)),
        dayjs(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`),
      ],
    });
    const resetData = searchForm.getFieldsValue();
    const beginTime = dayjs(resetData.time[0]).format('YYYY-MM-DD');
    const endTime = dayjs(resetData.time[1]).format('YYYY-MM-DD');
    delete resetData.time;
    // @ts-ignore
    tableRef.current?.searchByParams({
      ...resetData,
      beginTime: beginTime,
      endTime: endTime,
    });
  };

  const handleDownLoadClick = () => {
    if (tableSelectRows && tableSelectRows.length > 0) {
      let data = tableSelectRows.map((item) => {
        return {
          发生时间: item.date,
          企业名称: item.subStationName,
          设备名称: item.psrName,
          事项名称: item.eventName,
          事项状态: EVENTSTATUSCOLORANDSCRIPT[item.eventStatus].script,
          告警等级: ALARMCOLORANDSCRIPT[item.eventLevel].script,
          事项类型: item.typeNumber,
          处理方式: item.content,
          处理人: item.dealPeople,
          处理时间: item.dealTime,
        };
      });
      exportExcel(data, '历史事件');
    } else {
      messageApi.warning('请选择数据后进行操作');
    }
  };

  /** 搜索区域 */
  const renderSearch = () => {
    return (
      <>
        <Form
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          initialValues={{ eventStatus: '' }}
          style={{ marginBottom: 10 }}
          layout="inline"
          autoComplete="off"
          form={searchForm}
        >
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item label="发生时间" name="time">
                <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="事项类型" name="eventType">
                <Select
                  options={eventTypes}
                  placeholder="请选择事项类型"
                  allowClear
                  fieldNames={{
                    label: 'eventTypeName',
                    value: 'eventType',
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="事项名称" name="eventName">
                <Input placeholder="请输入关键字" />
              </Form.Item>
            </Col>
            <Col span={5}></Col>
            <Col span={6}>
              <Form.Item label="事项状态" name="eventStatus">
                <Select placeholder="请选择处理状态" options={EVENTTYPES} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="告警等级" name="eventLevel">
                <Select options={ALARMLEVEL} placeholder="请选择告警状态" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="处理状态" name="isDeal">
                <Select
                  placeholder="请选择处理状态"
                  options={DEALSTATUS}
                  style={{ minWidth: 180 }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item wrapperCol={{ span: 19, offset: 5 }}>
                <Space>
                  <Button onClick={handleResetClick}>
                    <ReloadOutlined />
                    重置
                  </Button>
                  <Button onClick={handleSearchClick}>
                    <SearchOutlined />
                    查询
                  </Button>
                  <Button onClick={handleDownLoadClick}>
                    <DownloadOutlined />
                    下载
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </>
    );
  };

  /** 设置搜索表单中日期的初始值 */
  useEffect(() => {
    searchForm.setFieldsValue({
      time: [
        dayjs(new Date(new Date().getFullYear(), 0, 1)),
        dayjs(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`),
      ],
    });
  }, []);

  /** 请求事件类型 */
  useEffect(() => {
    fetchEventTypes();
  }, []);

  return (
    <ContentPage>
      <ContentComponent title="历史事件" renderSearch={renderSearch}>
        {contextHolder}
        <GeneralTable
          url="/api/alarm/getHistoryAlarmEvent"
          ref={tableRef}
          columns={fetchColumns(handleViewClick)}
          rowKey="id"
          getCheckData={(data) => setTableSelectRows(data)}
          requestType="get"
          type="checkbox"
          bordered={false}
          filterParams={{
            beginTime: dayjs(dayjs(new Date(new Date().getFullYear(), 0, 1))).format('YYYY-MM-DD'),
            endTime: dayjs(
              dayjs(
                `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
              ),
            ).format('YYYY-MM-DD'),
          }}
        />
        <div style={{ display: 'none' }}>
          <Image.PreviewGroup
            preview={{
              current: 0,
              visible,
              onVisibleChange: (visible) => setVisible(visible),
            }}
          >
            {images.map((item) => {
              return <Image key={item} className="item-img" src={item} />;
            })}
          </Image.PreviewGroup>
        </div>
      </ContentComponent>
    </ContentPage>
  );
};
export default HistoryEvent;
