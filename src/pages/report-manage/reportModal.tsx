import Empty from '@/components/empty';
import { getReportData } from '@/services/report-manage';
import { exportExcel } from '@/utils/xlsx';
import { DownloadOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, DatePicker, Modal, Table } from 'antd';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { handleTable } from './utils';

interface currentInfo {
  reportInfo: any;
  isReportModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>; // 修改模态框状态
}

// 展示报表弹框
const ReportModal = (props: currentInfo) => {
  const { isReportModalOpen, setIsModalOpen, reportInfo } = props;
  // 当前日期
  const date = dayjs(new Date()).format('YYYY-MM-DD');
  // 表头
  const [columns, setColumns] = useState<any>([]);
  // 表格数据
  const [dataSource, setDataSource] = useState<any>([]);
  // 查看表格loading
  const [loading, setLoading] = useState<boolean>(false);

  // 获取报表数据
  const { run: fetchReportData } = useRequest(getReportData, {
    manual: true,
    onSuccess: (resolve) => {
      // 处理表头和表格数据
      const res = handleTable(resolve);
      setColumns(res.columns);
      setDataSource(res.dataSource);
      setLoading(false);
    },
  });

  // 返回
  const handleCancel = () => {
    setColumns([]);
    setDataSource([]);
    setIsModalOpen(false);
  };

  // 下载文件
  const handleDownLoad = () => {
    const transformedData = dataSource.map(({ date, ...rest }: { date: string }) => {
      return { 日期: date, ...rest };
    });
    exportExcel(transformedData, reportInfo.templateName);
  };

  useEffect(() => {
    if (reportInfo) {
      setLoading(true);
      fetchReportData(reportInfo.reportTemplateId, date);
    }
  }, [reportInfo]);

  return (
    <Modal
      title="查看报表"
      open={isReportModalOpen}
      width={1600}
      footer={null}
      destroyOnClose
      centered
      style={{ height: 720 }}
      onCancel={handleCancel}
    >
      <div
        style={{ display: 'flex', justifyContent: 'end', marginTop: '10px', alignItems: 'center' }}
      >
        <span style={{ fontSize: '16px' }}>日期：</span>
        <DatePicker
          picker={reportInfo?.reportType === 'day' ? 'date' : reportInfo?.reportType}
          //   disabledDate={disableDate}
          defaultValue={dayjs(date, 'YYYY-MM-DD')}
          onChange={(dates, dateString) => {
            setLoading(true);
            fetchReportData(reportInfo.reportTemplateId, dateString);
          }}
          allowClear={false}
        />
        <Button onClick={handleDownLoad} style={{ margin: '0 30px' }} icon={<DownloadOutlined />}>
          下载报表
        </Button>
      </div>
      <div style={{ padding: 10, height: 685 }}>
        <Table
          pagination={false}
          columns={columns}
          loading={{
            spinning: loading,
            delay: 500,
            size: 'large',
          }}
          dataSource={dataSource || []}
          locale={{
            emptyText: (
              <div style={{ marginTop: 25 }}>
                <Empty />{' '}
              </div>
            ),
          }}
          scroll={{ y: 600 }}
        />
      </div>
    </Modal>
  );
};

export default ReportModal;
