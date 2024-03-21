import ContentComponent from '@/components/content-component';
import ContentPage from '@/components/content-page';
import GeneralTable from '@/components/general-table';
import { deleteTemplate, getReportDataList } from '@/services/report-manage';
import { exportExcel } from '@/utils/xlsx';
import {
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Col, Form, Input, Row, Space, message } from 'antd';
import { useRef, useState } from 'react';
import AddModal from './addModal.';
import styles from './index.less';
import ReportModal from './reportModal';
import { columns, handleTable } from './utils';

const ReportManage = () => {
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

  // 批量导出报表
  const { run: fetchReportDataList } = useRequest(getReportDataList, {
    manual: true,
    onSuccess: (res) => {
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
      tableRef.current?.searchByParams({ ...values });
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
    handleSearchClick({ reportName: searchForm.getFieldValue('reportName') });
  };

  // 表单搜索区域
  const renderSearch = () => {
    return (
      <Form form={searchForm} onFinish={handleSearchClick}>
        <Row style={{ width: '100%' }}>
          <Col span={12}>
            <Form.Item label="报表" name="reportName">
              <Input placeholder="请输入报表名称" style={{ width: '30%' }} allowClear={false} />
            </Form.Item>
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

  return (
    <ContentPage>
      <ContentComponent
        title="报表管理"
        renderTitleRight={() => (
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircleOutlined />
            新增模版
          </Button>
        )}
        renderSearch={renderSearch}
      >
        <div className={styles.tableContent}>
          <GeneralTable
            url="/api/report/listTemplate"
            ref={tableRef}
            columns={tableColumns}
            rowKey="id"
            size="middle"
            type="checkbox"
            bordered={false}
            requestType="get"
            getCheckData={(data) => setTableSelectRows(data)}
            hasPage={true}
          />
        </div>
        {/* 查看报表弹框 */}
        <ReportModal
          reportInfo={reportInfo}
          isReportModalOpen={isReportModalOpen}
          setIsModalOpen={setIsReportModalOpen}
        />
        {/* 新增报表弹框 */}
        <AddModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} refresh={refresh} />
      </ContentComponent>
    </ContentPage>
  );
};
export default ReportManage;
