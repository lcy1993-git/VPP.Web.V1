import ContentPage from '@/components/content-page'
import CustomCard from '@/components/custom-card'
import { DatePicker, Form, Select, Space } from 'antd'
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import 'echarts-liquidfill';
import styles from './index.less'
import { carbonTrendsOption, waterWaveOption } from './utils';
import SegmentedTheme from '@/components/segmented-theme';
import { datePickerEnum, disableDate } from '@/pages/big-screen/utils';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import CustomCharts from '@/components/custom-charts';
import { useRequest } from 'ahooks';
import { getCarbonOverviewHead, getCarbonTargetProgress, getCarbonTrend } from '@/services/carbon-overview';
import Empty from '@/components/empty';
import HeatMap from './HeatMap';
dayjs.locale('zh-cn');


const CarbonOvervirw = () => {
  // 区域用能 年月日 切换
  const [fullAndPutDate, setFullAndPutDate] = useState<string>('日');
  // 区域用能 日期组件切换
  const [pickerType, setPickerType] = useState<'year' | 'month' | 'date'>('date');
  // 区域用能 日期
  const [dateValue, setDateValue] = useState<any>(dayjs(dayjs(`${new Date()}`), 'YYYY-MM-DD'));

  // 碳排放总览head部分数据
  const { data: carbonOverviewHead } = useRequest(getCarbonOverviewHead);

  // 碳排放总览进度指标
  const { data: carbonProgress } = useRequest(getCarbonTargetProgress);

  const { data: carbonTrend, run: fecthCarbonTrend } = useRequest(getCarbonTrend, {
    manual: true
  });


  // 数据过滤
  const dataFilter = (data: any) => {
    if (data?.code === 200) {
      return data.data;
    }
    return null;
  }


  /** 能源碳排放趋势 右侧 日期改变  */
  const datePickerChange = (date: any) => {
    if (!date) {
      return;
    }

    let fetchDate: any;
    datePickerEnum.forEach((item: any) => {
      if (item.name === fullAndPutDate) {
        fetchDate = dayjs(date).format(item.dayType);
        setDateValue(dayjs(fetchDate, item.dayType));
      }
    });
    // 请求数据
    fecthCarbonTrend({
      date: fetchDate,
      unit: pickerType === 'date' ? 'day' : pickerType,
    });
  };

  // 区域用能概览请求数据
  useEffect(() => {
    let date: any = null;
    let unit: any = '';
    datePickerEnum.forEach((item: any) => {
      if (item.name === fullAndPutDate) {
        date = dayjs().format(item.dayType);
        setDateValue(dayjs(date, item.dayType));
        setPickerType(item.type);
        unit = item.type;
      }
    });
    fecthCarbonTrend({
      date: date,
      unit: unit === 'date' ? 'day' : unit,
    });
  }, [fullAndPutDate])

  // 能源碳排放趋势 右侧组件
  const carbonFooterRender = () => {
    return (
      <Space>
        <SegmentedTheme
          size="small"
          options={datePickerEnum.map((item: any) => item.name)}
          getSelectedValue={(value) => setFullAndPutDate(value)}
        />
        <DatePicker
          size="small"
          picker={pickerType}
          onChange={datePickerChange}
          value={dateValue}
          disabledDate={disableDate}
        />
      </Space>
    )
  }


  return <div className={styles.carbon}>
    <div className={styles.carbonSearch}>
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
    {/* 页面头部区域 */}
    <div className={styles.carbonHead}>
      <CustomCard>
        <div className={styles.headSide}>
          <div className={styles.headSideItem}>
            <div className={styles.itemIcon}>
              <i className='iconfont'>&#xe656;</i>
            </div>
            <div className={styles.itemValue}>
              <dl>
                <dt>{dataFilter(carbonOverviewHead)?.dayCarbon}</dt>
                <dd>日总碳排(t)</dd>
              </dl>
              <dl>
                <dt>{dataFilter(carbonOverviewHead)?.dayTB}</dt>
                <dd>日同比(%)</dd>
              </dl>
              <dl>
                <dt>{dataFilter(carbonOverviewHead)?.dayHB}</dt>
                <dd>日环比(%)</dd>
              </dl>
            </div>
          </div>
          <div className={`${styles.headSideItem} ${styles.marginLR30}`}>
            <div className={styles.itemIcon}>
              <i className='iconfont'>&#xe655;</i>
            </div>
            <div className={styles.itemValue}>
              <dl>
                <dt>{dataFilter(carbonOverviewHead)?.monthCarbon}</dt>
                <dd>月总碳排(t)</dd>
              </dl>
              <dl>
                <dt>{dataFilter(carbonOverviewHead)?.monthTB}</dt>
                <dd>月同比(%)</dd>
              </dl>
              <dl>
                <dt>{dataFilter(carbonOverviewHead)?.monthHB}</dt>
                <dd>月环比(%)</dd>
              </dl>
            </div>
          </div>
          <div className={styles.headSideItem}>
            <div className={styles.itemIcon}>
              <i className='iconfont'>&#xe657;</i>
            </div>
            <div className={styles.itemValue}>
              <dl>
                <dt>{dataFilter(carbonOverviewHead)?.yearCarbon}</dt>
                <dd>年总碳排(t)</dd>
              </dl>
              <dl>
                <dt>{dataFilter(carbonOverviewHead)?.yearTB}</dt>
                <dd>年同比(%)</dd>
              </dl>
              <dl>
                <dt>{dataFilter(carbonOverviewHead)?.yearHB}</dt>
                <dd>年环比(%)</dd>
              </dl>
            </div>
          </div>
        </div>
      </CustomCard>
    </div>
    {/* 页面中间区域 */}
    <div className={styles.carbonMiddle}>
      <div className={styles.contentLeft}>
        <CustomCard title="碳排放指标进度">
          {
            dataFilter(carbonProgress) ? <div className={styles.waterWrap}>
            <div className={styles.charts}>
              <ReactECharts
                option={waterWaveOption(dataFilter(carbonProgress))}
                style={{ width: '100%', height: '100%' }}
                echarts={echarts}
              />
            </div>
            <div className={styles.chartsDesc}>
              <p><span>总额度：</span><i>{dataFilter(carbonProgress)?.total}</i><span>吨</span></p>
              <p><span>已用额度：</span><i>{dataFilter(carbonProgress)?.used}</i><span>吨</span></p>
              <p><span>剩余额度：</span><i>{dataFilter(carbonProgress)?.unused}</i><span>吨</span></p>
            </div>
          </div> : <Empty />
          }

        </CustomCard>
      </div>
      <div className={styles.contentRight}>
        <CustomCard>
          <HeatMap />
        </CustomCard>
      </div>
    </div>
    {/* 页面底部内容 */}
    <div className={styles.carbonFooter}>
      <CustomCard
        title="能源碳排放趋势"
        renderRight={carbonFooterRender}
      >
        <CustomCharts
          options={carbonTrendsOption(dataFilter(carbonTrend), fullAndPutDate)}
          loading={false}
        />
      </CustomCard>
    </div>
  </div>
}
export default CarbonOvervirw
