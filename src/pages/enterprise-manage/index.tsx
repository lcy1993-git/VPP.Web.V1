import ContentComponent from '@/components/content-component';
import ContentPage from '@/components/content-page';
import GeneralTable from '@/components/general-table';
import { getProvinceInfo } from '@/services/enterprise-manage';
import { exportExcel } from '@/utils/xlsx';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Cascader, Col, Form, Input, message, Row, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { columns } from './columns';
import SiteModal from './siteModal';

const EnterpriseAanage = () => {
  // 表格
  const tableRef = useRef(null);
  // 搜索表单form
  const [searchForm] = Form.useForm();
  // 省份数据
  const [provinceData, setProvinceData] = useState<any[]>([]);
  // 当前操作数据的ID, 用于编辑、详情
  const [currentSiteInfo, setCurrentSiteInfo] = useState<any>(null);
  // 表格选中数据
  const [selectData, setSelectData] = useState<any[]>([]);
  // modal显示状态
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // 模态框作用，适用于编辑还是详情
  const [modalStatus, setModalStatus] = useState<'detail' | 'edit' | 'add' | null>(null);

  const [messageApi, contextHolder] = message.useMessage();

  // table columns
  const tableColumns = [
    ...columns,
    {
      title: '操作',
      dataIndex: 'address',
      key: 'address',
      width: 180,
      render: (_text: any, record: any) => {
        return (
          <Space>
            <Button
              size="small"
              onClick={() => {
                console.log(record, '这是什么');
                setCurrentSiteInfo(record);
                setIsModalOpen(true);
                setModalStatus('detail');
              }}
            >
              详情
            </Button>
            <Button
              size="small"
              onClick={() => {
                setCurrentSiteInfo(record);
                setIsModalOpen(true);
                setModalStatus('edit');
              }}
            >
              编辑
            </Button>
          </Space>
        );
      },
    },
  ];

  // 获取省市区数据
  const { run: fetchProvinceInfo } = useRequest(getProvinceInfo, {
    manual: true,
    onSuccess: (data) => {
      setProvinceData(data);
    },
  });

  /**  筛选表格数据 */
  const searchTableData = (value: any) => {
    // @ts-ignore
    tableRef?.current?.searchByParams({
      ...value,
      region: value.region?.join(','),
      userId: localStorage.getItem('userId'),
    });
  };

  /** 下载表格数据 */
  const downloadExcel = () => {
    if (selectData.length === 0) {
      message.warning('请选择数据！');
      return;
    }
    let data = selectData.map((item, index) => {
      return {
        序号: index + 1,
        站点名称: item.name,
        所属客户: item.customer,
        所属省区: item.region,
        详细地址: item.address,
        投运时间: item.startUpTime,
        联系人: item.contact1,
        联系电话: item.contactPhone1,
      };
    });
    exportExcel(data, '站点管理');
  };

  /** 表格搜索区域 */
  const renderSearch = () => {
    return (
      <Form
        form={searchForm}
        onFinish={searchTableData}
        layout="inline"
        autoComplete="off"
        style={{ marginBottom: 24 }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item label="站点名称" name="name">
              <Input placeholder="可输入站点名称" style={{ width: 270 }} allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="所属客户" name="customer">
              <Input style={{ width: 270 }} placeholder="可输入客户名称" />
            </Form.Item>
          </Col>
          <Col span={8}></Col>
          <Col span={8}>
            <Form.Item label="所属省区" name="region">
              <Cascader
                options={provinceData}
                style={{ width: 270 }}
                fieldNames={{
                  label: 'name',
                  value: 'code',
                  children: 'childrens',
                }}
                placeholder="请选择所属省区"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="联系人/电话"
              name="contactOrPhone"
              rules={[
                {
                  pattern: /^[1-9]\d*$/,
                  message: '请输入正确手机号',
                },
              ]}
            >
              <Input style={{ width: 270 }} placeholder="请输入联系人/电话" maxLength={11} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              <Space>
                <Button className="mr20" htmlType="submit">
                  <SearchOutlined />
                  查询
                </Button>
                <Button onClick={downloadExcel}>
                  <DownloadOutlined />
                  下载
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  // const addSite = () => {
  //   setIsModalOpen(true)
  //   setModalStatus('add')
  //   setCurrentSiteInfo(null)
  // }

  useEffect(() => {
    fetchProvinceInfo();
  }, []);

  return (
    <ContentPage>
      <ContentComponent
        title="站点管理"
        renderSearch={renderSearch}
        // renderTitleRight={() => <Button onClick={addSite}>新增站点</Button>}
      >
        {contextHolder}
        <GeneralTable
          url="/sysApi/substationInformation/getSubstations"
          ref={tableRef}
          columns={tableColumns}
          rowKey="substationCode"
          type="checkbox"
          size="middle"
          bordered={false}
          getCheckData={(data) => setSelectData(data)}
          requestType="get"
          filterParams={{ userId: localStorage.getItem('userId') }}
        />

        <SiteModal
          provinceData={provinceData}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          currentSiteInfo={currentSiteInfo}
          modalStatus={modalStatus}
          messageApi={messageApi}
          tableRef={tableRef}
        />
      </ContentComponent>
    </ContentPage>
  );
};
export default EnterpriseAanage;
