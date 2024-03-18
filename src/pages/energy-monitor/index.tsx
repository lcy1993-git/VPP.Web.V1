import ContainerPage from '@/components/container-page'
import CustomCard from '@/components/custom-card'
import CustomCharts from '@/components/custom-charts'
import { ConfigProvider, DatePicker, Form, Segmented, Select, Space, Table } from 'antd'
import { useRef } from 'react'
import CustomProgress from './custom-progress'
import styles from './index.less'
import { energyDetail, energyStructureOptions, loadDetail } from './utils'
import ReactECharts from 'echarts-for-react';


const EnergyMonitor = () => {

  // 表格外层容器，用于设置表格滚动高度
  const tableWrapRef = useRef(null);

  const dataSource = [
    {
      key: Math.random(),
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: Math.random(),
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
      ellipsis: true
    },
  ];


  return <ContainerPage>
    <div className={styles.monitorPage}>
      <div className={styles.pageLeft}>
        <CustomCard
          style={{ borderLeft: 'none', borderRight: 'none' }}
        >
          <div className={styles.pageLeftSide}>
            <div className={styles.title}>
              企业排名
            </div>
            <div className={styles.content}>
              <div className={styles.search}>
                <Space>
                  <Segmented
                    options={['年', '月', '日']}
                  />
                  <DatePicker />
                </Space>
              </div>
              <div className={styles.table} ref={tableWrapRef}>
                <Table
                  size="middle"
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                />
              </div>
            </div>
          </div>
        </CustomCard>
      </div>
      <div className={styles.pageRight}>
        <CustomCard
          style={{ borderLeft: 'none', borderRight: 'none' }}
        >
          <div className={styles.content}>
            <div className={styles.contentTitle}>
              <span className={styles.name}>名称：</span>
              <Select
                placeholder="请选择区域"
                allowClear
                style={{ width: 260 }}
              />
            </div>
            <div className={styles.contentMain}>
              <div className={styles.mainBody}>
                <div className={styles.mainBodyLeft}>
                  <div className={styles.areaHead}>
                    <div className={styles.areaHeadTitle}>能耗总览</div>
                  </div>
                  <div className={`${styles.areaBody} ${styles.overview}`} style={{}}>
                    <CustomProgress
                      width={300}
                      height={20}
                      progress={0.3}
                      color={['#5A49FF', '#A49BFF']}
                      title='实时负荷'
                      value='3693.85kw'
                    />
                    <CustomProgress
                      width={300}
                      height={20}
                      progress={0.1}
                      color={['#5A49FF', '#A49BFF']}
                      title='日用电量'
                      value='3693.85kw'
                    />
                    <CustomProgress
                      width={300}
                      height={20}
                      progress={0.5}
                      color={['#5A49FF', '#A49BFF']}
                      title='月用电量'
                      value='3693.85kw'
                    />
                    <CustomProgress
                      width={300}
                      height={20}
                      progress={0.8}
                      color={['#5A49FF', '#A49BFF']}
                      title='年用电量'
                      value='3693.85kw'
                    />
                  </div>
                </div>
                <div className={styles.mainBodyRight}>
                  <div className={styles.areaHead}>
                    <div className={styles.areaHeadTitle}>用能详情</div>
                    <Space>
                      <Segmented
                        options={['年', '月', '日']}
                      />
                      <DatePicker />
                    </Space>
                  </div>
                  <div className={styles.areaBody}>
                    <CustomCharts
                      options={energyDetail()}
                      loading={false}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.mainBody}>
                <div className={styles.mainBodyLeft}>
                  <div className={styles.areaHead}>
                    <div className={styles.areaHeadTitle}>能源结构</div>
                    <Space>
                      <Segmented
                        options={['年', '月', '日']}
                      />
                      <DatePicker />
                    </Space>
                  </div>
                  <div className={styles.areaBody}>
                    <div className={styles.structure}>
                      <div className={styles.structureHead}>
                        <div className={styles.listTtem}>
                          <div className={styles.itemHead}>
                            <p>3693.85</p>
                            <p>kWh</p>
                          </div>
                          <div className={styles.itemTitle}>总用电量</div>
                        </div>
                        <div className={styles.listTtem}>
                          <div className={styles.itemHead}>
                            <p>3693.85</p>
                            <p>kWh</p>
                          </div>
                          <div className={styles.itemTitle}>传统能源用电量</div>
                        </div>
                        <div className={styles.listTtem}>
                          <div className={styles.itemHead}>
                            <p>3693.85</p>
                            <p>kWh</p>
                          </div>
                          <div className={styles.itemTitle}>清洁能源用电量</div>
                        </div>
                      </div>
                      <div className={styles.structureChart}>
                        <ReactECharts
                          option={energyStructureOptions()}
                          notMerge={true}
                          style={{ height: '100%', width: '100%' }}
                          lazyUpdate={false}
                          theme={'theme_name'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.mainBodyRight}>
                  <div className={styles.areaHead}>
                    <div className={styles.areaHeadTitle}>负荷详情</div>
                    <DatePicker />
                  </div>
                  <div className={styles.areaBody}>
                    <CustomCharts
                      options={loadDetail()}
                      loading={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CustomCard>
      </div>
    </div>
  </ContainerPage>
}
export default EnergyMonitor
