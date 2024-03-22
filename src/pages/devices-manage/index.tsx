import ContentComponent from '@/components/content-component';
import ContentPage from '@/components/content-page';
import GeneralTable from '@/components/general-table';
import { downloadFile, getQRCode } from '@/utils/utils';
import { useRequest } from '@umijs/max';
import { Button, Col, Form, Input, message, Row, Select, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getTableColumns } from './columns';
import DeviceModal from './deviceModal';
import { DownloadOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { getDevicesType, getMeasurePoint } from '@/services/devices-manage';

const DeviceManage = () => {
  // 表格
  const tableRef = useRef(null);
  // 搜索表单form
  const [searchForm] = Form.useForm();
  // 表格checkbox被选中的数据
  const [selectData, setSelectData] = useState<any[]>([]);
  // 设备类型
  const [devicesType, setDevicesType] = useState<any[]>([]);
  // 厂站数据
  const [stationOption, setStationOption] = useState([]);
  // modal显示状态
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // 当前设备信息
  const [currDeviceInfo, setCurrDeviceInfo] = useState<any>(null);

  const [messageApi, contextHolder] = message.useMessage();

  //编辑or查看
  const [isEdit, setIsEdit] = useState<boolean>(false);
  // table columns
  const tableColumns = [
    ...getTableColumns(devicesType),
    {
      title: '操作',
      dataIndex: 'address',
      key: 'address',
      width: 80,
      align: 'center' as any,
      render: (_text: any, record: any) => {
        return (
          <Space>
            <Button
              size="small"
              onClick={() => {
                setIsModalOpen(!isModalOpen);
                setCurrDeviceInfo(record);
                setIsEdit(false);
              }}
            >
              查看
            </Button>
            <Button
              size="small"
              onClick={() => {
                setIsModalOpen(!isModalOpen);
                setCurrDeviceInfo(record);
                setIsEdit(true);
              }}
            >
              编辑
            </Button>
          </Space>
        );
      },
    },
  ];

  /** 搜索栏区域 */
  const renderSearch = () => {
    return (
      <Form
        name="basic"
        form={searchForm}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ marginBottom: 20 }}
        onFinish={(value) => {
          // @ts-ignore
          tableRef.current?.searchByParams(value);
        }}
        layout="inline"
        autoComplete="off"
      >
        <Row gutter={[12, 12]}>
          <Col span={6}>
            <Form.Item label="所属站点" name="substationCode">
              <Select
                placeholder="请选择所属站点"
                options={stationOption}
                allowClear
                fieldNames={{
                  label: 'name',
                  value: 'substationCode',
                }}
                style={{ width: 270 }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="设备类型" name="type">
              <Select
                placeholder="请选择设备类型"
                options={devicesType}
                allowClear
                fieldNames={{
                  label: 'description',
                  value: 'typeId',
                }}
                style={{ width: 270 }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="设备名称" name="name">
              <Input placeholder="请输入关键字" style={{ width: 270 }} />
            </Form.Item>
          </Col>
          <Col span={6}></Col>
          <Col span={6}>
            <Form.Item label="设备厂商" name="manufacturer">
              <Input placeholder="请输入设备厂商" style={{ width: 270 }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="设备型号" name="deviceModel">
              <Input placeholder="请输入关键字" style={{ width: 270 }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="质保状态" name="isBeforePeriod">
              <Select
                options={[
                  { label: '质保外', value: 0 },
                  { label: '质保内', value: 1 },
                ]}
                style={{ width: 270 }}
                placeholder="请选择质保状态"
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
              <Space size={20}>
                <Button htmlType="submit"><SearchOutlined />查询 </Button>
                <Button
                  onClick={() => {
                    searchForm.resetFields();
                    // @ts-ignore
                    tableRef.current!.searchByParams({ isBeforePeriod: 'null' });
                  }}
                >
                  <ReloadOutlined />
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  /** 生成二维码到本地 */
  const createQRCode = () => {
    if (!selectData.length) {
      messageApi.warning('请选择设备');
    }
    const promise = selectData.map((item) => {
      const landingPageUrl = JSON.stringify({ id: item.code });
      return getQRCode(landingPageUrl, item.name);
    });
    Promise.all(promise).then((result) => {
      result.forEach((item) => {
        downloadFile(item.codeUrl, item.name);
      });
    });
  };

  // 获取设备类型
  const { run: fetchDevicesType } = useRequest(getDevicesType, {
    manual: true,
    onSuccess: (value) => {
      setDevicesType(value || []);
    },
  });

  // 获取厂站
  const { run: fetchAllStation } = useRequest(getMeasurePoint, {
    manual: true,
    onSuccess: (value) => {
      setStationOption(value || []);
    },
  });

  /** header 右侧区域 */
  const renderTitleRight = () => {
    return <Button onClick={createQRCode}><DownloadOutlined />二维码下载</Button>;
  };

  // 刷新table数据
  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.refresh();
    }
  };

  useEffect(() => {
    fetchDevicesType();
    fetchAllStation();
  }, []);

  return (
    <ContentPage>
      <ContentComponent
        title="设备管理"
        renderSearch={renderSearch}
        renderTitleRight={renderTitleRight}
      >
        {contextHolder}
        <GeneralTable
          ref={tableRef}
          columns={tableColumns}
          url="/sysApi/deviceInfo/getDeviceInfoPageList"
          rowKey="deviceCode"
          type="checkbox"
          size="middle"
          bordered={false}
          filterParams={{ isBeforePeriod: 'null' }}
          getCheckData={(data) => setSelectData(data)}
          requestType="post"
        />

        {/* 详情and编辑 */}
        <DeviceModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          messageApi={messageApi}
          currDeviceInfo={currDeviceInfo}
          isEdit={isEdit}
          refresh={refresh}
        />
      </ContentComponent>
    </ContentPage>
  );
};
export default DeviceManage;
