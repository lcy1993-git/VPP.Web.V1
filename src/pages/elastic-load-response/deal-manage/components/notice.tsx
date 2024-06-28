import CustomCharts from '@/components/custom-charts';
import SegmentedTheme from '@/components/segmented-theme';
import {
  getAnnouncementDetails,
  getAnnouncementList,
} from '@/services/elastic-load-response/deal-manage';
import { exportExcel } from '@/utils/xlsx';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DownloadOutlined,
  FileTextOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space, Table } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import { demandCapacityOptions, demandDetailColumns } from '../utils';
import AddDeclarationModal from './add-declaration-modal';
import OptionList from './option-list';
const { RangePicker } = DatePicker;
// 交易公告披露
const Notice = () => {
  const currentDate: any = [dayjs(), dayjs()];
  const [form] = Form.useForm();
  // 列表选项
  const [options, setOptions] = useState<any>([]);
  // 被选中的计划
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  // 容量详情升序还是降序
  const [ascOrDesc, setAscOrDesc] = useState<boolean>(true);
  const [tableData, setTableData] = useState<any>([]);
  // 日期
  const [date, setDate] = useState<any>(currentDate);
  // 新增申报弹框
  const [addDeclarationOpen, setAddDeclarationOpen] = useState<boolean>(false);
  // 新增申报弹框类型
  const [addDeclarationInfo, setAddDeclarationInfo] = useState<any>({});
  // 计划列表
  const { run: fetchAnnouncementList } = useRequest(getAnnouncementList, {
    manual: true,
    onSuccess: (res: any) => {
      setOptions([
        {
          title: '目前邀约计划', // 分类标题
          options: res?.dayAheadInvitationPlan || [], // 该分类下的选项列表
        },
        {
          title: '实时调度计划',
          options: res?.realTimeDispatchPlan || [],
        },
      ]);
    },
  });

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

  // 计划列表详情
  const { run: fetchAnnouncementDetails, data: announcementDetails } = useRequest(
    getAnnouncementDetails,
    {
      manual: true,
      onSuccess: (res: any) => {
        form.setFieldsValue(res);
        const dataSource = res?.xaxis.map((timePeriod: string, index: number) => ({
          key: index,
          timePeriod,
          demandCapacity: res?.capacity[index],
        }));
        setTableData(sortTableDataByDemandCapacity(dataSource, ascOrDesc));
      },
    },
  );

  // 升序/降序
  useEffect(() => {
    const sortedData = sortTableDataByDemandCapacity(tableData, ascOrDesc);
    setTableData(sortedData);
  }, [ascOrDesc]);

  // 查询按钮
  const handleSearch = () => {
    fetchAnnouncementList({
      startDate: moment(date[0]).format('YYYY-MM-DD'),
      endDate: moment(date[1]).format('YYYY-MM-DD'),
    });
  };

  // 下载文件
  const handleDownLoad = () => {
    const transformedData = tableData.map((item: any, index: number) => {
      return { 序号: index + 1, 时段: item.timePeriod, '需求容量(MW)': item.demandCapacity };
    });
    const staticInfoRows = [
      [`邀约计划信息：${selectedValue}`],
      [
        `运行日:${announcementDetails?.operatingDay}`,
        `响应类型:${announcementDetails?.responseType === 0 ? '削峰响应' : '填谷响应'}`,
        `需求时段:${announcementDetails?.demandPeriod}`,
      ],
      [
        `需求地区:${announcementDetails?.demandArea}`,
        `申报价格上限:${announcementDetails?.maximumBidPrice}`,
        `申报价格下限:${announcementDetails?.minimumBidPrice}`,
      ],
    ];
    exportExcel(transformedData, '邀约需求容量', staticInfoRows);
  };

  useEffect(() => {
    fetchAnnouncementList({
      startDate: moment(currentDate[0]).format('YYYY-MM-DD'),
      endDate: moment(currentDate[1]).format('YYYY-MM-DD'),
    });
  }, []);

  useEffect(() => {
    if (selectedValue) {
      fetchAnnouncementDetails(selectedValue);
    }
  }, [selectedValue]);

  return (
    <>
      <div className={styles.noticePage}>
        <div className={styles.header}>
          <div className={styles.left}>
            时间：
            <RangePicker
              format="YYYY-MM-DD"
              placeholder={['查询开始时间', '查询结束时间']}
              style={{ width: 300 }}
              allowClear={false}
              onChange={(date) => setDate(date)}
              value={date}
            />
            <Space size={15}>
              <Button style={{ marginLeft: '40px' }} onClick={() => setDate(null)}>
                <ReloadOutlined />
                重置
              </Button>
              <Button onClick={handleSearch}>
                <SearchOutlined />
                查询
              </Button>
              <Button onClick={handleDownLoad}>
                <DownloadOutlined />
                下载
              </Button>
            </Space>
          </div>
          <Button
            onClick={() => {
              setAddDeclarationOpen(true);
              setAddDeclarationInfo({
                isEdit: false,
                // identificationNum: text.identificationNum,
                // substationCode: text.substationCode,
              });
            }}
          >
            <FileTextOutlined />
            申报
          </Button>
        </div>
        <div className={styles.container}>
          <OptionList categories={options} setSelectedValue={setSelectedValue} />
          <div className={styles.infoContainer}>
            <div className={styles.planNum}>邀约计划信息：{selectedValue}</div>
            <Form
              autoComplete="off"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 12 }}
              style={{ paddingTop: '15px', height: '115px' }}
              form={form}
            >
              <Row gutter={24}>
                <Col span={7}>
                  <Form.Item label="运行日" name="operatingDay">
                    <Input style={{ width: 240 }} disabled />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item label="响应类型" name="responseType">
                    <Select
                      style={{ width: 240 }}
                      disabled
                      options={[
                        { label: '削峰响应', value: 0 },
                        { label: '填谷响应', value: 1 },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item label="需求时段" name="demandPeriod">
                    <Input style={{ width: 240 }} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={7}>
                  <Form.Item label="需求地区" name="demandArea">
                    <Input style={{ width: 240 }} disabled />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item label="申报价格上限" name="maximumBidPrice">
                    <Input style={{ width: 240 }} disabled />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item label="申报价格下限" name="minimumBidPrice">
                    <Input style={{ width: 240 }} disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div className={styles.demandCapacity}>
              <span className={styles.titleText}>邀约需求容量</span>
              <div className={styles.bar}>
                <div className={styles.blueTitle}>邀约需求容量柱状图</div>
                <CustomCharts
                  options={demandCapacityOptions(
                    announcementDetails?.xaxis,
                    announcementDetails?.capacity,
                  )}
                />
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
                  size="middle"
                  bordered
                />
              </div>
            </div>
          </div>
        </div>
      </div>{' '}
      {/* 新增申报 */}
      <AddDeclarationModal
        open={addDeclarationOpen}
        setModalOpen={setAddDeclarationOpen}
        modalInfo={addDeclarationInfo}
      />
    </>
  );
};

export default Notice;
