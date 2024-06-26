import GeneralTable from '@/components/general-table';
import { AuditOutlined, ContainerOutlined, PlusCircleOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Table, Upload } from 'antd';
import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import styles from '../index.less';
import { addTableColumns, contractColumns } from '../utils';
import { addContractPost, deleteContract, fileUpload } from '@/services/elastic-load-response/components';
import { createUUid } from '@/utils/utils';


const ContractManage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  // 模态框表单实例
  const [form] = Form.useForm();
  // 表格实例
  const tableRef = useRef(null);
  // 模态框表格实例
  const addContractTableRef = useRef(null);
  // 新增模态框状态
  const [visibile, setVisibile] = useState<boolean>(false)
  // 表格输入框
  const [keyword, setKeyword] = useState<string>('');
  // 时期选择
  const [selectDate, setSelectDate] = useState(dayjs(dayjs(new Date()).format('YYYY-MM-DD'), "YYYY-MM-DD"));
  // 模态框表格数据
  const [modalTableDataSource, setModalTableDataSource] = useState<any[]>([])
  // 合同列表
  const contractTableColumns = [
    ...contractColumns,
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center' as any,
      key: 'id',
      width: 180,
      render: (_text: any, record: any) => {
        return (
          <Space>
            <Button size="small" onClick={() => setVisibile(true)}>详情</Button>
            <Button size="small">下载</Button>
            <Button size="small" danger onClick={() => deleteContractHandle(record.id)}>删除</Button>
          </Space>
        );
      },
    }
  ]
  // 模态框列表
  const addContractTableColumns = [
    ...addTableColumns,
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center' as any,
      key: 'id',
      width: 180,
      render: (id: string, ) => {
        return (
          <Space>
            <Button size="small">下载</Button>
            <Button size="small" danger onClick={() => {
              const data = modalTableDataSource.filter(item => item.id != id)
              setModalTableDataSource(data || [])
            }}>
              删除
            </Button>
          </Space>
        );
      },
    },
  ]

  // 点击查询按钮
  const searchTableData = () => {
    (tableRef.current as any)?.searchByParams({
      date: dayjs(selectDate).format('YYYY-MM-DD'),
      keyword: keyword,
    });
  }

  // 时间选择器切换
  const datePlckerChange = (date: any) => {
    (tableRef.current as any)?.searchByParams({
      date: dayjs(date).format('YYYY-MM-DD'),
      keyword: keyword,
    });
    setSelectDate(dayjs(date))
  }

  // 删除合同
  const deleteContractHandle = async (id: string) => {
    try {
      const result = await deleteContract(id)
      if (result.code === 200) {
        messageApi.success('操作成功')
      }
    } catch (err) {
      messageApi.error('操作失败')
    }
  }

  // 新建合同
  const addContractHandle = () => {
    form.validateFields().then( async (values) => {
      const files = values.file?.fileList ?? [];
      const fileFormData = new FormData();
      files.forEach((f: any) => fileFormData.append('files', f.originFileObj, f.name));

      const result = files.length > 0 && (await fileUpload(fileFormData));
      const {data} = result;

      const params = {
        ...values,
        id: createUUid(),
        fileUrl: data && data.join(',')
      }

      console.log(params, '晨晨滴滴')
      setModalTableDataSource([...modalTableDataSource, params])
      form.resetFields()
    })
  }

  // 添加合同
  const addContract = async () => {
    if (!modalTableDataSource.length) {
      messageApi.warning('请输入新增合同')
    }
    const params = modalTableDataSource.map(item => {
      return {
        contractName: item.contractName,
        contractNum: item.contractNum,
        contractType: item.contractType === '电网结算合同' ? 1 : 0,
        contractingParty: item.contractingParty,
        endTime: dayjs(item.endTime).format('YYYY-MM-DD'),
        startTime: dayjs(item.startTime).format('YYYY-MM-DD'),
        settlementMethod: item.settlementMethod === '电网结算' ? 1 : 0,
        fileUrl: item.fileUrl,
        id: item.id,
      }
    })

    const result = await addContractPost(params)
    if (result.code === 200) {
      setModalTableDataSource([]);
      setVisibile(false);
      (tableRef.current as any)?.searchByParams({
        date: dayjs(new Date()).format('YYYY-MM-DD'),
          keyword: ''
      });
    }
  }

  return <div className={styles.contractPage}>
    <div className={styles.pageHead}>
      <Space>
        <DatePicker
          defaultValue={dayjs(dayjs(new Date()).format('YYYY-MM-DD'), "YYYY-MM-DD")}
          onChange={datePlckerChange}
          value={selectDate}
        />
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
        <Space>
          <Input onChange={(value) => setKeyword(value.target.value)} value={keyword} placeholder="请输入查询内容" style={{ width: 200 }} />
          <Button icon={<SearchOutlined />} onClick={searchTableData}>查询</Button>
        </Space>
      </div>
      <GeneralTable
        url="/sysApi/demand/response/contractManagement/list"
        ref={tableRef}
        columns={contractTableColumns}
        rowKey="id"
        type="checkbox"
        size="middle"
        bordered={true}
        getCheckData={(data) => { }}
        requestType="get"
        scroll={{
          y: window.innerHeight - 448
        }}
        filterParams={{
          date: dayjs(new Date()).format('YYYY-MM-DD'),
          keyword: ''
        }}
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
            form={form}
            initialValues={{
              contractType: 0,
              settlementMethod: 0
            }}
          >
            <Row>
              <Col span={6}>
                <Form.Item
                  label="合同编号"
                  name="contractNum"
                  rules={[
                    { required: true, message: '请输入合同编号' },
                  ]}
                >
                  <Input placeholder="请输入合同编号" />
                </Form.Item>
                <Form.Item
                  label="合同名称"
                  name="contractName"
                  rules={[
                    { required: true, message: '请输入合同名称' },
                  ]}
                >
                  <Input placeholder="请输入合同名称" />
                </Form.Item>
                <Form.Item label="合同类型" name="contractType">
                  <Select
                    options={[
                      { value: 0, label: '需求响应代理合同' },
                      { value: 1, label: '电网结算合同' },
                    ]} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="签订对象" name="contractingParty"
                  rules={[
                    { required: true, message: '请输入签订对象' },
                  ]}
                >
                  <Input placeholder="请输入签订对象" />
                </Form.Item>
                <Form.Item label="开始时间" name="startTime"
                  rules={[
                    { required: true, message: '请选择开始时间' },
                  ]}
                >
                  <DatePicker placeholder='请选择开始时间' style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  wrapperCol={{ offset: 8, span: 16 }}
                >
                  <Space>
                    <Button onClick={addContractHandle}>新建</Button>
                    <Button onClick={() => form.resetFields()}>重置</Button>
                  </Space>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="结算方式" name="settlementMethod">
                  <Select
                    options={[
                      { value: 0, label: '收益与考核比例结算' },
                      { value: 1, label: '电网结算' },
                    ]} />
                </Form.Item>
                <Form.Item label="结束时间" name="endTime"
                  rules={[
                    { required: true, message: '请选择结束时间' },
                  ]}
                >
                  <DatePicker placeholder='请选择结束时间' style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="合同导入" name="file"
                  rules={[
                    { required: true, message: '请上传合同' },
                  ]}
                >
                  <Upload>
                    <Button icon={<UploadOutlined />}>上传</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className={styles.modalTable} style={{ height: window.innerHeight - 468 }}>
          <div className={styles.table} style={{ height: window.innerHeight - 508 }}>
              <GeneralTable
                dataSource={modalTableDataSource}
                ref={addContractTableRef}
                rowKey="id"
                size="middle"
                hideSelect
                bordered={true}
                columns={addContractTableColumns}
                scroll={{ y: window.innerHeight - 616 }}
                hasPage={false}
              />
          </div>
          <div className={styles.button}>
            <Space>
              <Button>取消</Button>
              <Button onClick={addContract}>确认</Button>
            </Space>
          </div>
        </div>
      </div>
    </Modal>
    {contextHolder}
  </div>
};
export default ContractManage;
