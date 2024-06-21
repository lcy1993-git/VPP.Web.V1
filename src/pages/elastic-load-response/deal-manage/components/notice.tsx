import CustomCharts from '@/components/custom-charts';
import SegmentedTheme from '@/components/segmented-theme';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DownloadOutlined,
  FileTextOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Row, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import { demandCapacityOptions, demandDetailColumns } from '../utils';
import OptionList from './option-list';
const { RangePicker } = DatePicker;

// 交易公告披露
const Notice = () => {
  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 3', 'Option 3'];
  const [tableData, setTableData] = useState<any>([
    { timePeriod: '00:00:00', demandCapacity: '1200' },
    { timePeriod: '01:00:00', demandCapacity: '1200' },
    { timePeriod: '02:00:00', demandCapacity: '1200' },
    { timePeriod: '03:00:00', demandCapacity: '1000' },
  ]);
  // 容量详情升序还是降序
  const [ascOrDesc, setAscOrDesc] = useState<boolean>(true);

  // 根据需求容量排序
  const sortTableDataByDemandCapacity = (tableData: any, ascOrDesc: boolean) => {
    return [...tableData].sort((a, b) => {
      const capacityA = parseInt(a.demandCapacity);
      const capacityB = parseInt(b.demandCapacity);
      if (ascOrDesc) {
        // 升序
        return capacityA - capacityB;
      } else {
        // 降序
        return capacityB - capacityA;
      }
    });
  };

  useEffect(() => {
    const sortedData = sortTableDataByDemandCapacity(tableData, ascOrDesc);
    setTableData(sortedData);
  }, [ascOrDesc]);

  return (
    <div className={styles.noticePage}>
      <div className={styles.header}>
        <div className={styles.left}>
          时间：
          <RangePicker
            format="YYYY-MM-DD"
            placeholder={['查询开始时间', '查询结束时间']}
            style={{ width: 300 }}
            allowClear={false}
          />
          <Space size={15}>
            <Button style={{ marginLeft: '40px' }}>
              <ReloadOutlined />
              重置
            </Button>
            <Button>
              <SearchOutlined />
              查询
            </Button>
            <Button>
              <DownloadOutlined />
              下载
            </Button>
          </Space>
        </div>
        <Button>
          <FileTextOutlined />
          申报
        </Button>
      </div>
      <div className={styles.container}>
        <OptionList options={options} title="邀约计划列表" />
        <div className={styles.infoContainer}>
          <div className={styles.planNum}>邀约计划信息：XXXXXXXXXXX</div>
          <Form
            autoComplete="off"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            style={{ paddingTop: '15px', height: '115px' }}
          >
            <Row gutter={24}>
              <Col span={7}>
                <Form.Item label="运行日" name="">
                  <Input style={{ width: 240 }} />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="响应类型" name="">
                  <Input style={{ width: 240 }} />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="需求时段" name="">
                  <Input style={{ width: 240 }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={7}>
                <Form.Item label="需求地区" name="">
                  <Input style={{ width: 240 }} />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="申报价格上限" name="">
                  <Input style={{ width: 240 }} />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item label="申报价格下限" name="">
                  <Input style={{ width: 240 }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div className={styles.demandCapacity}>
            <span className={styles.titleText}>邀约需求容量</span>
            <div className={styles.bar}>
              <div className={styles.blueTitle}>邀约需求容量柱状图</div>
              <CustomCharts options={demandCapacityOptions([5, 20, 36, 10, 10, 20])} />
            </div>
            <div className={styles.table}>
              <div className={styles.header}>
                <div />
                <div className={styles.blueTitle}>邀约需求容量详情</div>
                <SegmentedTheme
                  options={[
                    { value: 'asc', icon: <ArrowUpOutlined /> },
                    { value: 'desc', icon: <ArrowDownOutlined /> },
                  ]}
                  getSelectedValue={(value) => setAscOrDesc(value === 'asc')}
                />
              </div>
              <Table
                columns={demandDetailColumns}
                dataSource={tableData}
                scroll={{ y: 155 }}
                pagination={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notice;
