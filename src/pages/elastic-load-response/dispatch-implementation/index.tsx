import ContainerPage from "@/components/container-page";
import ContentPage from "@/components/content-page";
import CustomCard from "@/components/custom-card";
import CustomCharts from "@/components/custom-charts";
import SegmentedTheme from "@/components/segmented-theme";
import { InsertRowAboveOutlined, LineChartOutlined } from "@ant-design/icons";
import {  DatePicker,Select, Table } from "antd";
import styles from './index.less';
import { planChartOptions, statusticsChart } from "./utils";


// 调度实施
const DispatchImplementation = () => {


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
    },
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


  return <ContentPage>
    <div className={styles.historyPlan}>
      <CustomCard title="历史计划统计">
        <div className={styles.wrapper}>
          <div className={styles.statistics}>
            <div className={styles.statisticsLabel}>
              <span className={styles.labelValue}>48</span>
              <span className={styles.labelText}>总受邀</span>
              <span className={styles.labelText}>（次）</span>
            </div>
            <CustomCharts options={statusticsChart()} loading={false} />
          </div>
          <div className={styles.cardList}>
            <div className={styles.cardListItem}>
              <div className={styles.listItemIcon}>
                <i className="iconfont">&#xe676;</i>
              </div>
              <div className={styles.listItemContent}>
                <span className={styles.label}>累计调节电流（MWh)</span>
                <span className={styles.value}>21.825</span>
              </div>
            </div>
            <div className={styles.cardListItem}>
              <div className={styles.listItemIcon}>
                <i className="iconfont">&#xe667;</i>
              </div>
              <div className={styles.listItemContent}>
                <span className={styles.label}>累计不贴金额（万元)</span>
                <span className={styles.value}>7.31</span>
              </div>
            </div>
            <div className={styles.cardListItem}>
              <div className={styles.listItemIcon}>
                <i className="iconfont">&#xe66f;</i>
              </div>
              <div className={styles.listItemContent}>
                <span className={styles.label}>日前响应交易里程（MWh)</span>
                <span className={styles.column}>
                  <span className={styles.label}>削峰：</span>
                  <span className={styles.value}>17.48</span>
                </span>
                <span className={styles.column}>
                  <span className={styles.label}>填谷：</span>
                  <span className={styles.value}>22.345</span>
                </span>
              </div>
            </div>
            <div className={styles.cardListItem}>
              <div className={styles.listItemIcon}>
                <i className="iconfont">&#xe66f;</i>
              </div>
              <div className={styles.listItemContent}>
                <span className={styles.label}>实时响应交易里程（MWh)</span>
                <span className={styles.column}>
                  <span className={styles.label}>削峰：</span>
                  <span className={styles.value}>17.48</span>
                </span>
                <span className={styles.column}>
                  <span className={styles.label}>填谷：</span>
                  <span className={styles.value}>22.345</span>
                </span>
              </div>
            </div>
            <div className={styles.cardListItem}>
              <div className={styles.listItemIcon}>
                <i className="iconfont">&#xe66e;</i>
              </div>
              <div className={styles.listItemContent}>
                <span className={styles.label}>实时响应交易收益（万元)</span>
                <span className={styles.column}>
                  <span className={styles.label}>削峰：</span>
                  <span className={styles.value}>17.48</span>
                </span>
                <span className={styles.column}>
                  <span className={styles.label}>填谷：</span>
                  <span className={styles.value}>22.345</span>
                </span>
              </div>
            </div>
            <div className={styles.cardListItem}>
              <div className={styles.listItemIcon}>
                <i className="iconfont">&#xe66e;</i>
              </div>
              <div className={styles.listItemContent}>
                <span className={styles.label}>日前响应交易收益（万元)</span>
                <span className={styles.column}>
                  <span className={styles.label}>削峰：</span>
                  <span className={styles.value}>17.48</span>
                </span>
                <span className={styles.column}>
                  <span className={styles.label}>填谷：</span>
                  <span className={styles.value}>22.345</span>
                </span>
              </div>
            </div>

          </div>
        </div>
      </CustomCard>
    </div>

    <div className={styles.planList}>
      <CustomCard>
        <div className={styles.planDate}>
          <DatePicker />
        </div>
        <div className={styles.planContent}>
          <div className={styles.planContentWrap}>
            <div className={styles.planMenu}>
              <div className={styles.planMenuDay}>日前邀约计划</div>
              <div className={styles.planMenuDayList}>
                {
                  ['1', '2', '3'].map(item => {
                    return <p key={item}>112554655</p>
                  })
                }
              </div>
              <div className={`${styles.planMenuDay} ${styles.realtime}`}>实时调度计划</div>
              <div className={styles.planMenuDayList}>
                {
                  ['1', '2', '3'].map(item => {
                    return <p key={item}>112554655</p>
                  })
                }
              </div>
            </div>
            <div className={styles.planInfo}>
              <div className={styles.planInfoTitle}>
                计划信息：xxxxxxxxx
              </div>
              <div className={styles.planInfoBasic}>
                <p>计划开始时间：2024-05-09</p>
                <p>计划结束时间：2024-05-09</p>
                <p>目前计划里程：0.70MWh</p>
                <p>实际完成里程：0.70MWh</p>
                <p>参与有用户：2家</p>
                <p>功率偏差：+1.43%</p>
                <p>预计收益：0.869万元</p>
              </div>
              <div className={styles.planCharts}>
                <div className={styles.planChartsHead}>
                  <div className={styles.title}>执行情况</div>
                  <SegmentedTheme
                    defaultValue="line"
                    options={[
                      { label: '曲线', value: 'line', icon: <LineChartOutlined /> },
                      { label: '表格', value: 'table', icon: <InsertRowAboveOutlined /> },
                    ]}
                    getSelectedValue={(value: any) => {
                      console.log(value)
                    }}
                  />
                </div>
                <div className={styles.planCard}>
                  <div className={styles.cardItem}>
                    <div className={styles.cardIcon}>
                      <i className="iconfont">&#xe677;</i>
                    </div>
                    <div className={styles.cardContent}>
                      <span className={styles.label}>实时功率（MW）</span>
                      <span className={styles.value}>1006.56</span>
                    </div>
                  </div>
                  <div className={styles.cardItem}>
                    <div className={styles.cardIcon}>
                      <i className="iconfont">&#xe675;</i>
                    </div>
                    <div className={styles.cardContent}>
                      <span className={styles.label}>最大功率（MW）</span>
                      <span className={styles.value}>1006.56</span>
                    </div>
                  </div>
                  <div className={styles.cardItem}>
                    <div className={styles.cardIcon}>
                      <i className="iconfont">&#xe66a;</i>
                    </div>
                    <div className={styles.cardContent}>
                      <span className={styles.label}>最小功率（MW）</span>
                      <span className={styles.value}>1006.56</span>
                    </div>
                  </div>
                </div>
                <div className={styles.planChart}>
                  <CustomCharts
                    options={planChartOptions()}
                    loading={false}
                  />
                </div>
              </div>

              <div className={styles.planTable}>
                <div className={styles.planTableHead}>
                  <div className={styles.title}>告警信息</div>
                  <Select
                    defaultValue="全部"
                    style={{ width: 120 }}
                    options={[
                      { value: '全部', label: '全部' },
                    ]}
                  />
                </div>
                <div className={styles.planTableWrap}>
                  <Table bordered dataSource={dataSource} columns={columns} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomCard>
    </div>
  </ContentPage>
};
export default DispatchImplementation;
