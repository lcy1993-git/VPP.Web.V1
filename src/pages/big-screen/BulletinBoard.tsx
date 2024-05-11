import title from '@/assets/image/big-screen/title.png';
import CustomCharts from '@/components/custom-charts';
import SegmentedTheme from '@/components/segmented-theme';
import {
  getBoardCenterData,
  getBoardSubstationData,
  getCleanEnergyManageData,
  getElasticEnergyManage,
  getEnergyManageFeature,
  getEnergyTrend,
  getEnterpriseEnergyMonitor,
  getStatusQuo,
} from '@/services/big-screen';
import { history } from '@umijs/max';
import { useRequest } from 'ahooks';
import { ConfigProvider, DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import { useEffect, useRef, useState } from 'react';
import BlockWrap from './components/BlockWrap';
import CurrentTime from './components/CurrentTime';
import ScrollBoardItem from './components/ScrollBoardItem';
import ThreeMap from './components/ThreeMap';
import styles from './index.less';
import {
  INTERVALTIME,
  datePickerEnum,
  elasticEnergyColumns,
  monitorColumns,
  statusQuoChartOptions,
} from './utils';
dayjs.locale('zh-cn');

/** 能源综合看板 */
const BulletinBoard = () => {
  // 区域用能概览页面状态
  const [currentView, setCurrentView] = useState<'现状' | '趋势' | '特征'>('现状');
  // 区域用能 年月日 切换
  const [fullAndPutDate, setFullAndPutDate] = useState<string>('年');
  // 区域用能 日期组件切换
  const [pickerType, setPickerType] = useState<'year' | 'month' | 'date'>('year');
  // 区域用能 日期
  const [dateValue, setDateValue] = useState<any>(dayjs(dayjs(`${new Date()}`), 'YYYY-MM-DD'));
  // 计算表格高度
  const [tableHeight, setTableHeight] = useState<number>(0);
  const [type, setType] = useState<number>(0);
  // 企业用能监测表格
  const tableWrapRef = useRef(null);

  // 页面数据处理
  const pageDataHandle = (data: any) => {
    if (data?.code === 200) {
      return data.data;
    }
    return null;
  };

  // 区域用能概览 --- 现状
  const { data: statusQuoData } = useRequest(getStatusQuo, {
    pollingInterval: INTERVALTIME,
    pollingErrorRetryCount: 3,
  });

  // 区域用能概览 --- 趋势
  const { data: energyTrendData, run: fetchEnergyTrend } = useRequest(getEnergyTrend, {
    manual: true,
    pollingInterval: INTERVALTIME,
    pollingErrorRetryCount: 3,
  });

  // 区域用能概览 --- 特征
  const { data: energyFeatureData, run: fetchEnergyManageFeature } = useRequest(
    getEnergyManageFeature,
    {
      manual: true,
      pollingInterval: INTERVALTIME,
      pollingErrorRetryCount: 3,
    },
  );

  // 企业用能监测
  const { data: energyMonitorData } = useRequest(getEnterpriseEnergyMonitor, {
    pollingInterval: INTERVALTIME,
    pollingErrorRetryCount: 3,
  });

  // 弹性负荷管理
  const { data: elasticEnergyData } = useRequest(getElasticEnergyManage, {
    pollingInterval: INTERVALTIME,
    pollingErrorRetryCount: 3,
  });

  // 大屏中间数据
  const { data: boardCenterData } = useRequest(getBoardCenterData, {
    pollingInterval: INTERVALTIME,
    pollingErrorRetryCount: 3,
  });

  // 清洁能源管理
  const { data: cleanEnergyManageData } = useRequest(getCleanEnergyManageData, {
    pollingInterval: INTERVALTIME,
    pollingErrorRetryCount: 3,
  });

  // 热力图数据
  const { data: substationData, run: fetchHeatDatas } = useRequest(getBoardSubstationData, {
    manual: true,
    pollingInterval: INTERVALTIME,
    pollingErrorRetryCount: 3,
  });

  /** 区域用能概览 日期改变  */
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
    fetchEnergyTrend({
      date: fetchDate,
      unit: pickerType === 'date' ? 'day' : pickerType,
    });
  };

  // 区域用能概览 图表 options数据处理
  const getEnergyOverviewOptions = () => {
    switch (currentView) {
      case '现状':
        return { currentView, data: pageDataHandle(statusQuoData) };
      case '趋势':
        return { currentView, data: pageDataHandle(energyTrendData), type: fullAndPutDate };
      case '特征':
        return { currentView, data: pageDataHandle(energyFeatureData), type: fullAndPutDate };
    }
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
    if (currentView === '趋势') {
      fetchEnergyTrend({
        date: date,
        unit: unit === 'date' ? 'day' : unit,
      });
    } else if (currentView === '特征') {
      fetchEnergyManageFeature({
        date: date,
        unit: unit === 'date' ? 'day' : unit,
      });
    }
  }, [fullAndPutDate, currentView]);

  useEffect(() => {
    fetchHeatDatas({ type });
  }, [type]); // 监听 type 的变化

  // 处理屏幕尺寸变化
  const handleScreenAuto = () => {
    const designDraftWidth = 1915;
    const designDraftHeight = 1030;
    const scaleWidth = document.documentElement.clientWidth / designDraftWidth;
    const scaleHeight = document.documentElement.clientHeight / designDraftHeight;

    (document.querySelector('#root') as any).style.width = '1920px';
    (document.querySelector('#root') as any).style.height = '1030px';
    (
      document.querySelector('#root') as any
    ).style.transform = `scale(${scaleWidth}, ${scaleHeight}) translate(-50%, -50%) translate3d(0, 0, 0)`;
    if (tableWrapRef?.current) {
      // 获取表格高度
      const tableOffsetHeight = (tableWrapRef.current! as any).offsetHeight;
      setTableHeight(tableOffsetHeight);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // 初始化自适应
    handleScreenAuto();
    // 定义事件处理函数
    const handleResize = () => handleScreenAuto();
    // 添加事件监听器
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize); // 移除事件监听器
    };
  }, []);
  
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0084ff', // Seed Token，影响范围大
          borderRadius: 2,
          colorText: '#fff',
          colorBorder: '#023999',
          colorPrimaryHover: '#10a2fa',
          colorTextPlaceholder: '#0143cc',
          controlOutline: 'transparent', // 输入组件 激活边框颜色
          colorBgBase: '#032566', // 所有组件的基础背景色
          colorBgContainer: 'transparent',
          colorError: '#ff0000',
          colorBgElevated: ' #001d51', // 模态框、悬浮框背景色
          controlItemBgActiveHover: 'rgba(0, 84, 255, 0.2)', // 控制组件项在鼠标悬浮且激活状态下的背景颜色
          controlItemBgHover: 'rgba(0, 84, 255, 0.2)', // 下拉框，手鼠hover背景色
          controlItemBgActive: 'rgba(0, 84, 255, 0.3)', // 控制组件项在激活状态下的背景颜色
        },
        components: {
          DatePicker: {
            activeBorderColor: '#023999',
            hoverBorderColor: '#023999',
          },
        },
      }}
    >
      <div className={styles.featurePage}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <CurrentTime />
          </div>
          <div className={styles.middle}>
            <img src={title} alt="title" />
          </div>
          <div className={styles.headerRight}>
            <div className={styles.menuButton} onClick={() => history.push('/energy-monitor')}>
              菜单
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.contentSide}>
            <div className={`${styles.sideItem} ${styles.marginB10}`}>
              <BlockWrap
                title="区域用能概览"
                isPaddingTop={false}
                headerRightRender={() => {
                  return (
                    <SegmentedTheme
                      size="small"
                      options={['现状', '趋势', '特征']}
                      getSelectedValue={(value: any) => {
                        setFullAndPutDate('年');
                        setPickerType('year');
                        setCurrentView(value);
                      }}
                    />
                  );
                }}
              >
                <div className={styles.energyOverview}>
                  {currentView === '现状' ? null : (
                    <div className={styles.energyOverviewSearch}>
                      <Space align="center">
                        <DatePicker
                          size="small"
                          picker={pickerType}
                          onChange={datePickerChange}
                          value={dateValue}
                        />
                        <SegmentedTheme
                          size="small"
                          defaultValue="年"
                          getSelectedValue={(value: any) => setFullAndPutDate(value)}
                          options={
                            currentView === '特征'
                              ? ['月', '年']
                              : datePickerEnum.map((item: any) => item.name)
                          }
                        />
                      </Space>
                    </div>
                  )}
                  <div className={styles.energyOverviewChart}>
                    <CustomCharts
                      options={statusQuoChartOptions(getEnergyOverviewOptions())}
                      loading={false}
                    />
                  </div>
                </div>
              </BlockWrap>
            </div>
            <div className={styles.sideItem}>
              <BlockWrap title="企业用能监测">
                <div style={{ width: '100%', height: '100%' }} ref={tableWrapRef}>
                  <ScrollBoardItem
                    dataList={pageDataHandle(energyMonitorData)}
                    height={tableHeight}
                    visibleRows={5}
                    columns={monitorColumns}
                  />
                </div>
              </BlockWrap>
            </div>
          </div>
          {/* center */}
          <div className={styles.contentMiddle}>
            <div className={`${styles.middleTop} ${styles.boardModdle}`}>
              <dl>
                <dt>
                  {pageDataHandle(boardCenterData)?.enterpriseNum}/
                  {pageDataHandle(boardCenterData)?.predictEnterpriseNum}
                </dt>
                <dd>接入企业/预计接入企业(个)</dd>
              </dl>
              <dl>
                <dt>{pageDataHandle(boardCenterData)?.traditionalTotal}</dt>
                <dd>传统能源总用电量(万kWh)</dd>
              </dl>
              <dl>
                <dt>{pageDataHandle(boardCenterData)?.cleanTotal}</dt>
                <dd>清洁能源总用电量(万kWh)</dd>
              </dl>
              <dl>
                <dt>{pageDataHandle(boardCenterData)?.carbonSaveTotal}</dt>
                <dd>
                  <p>累计计节碳量</p>
                  <p>(t)</p>
                </dd>
              </dl>
            </div>
            <div className={styles.three}>
              <ThreeMap isHeatmap={true} data={substationData?.data} />
            </div>
          </div>
          {/* right */}
          <div className={styles.contentSide}>
            <div className={`${styles.sideItem} ${styles.marginB10}`}>
              <BlockWrap title="清洁能源管理" isPaddingTop={false}>
                <div className={styles.clear}>
                  <div className={styles.clearItem}>
                    <div className={styles.clearItemTotal}>
                      {pageDataHandle(cleanEnergyManageData)?.essNum}
                    </div>
                    <div className={styles.clearItemUl}>
                      <div className={styles.clearItemLi}>
                        <span className={styles.name}>总容量</span>
                        <span className={styles.value}>
                          {pageDataHandle(cleanEnergyManageData)?.essCapacity}
                        </span>
                        <span className={styles.unit}>MWh</span>
                      </div>
                      <div className={styles.clearItemLi}>
                        <span className={styles.name}>实时充电功率</span>
                        <span className={styles.value}>
                          {pageDataHandle(cleanEnergyManageData)?.essPower}
                        </span>
                        <span className={styles.unit}>MW</span>
                      </div>
                      <div className={styles.clearItemLi}>
                        <span className={styles.name}>剩余可充放电量</span>
                        <span className={styles.value}>
                          {pageDataHandle(cleanEnergyManageData)?.essDischargeQuantity}
                        </span>
                        <span className={styles.unit}>MWh</span>
                      </div>
                      <div className={styles.clearItemLi}>
                        <span className={styles.name}>接入完成率</span>
                        <span className={styles.value}>
                          {pageDataHandle(cleanEnergyManageData)?.essCompleteRate}
                        </span>
                        <span className={styles.unit}>%</span>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.clearItem} ${styles.clearMiddleItem}`}>
                    <div className={styles.clearItemTotal}>
                      {pageDataHandle(cleanEnergyManageData)?.solarNum}
                    </div>
                    <div className={styles.clearItemUl}>
                      <div className={styles.clearItemLi}>
                        <span className={styles.name}>总容量</span>
                        <span className={styles.value}>
                          {pageDataHandle(cleanEnergyManageData)?.solarCapacity}
                        </span>
                        <span className={styles.unit}>MWh</span>
                      </div>
                      <div className={styles.clearItemLi}>
                        <span className={styles.name}>实时发电功率</span>
                        <span className={styles.value}>
                          {pageDataHandle(cleanEnergyManageData)?.solarPower}
                        </span>
                        <span className={styles.unit}>MW</span>
                      </div>
                      <div className={styles.clearItemLi}>
                        <span className={styles.name}>累计发电量</span>
                        <span className={styles.value}>
                          {pageDataHandle(cleanEnergyManageData)?.solarGenerated}
                        </span>
                        <span className={styles.unit}>MWh</span>
                      </div>
                      <div className={styles.clearItemLi}>
                        <span className={styles.name}>接入完成率</span>
                        <span className={styles.value}>
                          {pageDataHandle(cleanEnergyManageData)?.solarCompleteRate}
                        </span>
                        <span className={styles.unit}>%</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.clearItem}>
                    <div className={styles.clearItemTotal}>
                      {pageDataHandle(cleanEnergyManageData)?.chargePileNum}
                    </div>
                    <div className={styles.clearItemUl}>
                      <div className={styles.clearItemLi}>
                        <span className={styles.name}>总容量</span>
                        <span className={styles.value}>
                          {pageDataHandle(cleanEnergyManageData)?.chargePileCapacity}
                        </span>
                        <span className={styles.unit}>MWh</span>
                      </div>
                      <div className={styles.clearItemLi}>
                        <span className={styles.name}>实时负荷功率</span>
                        <span className={styles.value}>
                          {pageDataHandle(cleanEnergyManageData)?.chargePilePower}
                        </span>
                        <span className={styles.unit}>MW</span>
                      </div>
                      <div className={styles.clearItemLi}>
                        <span className={styles.name}>接入完成率</span>
                        <span className={styles.value}>
                          {pageDataHandle(cleanEnergyManageData)?.chargePileCompleteRate}
                        </span>
                        <span className={styles.unit}>%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </BlockWrap>
            </div>
            <div className={styles.sideItem}>
              <BlockWrap title="弹性负荷管理">
                <div style={{ width: '100%', height: '100%' }}>
                  <ScrollBoardItem
                    dataList={pageDataHandle(elasticEnergyData)}
                    height={tableHeight}
                    visibleRows={5}
                    columns={elasticEnergyColumns}
                  />
                </div>
              </BlockWrap>
              {/* right */}
              <div className={styles.contentSide}>
                <div className={`${styles.sideItem} ${styles.marginB10}`}>
                  <BlockWrap title="清洁能源管理">
                    <div>清洁能源管理</div>
                  </BlockWrap>
                </div>
                <div className={styles.sideItem}>
                  <BlockWrap title="弹性负荷管理">
                    <div style={{ width: '100%', height: '100%' }}>
                      <ScrollBoardItem
                        dataList={pageDataHandle(elasticEnergyData)}
                        height={tableHeight}
                        visibleRows={5}
                        columns={elasticEnergyColumns}
                      />
                    </div>
                  </BlockWrap>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={`${styles.button} ${styles.buttonLeft}`} onClick={() => setType(0)}>
            负荷热力
          </div>
          <div className={`${styles.button} ${styles.buttonRight}`} onClick={() => setType(1)}>
            电量热力
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};
export default BulletinBoard;
