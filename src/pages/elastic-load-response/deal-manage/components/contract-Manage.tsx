import GeneralTable from '@/components/general-table';
import { AuditOutlined, ContainerOutlined, PlusCircleOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Space, Table, Upload } from 'antd';
import { useRef, useState } from 'react';
import styles from '../index.less';
import { addContractTableColumns, contractColumns } from '../utils';


const ContractManage = () => {
  // 表格实例
  const tableRef = useRef(null);
  // 新增模态框状态
  const [visibile, setVisibile] = useState<boolean>(false)

  const contractTableColumns = [
    ...contractColumns,
    {
      title: '操作',
      dataIndex: 'index',
      align: 'center' as any,
      key: 'index',
      width: 180,
      render: () => {
        return (
          <Space>
            <Button size="small" onClick={() => setVisibile(true)}>详情</Button>
            <Button size="small">下载</Button>
            <Button size="small" danger>删除</Button>
          </Space>
        );
      },
    }
  ]

  return <div className={styles.contractPage}>
    <div className={styles.pageHead}>
      <Space>
        <DatePicker />
        <Button icon={<SearchOutlined />}>查询</Button>
        <Button icon={<PlusCircleOutlined />} onClick={() => setVisibile(true)}>新增</Button>
      </Space>
      <Space>
        <Button icon={<ContainerOutlined />}>运维增值服务协议</Button>
        <Button icon={<AuditOutlined />}>代理售电合同模版</Button>
        <Button icon={<AuditOutlined />}>需求响应代理合同模版</Button>
      </Space>
    </div>
    <div className={styles.pageMain}>
      <div className={styles.tableSearch}>
        <Input placeholder="请输入查询内容" style={{ width: 200 }} />
      </div>
      <GeneralTable
        url="/sysApi/deviceInfo/getDeviceInfoPageList"
        ref={tableRef}
        columns={contractTableColumns}
        rowKey="substationCode"
        type="checkbox"
        size="middle"
        bordered={true}
        getCheckData={(data) => { }}
        requestType="post"
        scroll={{
          y: window.innerHeight - 448
        }}
        filterParams={{ userId: localStorage.getItem('userId') }}
      />
    </div>
    <Modal
      title="新增合同"
      open={visibile}
      width="80%"
      centered
      footer={null}
      destroyOnClose
      onCancel={() => setVisibile(false)}
    >
      <div className={styles.modalMain} style={{ height: window.innerHeight - 300 }}>
        <div className={styles.modalMainForm}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ marginBottom: 10 }}
          autoComplete="off"
        >
          <Row>
            <Col span={6}>
              <Form.Item label="合同编号" name="time">
                <Input placeholder="请输入关键字" />
              </Form.Item>
              <Form.Item label="合同名称" name="time">
                <Input placeholder="请输入关键字" />
              </Form.Item>
              <Form.Item label="合同类型" name="time">
                <Input placeholder="请输入关键字" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="签订对象" name="time">
                <Input placeholder="请输入关键字" />
              </Form.Item>
              <Form.Item label="开始时间" name="time">
                <Input placeholder="请输入关键字" />
              </Form.Item>
              <Form.Item
                wrapperCol={{ offset: 8, span: 16 }}
              >
                <Space>
                  <Button>新建</Button>
                  <Button>重置</Button>
                </Space>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="结算方式" name="time">
                <Input placeholder="请输入关键字" />
              </Form.Item>
              <Form.Item label="结束时间" name="time">
                <Input placeholder="请输入关键字" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="合同导入" name="time">
                <Upload>
                  <Button icon={<UploadOutlined />}>上传</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        </div>
        <div className={styles.modalTable} style={{height: window.innerHeight - 468}}>
          <div className={styles.table} style={{height: window.innerHeight - 508}}>
            <GeneralTable
              url="/sysApi/deviceInfo/getDeviceInfoPageList"
              ref={tableRef}
              columns={addContractTableColumns}
              rowKey="substationCode"
              type="checkbox"
              size="middle"
              bordered={true}
              getCheckData={(data) => { }}
              requestType="post"
              scroll={{
                y: window.innerHeight - 616
              }}
              filterParams={{ userId: localStorage.getItem('userId') }}
            />
          </div>
          <div className={styles.button}>
            <Space>
              <Button>取消</Button>
              <Button>确认</Button>
            </Space>
          </div>
        </div>
      </div>
    </Modal>
  </div>
};
export default ContractManage;
