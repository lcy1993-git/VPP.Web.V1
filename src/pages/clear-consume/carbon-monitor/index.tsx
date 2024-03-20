import ContainerPage from "@/components/container-page"
import CustomCard from "@/components/custom-card"
import CustomCharts from "@/components/custom-charts"
import SegmentDatepicker from "@/components/segment-datepicker"
import { getCarbonTrend, getMonitorCenterData } from "@/services/carbon-monitor"
import { useRequest } from "ahooks"
import { Form, Select } from "antd"
import { useEffect, useState } from "react"
import styles from './index.less'
import { monitorOptions } from "./utils"


const CarbonMonitor = () => {

  // 碳排放监测 日期组件
  const [selectDate, setSelectDate] = useState<string>('')

  // 碳排放总览head部分数据
  const { data: monitorCenterData } = useRequest(getMonitorCenterData);

  // 碳排放监测柱状图
  const { data: trendData, run: fetchTrend } = useRequest(getCarbonTrend, {
    manual: true
  });

    // 数据过滤
  const dataFilter = (data: any) => {
    if (data?.code === 200) {
      return data.data;
    }
    return null;
  }

  useEffect(() => {
    if (selectDate) {
      fetchTrend({
        date: selectDate,
        unit: ['year','month', 'day'][selectDate.split('-').length - 1]
      })
    }
  }, [selectDate])


  return <ContainerPage paddingTop={0}>
    <div className={styles.monitorPage}>
      <div className={styles.formWrap}>
        <Form
          style={{ maxWidth: 400 }}
        >
          <Form.Item
            label="分类"
            name="username"
          >
            <Select
              placeholder="请选择区域"
              allowClear
              style={{ width: 260 }}
            />
          </Form.Item>
        </Form>
      </div>
      <div className={styles.head}>
        <CustomCard>
          <div className={styles.carbon}>
            <div className={styles.carbonItem}>
              <div className={styles.itemIcon}>
                <i className='iconfont'>&#xe656;</i>
              </div>
              <div className={styles.itemValue}>
                <dl>
                  <dt>{dataFilter(monitorCenterData)?.dayCarbon}</dt>
                  <dd>日总碳排(t)</dd>
                </dl>
              </div>
            </div>
            <div className={styles.carbonItem}>
              <div className={styles.itemIcon}>
                <i className='iconfont'>&#xe655;</i>
              </div>
              <div className={styles.itemValue}>
                <dl>
                  <dt>{dataFilter(monitorCenterData)?.monthCarbon}</dt>
                  <dd>月总碳排(t)</dd>
                </dl>
              </div>
            </div>
            <div className={styles.carbonItem}>
              <div className={styles.itemIcon}>
                <i className='iconfont'>&#xe657;</i>
              </div>
              <div className={styles.itemValue}>
                <dl>
                  <dt>{dataFilter(monitorCenterData)?.yearCarbon}</dt>
                  <dd>年总碳排(t)</dd>
                </dl>
              </div>
            </div>
          </div>
        </CustomCard>
      </div>
      <div className={styles.main}>
        <CustomCard title="碳排放监测">
          <div className={styles.content}>
            <div className={styles.search}>
              <SegmentDatepicker
                setSelectDate={setSelectDate}
              />
            </div>
            <div className={styles.chartDom}>
              <CustomCharts
                options={monitorOptions(dataFilter(trendData), ['year','month', 'day'][selectDate?.split('-').length - 1])}
                loading={false}
              />
            </div>
          </div>
        </CustomCard>
      </div>
    </div>
  </ContainerPage>
}
export default CarbonMonitor
