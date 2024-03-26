import ContentComponent from '@/components/content-component';
import Empty from '@/components/empty';
import { addTemplate, getReportListField, previewReportData } from '@/services/report-forms';
import { FileTextOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Checkbox, Form, Input, Modal, Select, Space, Table, message } from 'antd';
import moment from 'moment';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { handleTable } from './utils';

interface propsType {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>; // 修改模态框状态
  isModalOpen: boolean; // 模态框状态
  refresh?: any; // 新增成功后操作
  industryList: any; // 行业数据
  substationList: any; // 企业数据
}

const reportType = [
  {
    label: '日表',
    value: 'day',
  },
  {
    label: '月表',
    value: 'month',
  },
  {
    label: '年表',
    value: 'year',
  },
];

// 新增报表
const AddModal = (props: propsType) => {
  const { isModalOpen, setIsModalOpen, refresh, substationList, industryList } = props;
  // 字段
  const [reportListField, setReportListField] = useState<any>([]);
  // 添加form
  const [addForm] = Form.useForm();
  // 报表预览显示隐藏
  const [isVisible, setIsVisible] = useState(false);
  // 表头
  const [columns, setColumns] = useState<any>([]);
  // 表格数据
  const [dataSource, setDataSource] = useState<any>([]);
  // 设备id
  const [deviceCode, setDeviceCode] = useState<any>([]);
  // 预览表格loading
  const [loading, setLoading] = useState<boolean>(false);
  // 保存loading
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  // 表格高度
  const tableHeightRef = useRef<number>(0);
  const searchItemRef = useRef<HTMLDivElement>(null);
  // 选择区域类型
  const type = Form.useWatch('type', addForm);

  // 获取报表字段
  const { run: fetchReportListField } = useRequest(() => getReportListField(deviceCode), {
    manual: true,
    onSuccess: (resolve: any) => {
      const stationData = Object.keys(resolve).map((key) => ({
        value: key,
        label: resolve[key],
      }));
      setReportListField(stationData);
    },
  });

  useEffect(() => {
    setReportListField([]);
    if (deviceCode.length) {
      fetchReportListField();
      // 清空已选站点选择框
      addForm.setFieldsValue({
        reportListField: [],
      });
    }
  }, [deviceCode]);

  // 全区域情况
  useEffect(() => {
    if (type === 0) {
      setDeviceCode(['all']);
    } else {
      setDeviceCode([]);
      addForm.setFieldsValue({
        substationCode: '',
        industryCode: '',
      });
    }
    // 清空已选站点选择框
    setReportListField([]);
    addForm.setFieldsValue({
      reportListField: [],
    });
  }, [type]);

  // 新增
  const addReport = () => {
    addForm
      .validateFields()
      .then(async (value: any) => {
        setSaveLoading(true);
        let deviceCodeList = [];
        if (type === 0) {
          deviceCodeList = ['all'];
        } else if (type === 1) {
          deviceCodeList = [value.substationCode];
        } else {
          deviceCodeList = [value.industryCode];
        }
        const submitInfo: any = Object.assign(
          {},
          {
            dataNameList: value.reportListField,
            deviceCodeList,
            templateName: value.reportName,
            timeType: value.reportType,
            industryCode: value.industryCode,
            substationCode: value.substationCode,
          },
        );
        await addTemplate(submitInfo);
        message.success('添加成功');
        setIsModalOpen(false);
        setIsVisible(false);
        addForm.resetFields();
        if (refresh) refresh();
        setSaveLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 预览报表
  const previewReport = () => {
    setLoading(true);
    addForm.validateFields().then(async (value: any) => {
      setIsVisible(true);
      let deviceCodeList = [];
      if (type === 0) {
        deviceCodeList = ['all'];
      } else if (type === 1) {
        deviceCodeList = [value.substationCode];
      } else {
        deviceCodeList = [value.industryCode];
      }
      const submitInfo: any = Object.assign(
        {},
        {
          dataNameList: value.reportListField,
          deviceCodeList,
          templateName: value.reportName,
          timeType: value.reportType,
          industryCode: value.industryCode,
          substationCode: value.substationCode,
        },
      );
      const resolve = await previewReportData(submitInfo, moment(new Date()).format('YYYY-MM-DD'));
      const res = handleTable(resolve.data);
      setColumns(res.columns);
      setLoading(false);
      setDataSource(res.dataSource);
    });
  };

  // form值监听
  const onValuesChange = () => {
    // 预览报表关闭
    setIsVisible(false);
    setColumns([]);
    setDataSource([]);
    // 高度获取会延迟一步，使用setTimeout来确保获取到正确的高度
    setTimeout(() => {
      if (searchItemRef.current?.offsetHeight) {
        const height = 420 - searchItemRef.current?.offsetHeight;
        tableHeightRef.current = height;
      }
    }, 0);
  };

  // 取消按钮
  const handleCancel = () => {
    setIsModalOpen(false);
    addForm.resetFields();
    setIsVisible(false);
    setColumns([]);
    setDataSource([]);
    setDeviceCode([]);
    setReportListField([]);
  };

  // 重置
  const handleReset = () => {
    addForm.resetFields();
    setIsVisible(false);
    setColumns([]);
    setDataSource([]);
    setDeviceCode([]);
    setReportListField([]);
  };

  return (
    <>
      <Modal
        title="新增模板"
        open={isModalOpen}
        width={1600}
        footer={null}
        destroyOnClose
        centered
        onCancel={handleCancel}
      >
        <div className={styles.addStatements}>
          <ContentComponent title="新增模板">
            <div className={styles.modal}>
              <div className={styles.modalBody}>
                <div className={styles.modalTitle}>报表信息选择</div>
                <div className={styles.modalContent} ref={searchItemRef}>
                  <Form form={addForm} onValuesChange={onValuesChange}>
                    <div style={{ display: 'flex' }}>
                      <Form.Item
                        label="模版名称"
                        name="reportName"
                        required
                        rules={[{ required: true, message: '请输入模版名称' }]}
                      >
                        <Input
                          placeholder="请输入模板名称"
                          style={{ width: 365, marginRight: '20px' }}
                          allowClear={false}
                        />
                      </Form.Item>
                      <Form.Item
                        label="报表类型"
                        name="reportType"
                        required
                        rules={[{ required: true, message: '请选择模版类型' }]}
                      >
                        <Select
                          placeholder="请选择报表类型"
                          options={reportType}
                          allowClear={false}
                          style={{ width: 300 }}
                        />
                      </Form.Item>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <Form.Item
                        label="区域/企业/行业名称"
                        name="type"
                        required
                        rules={[{ required: true, message: '请选择查询名称' }]}
                      >
                        <Select
                          placeholder="请选择查询名称"
                          options={[
                            { label: '龙泉驿全区', value: 0 },
                            { label: '企业', value: 1 },
                            { label: '行业', value: 2 },
                          ]}
                          allowClear={false}
                          style={{ width: 300, marginRight: '20px' }}
                        />
                      </Form.Item>
                      {type === 1 && (
                        <Form.Item
                          label="企业名称"
                          name="substationCode"
                          rules={[{ required: true, message: '请选择企业' }]}
                        >
                          <Select
                            placeholder="请选择企业"
                            allowClear={false}
                            options={substationList}
                            style={{ width: 260 }}
                            fieldNames={{ label: 'name', value: 'substationCode' }}
                            onChange={(value) => setDeviceCode([value])}
                          />
                        </Form.Item>
                      )}
                      {type === 2 && (
                        <Form.Item
                          label="行业名称"
                          name="industryCode"
                          rules={[{ required: true, message: '请选择行业' }]}
                        >
                          <Select
                            placeholder="请选择行业"
                            allowClear={false}
                            options={industryList}
                            style={{ width: 260 }}
                            fieldNames={{ label: 'name', value: 'code' }}
                            onChange={(value) => setDeviceCode([value])}
                          />
                        </Form.Item>
                      )}
                    </div>
                    <Form.Item
                      label="选择数据"
                      name="reportListField"
                      required
                      rules={[{ required: true, message: '请选择模版数据' }]}
                    >
                      {reportListField.length ? (
                        <Checkbox.Group options={reportListField} />
                      ) : (
                        <span>暂无数据</span>
                      )}
                    </Form.Item>
                  </Form>
                </div>
                <Button
                  onClick={previewReport}
                  style={{ marginLeft: '100px', marginBottom: '10px' }}
                >
                  <FileTextOutlined />
                  报表预览
                </Button>
                {isVisible && (
                  <div>
                    <div className={`${styles.modalContent} ${styles.table}`}>
                      <Table
                        className="addTableStyle"
                        dataSource={dataSource || []}
                        columns={columns}
                        pagination={false}
                        loading={loading}
                        locale={{
                          emptyText: (
                            <div style={{ marginTop: 25 }}>
                              <Empty />
                            </div>
                          ),
                        }}
                        scroll={{ x: 300, y: tableHeightRef.current }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
                <Button icon={<SaveOutlined />} onClick={addReport} loading={saveLoading}>
                  保存
                </Button>
              </Space>
            </div>
          </ContentComponent>
        </div>
      </Modal>
    </>
  );
};
export default AddModal;
