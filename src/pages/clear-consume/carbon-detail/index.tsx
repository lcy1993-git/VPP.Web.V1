import ContentComponent from "@/components/content-component"
import ContentPage from "@/components/content-page"
import GeneralTable from "@/components/general-table"
import SegmentDatepicker from "@/components/segment-datepicker"
import { exportExcel } from "@/utils/xlsx"
import { SearchOutlined } from "@ant-design/icons"
import { Button, Col, Form, Input, message, Row, Select, Tag } from "antd"
import { useEffect, useRef, useState } from "react"


const CarbonDetail = () => {
  // form
  const [searchForm] = Form.useForm();
  // table 示例
  const tableRef = useRef(null)
  // 表格 checkbox 被选中
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  // 碳排放监测 日期组件
  const [selectDate, setSelectDate] = useState<string>('')

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
        const eunm: any = { area: '区域', industry: '行业', enterprise: '企业' }
        return eunm[text] || '未知';
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
    }
  ];

  useEffect(() => {
    if (selectDate) {
      searchForm.setFieldValue('date', selectDate)
    }
  }, [selectDate])

  // 点击查询
  const queryTableData = () => {
    const formParams = searchForm.getFieldsValue();
    const params = {
      ...formParams,
      unit: ['year', 'month', 'day'][selectDate.split('-').length - 1],
      type: formParams.type === '全部' ? 'null' : formParams.type
    }

    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.searchByParams(params);
    }
  }

  // 点击下载
  const handleDownLoadClick = () => {
    if (tableSelectRows && tableSelectRows.length > 0) {
      const eunm: any = { area: '区域', industry: '行业', enterprise: '企业' }
      let data = tableSelectRows.map((item) => {
        return {
          名称: item.name,
          类型: eunm[item.type] || '未知',
          时间: item.time,
          '排放量(t)': item.carbon,
          '占比(%)': item.rate,
          '指标值(t)': item.limit,
          排放超标情况: item.qualified ? '合格' : '不合格'
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
      <>
        <Form
          name="basic"
          autoComplete="off"
          form={searchForm}
        >
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
                <SegmentDatepicker
                  setSelectDate={setSelectDate}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="关键字" name="name">
                <Input placeholder="请输入关键字" style={{ width: 200 }}/>
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
  }

  const renderTitleRight = () => {
    return <Button onClick={handleDownLoadClick}>导出</Button>
  }

  return <ContentPage>
    <ContentComponent title="碳排放详情"
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
          date: '2024-03-20',
          type: 'area',
          unit: 'year'
        }}
      />
      {contextHolder}
    </ContentComponent>
  </ContentPage>
}
export default CarbonDetail
