import ContentComponent from '@/components/content-component';
import ContentPage from '@/components/content-page';
import GeneralTable from '@/components/general-table';
import { addAlarmDealWithOutDeal, getEventTypeList } from '@/services/alarm-manage/realtime';
import {
  ALARMCOLORANDSCRIPT,
  ALARMLEVEL,
  EVENTSTATUSCOLORANDSCRIPT,
  EVENTTYPES,
} from '@/utils/enum';
import { exportExcel } from '@/utils/xlsx';
import { DownloadOutlined, LeftOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { history, useLocation, useRequest } from '@umijs/max';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  message,
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useEffect, useRef, useState } from 'react';
import AlarmModal from './alarmModal';
import { columns } from './columns';
const { RangePicker } = DatePicker;

const RealtimeAlarm = () => {
  const { state }: { state: any } = useLocation();
  // 表格实例
  const tableRef = useRef<HTMLDivElement>(null);
  // 搜素表单实例
  const [form] = Form.useForm();
  // 事项、告警类型
  const [alarmTypes, setAlarmTypes] = useState<any[]>([]);
  // 表格 checkbox 被选中
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  // @ 告警确认提示框
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  // 当前告警条目
  const [currentAlarmData, setCurrentAlarmData] = useState<any>(null);

  const [messageApi, contextHolder] = message.useMessage();

  // 请求告警类型
  const { run: fetchEventTypes } = useRequest(getEventTypeList, {
    manual: true,
    onSuccess: (result: any) => {
      setAlarmTypes(result || []);
    },
  });

  // 查询
  const handleSearchClick = (deviceCode?: string) => {
    form.validateFields().then(async (values) => {
      let beginTime, endTime;
      if (values.time) {
        beginTime = dayjs(values.time[0]).format('YYYY-MM-DD');
        endTime = dayjs(values.time[1]).format('YYYY-MM-DD');
      }
      delete values.time;
      if (values.eventStatus === '') {
        delete values.eventStatus;
      }

      if (tableRef && tableRef.current) {
        //@ts-ignore
        tableRef.current?.searchByParams({ ...values, beginTime, endTime, deviceCode });
      }
    });
  };

  useEffect(() => {
    if (state) {
      // 如果state存在，表示从其他路由跳转过来， 反之通过菜单进入
      form.setFieldValue('deviceName', state.deviceName);
      handleSearchClick(state.deviceCode);
    }
  }, [state]);

  // 重置操作
  const handleResetClick = () => {
    // @ts-ignore
    tableRef.current?.searchByParams({
      beginTime: dayjs(dayjs(new Date(new Date().getFullYear(), 0, 1))).format('YYYY-MM-DD'),
      endTime: dayjs(
        dayjs(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`),
      ).format('YYYY-MM-DD'),
    });
    form.resetFields();
    form.setFieldsValue({
      time: [
        dayjs(new Date(new Date().getFullYear(), 0, 1)),
        dayjs(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`),
      ],
    });
  };

  // 告警处理
  const alarmHandling = (record: any) => {
    setCurrentAlarmData(record);
    setConfirmVisible(true);
  };

  // 告警确认但不处理
  const alarmAcknowledgement = async (record: any) => {
    await addAlarmDealWithOutDeal({ eventId: record.id });
    const time = form.getFieldValue('time');
    let beginTime, endTime;
    if (time) {
      beginTime = dayjs(time[0]).format('YYYY-MM-DD HH:mm:ss');
      endTime = dayjs(time[1]).format('YYYY-MM-DD HH:mm:ss');
    }
    // @ts-ignore
    tableRef.current?.searchByParams({
      beginTime,
      endTime,
      eventStatus: form.getFieldValue('eventStatus'),
    });
  };

  // 初始化 table columns
  const initTableColumns = [
    ...columns,
    {
      title: '操作',
      dataIndex: 'typeNumber',
      key: 'typeNumber',
      align: 'center' as any,
      render: (_text: any, record: any) => {
        return (
          <Popconfirm
            placement="topLeft"
            title="告警确认"
            description="是否处理该条告警信息？"
            onConfirm={() => alarmHandling(record)}
            onCancel={() => alarmAcknowledgement(record)}
            okText="处理"
            cancelText="确认但不处理"
          >
            <Button size="small">告警确认</Button>
          </Popconfirm>
        );
      },
    },
  ];

  // 点击下载
  const handleDownLoadClick = () => {
    if (tableSelectRows && tableSelectRows.length > 0) {
      let data = tableSelectRows.map((item) => {
        return {
          发生时间: item.date,
          企业名称: item.subStationName,
          设备名称: item.deviceName,
          事项名称: item.eventName,
          事项状态: EVENTSTATUSCOLORANDSCRIPT[item.eventStatus].script,
          告警等级: ALARMCOLORANDSCRIPT[item.eventLevel].script,
          事项类型: item.typeNumber,
          运维建议: item.advice,
        };
      });
      exportExcel(data, '实时告警');
    } else {
      messageApi.warning('请选择数据后进行操作！');
    }
  };

  /** 请求事件类型 */
  useEffect(() => {
    fetchEventTypes();
  }, []);

  // 返回上一页
  const handleGoBack = () => {
    history.back();
  };

  /** 搜索区域 */
  const renderSearch = () => {
    return (
      <>
        <Form
          layout="inline"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ eventStatus: '' }}
          style={{ marginBottom: 16 }}
          autoComplete="off"
          form={form}
        >
          <Row gutter={[16, 16]}>
            <Col span={7}>
              <Form.Item label="发生时间" name="time">
                <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="事项类型" name="eventType">
                <Select
                  options={alarmTypes}
                  allowClear
                  fieldNames={{
                    label: 'eventTypeName',
                    value: 'eventType',
                  }}
                  placeholder="请选择事项类型"
                  style={{ width: 280 }}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="设备名称" name="deviceName">
                <Input placeholder="请输入关键字" />
              </Form.Item>
            </Col>
            <Col span={5}></Col>
            <Col span={7}>
              <Form.Item label="事项状态" name="eventStatus">
                <Select placeholder="请选择处理状态" options={EVENTTYPES} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="告警等级" name="eventLevel">
                <Select
                  options={ALARMLEVEL}
                  placeholder="请选择告警等级"
                  allowClear
                  style={{ width: 280 }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="事项名称" name="eventName">
                <Input placeholder="请输入关键字" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item wrapperCol={{ span: 16, offset: 6 }}>
                <Space>
                  <Button onClick={() => handleSearchClick()}>
                    <SearchOutlined />
                    查询
                  </Button>
                  <Button onClick={handleResetClick}>
                    <ReloadOutlined />
                    重置
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

  const renderTitleRight = () => {
    return (
      <Space>
        {state?.siteType === 'tourActive' && (
          <Button onClick={handleGoBack}>
            <LeftOutlined />
            返回
          </Button>
        )}
        <Button
          onClick={() => {
            localStorage.setItem('whetherPlay', '0');
            localStorage.setItem('closeAudio', 'false');
          }}
        >
          <i className="iconfont" style={{ fontSize: '13px', marginRight: '5px' }}>
            &#xe649;
          </i>
          消音
        </Button>
      </Space>
    );
  };

  return (
    <ContentPage>
      <ContentComponent
        title="实时告警"
        renderSearch={renderSearch}
        renderTitleRight={renderTitleRight}
      >
        {contextHolder}
        <GeneralTable
          url="/api/alarm/getRealTimeAlarmEvent"
          ref={tableRef}
          columns={initTableColumns}
          rowKey="id"
          bordered={false}
          getCheckData={(data) => setTableSelectRows(data)}
          requestType="get"
          type="checkbox"
        />
        {/* 告警确认模态框 */}
        <AlarmModal
          confirmVisible={confirmVisible}
          setConfirmVisible={setConfirmVisible}
          currentAlarmData={currentAlarmData}
          searchFormRef={form}
          messageApi={messageApi}
          tableRef={tableRef}
        />
      </ContentComponent>
    </ContentPage>
  );
};
export default RealtimeAlarm;
