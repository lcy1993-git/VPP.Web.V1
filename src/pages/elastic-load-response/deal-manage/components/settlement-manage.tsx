import CustomCharts from '@/components/custom-charts';
import GeneralTable from '@/components/general-table';
import SegmentedTheme from '@/components/segmented-theme';
import { InsertRowAboveOutlined, LineChartOutlined, LoginOutlined, ReloadOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, message, Modal, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import styles from '../index.less'
import { electricityTableColumns, electricityTableData, settlementChartOptions, settlementColumns } from '../utils';
import { useRequest } from 'ahooks';
import { getModalDetail, getSettlementResult } from '@/services/elastic-load-response/components';
import { exportExcel } from '@/utils/xlsx';

const SettlementManage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  // 表格实例
  const tableRef = useRef(null);
  // 详情模态框状态
  const [visibile, setVisibile] = useState<boolean>(false)
  // 表格输入框
  const [keyword, setKeyword] = useState<string>('');
  // 时期选择
  const [selectDate, setSelectDate] = useState(dayjs(dayjs(new Date()).format('YYYY-MM-DD'), "YYYY-MM-DD"));
  // 日、月切换状态
  const [dayOrMonth, setDayOrMonth] = useState<'day' | 'month'>('day');
  // 模态框表格和图表进行切换
  const [modalChartOrTable, setModalChartOrTable] = useState<'line' | 'table'>('line');
  // 清算记过 card 数据
  const [settlementResultData, setSettlementResultData] = useState<any>(null);
  // 表格 checkbox 被选中
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  // 模态框 card数据
  const [modalCardData, setModalCardData] = useState<any>(null);
  // 模态框详情数据
  const [modalDetailData, setModalDetailData] = useState<any>(null);

  // 页面表格columns
  const settlementTableColumns = [
    ...settlementColumns,
    {
      title: '操作',
      dataIndex: 'index',
      align: 'center' as any,
      key: 'index',
      width: 80,
      render: () => {
        return <Button size="small" onClick={() => {
          setVisibile(true)
          fetchModalDetail()
        }}>详情</Button>
      },
    }
  ]

  // 市场清算结果
  const { run: fetchSettlementResult, loading: settlementResultLoading } = useRequest(getSettlementResult, {
    manual: true,
    onSuccess: (result) => {
      const { code, data } = result;
      if (code === 200 && data) {
        const resultData = [
          {
            label: dayOrMonth === 'day' ? '日清算电量' : '月度结算电量',
            value: data.settlementElectricity,
            unit: '（Mwh）',
            icon: <i className="iconfont">&#xe676;</i>,
            id: 1
          },
          {
            label: dayOrMonth === 'day' ? '日实际调节电量' : '月度实际调节电量',
            value: data.actualAdjustmentElectricity,
            unit: '（Mwh）',
            icon: <i className="iconfont">&#xe678;</i>,
            id: 2
          },
          {
            label: dayOrMonth === 'day' ? '日清算费用' : '月度收益',
            value: data.income,
            unit: '（万元）',
            icon: <i className="iconfont">&#xe63d;</i>,
            id: 3
          },
          {
            label: dayOrMonth === 'day' ? '日考核费用' : '月度考核费用',
            value: data.assessmentFees,
            unit: '（万元）',
            icon: <i className="iconfont">&#xe667;</i>,
            id: 4
          },
          {
            label: '用户收入',
            value: data.userIncome,
            unit: '（万元）',
            icon: <i className="iconfont">&#xe666;</i>,
            id: 5
          },
          {
            label: '运营商收入',
            value: data.operatorRevenue,
            unit: '（万元）',
            icon: <i className="iconfont">&#xe665;</i>,
            id: 6
          }
        ]

        setSettlementResultData(resultData);
      }
    }
  });

  // 模态框详情数据
  const { run: fetchModalDetail, loading: modalDetailLoading } = useRequest(getModalDetail, {
    manual: true,
    onSuccess: (result) => {
      const { code, data } = result;
      if (code === 200 && data) {
        const cardData = [
          {
            label: '调节电量',
            value: data.adjustElectricityUsage,
            unit: '（Mwh）',
            icon: <i className="iconfont">&#xe676;</i>,
            id: 1
          },
          {
            label: '调节收益',
            value: data.adjustedEarnings,
            unit: '（万元）',
            icon: <i className="iconfont">&#xe66e;</i>,
            id: 2
          },
          {
            label: '考核费用',
            value: data.assessmentFees,
            unit: '（万元）',
            icon: <i className="iconfont">&#xe667;</i>,
            id: 3
          },
        ]
        setModalCardData(cardData);
        setModalDetailData(data);
      }
    }
  });

  // 重置表格条件数据
  const resetTable = () => {
    (tableRef.current as any)?.searchByParams({
      date: dayjs(selectDate).format('YYYY-MM-DD'),
      keyword: '',
      type: dayOrMonth
    });
    setKeyword('')
  }
  // 搜索表格数据
  const searchTable = () => {
    (tableRef.current as any)?.searchByParams({
      date: dayjs(selectDate).format('YYYY-MM-DD'),
      keyword: keyword,
      type: dayOrMonth
    });
  }

  // 时间选择器切换
  const datePlckerChange = (date: any) => {
    (tableRef.current as any)?.searchByParams({
      date: dayjs(date).format(dayOrMonth === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM'),
      keyword: keyword,
      type: dayOrMonth
    });
    setSelectDate(dayjs(date))
  }

  // 导出数据
  const handleDownLoadClick = () => {
    if (tableSelectRows && tableSelectRows.length > 0) {
      let data = tableSelectRows.map((item) => {
        return {
          计划编号: item.identificationNum,
          用户编号: item.userId,
          ['计划电量(MWh)']: item.scheduledElectricity,
          ['实际电量(MWh)']: item.actualAdjustedElectricity,
          ['结算电量(MW)']: item.settlementElectricity,
          ['偏差考核电量(MW)']: item.deviationSettlementElectricity,
          ['平均结算电价(元/MWh)']: item.averageSettlementElectricity,
          ['结算费用(万元)']: item.settlementFee,
          ['分成比例%']: item.splitRatio,
          ['分成收益(万元)']: item.sharedProfits,
          ['考核费用(万元)']: item.assessmentFees,
          ['分摊比例%']: item.apportionmentRatio,
          ['分摊费用(万元)']: item.apportionedCosts,
          流程: item.isConfirm === Number(1) ? '已确认' : '未确认',
        };
      });
      exportExcel(data, `市场${dayOrMonth === 'day' ? '日' : '月'}清算结果`);
    } else {
      messageApi.warning('请选择数据后进行操作');
    }
  };

  // 监听是日、月清算
  useEffect(() => {
    (tableRef.current as any)?.searchByParams({
      date: dayjs(new Date()).format(dayOrMonth === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM'),
      keyword: keyword,
      type: dayOrMonth
    });
  }, [dayOrMonth])

  // 市场清算结果数据
  useEffect(() => {
    fetchSettlementResult({
      date: dayjs(selectDate).format('YYYY-MM-DD'),
      type: dayOrMonth
    })
  }, [selectDate, dayOrMonth])


  return <div className={styles.settlementPage}>
    <div className={styles.settlementPageHead}>
      <Space>
        <SegmentedTheme
          options={[{ label: '日清算', value: 'day' }, { label: '月清算', value: 'month' }]}
          getSelectedValue={(value) => setDayOrMonth(value as 'day' | 'month')}
        />
        <DatePicker
          picker={dayOrMonth === 'day' ? 'date' : 'month'}
          defaultValue={dayjs(dayjs(new Date()).format('YYYY-MM-DD'), "YYYY-MM-DD")}
          onChange={datePlckerChange}
          value={selectDate}
        />
      </Space>
    </div>
    <div className={styles.settlementPageMain}>
      <div className={styles.mainHead}>
        <span className={styles.mainHeadTitle}>{`${dayjs(selectDate).format(dayOrMonth === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM')} 市场${dayOrMonth === 'day' ? '日' : '月'}`}清算结果</span>
        <Space>
          <Button icon={<UploadOutlined />} onClick={() => handleDownLoadClick()}>导出</Button>
          <Button icon={<LoginOutlined />} onClick={() => messageApi.success('推送成功')}>推送</Button>
        </Space>
      </div>
      <div className={styles.cardList}>
        {
          settlementResultData?.map((item: any) => {
            return <div className={styles.cardListItem} key={item.id}>
              <div className={styles.listItemIcon}>
                {item.icon}
              </div>
              <div className={styles.listItemContent}>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.value}>{item.value}</span>
                <span className={styles.label} style={{ fontSize: 14 }}>{item.unit}</span>
              </div>
            </div>
          })
        }
      </div>
      <div className={styles.settlementTable}>
        <div className={styles.tableSearch}>
          <Space>
            <Input onChange={(value) => setKeyword(value.target.value)} value={keyword} placeholder='请输入查询内容' style={{ width: 200 }} />
            <Button icon={<ReloadOutlined />} onClick={resetTable}>重置</Button>
            <Button icon={<SearchOutlined />} onClick={searchTable}>查询</Button>
          </Space>
        </div>
        <GeneralTable
          url="/sysApi/demand/response/settlementManagement/list"
          ref={tableRef}
          columns={settlementTableColumns}
          rowKey="identificationNum"
          type="checkbox"
          size="middle"
          bordered={true}
          getCheckData={(data) => setTableSelectRows(data)}
          requestType="get"
          scroll={{
            y: window.innerHeight - 640
          }}
          filterParams={{
            date: dayjs(new Date()).format('YYYY-MM-DD'),
            keyword: '',
            type: 'day'
          }}
        />
      </div>
    </div>
    <Modal
      title="市场日清算详情"
      open={visibile}
      width="70%"
      centered
      footer={null}
      destroyOnClose
      onCancel={() => {
        setVisibile(false)
        setModalChartOrTable('line')
      }}
    >
      <div className={styles.modalMain} style={{ height: window.innerHeight - 300 }}>
        <div className={styles.cardList}>
          {
            modalCardData?.map((item: any) => {
              return <div className={styles.cardListItem} key={item.id}>
                <div className={styles.listItemIcon}>
                  {item.icon}
                </div>
                <div className={styles.listItemContent}>
                  <span className={styles.label}>{item.label}</span>
                  <span className={styles.value}>{item.value}</span>
                  <span className={styles.label} style={{ fontSize: 14 }}>{item.unit}</span>
                </div>
              </div>
            })
          }
        </div>
        <div className={styles.modalCardTitle}>0210327004-市场日清算结果走势</div>
        <div className={styles.modalChange}>
          <SegmentedTheme
            defaultValue="line"
            options={[
              { label: '曲线', value: 'line', icon: <LineChartOutlined /> },
              { label: '表格', value: 'table', icon: <InsertRowAboveOutlined /> },
            ]}
            getSelectedValue={(value: any) => setModalChartOrTable(value)}
          />
        </div>
        <div className={styles.modalChartOrTable} style={{ height: window.innerHeight - 510 }}>
          {
            modalChartOrTable === 'line' ? <CustomCharts
              options={settlementChartOptions(modalDetailData)}
              loading={false}
              height={window.innerHeight - 510}
              width={window.innerWidth * 0.7 - 60}
            /> :
              <GeneralTable
                dataSource={electricityTableData(modalDetailData)}
                rowKey="id"
                size="middle"
                hideSelect
                bordered={true}
                columns={electricityTableColumns}
                scroll={{ y: window.innerHeight - 560 }}
                hasPage={false}
              />
          }

        </div>
      </div>
    </Modal>
    {contextHolder}
  </div>
};
export default SettlementManage;
