import ContainerPage from '@/components/container-page';
import CustomCard from '@/components/custom-card';
import CustomCharts from '@/components/custom-charts';
import CustomDatePicker from '@/components/custom-datePicker';
import { getCarbonTrend, getMonitorCenterData } from '@/services/carbon-monitor';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import SelectForm from '../select-form';
import styles from './index.less';
import { monitorOptions } from './utils';

const CarbonMonitor = () => {
  // 分类类型
  const [type, setType] = useState<number>(0);
  // 企业code
  const [substationCode, setSubstationCode] = useState<string>('');
  // 行业code
  const [industryCode, setIndustryCode] = useState<string>('');
  // 碳排放监测 日期组件
  const [date, setDate] = useState<string>('');
  // 日期类型
  const [unit, setUnit] = useState<string>('');

  // head部分数据
  const { data: monitorCenterData, run: fetchMonitorCenterData } = useRequest(
    getMonitorCenterData,
    {
      manual: true,
    },
  );

  // 碳排放监测柱状图
  const {
    data: trendData,
    run: fetchTrend,
    loading: trendDataLoading,
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
        params.industryCode = industryCode;
        break;
    }
    return params;
  };

  // 碳排放检测
  useEffect(() => {
    if (date && unit) {
      fetchTrend({ ...handleParams(), date, unit });
    }
  }, [date, unit]);

  // 分类改变，重新请求
  useEffect(() => {
    // 行业和企业未选择返回
    if (type === 1 && !substationCode) return;
    if (type === 2 && !industryCode) return;
    // 请求
    fetchMonitorCenterData(handleParams());
    if (date && unit) fetchTrend({ ...handleParams(), date, unit });
  }, [type, industryCode, substationCode]);

  return (
    <ContainerPage paddingTop={0}>
      <div className={styles.monitorPage}>
        <div className={styles.formWrap}>
          <SelectForm
            setType={setType}
            setIndustryCode={setIndustryCode}
            setSubstationCode={setSubstationCode}
          />
        </div>
        <div className={styles.head}>
          <CustomCard>
            <div className={styles.carbon}>
              <div className={styles.carbonItem}>
                <div className={styles.itemIcon}>
                  <i className="iconfont">&#xe656;</i>
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
                  <i className="iconfont">&#xe655;</i>
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
                  <i className="iconfont">&#xe657;</i>
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
                <CustomDatePicker datePickerType="" setDate={setDate} setUnit={setUnit} />
              </div>
              <div className={styles.chartDom}>
                <CustomCharts
                  options={monitorOptions(
                    dataFilter(trendData),
                    ['year', 'month', 'day'][date?.split('-').length - 1],
                  )}
                  loading={trendDataLoading}
                />
              </div>
            </div>
          </CustomCard>
        </div>
      </div>
    </ContainerPage>
  );
};
export default CarbonMonitor;
