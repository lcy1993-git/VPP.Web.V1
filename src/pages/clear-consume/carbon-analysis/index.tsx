import ContentComponent from '@/components/content-component';
import ContentPage from '@/components/content-page';
import CustomDatePicker from '@/components/custom-datePicker';
import GeneralTable from '@/components/general-table';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Space } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import { useEffect, useRef, useState } from 'react';
import SelectForm from '../select-form/analysis-select';
import ReportModal from './reportModal';
dayjs.locale('zh-cn');

const CarbonAnalysis = () => {
  // form
  const [searchForm] = Form.useForm();
  // 分类类型
  const [type, setType] = useState<number>(0);
  // 行业code
  const [industry, setIndustry] = useState<any>('');
  // 区域id
  const [area, setArea] = useState<any>('');
  // 企业类别
  const [enterpriseCategory, setEnterpriseCategory] = useState<number>(0);
  // table 示例
  const tableRef = useRef(null);
  // 表格 checkbox 被选中
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  // 碳排放监测 日期组件
  const [date, setDate] = useState<string>('');
  // 日期类型
  const [unit, setUnit] = useState<string>('');
  // column
  const [column, setColumn] = useState<any>();
  // 弹框状态
  const [visible, setVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<number>(0);

  // 企业
  const enterpriseColumns = [
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
            <Button size="small" onClick={() => setVisible(true)}>
              报告查询
            </Button>
            <Button size="small">报告下载</Button>
          </Space>
        );
      },
    },
  ];

  // 区域或者行业
  const industryColumns = [
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
      title: type === 0 ? '区域名称' : '行业名称',
      dataIndex: 'name',
      key: 'name',
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
      title: '操作',
      align: 'center' as any,
      dataIndex: '',
      key: 'x',
      width: 200,
      render: () => {
        return (
          <Space>
            <Button size="small" onClick={() => setVisible(true)}>
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
    setModalType(type);
    let params = {
      ...formParams,
      unit,
      date,
      type,
    };
    // 企业类别
    if (type === 1) {
      params.enterpriseCategory = enterpriseCategory;
      setColumn(enterpriseColumns);
    } else {
      setColumn(industryColumns);
    }
    if (enterpriseCategory === 1) params.ids = area;
    else if (enterpriseCategory === 2) params.ids = industry;
    if (tableRef && tableRef.current) {
      (tableRef.current as any)?.searchByParams(params);
    }
  };

  /** 搜索区域 */
  const renderSearch = () => {
    return (
      <Row>
        <Col span={12}>
          <SelectForm
            setType={setType}
            setIndustryCode={setIndustry}
            setArea={setArea}
            setEnterpriseCategory={setEnterpriseCategory}
          />
        </Col>
        <Col span={12}>
          <Form name="basic" autoComplete="off" form={searchForm} style={{ display: 'flex' }}>
            <Form.Item label="时间" style={{ marginRight: '20px' }}>
              <CustomDatePicker datePickerType="" setDate={setDate} setUnit={setUnit} />
            </Form.Item>
            <Form.Item label="关键词" style={{ marginRight: '20px' }} name="keyword">
              <Input placeholder="请输入关键词" style={{ width: 260 }} />
            </Form.Item>
            <Form.Item>
              <Button icon={<SearchOutlined />} onClick={queryTableData}>
                查询
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );
  };

  const renderTitleRight = () => {
    return <Button>批量下载</Button>;
  };

  useEffect(() => {
    setColumn(industryColumns);
  }, []);

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
          columns={column}
          rowKey="uuid"
          bordered={false}
          requestType="post"
          type="checkbox"
          filterParams={{
            date: dayjs(new Date()).format('YYYY-MM-DD'),
            type: 0,
            unit: 'day',
          }}
        />

        <ReportModal visible={visible} setVisible={setVisible} type={modalType} />
      </ContentComponent>
    </ContentPage>
  );
};
export default CarbonAnalysis;
