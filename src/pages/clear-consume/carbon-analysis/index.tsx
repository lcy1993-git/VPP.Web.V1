import ContentComponent from '@/components/content-component';
import ContentPage from '@/components/content-page';
import GeneralTable from '@/components/general-table';
import SegmentDatepicker from '@/components/segment-datepicker';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Select, Space } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
dayjs.locale('zh-cn');

const CarbonAnalysis = () => {
  // form
  const [searchForm] = Form.useForm();
  // table 示例
  const tableRef = useRef(null);
  // 表格 checkbox 被选中
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  // 碳排放监测 日期组件
  const [selectDate, setSelectDate] = useState<string>('');
  // modal状态
  const [visible, setVisible] = useState<boolean>(false);

  // 初始化 table columns
  const initTableColumns = [
    {
      title: '序号',
      dataIndex: '',
      key: 'index',
      width: 60,
      align: 'center' as any,
      render: (_text: any, _record: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '所属区域',
      dataIndex: 'area',
      key: 'area',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '所属行业',
      dataIndex: 'industry',
      key: 'industry',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '排放量(t)',
      dataIndex: 'carbon',
      key: 'carbon',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '环比(%)',
      dataIndex: 'hb',
      key: 'hb',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '同比(%)',
      dataIndex: 'tb',
      key: 'tb',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '所属区域占比(%)',
      dataIndex: 'areaRate',
      key: 'areaRate',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '所属行业占比(%)',
      dataIndex: 'industryRate',
      key: 'industryRate',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '操作',
      align: 'center' as any,
      dataIndex: '',
      key: 'x',
      width: 200,
      render: () => {
        return (
          <Space>
            <Button size="small" type="default">
              报告查询
            </Button>
            <Button size="small">报告下载</Button>
          </Space>
        );
      },
    },
  ];

  // 点击查询
  const queryTableData = () => {
    const formParams = searchForm.getFieldsValue();
    const params = {
      ...formParams,
      unit: ['year', 'month', 'day'][selectDate.split('-').length - 1],
      type: formParams.type === '全部' ? 'null' : formParams.type,
    };

    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.searchByParams(params);
    }
  };

  useEffect(() => {
    if (selectDate) {
      searchForm.setFieldValue('date', selectDate);
    }
  }, [selectDate]);

  /** 搜索区域 */
  const renderSearch = () => {
    return (
      <>
        <Form name="basic" autoComplete="off" form={searchForm} initialValues={{ type: '全部' }}>
          <Row>
            <Col span={6}>
              <Form.Item label="分类" name="type">
                <Select
                  options={[
                    { label: '全部', value: '全部' },
                    { label: '区域', value: 'area' },
                    { label: '行业', value: 'industry' },
                    { label: '企业', value: 'enterprise' },
                  ]}
                  style={{ width: 200 }}
                  placeholder="请选择事项类型"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="时间" name="date">
                <SegmentDatepicker setSelectDate={setSelectDate} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="关键字" name="search">
                <Input placeholder="请输入关键字" style={{ width: 200 }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                <Button icon={<SearchOutlined />} onClick={queryTableData}>
                  查询
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </>
    );
  };

  const renderTitleRight = () => {
    return <Button>批量下载</Button>;
  };

  return (
    <ContentPage>
      <ContentComponent
        title="碳排放分析"
        renderSearch={renderSearch}
        renderTitleRight={renderTitleRight}
      >
        <GeneralTable
          url="/api/cleanEnergyConsumeManage/analyse"
          ref={tableRef}
          columns={initTableColumns}
          rowKey="uuid"
          bordered={false}
          requestType="get"
          type="checkbox"
          filterParams={{
            date: dayjs(new Date()).format('YYYY-MM-DD'),
            type: 'null',
            unit: 'day',
          }}
        />

        <Modal
          title="一汽大众负荷趋势"
          centered
          width={1000}
          open={visible}
          footer={false}
          onCancel={() => setVisible(false)}
        >
          <div className={styles.pdfView}>
            <div className={styles.pdfTitle}>xxx企业能源排放分析报告</div>
            <div className={styles.baseInfo}>
              <h3>一、企业基本信息</h3>
              <div className={styles.table}>
                <p>
                  <span>企业名称</span>
                  <span>xxx企业</span>
                </p>
                <p>
                  <span>企业人数</span>
                  <span></span>
                </p>
                <p>
                  <span></span>
                  <span></span>
                </p>
              </div>
            </div>
          </div>
        </Modal>
      </ContentComponent>
    </ContentPage>
  );
};
export default CarbonAnalysis;
