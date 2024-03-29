import CustomCard from '@/components/custom-card';
import CustomCharts from '@/components/custom-charts';
import CustomDatePicker from '@/components/custom-datePicker';
import Empty from '@/components/empty';
import {
  getCarbonOverviewHead,
  getCarbonTargetProgress,
  getCarbonTrend,
} from '@/services/carbon-overview';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import 'echarts-liquidfill';
import { useEffect, useState } from 'react';
import SelectForm from '../select-form';
import HeatMap from './HeatMap';
import styles from './index.less';
import { carbonTrendsOption, waterWaveOption } from './utils';
dayjs.locale('zh-cn');

const CarbonOverview = () => {
  // 分类类型
  const [type, setType] = useState<number>(0);
  // 企业code
  const [substationCode, setSubstationCode] = useState<string>('');
  // 行业code
  const [industry, setIndustry] = useState<string>('');
  // 能源碳排放趋势 选中的当前日期
  const [date, setDate] = useState<string>('');
  // 日期类型
  const [unit, setUnit] = useState<string>('');

  // 碳排放总览head部分数据
  const { data: carbonOverviewHead, run: fetchCarbonOverviewHead } = useRequest(
    getCarbonOverviewHead,
    {
      manual: true,
    },
  );

  // 碳排放总览进度指标
  const { data: carbonProgress, run: fetchCarbonTargetProgress } = useRequest(
    getCarbonTargetProgress,
    {
      manual: true,
    },
  );

  // 能源碳排放趋势
  const {
    data: carbonTrend,
    run: fetchCarbonTrend,
    loading: carbonTrendLoading,
  } = useRequest(getCarbonTrend, {
    manual: true,
  });

  // 数据过滤
  const dataFilter = (data: any) => {
    if (data?.code === 200) {
      return data.data;
    }
    return null;
  };

  // 请求字段
  const handleParams = () => {
    let params: any = { type };
    // 不同区域类型请求参数不同
    switch (type) {
      case 0:
        break;
      case 1:
        params.substationCode = substationCode;
        break;
      case 2:
        params.industry = industry;
        break;
    }
    return params;
  };

  // 区域用能概览请求数据
  useEffect(() => {
    if (date && unit) {
      fetchCarbonTrend({ ...handleParams(), date, unit });
    }
  }, [date, unit]);

  // 分类改变，重新请求
  useEffect(() => {
    // 行业和企业未选择返回
    if (type === 1 && !substationCode) return;
    if (type === 2 && !industry) return;
    // 请求
    fetchCarbonOverviewHead(handleParams());
    fetchCarbonTargetProgress(handleParams());
    if (date && unit) fetchCarbonTrend({ ...handleParams(), date, unit });
  }, [type, industry, substationCode]);

  // 能源碳排放趋势 右侧组件
  const carbonFooterRender = () => {
    return <CustomDatePicker datePickerType="" setDate={setDate} setUnit={setUnit} />;
  };

  return (
    <div className={styles.carbon}>
      <div className={styles.carbonSearch}>
        <SelectForm
          setType={setType}
          setIndustryCode={setIndustry}
          setSubstationCode={setSubstationCode}
        />
      </div>
      {/* 页面头部区域 */}
      <div className={styles.carbonHead}>
        <CustomCard>
          <div className={styles.headSide}>
            <div className={styles.headSideItem}>
              <div className={styles.itemIcon}>
                <i className="iconfont">&#xe656;</i>
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
                <i className="iconfont">&#xe655;</i>
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
                <i className="iconfont">&#xe657;</i>
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
                {/* <dl>
                  <dt>{dataFilter(carbonOverviewHead)?.yearHB}</dt>
                  <dd>年环比(%)</dd>
                </dl> */}
              </div>
            </div>
          </div>
        </CustomCard>
      </div>
      {/* 页面中间区域 */}
      <div className={styles.carbonMiddle}>
        <div className={styles.contentLeft}>
          <CustomCard title="碳排放指标进度">
            {dataFilter(carbonProgress) ? (
              <div className={styles.waterWrap}>
                <div className={styles.charts}>
                  <ReactECharts
                    option={waterWaveOption(dataFilter(carbonProgress))}
                    style={{ width: '100%', height: '100%' }}
                    echarts={echarts}
                  />
                </div>
                <div className={styles.chartsDesc}>
                  <p>
                    <span>总额度：</span>
                    <i>{dataFilter(carbonProgress)?.total}</i>
                    <span>吨</span>
                  </p>
                  <p>
                    <span>已用额度：</span>
                    <i>{dataFilter(carbonProgress)?.used}</i>
                    <span>吨</span>
                  </p>
                  <p>
                    <span>剩余额度：</span>
                    <i>{dataFilter(carbonProgress)?.unused}</i>
                    <span>吨</span>
                  </p>
                </div>
              </div>
            ) : (
              <Empty />
            )}
          </CustomCard>
        </div>
        <div className={styles.contentRight}>
          <CustomCard>
            <HeatMap 
            type={type}
            substationCode={substationCode}
            industryCode={industryCode}
            />
          </CustomCard>
        </div>
      </div>
      {/* 页面底部内容 */}
      <div className={styles.carbonFooter}>
        <CustomCard title="能源碳排放趋势" renderRight={carbonFooterRender}>
          <CustomCharts
            options={carbonTrendsOption(dataFilter(carbonTrend), unit)}
            loading={carbonTrendLoading}
          />
        </CustomCard>
      </div>
    </div>
  );
};
export default CarbonOverview;
