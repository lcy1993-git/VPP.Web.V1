import CircleRingChart from '@/components/circle-ring-chart';
import ColorCircleScript from '@/components/color-circle-script';
import Empty from '@/components/empty';
import { handleDiffMins, handleInverterStatus, roundNumbers } from '@/utils/common';
import { ALARMCOLORANDSCRIPT, EVENTSTATUSCOLORANDSCRIPT } from '@/utils/enum';
import { history } from '@umijs/max';
import { Divider, Tooltip } from 'antd';
import * as echarts from 'echarts';
import styles from './index.less';
/** header区域 数据总览 */
export const renderOverviewData = (statisticsHeaData: any) => {
  const testData = [
    {
      label: '日发电量(kWh)',
      width: 170,
      id: 1,
      value: statisticsHeaData?.generateDay,
    },
    {
      label: '月发电量(kWh)',
      id: 2,
      value: statisticsHeaData?.generateMonth,
    },
    {
      label: '年发电量(kWh)',
      id: 3,
      value: statisticsHeaData?.generateYear,
    },
    {
      label: '累计发电量(kWh)',
      id: 4,
      value: statisticsHeaData?.generateTotal,
    },
    {
      label: '日收入(元)',
      id: 5,
      width: 140,
      value: statisticsHeaData?.incomeDay,
    },
    {
      label: '月收入(元)',
      id: 6,
      value: statisticsHeaData?.incomeMonth,
    },
    {
      label: '年收入(元)',
      id: 7,
      value: statisticsHeaData?.incomeYear,
    },
    {
      label: '累计收入(元)',
      id: 8,
      value: statisticsHeaData?.incomeTotal,
    },
  ];
  const overviewData = [
    {
      label: '日自用电量(kWh)',
      width: 170,
      id: 1,
      value: statisticsHeaData?.selfConsumeDay,
    },
    {
      label: '月自用电量(kWh)',
      id: 2,
      value: statisticsHeaData?.selfConsumeMonth,
    },
    {
      label: '年自用电量(kWh)',
      id: 3,
      value: statisticsHeaData?.selfConsumeYear,
    },
    {
      label: '累计自用电量(kWh)',
      id: 4,
      value: statisticsHeaData?.selfConsumeTotal,
    },
    {
      label: '日节碳量(t)',
      width: 140,
      id: 5,
      value: statisticsHeaData?.carbonSaveDay,
    },
    {
      label: '月节碳量(t)',
      id: 6,
      value: statisticsHeaData?.carbonSaveMonth,
    },
    {
      label: '年节碳量(t)',
      id: 7,
      value: statisticsHeaData?.carbonSaveYear,
    },
    {
      label: '累计节碳量(t)',
      id: 8,
      value: statisticsHeaData?.carbonSaveTotal,
    },
  ];
  return (
    <>
      <ul className={styles.overview}>
        {testData.map((item, index) => {
          return (
            <li
              className={styles.listItem}
              key={item.id}
              style={{
                borderColor: index === 0 ? 'transparent' : '#0072FF',
                width: item.width ? item.width : '',
              }}
            >
              <p className={styles.itemLabel}>{item.label}</p>
              <Tooltip title={item.value}>
                <p className={styles.itemvalue}>{item.value}</p>
              </Tooltip>
            </li>
          );
        })}
      </ul>
      <ul className={styles.overview}>
        {overviewData.map((item, index) => {
          return (
            <li
              className={styles.listItem}
              key={item.id}
              style={{
                borderColor: index === 0 ? 'transparent' : '#0072FF',
                width: item.width ? item.width : '',
              }}
            >
              <p className={styles.itemLabel}>{item.label}</p>
              <Tooltip title={item.value}>
                <p className={styles.itemvalue}>{item.value}</p>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </>
  );
};

/** 逆变器概览
 * @inverterData 列表数据
 * @subStationCode 站点ID
 * @moduleStatus 当前显示的是逆变器概览还是并网表概览
 */
export const renderInverter = (inverterData: any, subStationCode: string, moduleStatus: string) => {
  if (!inverterData?.length && moduleStatus !== '电量概览') {
    return (
      <div className={styles.emptyWrap}>
        <Empty />
      </div>
    );
  }
  if (moduleStatus === '逆变器概览') {
    return (
      <div className={styles.inverterWrap}>
        {inverterData?.map((item: any) => {
          return (
            <div className={styles.moduleItem} key={item.deviceCode}>
              <div className={styles.ItemHeader}>
                <div className={styles.circle}>
                  {handleInverterStatus(item.status) === '运行' ? (
                    <i
                      className="iconfont"
                      style={{
                        color: handleInverterStatus(item.status) === '运行' ? '#00FF90' : '#FF3838',
                      }}
                    >
                      &#xe662;
                    </i>
                  ) : (
                    <i
                      className="iconfont"
                      style={{
                        color: handleInverterStatus(item.status) === '运行' ? '#00FF90' : '#FF3838',
                      }}
                    >
                      &#xe661;
                    </i>
                  )}
                </div>
                <div className={styles.headerMain}>
                  <div className={styles.headerTitle}>
                    <span
                      onClick={() =>
                        history.push('/device-detail', {
                          devicetype: 'inverter',
                          deviceCode: item.deviceCode,
                          siteType: 'solar',
                          subStationCode: subStationCode,
                        })
                      }
                    >
                      {item.deviceName}
                    </span>
                    <span
                      style={{
                        borderColor:
                          handleInverterStatus(item.status) === '运行' ? '#00FF90' : '#FF3838',
                        color: handleInverterStatus(item.status) === '运行' ? '#00FF90' : '#FF3838',
                      }}
                    >
                      {handleInverterStatus(item.status)}
                    </span>
                  </div>
                  <div className={styles.value}>
                    <span>额定功率：</span>
                    <span>{roundNumbers(item.ratedPower)} kW</span>
                  </div>
                </div>
              </div>
              <div className={styles.ItemList}>
                <dl>
                  <dt>当前有功</dt>
                  <dd>
                    <Tooltip placement="top" title={`${roundNumbers(item.outPower)}kW`}>
                      {roundNumbers(item.outPower)} kW
                    </Tooltip>
                  </dd>
                </dl>
                <Divider style={{ height: 40, top: 4 }} type="vertical" />
                <dl>
                  <dt>当日电量</dt>
                  <dd>
                    <Tooltip placement="top" title={`${roundNumbers(item.generateDay)}kWh`}>
                      {roundNumbers(item.generateDay)} kWh
                    </Tooltip>
                  </dd>
                </dl>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else if (moduleStatus === '电表概览') {
    return (
      <div className={styles.inverterWrap}>
        {inverterData.map((item: any) => {
          return (
            <div className={styles.clusterModule} key={item.deviceCode}>
              <div className={styles.clusterModuleHead}>
                <div className={styles.moduleIcon}>
                  <i className="iconfont" style={{ color: '#00FF90' }}>
                    &#xe662;
                  </i>
                </div>
                <dl className={styles.moduleText}>
                  <dt
                    className={styles.deviceName}
                    // onClick={() => {
                    //   history.push('/device-detail', {
                    //     devicetype: 'onGrid',
                    //     deviceCode: item.deviceCode,
                    //     siteType: 'solar',
                    //     subStationCode: subStationCode,
                    //   });
                    // }}
                  >
                    {item.deviceName}
                  </dt>
                </dl>
              </div>
              <div className={styles.clusterModuleBody}>
                <div className={styles.bodyTop}>
                  <dl>
                    <dt>正向有功总电能</dt>
                    <dd>
                      <Tooltip
                        placement="top"
                        title={`${roundNumbers(item.forwardTotalActiveEnergy)}kWh`}
                      >
                        {roundNumbers(item.forwardTotalActiveEnergy)}kWh
                      </Tooltip>
                    </dd>
                  </dl>
                  <Divider style={{ height: 40, top: 16 }} type="vertical" />
                  <dl>
                    <dt>反向有功总电能</dt>
                    <dd>
                      <Tooltip
                        placement="top"
                        title={`${roundNumbers(item.reverseTotalActiveEnergy)}kWh`}
                      >
                        {roundNumbers(item.reverseTotalActiveEnergy)}kWh
                      </Tooltip>
                    </dd>
                  </dl>
                  {item.deviceName.includes('并网柜') && (
                    <>
                      <Divider style={{ height: 40, top: 16 }} type="vertical" />
                      <dl>
                        <dt>日发电量</dt>
                        <dd>
                          <Tooltip
                            placement="top"
                            title={`${roundNumbers(item.dailyPowerGeneration)}kWh`}
                          >
                            {roundNumbers(item.dailyPowerGeneration)}kWh
                          </Tooltip>
                        </dd>
                      </dl>
                    </>
                  )}
                  {item.deviceName.includes('关口表') && (
                    <>
                      <Divider style={{ height: 40, top: 16 }} type="vertical" />
                      <dl>
                        <dt>有功总功率</dt>
                        <dd>
                          <Tooltip
                            placement="top"
                            title={`${roundNumbers(item.totalActivePower)}kW`}
                          >
                            {roundNumbers(item.totalActivePower)}kW
                          </Tooltip>
                        </dd>
                      </dl>
                      <Divider style={{ height: 40, top: 16 }} type="vertical" />
                      <dl>
                        <dt>总功率因数</dt>
                        <dd>
                          <Tooltip
                            placement="top"
                            title={`${roundNumbers(item.totalPowerFactor)}kW`}
                          >
                            {roundNumbers(item.totalPowerFactor)}
                          </Tooltip>
                        </dd>
                      </dl>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    // 电量概览
    const normalColor = '#17cc8a';
    const abnormalColor = '#FF0000';
    const noDataText = '无';
    return (
      <>
        <div className={styles.electryWrap}>
          <div className={styles.electryModule}>
            <div className={styles.echartMain}>
              <CircleRingChart
                textName=""
                pathColor={
                  inverterData?.peekDemandPositiveElectricity ? normalColor : abnormalColor
                }
                value="尖期正向有功电量"
                size={12}
                circleRingChartRatio={(1 * 100).toFixed(2)}
                subTitle={
                  inverterData?.peekDemandPositiveElectricity
                    ? inverterData?.peekDemandPositiveElectricity
                    : noDataText + 'kW'
                }
                breadth="160px"
              />
            </div>
          </div>

          <div className={styles.electryModule}>
            <div className={styles.echartMain}>
              <CircleRingChart
                textName=""
                pathColor={
                  inverterData?.peekDemandNegativeElectricity ? normalColor : abnormalColor
                }
                value="尖期反向有功电量"
                size={12}
                circleRingChartRatio={(1 * 100).toFixed(2)}
                subTitle={
                  inverterData?.peekDemandNegativeElectricity
                    ? inverterData?.peekDemandNegativeElectricity
                    : noDataText + 'kW'
                }
                breadth="160px"
              />
            </div>
          </div>

          <div className={styles.electryModule}>
            <div className={styles.echartMain}>
              <CircleRingChart
                textName=""
                pathColor={inverterData?.peekPositiveElectricity ? normalColor : abnormalColor}
                value="峰期正向有功电量"
                size={12}
                circleRingChartRatio={(1 * 100).toFixed(2)}
                subTitle={
                  inverterData?.peekPositiveElectricity
                    ? inverterData?.peekPositiveElectricity
                    : noDataText + 'kW'
                }
                breadth="160px"
              />
            </div>
          </div>

          <div className={styles.electryModule}>
            <div className={styles.echartMain}>
              <CircleRingChart
                textName=""
                pathColor={inverterData?.peekNegativeElectricity ? normalColor : abnormalColor}
                value="峰期反向有功电量"
                size={12}
                circleRingChartRatio={(1 * 100).toFixed(2)}
                subTitle={
                  inverterData?.peekNegativeElectricity
                    ? inverterData?.peekNegativeElectricity
                    : noDataText + 'kW'
                }
                breadth="160px"
              />
            </div>
          </div>

          <div className={styles.electryModule}>
            <div className={styles.echartMain}>
              <CircleRingChart
                textName=""
                pathColor={inverterData?.normalPositiveElectricity ? normalColor : abnormalColor}
                value="平期正向有功电量"
                size={12}
                circleRingChartRatio={(1 * 100).toFixed(2)}
                subTitle={
                  inverterData?.normalPositiveElectricity
                    ? inverterData?.normalPositiveElectricity
                    : noDataText + 'kW'
                }
                breadth="160px"
              />
            </div>
          </div>

          <div className={styles.electryModule}>
            <div className={styles.echartMain}>
              <CircleRingChart
                textName=""
                pathColor={inverterData?.normalNegativeElectricity ? normalColor : abnormalColor}
                value="平期反向有功电量"
                size={12}
                circleRingChartRatio={(1 * 100).toFixed(2)}
                subTitle={
                  inverterData?.normalNegativeElectricity
                    ? inverterData?.normalNegativeElectricity
                    : noDataText + 'kW'
                }
                breadth="160px"
              />
            </div>
          </div>

          <div className={styles.electryModule}>
            <div className={styles.echartMain}>
              <CircleRingChart
                textName=""
                pathColor={inverterData?.valleyPositiveElectricity ? normalColor : abnormalColor}
                value="谷期正向有功电量"
                size={12}
                circleRingChartRatio={(1 * 100).toFixed(2)}
                subTitle={
                  inverterData?.valleyPositiveElectricity
                    ? inverterData?.valleyPositiveElectricity
                    : noDataText + 'kW'
                }
                breadth="160px"
              />
            </div>
          </div>

          <div className={styles.electryModule}>
            <div className={styles.echartMain}>
              <CircleRingChart
                textName=""
                pathColor={inverterData?.valleyNegativeElectricity ? normalColor : abnormalColor}
                value="谷期反向有功电量"
                size={12}
                circleRingChartRatio={(1 * 100).toFixed(2)}
                subTitle={
                  inverterData?.valleyNegativeElectricity
                    ? inverterData?.valleyNegativeElectricity
                    : noDataText + 'kW'
                }
                breadth="160px"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
};

// 发电量 options
export const powerGenerationOptions = (data: any, timeType: string) => {
  let xAxisData: string[] = [];

  let powerGeneration: any[] = []; // 发电量
  if (data) {
    const xAxis = Object.keys(data?.powerMap).map((item) => {
      let xAxisItem;
      if (timeType === '日') {
        xAxisItem = item.slice(11, 16);
      } else if (timeType === '月') {
        xAxisItem = item.slice(8, 10);
      } else {
        xAxisItem = item.slice(5, 7);
      }
      return xAxisItem;
    });
    xAxisData.push(...xAxis);
    powerGeneration = [...Object.values(data.powerMap)];
  }

  if (!xAxisData.length) {
    return false;
  }

  return {
    grid: {
      top: '14%',
      left: '3%',
      right: '4%',
      bottom: '1%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#0065D7',
          width: 0.5,
        },
      },
      data: xAxisData,
      name: timeType !== '日' ? (timeType === '月' ? '日' : '月') : '',
    },
    yAxis: {
      splitLine: {
        show: true,
        lineStyle: {
          color: '#0065D7',
          width: 0.5,
        },
      },
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      nameTextStyle: {
        align: 'right',
      },
      name: '电量/kWh',
      type: 'value',
    },
    series: [
      {
        data: powerGeneration,
        type: 'bar',
        barWidth: 16,
        name: '发电量',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: '#00A1C9' },
            { offset: 1, color: '#1EFFE2' },
          ]),
        },
      },
    ],
  };
};

// 发电趋势
export const powerCountOptions = (powerGenerationTrends: any, isToday: boolean) => {
  let xAxisData: string[] = [];
  let photovoltaic: any[] = []; // 有功
  if (powerGenerationTrends) {
    const xAxis = Object.keys(powerGenerationTrends?.powerMap)
      .map((item) => item.split(' ')[1])
      .map((item) => `${item.split(':')[0]}:${item.split(':')[1]}`);
    xAxisData.push(...xAxis);
    photovoltaic = [...Object.values(powerGenerationTrends?.powerMap)];
  }
  if (!powerGenerationTrends && !xAxisData.length) {
    return false;
  }

  return {
    grid: {
      top: '14%',
      left: '1%',
      right: '2%',
      bottom: '1%',
      containLabel: true,
    },
    legend: {
      data: ['有功'],
      x: 'center',
      top: 0,
      textStyle: {
        color: '#fff',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    color: ['#4B85FF', '#FF3838'],
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#0065D7',
          width: 0.5,
        },
      },
      nameLocation: 'end',
      data: xAxisData,
    },
    yAxis: {
      splitLine: {
        show: true,
        lineStyle: {
          color: '#0065D7',
          width: 0.5,
        },
      },
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      name: '有功/kW',
      nameTextStyle: {
        align: 'right',
      },
      type: 'value',
    },
    series: [
      {
        // 当天的数据只展示当前小时之前
        data: isToday ? photovoltaic.slice(0, handleDiffMins()) : photovoltaic,
        type: 'line',
        symbol: 'none',
        barWidth: 16,
        smooth: true,
        name: '有功',
      },
    ],
  };
};

// 告警详情 告警等级
export const ALARMLEVEL = ['全部告警', '一级告警', '二级告警', '三级告警'];

// 告警详情 table colums
export const tableColumns = [
  {
    title: '告警时间',
    dataIndex: 'date',
    key: 'date',
    align: 'center' as any,
    ellipsis: true,
  },
  {
    title: '所属站点',
    dataIndex: 'subStationName',
    key: 'subStationName',
    align: 'center' as any,
    ellipsis: true,
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
    align: 'center' as any,
    ellipsis: true,
  },
  {
    title: '事项名称',
    dataIndex: 'eventName',
    key: 'eventName',
    align: 'center' as any,
    ellipsis: true,
  },
  {
    title: '事件状态',
    dataIndex: 'eventStatus',
    key: 'eventStatus',
    align: 'center' as any,
    ellipsis: true,
    render: (text: any) => {
      const color = EVENTSTATUSCOLORANDSCRIPT[text]?.color || '';
      const script = EVENTSTATUSCOLORANDSCRIPT[text]?.script || '-';
      return (
        <div>
          <ColorCircleScript color={color} script={script} />
        </div>
      );
    },
  },
  {
    title: '告警等级',
    dataIndex: 'eventLevel',
    key: 'eventLevel',
    align: 'center' as any,
    ellipsis: true,
    render: (text: any) => {
      const color = ALARMCOLORANDSCRIPT[text]?.color || '';
      const script = ALARMCOLORANDSCRIPT[text]?.script || '';
      return <span style={{ color: color }}>{script}</span>;
    },
  },
];
