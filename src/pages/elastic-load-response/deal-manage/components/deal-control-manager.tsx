import CustomCharts from '@/components/custom-charts';
import GeneralTable from '@/components/general-table';
import SegmentedTheme from '@/components/segmented-theme';
import { DownOutlined, InsertRowAboveOutlined, LineChartOutlined, ReloadOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Collapse, Input, Select, Space } from 'antd';
import { useRef, useState } from 'react';
import styles from '../index.less'
import { companyChartOptions, companyTableColumns, responseChartOptions, responseDetalTableColumns, responseTableColumns } from '../utils';

const DealControlManager = () => {

  // 邀约响应计划
  const [responseChartOrTable, setresponseChartOrTable] = useState<'line' | 'table'>('line');
  // 邀约响应计划表格实例
  const responseTableRef = useRef(null);

  const collapseItems = [
    {
      key: '1',
      label: '20240509001',
      children: <div>
        <ul className={styles.planChildren}>
          <li><span>计划开始时间：</span><span>2024-05-09</span></li>
          <li><span>计划结束时间：</span><span>2024-05-09</span></li>
          <li className={styles.borderBottom}><span>响应类型：</span><span>日前削峰</span></li>
        </ul>
        <div className={styles.cardListItem}>
          <div className={styles.listItemIcon}>
            <i className="iconfont">&#xe679;</i>
          </div>
          <div className={styles.listItemContent}>
            <span className={styles.label}>参与用户(家)</span>
            <span className={styles.value}>10</span>
          </div>
        </div>
        <div className={styles.cardListItem}>
          <div className={styles.listItemIcon}>
            <i className="iconfont">&#xe668;</i>
          </div>
          <div className={styles.listItemContent}>
            <span className={styles.label}>响应市场(h)</span>
            <span className={styles.value}>1006.56</span>
          </div>
        </div>
        <div className={styles.cardListItem}>
          <div className={styles.listItemIcon}>
            <i className="iconfont">&#xe66f;</i>
          </div>
          <div className={styles.listItemContent}>
            <span className={styles.label}>计算里程(MWh)</span>
            <span className={styles.value}>10</span>
          </div>
        </div>
      </div>,
    },
    {
      key: '2',
      label: '20240509002',
      children: <div>
        <ul className={styles.planChildren}>
          <li><span>计划开始时间：</span><span>2024-05-09</span></li>
          <li><span>计划结束时间：</span><span>2024-05-09</span></li>
          <li className={styles.borderBottom}><span>响应类型：</span><span>日前削峰</span></li>
        </ul>
        <div className={styles.cardListItem}>
          <div className={styles.listItemIcon}>
            <i className="iconfont">&#xe679;</i>
          </div>
          <div className={styles.listItemContent}>
            <span className={styles.label}>参与用户(家)</span>
            <span className={styles.value}>10</span>
          </div>
        </div>
        <div className={styles.cardListItem}>
          <div className={styles.listItemIcon}>
            <i className="iconfont">&#xe668;</i>
          </div>
          <div className={styles.listItemContent}>
            <span className={styles.label}>响应市场(h)</span>
            <span className={styles.value}>1006.56</span>
          </div>
        </div>
        <div className={styles.cardListItem}>
          <div className={styles.listItemIcon}>
            <i className="iconfont">&#xe66f;</i>
          </div>
          <div className={styles.listItemContent}>
            <span className={styles.label}>计算里程(MWh)</span>
            <span className={styles.value}>10</span>
          </div>
        </div>
      </div>,
    },
    {
      key: '3',
      label: '20240509003',
      children: <div>
        <ul className={styles.planChildren}>
          <li><span>计划开始时间：</span><span>2024-05-09</span></li>
          <li><span>计划结束时间：</span><span>2024-05-09</span></li>
          <li className={styles.borderBottom}><span>响应类型：</span><span>日前削峰</span></li>
        </ul>
        <div className={styles.cardListItem}>
          <div className={styles.listItemIcon}>
            <i className="iconfont">&#xe679;</i>
          </div>
          <div className={styles.listItemContent}>
            <span className={styles.label}>参与用户(家)</span>
            <span className={styles.value}>10</span>
          </div>
        </div>
        <div className={styles.cardListItem}>
          <div className={styles.listItemIcon}>
            <i className="iconfont">&#xe668;</i>
          </div>
          <div className={styles.listItemContent}>
            <span className={styles.label}>响应市场(h)</span>
            <span className={styles.value}>1006.56</span>
          </div>
        </div>
        <div className={styles.cardListItem}>
          <div className={styles.listItemIcon}>
            <i className="iconfont">&#xe66f;</i>
          </div>
          <div className={styles.listItemContent}>
            <span className={styles.label}>计算里程(MWh)</span>
            <span className={styles.value}>10</span>
          </div>
        </div>
      </div>,
    },
  ];

  return <div className={styles.controlPage}>
    <div className={styles.controlPageSelect}>
      <Select
        defaultValue="1"
        style={{ width: 200 }}
        options={[
          { value: '1', label: '日前邀约计划' },
          { value: '2', label: '实时调度计划' },
        ]}
      />
    </div>
    <div className={styles.controlPageMain}>
      <div className={styles.controlPageMainTop}>
        <div className={styles.controlMenu}>
          <Collapse
            bordered={false}
            expandIconPosition="end"
            accordion
            items={collapseItems}
            expandIcon={(e) => e.isActive ? <UpOutlined /> : <DownOutlined />}
          />
        </div>
        <div className={styles.controlSide}>
          <div className={styles.controlSideTitle}>
            <div className={styles.wrapHeadSegmented}></div>
            <div className={styles.wrapHeadTitle}>2024-05-09 邀约响应计划</div>
            <div className={styles.wrapHeadSegmented}>
              <SegmentedTheme
                defaultValue="line"
                options={[
                  { label: '曲线', value: 'line', icon: <LineChartOutlined /> },
                  { label: '表格', value: 'table', icon: <InsertRowAboveOutlined /> },
                ]}
                getSelectedValue={(value: any) => setresponseChartOrTable(value)}
              />
            </div>
          </div>
          <div className={styles.chartsOrTable}>
          {
            responseChartOrTable === 'line' ? <CustomCharts
              options={responseChartOptions()}
              loading={false}
              height={280}
              width={window.innerWidth - 574}
            /> :
              <GeneralTable
                url="/sysApi/deviceInfo/getDeviceInfoPageList"
                ref={responseTableRef}
                columns={responseTableColumns}
                rowKey="substationCode"
                hideSelect={true}
                size="middle"
                bordered={true}
                getCheckData={(data) => { }}
                requestType="post"
                scroll={{
                  y: 180
                }}
                filterParams={{ userId: localStorage.getItem('userId') }}
              />
          }
          </div>
        </div>
      </div>
      <div className={styles.controlPageMainBottom}>
        <div className={styles.tableTitle}>
          <div className={styles.title}>计划分解详情</div>
          <Space>
            <Input placeholder='请输入查询内容' style={{ width: 200 }} />
            <Button icon={<ReloadOutlined />}>重置</Button>
            <Button icon={<SearchOutlined />}>查询</Button>
          </Space>
        </div>
        <div className={styles.tableWrap}>
          <GeneralTable
            url="/sysApi/deviceInfo/getDeviceInfoPageList"
            ref={responseTableRef}
            columns={responseDetalTableColumns}
            rowKey="substationCode"
            hideSelect={true}
            size="middle"
            bordered={true}
            getCheckData={(data) => { }}
            requestType="post"
            scroll={{
              y: window.innerHeight - 720
            }}
            filterParams={{ userId: localStorage.getItem('userId') }}
          />
        </div>
      </div>
    </div>
  </div>
};
export default DealControlManager;
