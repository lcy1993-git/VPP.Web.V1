import ContentComponent from '@/components/content-component';
import ContentPage from '@/components/content-page';
import CustomDatePicker from '@/components/custom-datePicker';
import GeneralTable from '@/components/general-table';
import {
  deleteTemplate,
  getIndustryList,
  getReportDataList,
  getSubstationList,
} from '@/services/report-forms';
import { exportExcel } from '@/utils/xlsx';
import {
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Col, Form, Row, Select, Space, message } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import AddModal from './addModal.';
import styles from './index.less';
import ReportModal from './reportModal';
import { columns, handleTable } from './utils';

const ReportForms = () => {
  // 表格Ref
  const tableRef = useRef(null);
  // 新增模态框状态
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // 报表查看模态框状态
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  // 查看报表信息
  const [reportInfo, setReportInfo] = useState<any>(null);
  // 选中表格数据
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  // 搜素表单实例
  const [searchForm] = Form.useForm();
  // 日期类型
  const [unit, setUnit] = useState<string>('day');
  // 日期
  const [date, setDate] = useState<string>(dayjs(new Date()).format('YYYY-MM-DD'));
  // 选择区域类型
  const type = Form.useWatch('type', searchForm);

  // 企业数据
  const { data: substationList } = useRequest(getSubstationList, {
    manual: false,
  });

  // 行业数据
  const { data: industryList } = useRequest(getIndustryList, {
    manual: false,
  });

  // 批量导出报表
  const { run: fetchReportDataList } = useRequest(getReportDataList, {
    manual: true,
    onSuccess: (res: any) => {
      res.forEach((item: any, index: number) => {
        // 处理数据
        const transformedData = handleTable(item).dataSource.map(({ date, ...rest }) => {
          return { 日期: date, ...rest };
        });
        // 下载文件
        exportExcel(transformedData, tableSelectRows[index].templateName);
      });
    },
  });

  // 删除报表
  const { run: deleteReport } = useRequest(deleteTemplate, {
    manual: true,
  });

  // 刷新数据
  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.refresh();
    }
  };

  // 查询按钮
  const handleSearchClick = (values: any) => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.searchByParams({ ...values, date, unit });
    }
  };

  // 导出按钮
  const handleDownLoad = async () => {
    if (tableSelectRows && tableSelectRows.length > 0) {
      fetchReportDataList(tableSelectRows.map((item) => item.id));
    } else {
      message.warning('请勾选数据后进行导出操作');
    }
  };

  // 删除报表
  const handleDelete = async (id: any) => {
    // 删除
    await deleteReport(id);
    // 刷新
    handleSearchClick({
      type: searchForm.getFieldValue('type'),
      substationCode: searchForm.getFieldValue('substationCode'),
      industryCode: searchForm.getFieldValue('industryCode'),
    });
  };

  // 表单搜索区域
  const renderSearch = () => {
    return (
      <Form form={searchForm} onFinish={handleSearchClick}>
        <Row style={{ width: '100%' }}>
          <Col span={12} style={{ display: 'flex' }}>
            <Form.Item
              label="名称："
              name="type"
              initialValue={0}
              rules={[{ required: true, message: '请选择名称' }]}
            >
              <Select
                placeholder="请选择名称"
                style={{ width: 260, marginRight: '15px' }}
                allowClear={false}
                options={[
                  { label: '龙泉驿全区', value: 0 },
                  { label: '企业', value: 1 },
                  { label: '行业', value: 2 },
                ]}
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
                />
              </Form.Item>
            )}
          </Col>
          <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Form.Item>
              <Space>
                <Button htmlType="submit">
                  <SearchOutlined />
                  查询
                </Button>
                <Button onClick={handleDownLoad}>
                  <UploadOutlined />
                  导出
                </Button>
                <Button
                  onClick={() => {
                    if (tableSelectRows && tableSelectRows.length > 0) {
                      handleDelete(tableSelectRows.map((item) => item.id));
                    } else {
                      message.warning('请勾选数据后进行删除操作');
                    }
                  }}
                >
                  <DeleteOutlined />
                  删除
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  const tableColumns = [
    ...columns,
    {
      title: '操作',
      width: 180,
      align: 'center' as any,
      render: (_: any, record: any) => {
        return (
          <Space>
            <Button
              size="small"
              onClick={() => {
                setIsReportModalOpen(true);
                setReportInfo({
                  // reportDate: record.createTime,
                  reportTemplateId: record.id,
                  reportType: record.timeType,
                  templateName: record.templateName,
                });
              }}
            >
              查看
            </Button>
            <Button size="small" onClick={() => handleDelete([record.id])}>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  // 标题右侧
  const renderTitleRight = () => {
    return (
      <Space size={10}>
        <CustomDatePicker
          datePickerType=""
          getTypeAndDate={(type, date) => {
            setUnit(type);
            setDate(date);
          }}
        />
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircleOutlined />
          新增模版
        </Button>
      </Space>
    );
  };

  return (
    <ContentPage>
      <ContentComponent
        title="报表报告"
        renderTitleRight={renderTitleRight}
        renderSearch={renderSearch}
      >
        <div className={styles.tableContent}>
          <GeneralTable
            url="/api/financial/report/listTemplateByGov"
            ref={tableRef}
            columns={tableColumns}
            rowKey="id"
            size="middle"
            type="checkbox"
            bordered={false}
            requestType="get"
            getCheckData={(data) => setTableSelectRows(data)}
            hasPage={true}
            filterParams={{ date: dayjs(new Date()).format('YYYY-MM-DD'), type: 0, unit: 'day' }}
          />
        </div>
        {/* 查看报表弹框 */}
        <ReportModal
          reportInfo={reportInfo}
          isReportModalOpen={isReportModalOpen}
          setIsModalOpen={setIsReportModalOpen}
        />
        {/* 新增报表弹框 */}
        <AddModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          refresh={refresh}
          substationList={substationList}
          industryList={industryList}
        />
      </ContentComponent>
    </ContentPage>
  );
};
export default ReportForms;
