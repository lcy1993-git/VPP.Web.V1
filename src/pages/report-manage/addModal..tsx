import ContentComponent from '@/components/content-component';
import Empty from '@/components/empty';
import { addTemplate, getReportListField, previewReportData } from '@/services/report-manage';
import { getSubstations } from '@/services/system/user';
import { FileTextOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Checkbox, Form, Input, Modal, Select, Space, Table, message } from 'antd';
import moment from 'moment';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './index.less';
import { handleTable } from './utils';
interface propsType {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>; // 修改模态框状态
  isModalOpen: boolean; // 模态框状态
  refresh?: any; // 新增成功后操作
}

// 新增报表
const AddModal = (props: propsType) => {
  const { isModalOpen, setIsModalOpen, refresh } = props;
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
  // 电站id
  const [substationCode, setSubstationCode] = useState<any>([]);
  // 预览表格loading
  const [loading, setLoading] = useState<boolean>(false);
  // 保存loading
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  // 获取电站名称数据
  const { run: fetchUserStation, data: userStation } = useRequest(getSubstations, {
    manual: true,
  });

  // 获取报表字段
  const { run: fetchReportListField } = useRequest(() => getReportListField(substationCode), {
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
    if (isModalOpen) fetchUserStation();
  }, [isModalOpen]);

  useEffect(() => {
    setReportListField([]);
    if (substationCode.length) {
      fetchReportListField();
      // 清空已选站点选择框
      addForm.setFieldsValue({
        reportListField: [],
      });
    }
  }, [substationCode]);

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

  // 新增
  const addReport = () => {
    addForm
      .validateFields()
      .then(async (value: any) => {
        setSaveLoading(true);
        const submitInfo: any = Object.assign(
          {},
          {
            dataNameList: value.reportListField,
            substationCodeList: value.stationName,
            templateName: value.reportName,
            timeType: value.reportType,
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
      const submitInfo: any = Object.assign(
        {},
        {
          dataNameList: value.reportListField,
          substationCodeList: value.stationName,
          templateName: value.reportName,
          timeType: value.reportType,
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
  };

  // 取消按钮
  const handleCancel = () => {
    setIsModalOpen(false);
    addForm.resetFields();
    setIsVisible(false);
    setColumns([]);
    setDataSource([]);
    setSubstationCode([]);
    setReportListField([]);
  };

  // 重置
  const handleReset = () => {
    addForm.resetFields();
    setIsVisible(false);
    setColumns([]);
    setDataSource([]);
    setSubstationCode([]);
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
                <div className={styles.modalContent}>
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
                          style={{ width: 300 }}
                          allowClear={false}
                        />
                      </Form.Item>
                      <Form.Item
                        label="报表类型"
                        name="reportType"
                        required
                        rules={[{ required: true, message: '请选择模版类型' }]}
                        style={{ marginLeft: '30px' }}
                      >
                        <Select
                          placeholder="请选择报表类型"
                          options={reportType}
                          allowClear
                          style={{ width: 400 }}
                        />
                      </Form.Item>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <Form.Item
                        label="站点选择"
                        name="stationName"
                        required
                        rules={[{ required: true, message: '请选择所属站点' }]}
                      >
                        <Select
                          placeholder="请选择所属站点"
                          options={userStation || []}
                          allowClear
                          fieldNames={{
                            label: 'name',
                            value: 'substationCode',
                          }}
                          mode="multiple"
                          style={{ width: 300 }}
                          onChange={(value) => setSubstationCode(value)}
                        />
                      </Form.Item>
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
                  style={{ marginLeft: '100px', marginBottom: '15px' }}
                >
                  <FileTextOutlined />
                  报表预览
                </Button>
                {isVisible && (
                  <div>
                    {/* <div className={styles.modalTitle}>报表预览</div> */}
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
                              <Empty />{' '}
                            </div>
                          ),
                        }}
                        scroll={{ y: 245 }}
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
