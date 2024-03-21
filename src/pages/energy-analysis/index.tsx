import ContainerPage from '@/components/container-page'
import ContentComponent from '@/components/content-component'
import CustomCard from '@/components/custom-card'
import CustomCharts from '@/components/custom-charts'
import CustomItem from '@/components/custom-Item'
import { DatePicker, Segmented, Select, Space } from 'antd'
import { divide } from 'lodash'
import styles from './index.less'
import { energyRankOptions, powerIndexOptions, powerTrendOptions } from './utils'


const EnergyAnalysis = () => {
  return <ContainerPage>
    <CustomCard>
      <div className={styles.analysis}>
        <div className={styles.header}>
          <div className={styles.title}>能耗分析</div>
          <div className={styles.search}>
            <div className={styles.searchSelect}>
              <span className={styles.selectLabel}>名称：</span>
              <Select
                defaultValue="lucy"
                style={{ width: 300 }}
                size="large"
                options={[{ value: 'lucy', label: 'Lucy' }]}
              />
            </div>
            <div className={styles.searchDate}>
              <Space>
                <Segmented
                  options={['年', '月', '日']}
                />
                <DatePicker />
              </Space>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.containerTop}>
            <div className={styles.structure}>
              <div className={styles.moduleTitle}>能源结构排行</div>
              <div className={styles.chart} style={{paddingLeft: 20}}>
                <CustomCharts
                  options={energyRankOptions()}
                  loading={false}
                />
              </div>
            </div>
            <div className={styles.trend}>
              <div className={styles.moduleTitle}>用电量趋势分析</div>
              <div className={styles.chart}>
                <div className={styles.chartLegend}>
                  <p>
                    <i className='iconfont'></i>
                    <span className={styles.label}>总用电量:</span>
                    <span className={styles.value}>3698.37kW</span>
                  </p>
                  <p>
                    <i className='iconfont'></i>
                    <span className={styles.label}>传统能源用电量:</span>
                    <span className={styles.value}>3698.37kW</span>
                  </p>
                  <p>
                    <i className='iconfont'></i>
                    <span className={styles.label}>清洁能源用电量:</span>
                    <span className={styles.value}>3698.37kW</span>
                  </p>
                </div>
                <div className={styles.chartMain}>
                  <CustomCharts
                    options={powerTrendOptions()}
                    loading={false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.containerBottom}>
            <div className={styles.moduleTitle}>企业用电指数分析</div>
            <div className={styles.chart}>
            <div className={styles.chartLegend}>
                  <p>
                    <b className='iconfont'>&#xe64b;</b>
                    <span className={styles.label}>当前用电增长指数:</span>
                    <span className={styles.value} style={{color: '#39FFC5'}}>3698.37kW</span>
                  </p>
                  <p>
                    <b className='iconfont'>&#xe64b;</b>
                    <span className={styles.label}>当前用电活跃指数:</span>
                    <span className={styles.value}  style={{color: '#0090FF'}}>3698.37kW</span>
                  </p>
                  <p>
                    <b className='iconfont'>&#xe64b;</b>
                    <span className={styles.label}>当前用电预期指数:</span>
                    <span className={styles.value}  style={{color: '#FB8D44'}}>3698.37kW</span>
                  </p>
                  <p>
                    <b className='iconfont'>&#xe64b;</b>
                    <span className={styles.label}>当前综合用电指数:</span>
                    <span className={styles.value}  style={{color: '#FFEA00'}}>3698.37kW</span>
                  </p>
                </div>
                <div className={styles.chartMain}>
                  <CustomCharts
                    options={powerIndexOptions()}
                    loading={false}
                  />
                </div>
            </div>
          </div>
        </div>
      </div>
    </CustomCard>
  </ContainerPage>
}
export default EnergyAnalysis
