import title from '@/assets/image/big-screen/title.png';
import CustomCharts from '@/components/custom-charts';
import SegmentedTheme from '@/components/segmented-theme';
import {
  getCenterData,
  getElasticEnergyOverView,
  getEnergyUse,
  getResponseStatistic,
  getSubstationData,
  getTypicalResponseAnalysis,
} from '@/services/big-screen';
import { history } from '@umijs/max';
import { useRequest } from 'ahooks';
import { ConfigProvider, DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import { useEffect, useRef, useState } from 'react';
import BlockWrap from './components/BlockWrap';
import CurrentTime from './components/CurrentTime';
import CustomCircle from './components/CustomCircle';
import ScrollBoardItem from './components/ScrollBoardItem';
import ThreeMap from './components/ThreeMap';
import styles from './index.less';
import {
  INTERVALTIME,
  datePickerEnum,
  disableDate,
  elasticityOverviewOptions,
  energyOverviewOptions,
  typicalResponse,
} from './utils';
dayjs.locale('zh-cn');

let refeshThreeMap: any[] = [];
/***
 *特色场景
 * */
const Feature = () => {
  // 响应统计 圆环最外层dom 用于获取圆环的宽度
  const canvasWrapRef = useRef(null);
  // 典型响应统计表格
  const tableWrapRef = useRef(null);
  // 响应统计 圆环宽度
  const [circleWidth, setCircleWidth] = useState<number>(0);
  // 计算表格高度
  const [blockWidthOrHeight, setBlockWidthOrHeight] = useState({ width: 0, height: 0 });
  // 区域用能 年月日 切换
  const [fullAndPutDate, setFullAndPutDate] = useState<string>('日');
  // 区域用能 日期组件切换
  const [pickerType, setPickerType] = useState<'year' | 'month' | 'date'>('date');
  // 区域用能 日期
  const [dateValue, setDateValue] = useState<any>(dayjs(dayjs(`${new Date()}`), 'YYYY-MM-DD'));
  // 典型响应分析查询类型，默认负荷
  const [typicalResponseAnalysisType, setTypicalResponseAnalysisType] = useState<string>('负荷');

  // 地图组件左侧dom
  const left_dom: any = useRef(null);
  // 地图组件上侧dom
  const top_dom: any = useRef(null);

  // 区域用能概览数据请求
  const { data: energyUseData, run: fetchEnergyUse } = useRequest(getEnergyUse, {
    manual: true,
    pollingInterval: INTERVALTIME,
    pollingErrorRetryCount: 3,
  });

  // 区域弹性负荷概览数据请求
  const { data: elasticEnergyOverViewData } = useRequest(getElasticEnergyOverView, {
    pollingInterval: INTERVALTIME,
    pollingErrorRetryCount: 3,
  });

  // 页面中间数据
  const { data: overviewData } = useRequest(getCenterData, {
    pollingInterval: INTERVALTIME,
    pollingErrorRetryCount: 3,
  });

  // 响应统计
  const { data: responseStatisticData } = useRequest(getResponseStatistic, {
    pollingInterval: INTERVALTIME,
    pollingErrorRetryCount: 3,
  });

  // 特色场景-大屏地图-电站数据
  const { data: substationData } = useRequest(getSubstationData, {
    pollingInterval: INTERVALTIME,
    pollingErrorRetryCount: 3,
  });

  // 典型响应分析
  const { run: fetchTypicalResponseAnalysis, data: typicalResponseData } = useRequest(
    getTypicalResponseAnalysis,
    {
      manual: true,
      pollingInterval: INTERVALTIME,
      pollingErrorRetryCount: 3,
    },
  );

  /** 区域用能 右侧 日期改变  */
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
    fetchEnergyUse({
      date: fetchDate,
      unit: pickerType === 'date' ? 'day' : pickerType,
    });
  };

  // 区域用能右侧render
  const energyOverviewRender = () => {
    return (
      <Space align="center">
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
    );
  };

  // 典型响应分析右侧render
  const resultAnalysisRender = () => {
    return (
      <SegmentedTheme
        size="small"
        options={['负荷', '时长']}
        getSelectedValue={(value) => setTypicalResponseAnalysisType(value)}
      />
    );
  };

  // 处理页面所有请求返回的数据
  const pageDataHandle = (data: any) => {
    if (data?.code === 200) {
      return data.data;
    }
    return null;
  };

  // 响应统计数据计算响应率
  const responseDataHandle = (data: any, isFun: boolean) => {
    if (!data) {
      return 0;
    }
    if (isFun) {
      // 计算企业响应率
      return Number(data.responseEnterpriseNum / data.totalEnterpriseNum).toFixed(2);
    } else {
      // 计算事件响应率
      return Number(data.responseEventNum / data.totalInvitedEventNum).toFixed(2);
    }
  };

  // 典型响应分析
  useEffect(() => {
    fetchTypicalResponseAnalysis(typicalResponseAnalysisType);
  }, [typicalResponseAnalysisType]);

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
    fetchEnergyUse({
      date: date,
      unit: unit === 'date' ? 'day' : unit,
    });
  }, [fullAndPutDate]);

  const handleScreenAuto = () => {
    const designDraftWidth = 1910;
    const designDraftHeight = 910;
    console.log(document.documentElement.offsetWidth, 123);
    console.log(document.documentElement.offsetHeight, 321);

    if (
      document.documentElement.offsetWidth < designDraftWidth ||
      document.documentElement.offsetHeight < designDraftHeight
    ) {
      const scaleWidth = document.documentElement.clientWidth / designDraftWidth;
      const scaleHeight = document.documentElement.clientHeight / designDraftHeight;
      (document.querySelector('#root') as any).setAttribute(
        'style',
        `
      width: 1920px;
      height: 919px;
      transform: scale(${scaleWidth}, ${scaleHeight}) translate(-50%, -50%) translate3d(0, 0, 0);
      position: absolute;
      top: 50%;
      left: 50%;
      transform-origin: 0 0;
      transition: 0.3s;
    `,
      );

      setCircleWidth(188);
      setBlockWidthOrHeight({
        width: 470,
        height: 313,
      });
      return;
    } else {
      (document.querySelector('#root') as any).removeAttribute('style');
    }
    refeshThreeMap = [];
    if (canvasWrapRef?.current) {
      const offsetWidth = (canvasWrapRef.current! as any).offsetWidth;
      const offsetHeight = (canvasWrapRef.current! as any).offsetHeight;
      const _width = offsetWidth > offsetHeight ? offsetHeight : offsetWidth;
      setCircleWidth(_width);

      // 获取表格高度
      const tableOffsetHeight = (tableWrapRef.current! as any).offsetHeight;
      const tableOffsetWidth = (tableWrapRef.current! as any).offsetWidth;
      setBlockWidthOrHeight({
        width: tableOffsetWidth,
        height: tableOffsetHeight,
      });
    }
  };

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
            <Space>
              <div
                className={styles.menuButton}
                onClick={() => history.push('/big-screen/bulletin-board')}
              >
                能源看板
              </div>
              <div className={styles.menuButton} onClick={() => history.push('/energy-monitor')}>
                首页
              </div>
            </Space>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.contentSide} ref={left_dom}>
            <div className={`${styles.sideItem} ${styles.marginB10}`}>
              <BlockWrap title="区域用能概览" headerRightRender={energyOverviewRender}>
                <CustomCharts
                  options={energyOverviewOptions(pageDataHandle(energyUseData), fullAndPutDate)}
                  loading={false}
                  width={blockWidthOrHeight.width}
                  height={blockWidthOrHeight.height}
                />
              </BlockWrap>
            </div>
            <div className={styles.sideItem}>
              <BlockWrap title="区域弹性负荷概览">
                <div className={styles.elasticityBody}>
                  <div className={styles.elasticityTitle}>
                    <div className={styles.titleIcon}></div>
                    <div className={styles.elasticityValue}>
                      <dl>
                        <dt>{pageDataHandle(elasticEnergyOverViewData)?.totalPower}</dt>
                        <dd>实时负荷(MW)</dd>
                      </dl>
                      <dl>
                        <dt>{pageDataHandle(elasticEnergyOverViewData)?.basePower}</dt>
                        <dd>基线负荷(MW)</dd>
                      </dl>
                    </div>
                  </div>
                  <div className={styles.elasticityChart}>
                    <CustomCharts
                      options={elasticityOverviewOptions(pageDataHandle(elasticEnergyOverViewData))}
                      loading={false}
                      width={blockWidthOrHeight.width}
                      height={blockWidthOrHeight.height - 65}
                    />
                  </div>
                </div>
              </BlockWrap>
            </div>
          </div>
          {/* center */}
          <div className={styles.contentMiddle}>
            <div className={styles.middleTop} ref={top_dom}>
              <div className={styles.totalCount}>
                <p className={styles.title}>总可调节负荷（MW）</p>
                <p className={styles.value}>
                  {pageDataHandle(overviewData)
                    ?.totalAdjustPower.toString()
                    .split('')
                    .map((item: string, index: any) => {
                      return Number(item) || Number(item) === 0 ? (
                        <span key={`${item}-totalAdjustPower-${index}`}>{item}</span>
                      ) : (
                        <i key={`${item}-${index}`}>{item}</i>
                      );
                    })}
                </p>
              </div>
              <div className={styles.totalCount}>
                <p className={styles.title}>实时可上调功率（MW）</p>
                <p className={styles.value}>
                  {pageDataHandle(overviewData)
                    ?.maxUpAdjustPower.toString()
                    .split('')
                    .map((item: string, index: any) => {
                      return Number(item) || Number(item) === 0 ? (
                        <span key={`${item}-maxUpAdjustPower-${index}`}>{item}</span>
                      ) : (
                        <i key={`${item}-${index}`}>{item}</i>
                      );
                    })}
                </p>
              </div>
              <div className={styles.totalCount}>
                <p className={styles.title}>实时可下调功率（MW）</p>
                <p className={styles.value}>
                  {pageDataHandle(overviewData)
                    ?.maxDownAdjustPower.toString()
                    .split('')
                    .map((item: string, index: any) => {
                      return Number(item) || Number(item) === 0 ? (
                        <span key={`${item}-maxDownAdjustPower-${index}`}>{item}</span>
                      ) : (
                        <i key={`${item}-${index}`}>{item}</i>
                      );
                    })}
                </p>
              </div>
            </div>
            <div className={styles.three}>
              {substationData && (
                <ThreeMap
                left={left_dom.current?.offsetWidth} 
                top={top_dom.current?.offsetHeight}
                data={substationData?.data} 
                refeshThreeMap={refeshThreeMap} 
                />
              )}
            </div>
          </div>

          {/* right */}
          <div className={styles.contentSide}>
            <div className={`${styles.sideItem} ${styles.marginB10}`}>
              <BlockWrap title="响应统计">
                <div className={styles.response}>
                  <div className={styles.responseLeft}>
                    <div className={styles.chartsWrap} ref={canvasWrapRef}>
                      {circleWidth && (
                        <CustomCircle
                          circleBgColor="#1a96ff"
                          circleColor="#33ec9b"
                          circleWidth={circleWidth}
                          value={responseDataHandle(pageDataHandle(responseStatisticData), false)}
                        />
                      )}
                    </div>
                    <div className={styles.chartsDesc}>
                      <p className={styles.desc}>
                        已响应事件(次)：
                        <span>{pageDataHandle(responseStatisticData)?.responseEventNum}</span>
                      </p>
                      <p className={styles.desc}>
                        未响应事件(次)：
                        <span>{pageDataHandle(responseStatisticData)?.unResponseEventNum}</span>
                      </p>
                      <p className={styles.desc}>
                        总受邀事件(次)：
                        <span>{pageDataHandle(responseStatisticData)?.totalInvitedEventNum}</span>
                      </p>
                    </div>
                  </div>
                  <div className={styles.responseRight}>
                    <div className={styles.chartsWrap}>
                      {circleWidth && (
                        <CustomCircle
                          circleBgColor="#1a96ff"
                          circleColor="#95e129"
                          circleWidth={circleWidth}
                          value={responseDataHandle(pageDataHandle(responseStatisticData), true)}
                        />
                      )}
                    </div>
                    <div className={styles.chartsDesc}>
                      <p className={styles.desc}>
                        已响应企业(个)：
                        <span>{pageDataHandle(responseStatisticData)?.responseEnterpriseNum}</span>
                      </p>
                      <p className={styles.desc}>
                        未响应企业(个)：
                        <span>
                          {pageDataHandle(responseStatisticData)?.unResponseEnterpriseNum}
                        </span>
                      </p>
                      <p className={styles.desc}>
                        总受邀企业(个)：
                        <span>{pageDataHandle(responseStatisticData)?.totalEnterpriseNum}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </BlockWrap>
            </div>
            <div className={styles.sideItem}>
              <BlockWrap title="典型响应分析" headerRightRender={resultAnalysisRender}>
                <div style={{ width: '100%', height: '100%' }} ref={tableWrapRef}>
                  <ScrollBoardItem
                    dataList={pageDataHandle(typicalResponseData)}
                    height={blockWidthOrHeight.height}
                    visibleRows={5}
                    columns={typicalResponse(typicalResponseAnalysisType)}
                  />
                </div>
              </BlockWrap>
            </div>
          </div>
        </div>
        <div className={styles.footer}></div>
      </div>
    </ConfigProvider>
  );
};
export default Feature;
