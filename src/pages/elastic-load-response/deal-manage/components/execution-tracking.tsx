import CustomCharts from '@/components/custom-charts';
import GeneralTable from '@/components/general-table';
import SegmentedTheme from '@/components/segmented-theme';
import { DownOutlined, InsertRowAboveOutlined, LineChartOutlined, UpOutlined } from '@ant-design/icons';
import { Collapse, Table } from 'antd';
import { useRef, useState } from 'react';
import styles from '../index.less'
import { companyChartOptions, companyTableColumns, dayPlanChartOptions, dayPlanTableColumns, sourceTableColumns } from '../utils';

const ExecutionTracking = () => {

  // 日邀约计划table实例
  const dayPlanTableRef = useRef(null);
  // 资源商信息table实例
  const sourceTableRef = useRef(null);
  // 公司资源实时运行Tbale
  const companyTableRef = useRef(null);
  // 模态框表格和图表进行切换
  const [dayPlanModalSegmend, setDayPlanModalSegmend] = useState<'line' | 'table'>('line');

  const [companyModalSegmend, setCompanyModalSegmend] = useState<'line' | 'table'>('line');

  const items = [
    {
      key: '1',
      label: '20240509001',
      children: <ul className={styles.planChildren}>
        <li><span>计划开始时间：</span><span>2024-05-09</span></li>
        <li className={styles.borderBottom}><span>计划结束时间：</span><span>2024-05-09</span></li>
        <li><span>目前计划里程：</span><span>0.7MWh</span></li>
        <li><span>实时完成里程：</span><span>0.7MWh</span></li>
        <li><span>参与用户：</span><span>2家</span></li>
        <li><span>功率偏差：</span><span>1.43%</span></li>
        <li><span>预计收益：</span><span>0.869万元</span></li>
      </ul>,
    },
    {
      key: '2',
      label: '20240509002',
      children: <ul className={styles.planChildren}>
        <li><span>计划开始时间：</span><span>2024-05-09</span></li>
        <li className={styles.borderBottom}><span>计划结束时间：</span><span>2024-05-09</span></li>
        <li><span>目前计划里程：</span><span>0.7MWh</span></li>
        <li><span>实时完成里程：</span><span>0.7MWh</span></li>
        <li><span>参与用户：</span><span>2家</span></li>
        <li><span>功率偏差：</span><span>1.43%</span></li>
        <li><span>预计收益：</span><span>0.869万元</span></li>
      </ul>,
    },
    {
      key: '3',
      label: '20240509003',
      children: <ul className={styles.planChildren}>
        <li><span>计划开始时间：</span><span>2024-05-09</span></li>
        <li className={styles.borderBottom}><span>计划结束时间：</span><span>2024-05-09</span></li>
        <li><span>目前计划里程：</span><span>0.7MWh</span></li>
        <li><span>实时完成里程：</span><span>0.7MWh</span></li>
        <li><span>参与用户：</span><span>2家</span></li>
        <li><span>功率偏差：</span><span>1.43%</span></li>
        <li><span>预计收益：</span><span>0.869万元</span></li>
      </ul>,
    },
  ];

  return <div className={styles.tractingPage}>
    <div className={styles.tractingMenu}>
      <div className={styles.tractingMenuSide}>
        <div className={styles.menuBg}>
          日前邀约计划
        </div>
        <div className={styles.menuMain} style={{ height: (window.innerHeight - 280) / 2 }}>
          <Collapse
            bordered={false}
            expandIconPosition="end"
            accordion
            items={items}
            expandIcon={(e) => e.isActive ? <UpOutlined /> : <DownOutlined />}
          />
        </div>
      </div>
      <div className={styles.tractingMenuSide}>
        <div className={styles.menuBg}>
          实时调度计划
        </div>
        <div className={styles.menuMain} style={{ height: (window.innerHeight - 280) / 2 }}>
          <Collapse
            bordered={false}
            expandIconPosition="end"
            accordion
            items={items}
            expandIcon={(e) => e.isActive ? <UpOutlined /> : <DownOutlined />}
          />
        </div>
      </div>
    </div>
    <div className={styles.tractingMain} style={{ height: window.innerHeight - 198 }}>
      <div className={styles.tractingWrap}>
        <div className={styles.wrapHead}>
          <div className={styles.wrapHeadSegmented}></div>
          <div className={styles.wrapHeadTitle}>实时运行功率曲线-日前邀约计划</div>
          <div className={styles.wrapHeadSegmented}>
            <SegmentedTheme
              defaultValue="line"
              options={[
                { label: '曲线', value: 'line', icon: <LineChartOutlined /> },
                { label: '表格', value: 'table', icon: <InsertRowAboveOutlined /> },
              ]}
              getSelectedValue={(value: any) => setDayPlanModalSegmend(value)}
            />
          </div>
        </div>
        <div className={styles.modalChartOrTable} style={{ height: 368 }}>
          {
            dayPlanModalSegmend === 'line' ? <CustomCharts
              options={dayPlanChartOptions()}
              loading={false}
              height={360}
              width={window.innerWidth - 574}
            /> :
              <GeneralTable
                url="/sysApi/deviceInfo/getDeviceInfoPageList"
                ref={dayPlanTableRef}
                columns={dayPlanTableColumns}
                rowKey="substationCode"
                size="middle"
                hideSelect={true}
                bordered={true}
                getCheckData={(data) => { }}
                requestType="post"
                scroll={{
                  y: 260
                }}
                filterParams={{ userId: localStorage.getItem('userId') }}
              />
          }
        </div>
      </div>
      <div className={styles.tractingWrap} style={{ margin: '20px 0' }}>
        <div className={styles.sourceInfoTitle}>邀约资源商信息</div>
        <GeneralTable
          url="/sysApi/deviceInfo/getDeviceInfoPageList"
          ref={sourceTableRef}
          columns={sourceTableColumns}
          rowKey="substationCode"
          type="checkbox"
          size="middle"
          bordered={true}
          getCheckData={(data) => { }}
          requestType="post"
          scroll={{
            y: 260
          }}
          filterParams={{ userId: localStorage.getItem('userId') }}
        />
      </div>
      <div className={styles.tractingWrap}>
        <div className={styles.wrapHead}>
          <div className={styles.wrapHeadSegmented}></div>
          <div className={styles.wrapHeadTitle}>资源实时运行功率曲线-xx公司</div>
          <div className={styles.wrapHeadSegmented}>
            <SegmentedTheme
              defaultValue="line"
              options={[
                { label: '曲线', value: 'line', icon: <LineChartOutlined /> },
                { label: '表格', value: 'table', icon: <InsertRowAboveOutlined /> },
              ]}
              getSelectedValue={(value: any) => setCompanyModalSegmend(value)}
            />
          </div>
        </div>
        <div className={styles.modalChartOrTable} style={{ height: 368 }}>
          {
            companyModalSegmend === 'line' ? <CustomCharts
              options={companyChartOptions()}
              loading={false}
              height={360}
              width={window.innerWidth - 574}
            /> :
              <GeneralTable
                url="/sysApi/deviceInfo/getDeviceInfoPageList"
                ref={companyTableRef}
                columns={companyTableColumns}
                rowKey="substationCode"
                type="checkbox"
                size="middle"
                bordered={true}
                getCheckData={(data) => { }}
                requestType="post"
                scroll={{
                  y: 260
                }}
                filterParams={{ userId: localStorage.getItem('userId') }}
              />
          }
        </div>
      </div>
    </div>
  </div>
};
export default ExecutionTracking;

