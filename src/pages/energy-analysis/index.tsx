import ContainerPage from '@/components/container-page';
import CustomCard from '@/components/custom-card';
import CustomCharts from '@/components/custom-charts';
import CustomDatePicker from '@/components/custom-datePicker';
import {
  getEnergyRanking,
  getIndustryList,
  getSubstationList,
  getTrendAnalysis,
  getTrendConsumption,
} from '@/services/energy-analysis';
import { currentDay } from '@/utils/common';
import { useRequest } from '@umijs/max';
import { Col, Form, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { energyRankOptions, powerIndexOptions, powerTrendOptions } from './utils';

const EnergyAnalysis = () => {
  // 搜素表单实例
  const [searchForm] = Form.useForm();
  // 选择区域类型
  const type = Form.useWatch('type', searchForm);
  const substationCode = Form.useWatch('substationCode', searchForm);
  const industry = Form.useWatch('industry', searchForm);
  // 日期类型
  const [unit, setUnit] = useState<string>('day');
  // 日期
  const [date, setDate] = useState<string>(currentDay);
  // 能源结构排行
  const [energyRanking, setEnergyRanking] = useState<any>([]);
  // 用电量趋势分析
  const [trendAnalysis, setTrendAnalysis] = useState<any>();
  // 企业用电指数分析
  const [trendConsumption, setTrendConsumption] = useState<any>();

  // 企业数据
  const { data: substationList } = useRequest(getSubstationList, {
    manual: false,
  });

  // 行业数据
  const { data: industryList } = useRequest(getIndustryList, {
    manual: false,
  });

  // 能源结构排行
  const {
    run: fetchEnergyRanking,
    loading: energyRankingLoading,
    cancel: cancelEnergyRanking,
  } = useRequest(getEnergyRanking, {
    manual: true,
    onSuccess: (res) => setEnergyRanking(res),
  });

  // 用电量趋势分析
  const {
    run: fetchTrendAnalysis,
    loading: trendAnalysisLoading,
    cancel: cancelTrendAnalysis,
  } = useRequest(getTrendAnalysis, {
    manual: true,
    onSuccess: (res) => setTrendAnalysis(res),
  });

  // 企业用电指数分析
  const {
    run: fetchTrendConsumption,
    loading: trendConsumptionLoading,
    cancel: cancelTrendConsumption,
  } = useRequest(getTrendConsumption, {
    manual: true,
    onSuccess: (res) => setTrendConsumption(res),
  });

  // 请求数据
  useEffect(() => {
    if (type !== undefined && unit !== undefined && date !== undefined) {
      // 取消未完成的接口请求
      cancelEnergyRanking();
      cancelTrendAnalysis();
      cancelTrendConsumption();
      // 数据置空
      setEnergyRanking([]);
      setTrendAnalysis(null);
      setTrendConsumption(null);
      // 行业和企业未选择返回
      if (type === 1 && !substationCode) return;
      if (type === 2 && !industry) return;
      let params: any = { date, type, unit };
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
      fetchEnergyRanking(params);
      fetchTrendAnalysis(params);
      fetchTrendConsumption(params);
    }
  }, [type, unit, date, substationCode, industry]);

  return (
    <ContainerPage>
      <CustomCard>
        <div className={styles.analysis}>
          <div className={styles.header}>
            <div className={styles.title}>能耗分析</div>
            <Form form={searchForm}>
              <Row style={{ width: '100%', paddingLeft: '20px', paddingRight: '30px' }}>
                <Col span={12} style={{ display: 'flex' }}>
                  <Form.Item
                    label="名称："
                    name="type"
                    initialValue={0}
                    rules={[{ required: true, message: '请选择名称' }]}
                  >
                    <Select
                      placeholder="请选择名称"
                      style={{ width: 260, marginRight: '15px' }}
                      allowClear={false}
                      options={[
                        { label: '龙泉驿全区', value: 0 },
                        { label: '企业', value: 1 },
                        { label: '行业', value: 2 },
                      ]}
                    />
                  </Form.Item>
                  {type === 1 && (
                    <Form.Item
                      label="企业名称"
                      name="substationCode"
                      rules={[{ required: true, message: '请选择企业' }]}
                    >
                      <Select
                        placeholder="请选择企业"
                        allowClear={false}
                        options={substationList}
                        style={{ width: 260 }}
                        fieldNames={{ label: 'name', value: 'substationCode' }}
                      />
                    </Form.Item>
                  )}
                  {type === 2 && (
                    <Form.Item
                      label="行业名称"
                      name="industry"
                      rules={[{ required: true, message: '请选择行业' }]}
                    >
                      <Select
                        placeholder="请选择行业"
                        allowClear={false}
                        options={industryList}
                        style={{ width: 260 }}
                        fieldNames={{ label: 'name', value: 'id' }}
                      />
                    </Form.Item>
                  )}
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Form.Item>
                    <CustomDatePicker datePickerType="" setDate={setDate} setUnit={setUnit} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={styles.container}>
            <div className={styles.containerTop}>
              <div className={styles.structure}>
                <div className={styles.moduleTitle}>能源结构排行</div>
                <div className={styles.chart} style={{ paddingLeft: 20 }}>
                  <CustomCharts
                    options={energyRankOptions(energyRanking)}
                    loading={energyRankingLoading}
                  />
                </div>
              </div>
              <div className={styles.trend}>
                <div className={styles.moduleTitle}>用电量趋势分析</div>
                <div className={styles.chart}>
                  <div className={styles.chartLegend}>
                    <p>
                      <i className="iconfont"></i>
                      <span className={styles.label}>总用电量:</span>
                      <span className={styles.value}>
                        {trendAnalysis?.totalEnergyElectricity || '-'}kW
                      </span>
                    </p>
                    <p>
                      <i className="iconfont"></i>
                      <span className={styles.label}>传统能源用电量:</span>
                      <span className={styles.value}>
                        {trendAnalysis?.conventionalEnergyElectricity || '-'}kW
                      </span>
                    </p>
                    <p>
                      <i className="iconfont"></i>
                      <span className={styles.label}>清洁能源用电量:</span>
                      <span className={styles.value}>
                        {trendAnalysis?.cleanEnergyElectricity || '-'}kW
                      </span>
                    </p>
                  </div>
                  <div className={styles.chartMain}>
                    <CustomCharts
                      options={powerTrendOptions(trendAnalysis, unit)}
                      loading={trendAnalysisLoading}
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
                    <b className="iconfont">&#xe64b;</b>
                    <span className={styles.label}>当前用电增长指数:</span>
                    <span className={styles.value} style={{ color: '#39FFC5' }}>
                      {trendConsumption?.growthIndex || '-'}
                    </span>
                  </p>
                  <p>
                    <b className="iconfont">&#xe64b;</b>
                    <span className={styles.label}>当前用电活跃指数:</span>
                    <span className={styles.value} style={{ color: '#0090FF' }}>
                      {trendConsumption?.activityIndex || '-'}
                    </span>
                  </p>
                  <p>
                    <b className="iconfont">&#xe64b;</b>
                    <span className={styles.label}>当前用电预期指数:</span>
                    <span className={styles.value} style={{ color: '#FB8D44' }}>
                      {trendConsumption?.expectationIndex || '-'}
                    </span>
                  </p>
                  <p>
                    <b className="iconfont">&#xe64b;</b>
                    <span className={styles.label}>当前综合用电指数:</span>
                    <span className={styles.value} style={{ color: '#FFEA00' }}>
                      {trendConsumption?.electricityIndex || '-'}
                    </span>
                  </p>
                </div>
                <div className={styles.chartMain}>
                  <CustomCharts
                    options={powerIndexOptions(trendConsumption, unit)}
                    loading={trendConsumptionLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomCard>
    </ContainerPage>
  );
};
export default EnergyAnalysis;
