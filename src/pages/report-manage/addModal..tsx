import ContentComponent from '@/components/content-component';
import Empty from '@/components/empty';
import {
  addTemplate,
  getDeviceTree,
  getReportListField,
  previewReportData,
} from '@/services/report-manage';
import { FileTextOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  TreeSelect,
  message,
} from 'antd';
import moment from 'moment';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { handleTable, transformData } from './utils';

interface propsType {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>; // 修改模态框状态
  isModalOpen: boolean; // 模态框状态
  refresh?: any; // 新增成功后操作
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
  // 设备树
  const [deviceTree, setDeviceTree] = useState<any>([]);
  // 表格高度
  const tableHeightRef = useRef<number>(0);
  const searchItemRef = useRef<HTMLDivElement>(null);

  // 获取设备树数据
  const { run: fetchUserStation, data: tree } = useRequest(getDeviceTree, {
    manual: true,
    onSuccess: (value) => setDeviceTree(transformData(value)),
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
            deviceCodeList: value.stationName,
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
          deviceCodeList: value.stationName,
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

  // 只能选择企业或者一个企业下的设备，根据情况禁用选择
  const onChange = (newValue: string) => {
    if (newValue.length === 1) {
      // 找到用户选择的 level: 1 对象
      const selectedParent = deviceTree.find(
        (parent: any) => parent.value === newValue[0] && parent.level === 1,
      );
      // 如果找到选中的 level: 1 对象，则遍历所有同级的 level: 1 对象并将它们的下属 level: 2 对象都添加 disabled: true 属性
      if (selectedParent) {
        deviceTree
          .filter((parent: any) => parent.level === 1)
          .forEach((parent: any) => {
            parent.children.forEach((child: any) => {
              child.disabled = true;
            });
          });
        setDeviceTree(deviceTree);
      } else {
        deviceTree.forEach((parent: any) => {
          parent.disabled = true;
          if (!parent.children.some((child: any) => child.value === newValue[0])) {
            parent.children.forEach((child: any) => {
              child.disabled = true; // 其他 level: 2 对象设置 disabled: true
            });
          }
        });
        setDeviceTree(deviceTree);
      }
    } else if (newValue.length === 0) {
      setDeviceTree(transformData(tree));
    }
    setSubstationCode(newValue);
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
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                      >
                        <Select
                          placeholder="请选择报表类型"
                          options={reportType}
                          allowClear
                          style={{ width: 300 }}
                        />
                      </Form.Item>
                      <Form.Item
                        label="电站/设备选择"
                        name="stationName"
                        required
                        rules={[{ required: true, message: '请选择查询测点' }]}
                      >
                        <TreeSelect
                          showSearch
                          style={{ width: 400 }}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          placeholder="请选择电站或设备"
                          allowClear
                          multiple
                          treeDefaultExpandAll
                          onChange={onChange}
                          treeData={deviceTree}
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
                  style={{ marginLeft: '100px', marginBottom: '10px' }}
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
