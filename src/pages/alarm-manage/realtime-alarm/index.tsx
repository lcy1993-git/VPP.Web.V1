import ContentComponent from "@/components/content-component"
import ContentPage from "@/components/content-page"
import GeneralTable from "@/components/general-table"
import { ALARMLEVEL, EVENTTYPES } from "@/utils/enum"
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from "antd"
import { useRef } from "react"
import { columns } from "./utils"
const { RangePicker } = DatePicker;


const RealtimeAlarm = () => {
  // 表格实例
  const tableRef = useRef(null)
  // 搜素表单实例
  const [searchform] = Form.useForm();

  // 搜索区域
  const searchArea = () => {
    return (
      <Form
        layout="inline"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ eventStatus: '' }}
        style={{ marginBottom: 16 }}
        autoComplete="off"
        form={searchform}
      >
        <Row gutter={[16, 16]}>
          <Col span={7}>
            <Form.Item label="发生时间" name="time">
              <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="事项名称" name="eventName">
              <Input placeholder="请输入关键字" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="事项类型" name="eventType" >
              <Select options={[]} allowClear
                fieldNames={{
                  label: 'eventTypeName',
                  value: 'eventType'
                }}
                placeholder="请选择事项类型" style={{ width: 280 }}>
              </Select>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="设备名称" name="psrName">
              <Input placeholder="请输入关键字" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="事项状态" name="eventStatus">
              <Select placeholder="请选择处理状态" options={EVENTTYPES} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="告警等级" name="eventLevel">
              <Select options={ALARMLEVEL} placeholder="请选择告警等级" allowClear style={{ width: 280 }} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
              <Space>
                <Button onClick={() => {}}>查询</Button>
                <Button onClick={() => {}}>重置</Button>
                <Button onClick={() => {}}>下载</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }

  // header right
  const renderTitleRight = () => {
    return <Button>消音</Button>
  }

  return (
    <ContentPage>
      <ContentComponent
        title="实时告警"
        renderSearch={searchArea}
        renderTitleRight={renderTitleRight}
      >
        <GeneralTable
          url="/sysApi/sysrole/getSysRolePageList"
          ref={tableRef}
          columns={columns}
          rowKey="id"
          hideSelect
          size="middle"
          bordered={false}
          requestType="post"
          filterParams={{ }}
          hasPage={true}
        />
      </ContentComponent>
    </ContentPage>
  )
}
export default RealtimeAlarm
