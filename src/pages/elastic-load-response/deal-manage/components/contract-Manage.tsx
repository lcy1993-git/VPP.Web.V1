import GeneralTable from '@/components/general-table';
import { AuditOutlined, ContainerOutlined, PlusCircleOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, List, message, Modal, Popover, Row, Select, Space, Spin, Table, Upload } from 'antd';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import styles from '../index.less';
import { contractColumns } from '../utils';
import { addContractPost, deleteContract, fileUpload, setContractDetail } from '@/services/elastic-load-response/components';
import { createUUid, downloadFile, downLoadPdfOrDocx } from '@/utils/utils';
import PreviewPdf from '@/components/preview-docx';


const ContractManage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  // 模态框表单实例
  const [form] = Form.useForm();
  // 表格实例
  const tableRef = useRef(null);
  // 新增模态框状态
  const [visibile, setVisibile] = useState<boolean>(false)
  // 预览合同模态框状态
  const [previewModalStatus, setPreviewModalStatus] = useState<boolean>(false)
  // 表格输入框
  const [keyword, setKeyword] = useState<string>('');
  // 查看详情文件格式
  const [fileType, setFiletype] = useState<'docx' | 'pdf'>('docx');
  // 预览文件地址
  const [previewPath, setPreviewPath] = useState<string>('');
  // 合同列表
  const [contractList, setContractList] = useState<any>();
  // 时期选择
  const [selectDate, setSelectDate] = useState(dayjs(dayjs(new Date()).format('YYYY-MM-DD'), "YYYY-MM-DD"));
  // 合同列表模态框状态
  const [open, setOpen] = useState<any>();

  // 合同列表
  const contractTableColumns = [
    ...contractColumns,
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center' as any,
      key: 'id',
      width: 180,
      render: (text: any) => {

        return (
          <Space>
            {/* <Popover content={contractList} open={open ? open[`popver-${text}`] : false} placement="left" trigger="click" title="合同列表"> */}
            <Button size="small" onClick={() => {
              setOpen(true)
              fetchContractList(text)
            }}>详情</Button>
            {/* </Popover> */}
            <Button size="small" onClick={() => downLoadPdfOrDocx('http://10.6.1.115:9000/prs3000/%E5%85%B3%E4%BA%8EMODBUS-TCP%E9%80%9A%E8%AE%AF%E8%AF%B4%E6%98%8E_1719456234553.docx')}>下载</Button>
            <Button size="small" danger onClick={() => deleteContractHandle(text)}>删除</Button>
          </Space>
        );
      },
    }
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
    form.validateFields().then(async (values) => {
      const files = values.file?.fileList ?? [];
      const fileFormData = new FormData();
      files.forEach((f: any) => fileFormData.append('files', f.originFileObj, f.name));

      const result = files.length > 0 && (await fileUpload(fileFormData));
      const { data } = result;

      const params = {
        contractName: values.contractName,
        contractNum: values.contractNum,
        contractType: values.contractType === '电网结算合同' ? 1 : 0,
        contractingParty: values.contractingParty,
        endTime: dayjs(values.endTime).format('YYYY-MM-DD'),
        startTime: dayjs(values.startTime).format('YYYY-MM-DD'),
        settlementMethod: values.settlementMethod === '电网结算' ? 1 : 0,
        fileUrl: data && data.join(','),
        id: createUUid(),
      }
      const resopnseResult = await addContractPost([params])
      if (resopnseResult.code === 200) {
        form.resetFields()
        setVisibile(false);
        (tableRef.current as any)?.searchByParams({
          date: dayjs(new Date()).format('YYYY-MM-DD'),
          keyword: ''
        });
      }
    })
  }



  // 查看合同详情
  const fetchContractList = async (contractId: string) => {
    const result = await setContractDetail(contractId)
    const { code, data } = result;
    if (code === 200 && data) {
      const dataSource = data.split(',').map((item: string) => {
        const pathParts = item.split('/');
        const fileNameWithExtension = pathParts[pathParts.length - 1];
        const fileName = fileNameWithExtension.substring(0, fileNameWithExtension.lastIndexOf('.'));
        const fileExtension = fileNameWithExtension.substring(fileNameWithExtension.lastIndexOf('.') + 1);
        return {
          filePath: item,
          fileType: fileExtension,
          fileName: decodeURIComponent(fileName) + '.' + fileExtension
        }
      })
      setContractList(dataSource)
    }
  }



  return <div className={styles.contractPage}>
    <div className={styles.pageHead}>
      <Space>
        <Button icon={<ContainerOutlined />} onClick={() => messageApi.info('功能维护中，请稍后！')}>运维增值服务协议</Button>
        <Button icon={<AuditOutlined />}  onClick={() => messageApi.info('功能维护中，请稍后！')}>代理售电合同模版</Button>
        <Button icon={<AuditOutlined />} onClick={() => messageApi.info('功能维护中，请稍后！')}>需求响应代理合同模版</Button>
      </Space>
    </div>
    <div className={styles.pageMain}>
      <div className={styles.tableSearch}>
        <Space>
          <DatePicker
            defaultValue={dayjs(dayjs(new Date()).format('YYYY-MM-DD'), "YYYY-MM-DD")}
            onChange={datePlckerChange}
            value={selectDate}
          />
          <Input onChange={(value) => setKeyword(value.target.value)} value={keyword} placeholder="请输入查询内容" style={{ width: 200 }} />
          <Button icon={<SearchOutlined />} onClick={searchTableData}>查询</Button>
        </Space>
        <Space>
          <Button icon={<PlusCircleOutlined />} onClick={() => setVisibile(true)}>新增</Button>
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
          y: window.innerHeight - 428
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
      width={1000}
      centered
      footer={null}
      destroyOnClose
      onCancel={() => setVisibile(false)}
    >
      <div className={styles.modalMain} style={{ height: 360 }}>
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
              <Col span={12}>
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

                <Form.Item label="签订对象" name="contractingParty"
                  rules={[
                    { required: true, message: '请输入签订对象' },
                  ]}
                >
                  <Input placeholder="请输入签订对象" />
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
              <Col span={12}>
                <Form.Item label="结算方式" name="settlementMethod">
                  <Select
                    options={[
                      { value: 0, label: '收益与考核比例结算' },
                      { value: 1, label: '电网结算' },
                    ]} />
                </Form.Item>
                <Form.Item label="开始时间" name="startTime"
                  rules={[
                    { required: true, message: '请选择开始时间' },
                  ]}
                >
                  <DatePicker placeholder='请选择开始时间' style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="结束时间" name="endTime"
                  rules={[
                    { required: true, message: '请选择结束时间' },
                  ]}
                >
                  <DatePicker placeholder='请选择结束时间' style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="合同导入" name="file"
                  rules={[
                    { required: true, message: '请上传合同' },
                  ]}
                >
                  <Upload accept=".doc, .docx, .pdf">
                    <Button icon={<UploadOutlined />}>上传</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </Modal>
    <Modal
      title="预览合同"
      open={previewModalStatus}
      width="80%"
      centered
      footer={null}
      destroyOnClose={true}
      onCancel={() => setPreviewModalStatus(false)}
    >
      <div className={styles.modalMain} style={{ height: window.innerHeight - 200, overflow: 'auto' }}>
        {
          fileType === 'pdf' ?
            <iframe src={previewPath} style={{ width: '100%', height: '100%' }}></iframe>
            : <PreviewPdf docUrl={previewPath} />
        }
      </div>
    </Modal>
    <Modal
      title="合同列表"
      open={open}
      width="20%"
      centered
      footer={null}
      destroyOnClose={true}
      onCancel={() => setOpen(false)}
    >
      <div style={{ width: '100%', height: 500 }}>
        <List
          bordered
          dataSource={contractList}
          renderItem={(item: any) => (
            <List.Item
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setPreviewModalStatus(true)
                setFiletype(item.fileType)
                setPreviewPath(item.filePath)
                setOpen(false);
              }}>
              <p>{item.fileName}</p>
            </List.Item>
          )}
        />
      </div>
    </Modal>
    {contextHolder}
  </div>
};
export default ContractManage;
