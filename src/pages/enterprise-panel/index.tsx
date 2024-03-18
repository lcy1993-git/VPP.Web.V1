import ContainerPage from "@/components/container-page"
import ContentComponent from "@/components/content-component"
import CustomCharts from "@/components/custom-charts";
import GeneralTable from "@/components/general-table";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Modal, Row, Segmented, Select, Space } from "antd";
import { useRef, useState } from "react";
import styles from './index.less'
import { chartOptions } from "./utils";

const EnterprisePanel = () => {
  // 搜索form
  const [searchForm] = Form.useForm();
  // table
  const tableRef = useRef(null);
  // modal状态
  const [visible, setVisible] = useState<boolean>(true);

  // columns
  const tableColumns = [
    {
      title: '序号',
      dataIndex: 'time',
      key: 'time',
      align: 'center' as any,
    },
    {
      title: '企业名称',
      dataIndex: 'time',
      key: 'time',
      align: 'center' as any,
    },
    {
      title: '统计周期',
      dataIndex: 'time',
      key: 'time',
      align: 'center' as any,
    },
    {
      title: '总用量(MWh)',
      dataIndex: 'time',
      key: 'time',
      align: 'center' as any,
    },
    {
      title: '光伏总发电量(MWh)',
      dataIndex: 'time',
      key: 'time',
      align: 'center' as any,
    },
    {
      title: '区域排名',
      dataIndex: 'time',
      key: 'time',
      align: 'center' as any,
    },
    {
      title: '行业排名',
      dataIndex: 'time',
      key: 'time',
      align: 'center' as any,
    },
    {
      title: '实时负荷趋势',
      dataIndex: 'time',
      key: 'time',
      align: 'center' as any,
    },
    {
      title: '用量趋势',
      dataIndex: 'time',
      key: 'time',
      align: 'center' as any,
    },
  ]
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
          <Form.Item label="统计周期" name="">
            <Space>
              <Segmented
                options={['年', '月', '日']}
              />
              <DatePicker />
            </Space>
          </Form.Item>
          <Form.Item label="企业名称" name="">
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

  return <ContainerPage>
    <ContentComponent title="企业看板" renderSearch={renderSearch}>
      <div className={styles.panelPage}>
      <GeneralTable
        ref={tableRef}
        initTableAjax={false}
        columns={tableColumns}
        dataSource={[]}
        rowKey="time"
        hideSelect={false}
        bordered={false}
        hasPage={false}
      />

      <Modal title="一汽大众负荷趋势"
        centered
        width={1000}
        open={visible}
        footer={false}
        onCancel={() => setVisible(false)}>
        <div className={styles.modalBody}>
          <CustomCharts
            options={chartOptions()}
            loading={false}
            width="952px"
            height="380px"
          />
        </div>
      </Modal>
      </div>
    </ContentComponent>
  </ContainerPage>
}
export default EnterprisePanel
