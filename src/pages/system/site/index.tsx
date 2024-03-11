import { Button, Col, Form, Input, Modal, Row, Select, Space, Table, Tag } from 'antd';

import ContentComponent from '@/components/content-component';
import ContentPage from '@/components/content-page';
import GeneralTable from '@/components/general-table';
import { getStationList, modifyUserSite } from '@/services/system/site';
import { useRequest } from '@umijs/max';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import Empty from '@/components/empty';

const Site: React.FC = () => {
  // 搜索表单实例
  const [searchForm] = Form.useForm();
  // 表格实例
  const tableRef = useRef<HTMLDivElement>(null);
  // 模态框状态
  const [visibile, setVisibile] = useState<boolean>(false);
  // 站点表格数据
  const [stationData, setStationData] = useState([]);
  // 被选中的站点
  const [selectSite, setSelectSite] = useState<any>([]);
  // 当前操作的用户账号
  const [userAccount, setUserAccount] = useState<any>(null);

  // 模态框 站点表格 columns
  const siteColumns = [
    {
      title: '站点名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '站点地址',
      dataIndex: 'address',
      key: 'address',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '客户名称',
      dataIndex: 'customer',
      key: 'customer',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '联系方式',
      dataIndex: 'contactPhone1',
      key: 'contactPhone1',
      align: 'center' as any,
    },
  ];
  // 用户列表 columns
  const userColumns = [
    {
      title: '用户账号',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as any,
      width: 150,
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      align: 'center' as any,
      width: 210,
    },
    {
      title: '手机号',
      dataIndex: 'telephone',
      key: 'telephone',
      align: 'center' as any,
      width: 180,
    },
    {
      title: '用户权限',
      dataIndex: 'roleNickName',
      key: 'roleNickName',
      align: 'center' as any,
      width: 160,
    },
    {
      title: '访问电站',
      dataIndex: 'substationIds',
      key: 'substationIds',
      align: 'center' as any,
      render: (_text: any, record: any) => {
        return record.substationInformationList?.map((item: any) => {
          return <Tag key={item.substationCode}>{item.name}</Tag>;
        });
      },
    },
    {
      title: '用户状态',
      dataIndex: 'status',
      key: 'path',
      align: 'center' as any,
      render: (text: any, record: any) => {
        return <span>{record.status === 0 ? '停用' : '正常'}</span>;
      },
      width: 120,
    },

    {
      title: '到期时间',
      dataIndex: 'expiryTime',
      key: 'expiryTime',
      align: 'center' as any,
      render: (text: any, record: any) => {
        return <>{moment(record.expiryTime).format('YYYY-MM-DD HH:mm')}</>;
      },
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center' as any,
      width: 120,
      render: (_text: any, record: any) => {
        return (
          <Space>
            <Button
              size="small"
              onClick={() => {
                setUserAccount(record);
                setVisibile(true);
                setSelectSite(record.substationCodes);
              }}
            >
              站点权限
            </Button>
          </Space>
        );
      },
    },
  ];
  /*** 请求站点列表 */
  const { run: fetchStation } = useRequest(getStationList, {
    manual: true,
    onSuccess: (result: any) => {
      if (result?.dataList) {
        setStationData(result.dataList);
      }
    },
  });

  /** 根据筛选条件查询表格数据 */
  const searchTable = () => {
    searchForm.validateFields().then(async (values) => {
      if (tableRef && tableRef.current) {
        //@ts-ignore
        tableRef.current.searchByParams(
          { ...values, userId: localStorage.getItem('userId') },
          true,
        );
      }
    });
  };

  // 用户数据重置按钮点击事件
  const resetEvent = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.searchByParams({ userId: localStorage.getItem('userId') }, true);
      searchForm.resetFields();
    }
  };

  /** 表单搜索区域 */
  const renderSearch = () => {
    return (
      <div className={styles.search}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          layout="inline"
          onFinish={searchTable}
          autoComplete="off"
          style={{ paddingBottom: 20 }}
          form={searchForm}
        >
          <Row gutter={[8, 8]} style={{ width: '100%' }}>
            <Col span={6}>
              <Form.Item label="用户账号" name="name">
                <Input placeholder="请输入用户账号" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="手机号码"
                name="telephone"
                rules={[
                  {
                    pattern: /^[1-9]\d*$/,
                    message: '请输入正确手机号',
                  },
                ]}
              >
                <Input placeholder="请输入手机号" allowClear maxLength={11} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="用户状态" name="status">
                <Select
                  allowClear
                  placeholder="请选择用户状态"
                  options={[
                    { label: '全部', value: 'null' },
                    { label: '停用', value: 0 },
                    { label: '正常', value: 1 },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
                <Space>
                  <Button htmlType="submit" icon={<SearchOutlined />}>查询 </Button>
                  <Button onClick={resetEvent} icon={<ReloadOutlined />}>重置 </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  // 模态框确定 编辑用户访问权限
  const submitUserStation = async () => {
    const params = {
      id: userAccount.id,
      isModifySubstation: true,
      substationCodes: selectSite,
    };
    const result = await modifyUserSite(params);
    if (result.code === 200) {
      setVisibile(false);
      // @ts-ignore
      tableRef.current?.searchByParams({
        userId: localStorage.getItem('userId'),
      });
    }
  };

  useEffect(() => {
    fetchStation();
  }, []);

  return (
    <ContentPage>
      <ContentComponent title="站点管理" renderSearch={renderSearch}>
        <GeneralTable
          url="/sysApi/sysuser/getSysUserListPage"
          ref={tableRef}
          columns={userColumns}
          rowKey="id"
          hideSelect
          size="middle"
          bordered={false}
          requestType="post"
          filterParams={{ userId: localStorage.getItem('userId') }}
          hasPage={true}
        />

        <Modal
          open={visibile}
          centered
          title="编辑用户站点访问权限"
          width={1200}
          footer={null}
          onCancel={() => setVisibile(false)}
        >
          <div className={styles.modalBody}>
            <div className={styles.formItem}>
              <div className={styles.label}>用户名称：</div>
              <div className={styles.value}>{userAccount?.name}</div>
            </div>
            <div className={styles.siteList}>
              <div className={styles.label}>站点权限：</div>
              <div className={styles.value}>
                <Table
                  dataSource={stationData}
                  columns={siteColumns}
                  pagination={false}
                  rowSelection={{
                    columnWidth: 60,
                    selectedRowKeys: selectSite,
                    onChange: (value) => setSelectSite(value),
                  }}
                  scroll={{ y: 460 }}
                  locale={{ emptyText: <div style={{ marginTop: 25 }}><Empty /> </div> }}
                  rowKey="substationCode"
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Space size={20}>
                <Button onClick={() => setVisibile(false)}>取消</Button>
                <Button onClick={submitUserStation}>确定</Button>
              </Space>
            </div>
          </div>
        </Modal>
      </ContentComponent>
    </ContentPage>
  );
};

export default Site;
