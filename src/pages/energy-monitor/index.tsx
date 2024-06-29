import ContainerPage from '@/components/container-page';
import CustomCard from '@/components/custom-card';
import CustomCharts from '@/components/custom-charts';
import CustomDatePicker from '@/components/custom-datePicker';
import {
  getEnergyStructure,
  getLoadDetails,
  getMonitorDetails,
  getMonitorOverview,
  getRanking,
} from '@/services/energy-monitor';
import { currentDay } from '@/utils/common';
import { useRequest } from 'ahooks';
import { Table } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import ReactECharts from 'echarts-for-react';
import { useEffect, useRef, useState } from 'react';
import SelectForm from '../clear-consume/select-form/all-region-select';
import CustomProgress from './custom-progress';
import styles from './index.less';
import { columns, energyDetail, energyStructureOptions, loadDetail } from './utils';
dayjs.locale('zh-cn');

const EnergyMonitor = () => {
  // 表格外层容器，用于设置表格滚动高度
  const tableWrapRef = useRef(null);
  // 用能详情 日期
  const [energyDate, setEnergyDate] = useState<string>(currentDay);
  const [energyDateType, setEnergyDateType] = useState<string>('day');
  // 能源结构 日期组件
  const [structureDate, setStructureDate] = useState<string>(currentDay);
  const [structureDateType, setStructureDateType] = useState<string>('day');
  // 分类类型
  const [type, setType] = useState<number>(0);
  // 企业code
  const [substationCode, setSubstationCode] = useState<string>('');
  // 行业code
  const [industry, setIndustry] = useState<string>('');
  // 企业排名
  const [rankingDate, setRankingDate] = useState<string>(currentDay);
  const [rankingDateType, setRankingDateType] = useState<string>('day');
  // 负荷详情日期
  const [loadDate, setLoadDate] = useState<string>(currentDay);

  // 用能详情
  const { data: detailsData, run: fetchMonitorDetails } = useRequest(getMonitorDetails, {
    manual: true,
  });

  // 能耗总览
  const { data: overviewData, run: fetchMonitorOverview } = useRequest(getMonitorOverview, {
    manual: true,
  });

  // 能源结构
  const { data: structureData, run: fetchEnergyStructure } = useRequest(getEnergyStructure, {
    manual: true,
  });

  // 负荷详情
  const { data: loadDetailData, run: fetchLoadDetails } = useRequest(getLoadDetails, {
    manual: true,
  });

  // 企业排名
  const { data: rankingData, run: fetchRanking } = useRequest(getRanking, {
    manual: true,
  });

  // 数据过滤
  const dataFilter = (data: any) => {
    if (data?.code === 200) {
      return data.data;
    }
    return null;
  };

  // 处理请求参数
  const handleParams = (moduleType: 'overview' | 'structure' | 'energy' | 'load') => {
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
    // 不同模块类型请求参数不同
    switch (moduleType) {
      case 'overview':
        break;
      case 'structure':
        params.date = structureDate;
        params.unit = structureDateType;
        break;
      case 'energy':
        params.date = energyDate;
        params.unit = energyDateType;
        break;
      case 'load':
        params.date = loadDate;
        break;
    }
    return params;
  };

  // 处理progress数据和提示
  const handleProgress = (progressType: string, unit: string, data: any, totalData: any) => {
    const proportion: any = (data / totalData).toFixed(2);
    const hint =
      type === 0
        ? `区域总${progressType}为${data + unit}`
        : `区域总${progressType}为${totalData + unit}，街道/行业${progressType}为${
            data + unit
          }，占比为${proportion * 100}%`;
    return hint;
  };

  // 企业排名
  useEffect(() => {
    if (rankingDate && rankingDateType) {
      fetchRanking({
        date: rankingDate,
        unit: rankingDateType,
      });
    }
  }, [rankingDate, rankingDateType]);

  // 能源结构
  useEffect(() => {
    if (structureDate && structureDateType) {
      fetchEnergyStructure(handleParams('structure'));
    }
  }, [structureDate, structureDateType]);

  // 用能详情数据请求
  useEffect(() => {
    if (energyDate) {
      fetchMonitorDetails(handleParams('energy'));
    }
  }, [energyDate]);

  // 负荷详情
  useEffect(() => {
    if (loadDate) fetchLoadDetails(handleParams('load'));
  }, [loadDate]);

  // 选择类型切换
  useEffect(() => {
    if (type !== undefined && structureDate && structureDateType && loadDate) {
      // 行业和企业未选择返回
      if (type === 1 && !substationCode) return;
      if (type === 2 && !industry) return;
      fetchMonitorOverview(handleParams('overview'));
      fetchEnergyStructure(handleParams('structure'));
      fetchLoadDetails(handleParams('load'));
      fetchMonitorDetails(handleParams('energy'));
    }
  }, [type, industry, substationCode]);

  return (
    <ContainerPage>
      <div className={styles.monitorPage}>
        <div className={styles.pageLeft}>
          <CustomCard style={{ borderLeft: 'none', borderRight: 'none' }}>
            <div className={styles.pageLeftSide}>
              <div className={styles.title}>企业排名</div>
              <div className={styles.content}>
                <div className={styles.search}>
                  <CustomDatePicker
                    datePickerType=""
                    setDate={setRankingDate}
                    setUnit={setRankingDateType}
                  />
                </div>
                <div className={styles.table} ref={tableWrapRef}>
                  <Table
                    size="middle"
                    dataSource={dataFilter(rankingData) || []}
                    columns={columns(rankingDateType)}
                    pagination={false}
                    rowKey="companyName"
                  />
                </div>
              </div>
            </div>
          </CustomCard>
        </div>
        <div className={styles.pageRight}>
          <CustomCard style={{ borderLeft: 'none', borderRight: 'none' }}>
            <div className={styles.content}>
              <div className={styles.contentTitle}>
                <SelectForm
                  setType={setType}
                  setIndustryCode={setIndustry}
                  setSubstationCode={setSubstationCode}
                />
              </div>
              <div className={styles.contentMain}>
                <div className={styles.mainBody}>
                  <div className={styles.mainBodyLeft}>
                    <div className={styles.areaHead}>
                      <div className={styles.areaHeadTitle}>能耗总览</div>
                    </div>
                    <div className={`${styles.areaBody} ${styles.overview}`}>
                      <CustomProgress
                        width={300}
                        height={20}
                        progress={
                          dataFilter(overviewData)?.realPower / dataFilter(overviewData)?.totalPower
                        }
                        color={['#5A49FF', '#A49BFF']}
                        title="实时负荷"
                        value={`${dataFilter(overviewData)?.realPower || 0}kW`}
                        hintText={handleProgress(
                          '实时负荷',
                          'kW',
                          dataFilter(overviewData)?.realPower,
                          dataFilter(overviewData)?.totalPower,
                        )}
                      />
                      <CustomProgress
                        width={300}
                        height={20}
                        progress={
                          dataFilter(overviewData)?.dayElectricity /
                          dataFilter(overviewData)?.totalDayElectricity
                        }
                        color={['#5A49FF', '#A49BFF']}
                        title="日用电量"
                        value={`${dataFilter(overviewData)?.dayElectricity || 0}kWh`}
                        hintText={handleProgress(
                          '日用电量',
                          'kWh',
                          dataFilter(overviewData)?.dayElectricity,
                          dataFilter(overviewData)?.totalDayElectricity,
                        )}
                      />
                      <CustomProgress
                        width={300}
                        height={20}
                        progress={
                          dataFilter(overviewData)?.monthElectricity /
                          dataFilter(overviewData)?.totalMonthElectricity
                        }
                        color={['#5A49FF', '#A49BFF']}
                        title="月用电量"
                        value={`${dataFilter(overviewData)?.monthElectricity || 0}kWh`}
                        hintText={handleProgress(
                          '月用电量',
                          'kWh',
                          dataFilter(overviewData)?.monthElectricity,
                          dataFilter(overviewData)?.totalMonthElectricity,
                        )}
                      />
                      <CustomProgress
                        width={300}
                        height={20}
                        progress={
                          dataFilter(overviewData)?.yearElectricity /
                          dataFilter(overviewData)?.totalYearElectricity
                        }
                        color={['#5A49FF', '#A49BFF']}
                        title="年用电量"
                        value={`${dataFilter(overviewData)?.yearElectricity || 0}kWh`}
                        hintText={handleProgress(
                          '年用电量',
                          'kWh',
                          dataFilter(overviewData)?.yearElectricity,
                          dataFilter(overviewData)?.totalYearElectricity,
                        )}
                      />
                    </div>
                  </div>
                  <div className={styles.mainBodyRight}>
                    <div className={styles.areaHead}>
                      <div className={styles.areaHeadTitle}>用能详情</div>
                      <CustomDatePicker
                        datePickerType=""
                        setDate={setEnergyDate}
                        setUnit={setEnergyDateType}
                      />
                    </div>
                    <div className={styles.areaBody}>
                      <CustomCharts
                        options={energyDetail(dataFilter(detailsData), energyDate)}
                        loading={false}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.mainBody}>
                  <div className={styles.mainBodyLeft}>
                    <div className={styles.areaHead}>
                      <div className={styles.areaHeadTitle}>能源结构</div>
                      <CustomDatePicker
                        datePickerType=""
                        setDate={setStructureDate}
                        setUnit={setStructureDateType}
                      />
                    </div>
                    <div className={styles.areaBody}>
                      <div className={styles.structure}>
                        <div className={styles.structureHead}>
                          <div className={styles.listTtem}>
                            <div className={styles.itemHead}>
                              <p>{dataFilter(structureData)?.totalEnergyElectricity}</p>
                              <p>kWh</p>
                            </div>
                            <div className={styles.itemTitle}>总用电量</div>
                          </div>
                          <div className={styles.listTtem}>
                            <div className={styles.itemHead}>
                              <p>{dataFilter(structureData)?.conventionalEnergyElectricity}</p>
                              <p>kWh</p>
                            </div>
                            <div className={styles.itemTitle}>传统能源用电量</div>
                          </div>
                          <div className={styles.listTtem}>
                            <div className={styles.itemHead}>
                              <p>{dataFilter(structureData)?.cleanEnergyElectricity}</p>
                              <p>kWh</p>
                            </div>
                            <div className={styles.itemTitle}>清洁能源用电量</div>
                          </div>
                        </div>
                        <div className={styles.structureChart}>
                          <ReactECharts
                            option={energyStructureOptions(dataFilter(structureData))}
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
                      <CustomDatePicker datePickerType="day" setDate={setLoadDate} />
                    </div>
                    <div className={styles.areaBody}>
                      <CustomCharts
                        options={loadDetail(dataFilter(loadDetailData))}
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
  );
};
export default EnergyMonitor;
