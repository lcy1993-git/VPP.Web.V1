import ContentComponent from '@/components/content-component';
import ContentPage from '@/components/content-page';
import CustomDatePicker from '@/components/custom-datePicker';
import GeneralTable from '@/components/general-table';
import { exportExcel } from '@/utils/xlsx';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Tag } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import { useRef, useState } from 'react';
import SelectForm from '../select-form/detail-select';
dayjs.locale('zh-cn');

const CarbonDetail = () => {
  // form
  const [searchForm] = Form.useForm();
  // 分类类型
  const [type, setType] = useState<number>(-1);
  // 企业code
  const [substationCode, setSubstationCode] = useState<string>('');
  // 行业code
  const [industry, setIndustry] = useState<string>('');
  // 区域id
  const [area, setArea] = useState<string>('');
  // table 示例
  const tableRef = useRef(null);
  // 表格 checkbox 被选中
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  // 日期
  const [date, setDate] = useState<string>('');
  // 日期类型
  const [unit, setUnit] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();

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
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center' as any,
      ellipsis: true,
      render: (text: string) => {
        const enumText: any = { area: '区域', industry: '行业', enterprise: '企业' };
        return enumText[text] || '未知';
      },
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '排放量（t）',
      dataIndex: 'carbon',
      key: 'carbon',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '占比（%）',
      dataIndex: 'rate',
      key: 'rate',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '指标值（t）',
      dataIndex: 'limit',
      key: 'limit',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '排放超标情况',
      dataIndex: 'qualified',
      key: 'qualified',
      align: 'center' as any,
      ellipsis: true,
      render: (text: boolean) => {
        return <Tag color={text ? '#0b3079' : '#dc4446'}>{text ? '合格' : '不合格'}</Tag>;
      },
    },
  ];

  // 点击查询
  const queryTableData = () => {
    const formParams = searchForm.getFieldsValue();
    let params = {
      ...formParams,
      unit,
      date,
      type,
    };
    switch (type) {
      case -1:
        break;
      case 0:
        params.area = area;
        break;
      case 1:
        params.substationCode = substationCode;
        break;
      case 2:
        params.industry = industry;
        break;
    }
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.searchByParams(params);
    }
  };

  // 点击下载
  const handleDownLoadClick = () => {
    if (tableSelectRows && tableSelectRows.length > 0) {
      const classEnum: any = { area: '区域', industry: '行业', enterprise: '企业' };
      let data = tableSelectRows.map((item) => {
        return {
          名称: item.name,
          类型: classEnum[item.type] || '未知',
          时间: item.time,
          '排放量(t)': item.carbon,
          '占比(%)': item.rate,
          '指标值(t)': item.limit,
          排放超标情况: item.qualified ? '合格' : '不合格',
        };
      });
      exportExcel(data, '碳排放详情');
    } else {
      messageApi.warning('请选择数据后进行操作！');
    }
  };

  /** 搜索区域 */
  const renderSearch = () => {
    return (
      <Row>
        <Col span={12}>
          <SelectForm
            setType={setType}
            setArea={setArea}
            setIndustryCode={setIndustry}
            setSubstationCode={setSubstationCode}
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
    return <Button onClick={handleDownLoadClick}>导出</Button>;
  };

  return (
    <ContentPage>
      <ContentComponent
        title="碳排放详情"
        renderSearch={renderSearch}
        renderTitleRight={renderTitleRight}
      >
        <GeneralTable
          url="/api/cleanEnergyConsumeManage/carbonDetail"
          ref={tableRef}
          columns={initTableColumns}
          getCheckData={(data) => setTableSelectRows(data)}
          rowKey="uuid"
          bordered={false}
          requestType="get"
          type="checkbox"
          filterParams={{
            date: dayjs(new Date()).format('YYYY-MM-DD'),
            type: -1,
            unit: 'day',
          }}
        />
        {contextHolder}
      </ContentComponent>
    </ContentPage>
  );
};
export default CarbonDetail;
