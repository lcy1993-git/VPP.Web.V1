import CustomCharts from '@/components/custom-charts';
import GeneralTable from '@/components/general-table';
import SegmentedTheme from '@/components/segmented-theme';
import { InsertRowAboveOutlined, LineChartOutlined, LoginOutlined, ReloadOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Modal, Space, Table } from 'antd';
import { useRef, useState } from 'react';
import styles from '../index.less'
import { settlementChartOptions, settlementColumns } from '../utils';

const SettlementManage = () => {
  // 表格实例
  const tableRef = useRef(null);
  // 详情模态框状态
  const [visibile, setVisibile] = useState<boolean>(false)
  // 模态框表格和图表进行切换
  const [modalChartOrTable, setModalChartOrTable] = useState<'line' | 'table'>('line');
  // 清算结果数据
  const settlementInfo = [
    {
      label: '日清算电量',
      value: 21.825,
      unit: '（Mwh）',
      icon: <i className="iconfont">&#xe676;</i>,
      id: 1
    },
    {
      label: '日实际调节电量',
      value: 21.825,
      unit: '（Mwh）',
      icon: <i className="iconfont">&#xe678;</i>,
      id: 2
    },
    {
      label: '日清算费用',
      value: 21.825,
      unit: '（万元）',
      icon: <i className="iconfont">&#xe63d;</i>,
      id: 3
    },
    {
      label: '日考核费用',
      value: 21.825,
      unit: '（万元）',
      icon: <i className="iconfont">&#xe667;</i>,
      id: 4
    },
    {
      label: '用户收入',
      value: 21.825,
      unit: '（万元）',
      icon: <i className="iconfont">&#xe666;</i>,
      id: 5
    },
    {
      label: '运营商收入',
      value: 21.825,
      unit: '（万元）',
      icon: <i className="iconfont">&#xe665;</i>,
      id: 6
    }
  ]
  // 模态框日清算详情card
  const settlementDetalCard = [
    {
      label: '日清算电量',
      value: 21.825,
      unit: '（Mwh）',
      icon: <i className="iconfont">&#xe676;</i>,
      id: 1
    },
    {
      label: '调节收益',
      value: 21.825,
      unit: '（万元）',
      icon: <i className="iconfont">&#xe66e;</i>,
      id: 2
    },
    {
      label: '考核费用',
      value: 21.825,
      unit: '（万元）',
      icon: <i className="iconfont">&#xe667;</i>,
      id: 3
    },
  ]
  // 表格columns
  const settlementTableColumns = [
    ...settlementColumns,
    {
      title: '操作',
      dataIndex: 'index',
      align: 'center' as any,
      key: 'index',
      width: 80,
      render: () => {
        return <Button size="small" onClick={() => setVisibile(true)}>详情</Button>
      },
    }
  ]

  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    }
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  return <div className={styles.settlementPage}>
    <div className={styles.settlementPageHead}>
      <Space>
        <SegmentedTheme
          options={['日清算', '月清算']}
          getSelectedValue={(value) => { }}
        />
        <DatePicker />
      </Space>
    </div>
    <div className={styles.settlementPageMain}>
      <div className={styles.mainHead}>
        <span className={styles.mainHeadTitle}>2024-05-09 市场日清算结果</span>
        <Space>
          <Button icon={<UploadOutlined />}>导出</Button>
          <Button icon={<LoginOutlined />}>推送</Button>
        </Space>
      </div>
      <div className={styles.cardList}>
        {
          settlementInfo.map(item => {
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
            <Input placeholder='请输入查询内容' style={{ width: 200 }} />
            <Button icon={<ReloadOutlined />}>重置</Button>
            <Button icon={<SearchOutlined />}>查询</Button>
          </Space>
        </div>
        <GeneralTable
          url="/sysApi/deviceInfo/getDeviceInfoPageList"
          ref={tableRef}
          columns={settlementTableColumns}
          rowKey="deviceCode"
          type="checkbox"
          size="middle"
          bordered={true}
          getCheckData={(data) => { }}
          requestType="post"
          scroll={{
            y: window.innerHeight - 640
          }}
          filterParams={{ userId: localStorage.getItem('userId') }}
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
      onCancel={() => setVisibile(false)}
    >
      <div className={styles.modalMain} style={{ height: window.innerHeight - 300 }}>
        <div className={styles.cardList}>
          {
            settlementDetalCard.map(item => {
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
        <div className={styles.modalChartOrTable} style={{height: window.innerHeight - 510}}>
          {
            modalChartOrTable === 'line' ? <CustomCharts
            options={settlementChartOptions()}
            loading={false}
            height={window.innerHeight - 510}
            width={window.innerWidth * 0.7 - 60}
          /> :
          <Table dataSource={dataSource} columns={columns} scroll={{y: window.innerHeight - 610}}/>
          }

        </div>
      </div>
    </Modal>
  </div>
};
export default SettlementManage;
