import ContentComponent from "@/components/content-component"
import ContentPage from "@/components/content-page"
import GeneralTable from "@/components/general-table"
import { SearchOutlined } from "@ant-design/icons"
import { Button, DatePicker, Form, Input, Segmented, Select, Space } from "antd"
import { useRef } from "react"


const CarbonAnalysis = () => {
  const [searchForm] = Form.useForm();

  const tableRef = useRef(null)

  // 初始化 table columns
  const initTableColumns = [
    {
      title: '序号',
      dataIndex: '',
      key: 'index',
      width: 100,
      align: 'center' as any,
      render: (_text: any, _record: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: '名称',
      dataIndex: 'date',
      key: 'date',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'date',
      key: 'date',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'date',
      key: 'date',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '排放量（t）',
      dataIndex: 'date',
      key: 'date',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '占比（%）',
      dataIndex: 'date',
      key: 'date',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '指标值（t）',
      dataIndex: 'date',
      key: 'date',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '排放超标情况',
      dataIndex: 'date',
      key: 'date',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '企业名称',
      dataIndex: 'subStationName',
      key: 'subStationName',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      align: 'center' as any,
      ellipsis: true,
    },
    {
      title: '事项名称',
      dataIndex: 'eventName',
      key: 'eventName',
      align: 'center' as any,
      ellipsis: true,
    },
  ];

  /** 搜索区域 */
  const renderSearch = () => {
    return (
      <>
        <Form
          name="basic"
          style={{ marginBottom: 20 }}
          layout="inline"
          autoComplete="off"
          form={searchForm}
        >
        <Form.Item label="分类" name="">
            <Select
              options={[]}
              placeholder="请选择事项类型"
              allowClear
              fieldNames={{
                label: 'eventTypeName',
                value: 'eventType',
              }}
            />
          </Form.Item>
          <Form.Item label="时间" name="">
            <Space>
              <Segmented
                options={['年', '月', '日']}
              />
              <DatePicker />
            </Space>
          </Form.Item>

          <Form.Item label="关键字" name="">
            <Input placeholder="请输入关键字" />
          </Form.Item>
          <Form.Item>
            <Button icon={<SearchOutlined />}>
              查询
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }

  const renderTitleRight = () => {
    return <Button>导出</Button>
  }

  return <ContentPage>
    <ContentComponent title="碳排放详情"
      renderSearch={renderSearch}
      renderTitleRight={renderTitleRight}
    >
      <GeneralTable
          url="/api/alarm/getRealTimeAlarmEvent"
          ref={tableRef}
          columns={initTableColumns}
          rowKey="id"
          bordered={false}
          requestType="get"
          hideSelect
        />
    </ContentComponent>
  </ContentPage>
}
export default CarbonAnalysis
