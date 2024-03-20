import Empty from '@/components/empty';
import {
  handleDiffMins,
  handleInverterStatus,
  handleInverterStatus_air,
  handleInverterStatus_cluster,
  handleInverterStatus_psc,
  roundNumbers,
} from '@/utils/common';
import { history } from '@umijs/max';
import { Divider, Tooltip } from 'antd';
import * as echarts from 'echarts';
import styles from './index.less';
export const DEVICESRUNSTATUS = ['关机', '待机', '充电', '放电'];

/** header区域 数据总览 */
export const renderOverviewData = (basisInfo: any) => {
  const testData = [
    {
      label: '日充放电量(kWh)',
      id: 1,
      value1: basisInfo?.chargeDay,
      value2: basisInfo?.dischargeDay,
    },
    {
      label: '月充放电量(kWh)',
      id: 2,
      value1: basisInfo?.chargeMonth,
      value2: basisInfo?.dischargeMonth,
    },
    {
      label: '年充放电量(kWh)',
      id: 3,
      value1: basisInfo?.chargeYear,
      value2: basisInfo?.dischargeYear,
    },
    {
      label: '累计充放电量(kWh)',
      id: 4,
      value1: basisInfo?.chargeTotal,
      value2: basisInfo?.dischargeTotal,
    },
    {
      label: '日收入(元)',
      id: 5,
      value1: basisInfo?.incomeDay,
    },
    {
      label: '月收入(元)',
      id: 6,
      value1: basisInfo?.incomeMonth,
    },
  ];

  const overviewData = [
    {
      label: '年收入(元)',
      id: 7,
      value1: basisInfo?.incomeYear,
    },
    {
      label: '累计收入(元)',
      id: 8,
      value1: basisInfo?.incomeTotal,
    },
    {
      label: '日节约电费(元)',
      value1: basisInfo?.dailyElectricityCostSaving,
      id: 9,
    },
    {
      label: '月节约电费(元)',
      value1: basisInfo?.monthlyElectricityCostSaving,
      id: 10,
    },
    {
      label: '年节约电费(元)',
      value1: basisInfo?.annualElectricityCostSaving,
      id: 11,
    },
    {
      label: '累计节约电费(元)',
      value1: basisInfo?.totalElectricityCostSaving,
      id: 12,
    },
  ];

  const showValue = (data: any) => {
    if (data.value2) {
      if (!data.value1) data.value1 = '';
      return (
        <>
          {data.value1 === 0 ? 0 : -data.value1}
          {data.value2 ? (
            <span>
              /<span style={{ color: '#FFC300' }}>{data.value2}</span>
            </span>
          ) : (
            ''
          )}
        </>
      );
    } else {
      return <>{data.value1 ? data.value1 : ''}</>;
    }
  };

  return (
    <>
      <ul className={styles.overview}>
        {testData.map((item, index) => {
          const tooltipTitle = item.value2 ? `-${item.value1}/${item.value2}` : item.value1;
          return (
            <li
              className={styles.listItem}
              key={item.id}
              style={{ borderColor: index === 0 ? 'transparent' : '#0072FF' }}
            >
              <p className={styles.itemLabel}>{item.label}</p>
              <Tooltip title={tooltipTitle}>
                <p className={styles.itemvalue}>{showValue(item)}</p>
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
              style={{ borderColor: index === 0 ? 'transparent' : '#0072FF' }}
            >
              <p className={styles.itemLabel}>{item.label}</p>
              <Tooltip title={item.value1}>
                <p className={styles.itemvalue}>{item.value1}</p>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </>
  );
};

// 发电量 options
export const powerGenerationOptions = (fullAndPutPowerData: any, timeType: string) => {
  let xAxisData: string[] = [];
  let chargeCapacitys: any[] = []; // 充电量
  let dischargeCapacity: any[] = []; // 放电量

  if (fullAndPutPowerData) {
    const xAxis = Object.keys(fullAndPutPowerData?.timeChargeMap).map((item) => {
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
    dischargeCapacity = [...Object.values(fullAndPutPowerData.timeDischargeMap)];
    chargeCapacitys = [...Object.values(fullAndPutPowerData.timeChargeMap)];
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
    legend: {
      data: [timeType + '充电量', timeType + '放电量'],
      x: 'center',
      top: 0,
      textStyle: {
        color: '#fff',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#0054FF',
        },
      },
      boundaryGap: true,
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
      name: '电量/kWh',
      type: 'value',
    },
    series: [
      {
        data: chargeCapacitys,
        type: 'bar',
        barWidth: 10,
        name: timeType + '充电量',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: 'rgba(0, 161, 159, 1)' },
            { offset: 1, color: 'rgba(0, 226, 144, 1)' },
          ]),
        },
      },
      {
        data: dischargeCapacity,
        type: 'bar',
        barWidth: 10,
        name: timeType + '放电量',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: 'rgba(93, 79, 236, 1)' },
            { offset: 1, color: 'rgba(100, 140, 255, 1)' },
          ]),
        },
      },
    ],
  };
};

// 点击逆变器名称，跳转到逆变器详情
const navigatorHandle = (currentRender: string, deviceCode: string, subStationCode: string) => {
  switch (currentRender) {
    case 'PCS概览':
      // history.push(`/energy-storage/pcs-detail/${deviceCode}`)
      history.push('/device-detail', {
        devicetype: 'PCS',
        deviceCode: deviceCode,
        siteType: 'energy',
        subStationCode: subStationCode,
      });
      break;
    case '电池簇概览':
      // history.push(`/energy-storage/cluster-detail/${deviceCode}`)
      history.push('/device-detail', {
        devicetype: 'cluster',
        deviceCode: deviceCode,
        siteType: 'energy',
        subStationCode: subStationCode,
      });
      break;
    case '电表概览':
      // history.push(`/energy-storage/on-grid-detail/${deviceCode}`)
      history.push('/device-detail', {
        devicetype: 'onGrid',
        deviceCode: deviceCode,
        siteType: 'energy',
        subStationCode: subStationCode,
      });
      break;
  }
};

// PCS概览
const renderPcsOverview = (pcsOverview: any, subStationId: string) => {
  return (
    <div className={styles.inverterWrap}>
      {pcsOverview?.map((item: any) => {
        return (
          <div className={styles.moduleItem} key={item.deviceCode}>
            <div className={styles.ItemHeader}>
              <div className={styles.circle}>
                {handleInverterStatus_psc(item.status) === '运行' ? (
                  <i
                    className="iconfont"
                    style={{
                      color:
                        handleInverterStatus_psc(item.status) === '运行' ? '#00FF90' : '#FF3838',
                    }}
                  >
                    &#xe662;
                  </i>
                ) : (
                  <i
                    className="iconfont"
                    style={{
                      color:
                        handleInverterStatus_psc(item.status) === '运行' ? '#00FF90' : '#FF3838',
                    }}
                  >
                    &#xe661;
                  </i>
                )}
              </div>
              <div className={styles.headerMain}>
                <div className={styles.headerTitle}>
                  <span onClick={() => navigatorHandle('PCS概览', item.deviceCode, subStationId)}>
                    {item.deviceName}
                  </span>
                  <span
                    style={{
                      borderColor:
                        handleInverterStatus_psc(item.status) === '运行' ? '#00FF90' : '#FF3838',
                      color:
                        handleInverterStatus_psc(item.status) === '运行' ? '#00FF90' : '#FF3838',
                    }}
                  >
                    {handleInverterStatus_psc(item.status)}
                  </span>
                </div>
                <div className={styles.value}>
                  <span>额定功率：</span>
                  <span>{roundNumbers(item.ratedPower)}kW</span>
                </div>
              </div>
            </div>
            <div className={styles.ItemList}>
              <dl>
                <dt>有功功率</dt>
                <dd>
                  <Tooltip placement="top" title={`${roundNumbers(item.activePower)}kW`}>
                    {roundNumbers(item.activePower)}kW
                  </Tooltip>
                </dd>
              </dl>
              <Divider style={{ height: 40, top: 4 }} type="vertical" />
              <dl>
                <dt>SOC</dt>
                <dd>
                  <Tooltip placement="top" title={`${roundNumbers(item.soc)}%`}>
                    {roundNumbers(item.soc)}%
                  </Tooltip>
                </dd>
              </dl>
            </div>
            <div className={styles.ItemList}>
              <dl>
                <dt>当天充电电量</dt>
                <dd>
                  <Tooltip placement="top" title={`${roundNumbers(item.todayChargeCapacity)}kWh`}>
                    {roundNumbers(item.todayChargeCapacity)}kWh
                  </Tooltip>
                </dd>
              </dl>
              <Divider style={{ height: 40, top: 4 }} type="vertical" />
              <dl>
                <dt>当日放电电量</dt>
                <dd>
                  <Tooltip
                    placement="top"
                    title={`${roundNumbers(item.todayDisChargeCapacity)}kWh`}
                  >
                    {roundNumbers(item.todayDisChargeCapacity)}kWh
                  </Tooltip>
                </dd>
              </dl>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 并网概览
const renderOnGridOverview = (gridOverview: any, subStationId: string) => {
  return (
    <div className={styles.inverterWrap}>
      {gridOverview.map((item: any) => {
        return (
          <div className={styles.clusterModule} key={item.id}>
            <div className={styles.clusterModuleHead}>
              <div className={styles.moduleIcon}>
                {handleInverterStatus(item.status) === '运行' ? (
                  <i
                    className="iconfont"
                    style={{
                      color: handleInverterStatus(item.status) === '运行' ? '#00FF90' : '#00FF90',
                    }}
                  >
                    &#xe662;
                  </i>
                ) : (
                  <i
                    className="iconfont"
                    style={{
                      color: handleInverterStatus(item.status) === '运行' ? '#00FF90' : '#00FF90',
                    }}
                  >
                    &#xe661;
                  </i>
                )}
              </div>
              <dl className={styles.moduleText}>
                <dt
                  className={styles.deviceName}
                  onClick={() => navigatorHandle('电表概览', item.deviceCode, subStationId)}
                >
                  {item.deviceName}
                </dt>
                <dd className={styles.deviceStatus}>
                  {/* <span
                    style={{
                      borderColor:
                        handleInverterStatus(item.status) === '运行' ? '#00FF90' : '#FF3838',
                      color: handleInverterStatus(item.status) === '运行' ? '#00FF90' : '#FF3838',
                    }}
                  >
                    {handleInverterStatus(item.status)}
                  </span> */}
                </dd>
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
                        <Tooltip placement="top" title={`${roundNumbers(item.totalActivePower)}kW`}>
                          {roundNumbers(item.totalActivePower)}kW
                        </Tooltip>
                      </dd>
                    </dl>
                    <Divider style={{ height: 40, top: 16 }} type="vertical" />
                    <dl>
                      <dt>总功率因数</dt>
                      <dd>
                        <Tooltip placement="top" title={`${roundNumbers(item.totalPowerFactor)}kW`}>
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
};

// 空调概览
const renderAirCondition = (airCondition: any) => {
  // 空调模式
  const airConditioningMode = ['停止', '内循环', '制冷', '加热', '全自动', '补水'];
  // 室外风机状态
  const outdoorFanStatus = ['停止', '运行'];
  return (
    <div className={styles.inverterWrap}>
      {airCondition.map((item: any) => {
        return (
          <div className={styles.clusterModule} key={item.id}>
            <div className={styles.clusterModuleHead}>
              <div className={styles.moduleIcon}>
                {handleInverterStatus_air(item.status) === '运行' ? (
                  <i
                    className="iconfont"
                    style={{
                      color:
                        handleInverterStatus_air(item.status) === '运行' ? '#00FF90' : '#FF3838',
                    }}
                  >
                    &#xe662;
                  </i>
                ) : (
                  <i
                    className="iconfont"
                    style={{
                      color:
                        handleInverterStatus_air(item.status) === '运行' ? '#00FF90' : '#FF3838',
                    }}
                  >
                    &#xe661;
                  </i>
                )}
              </div>
              <dl className={styles.moduleText}>
                <dt
                  className={styles.deviceName}
                  style={{ textDecoration: 'none', cursor: 'auto' }}
                >
                  {item.deviceName}
                </dt>
                <dd className={styles.deviceStatus}>
                  <span
                    style={{
                      borderColor:
                        handleInverterStatus_air(item.status) === '运行' ? '#00FF90' : '#FF3838',
                      color:
                        handleInverterStatus_air(item.status) === '运行' ? '#00FF90' : '#FF3838',
                    }}
                  >
                    {handleInverterStatus_air(item.status)}
                  </span>
                </dd>
              </dl>
            </div>
            <div className={styles.clusterModuleBody}>
              <div className={styles.bodyTop}>
                <dl>
                  <dt>室内温度</dt>
                  <dd>
                    <Tooltip placement="top" title={`${roundNumbers(item.indoorTemperature)}℃`}>
                      {roundNumbers(item.indoorTemperature)}℃
                    </Tooltip>
                  </dd>
                </dl>
                <Divider style={{ height: 40, top: 16 }} type="vertical" />
                <dl>
                  <dt>冷凝/环境温度</dt>
                  <dd>
                    <Tooltip placement="top" title={`${roundNumbers(item.envTemperature)}℃`}>
                      {roundNumbers(item.envTemperature)}℃
                    </Tooltip>
                  </dd>
                </dl>
                <Divider style={{ height: 40, top: 16 }} type="vertical" />
                <dl>
                  <dt>湿度设定值</dt>
                  <dd>
                    <Tooltip placement="top" title={`${roundNumbers(item.humiditySetPoint)}℃`}>
                      {roundNumbers(item.humiditySetPoint)}℃
                    </Tooltip>
                  </dd>
                </dl>
                <Divider style={{ height: 40, top: 16 }} type="vertical" />
                <dl>
                  <dt>空调模式</dt>
                  <dd>
                    <Tooltip
                      placement="top"
                      title={`${airConditioningMode[item.airConditioningMode] || '未知'}`}
                    >
                      {airConditioningMode[item.airConditioningMode] || '未知'}
                    </Tooltip>
                  </dd>
                </dl>
              </div>
              <div className={styles.bodybottom}>
                <dl>
                  <dt>室内湿度</dt>
                  <dd>
                    <Tooltip placement="top" title={`${roundNumbers(item.indoorHumidity)}RH`}>
                      {roundNumbers(item.indoorHumidity)}RH
                    </Tooltip>
                  </dd>
                </dl>
                <Divider style={{ height: 40, top: 16 }} type="vertical" />
                <dl>
                  <dt>室外风机状态</dt>
                  <dd>
                    <Tooltip
                      placement="top"
                      title={`${outdoorFanStatus[item.outdoorFanStatus] || '未知'}`}
                    >
                      {outdoorFanStatus[item.outdoorFanStatus] || '未知'}
                    </Tooltip>
                  </dd>
                </dl>
                <Divider style={{ height: 40, top: 16 }} type="vertical" />
                <dl>
                  <dt>湿度设定值</dt>
                  <dd>
                    <Tooltip placement="top" title={`${roundNumbers(item.humiditySetPoint)}RH`}>
                      {roundNumbers(item.humiditySetPoint)}RH
                    </Tooltip>
                  </dd>
                </dl>
                <Divider style={{ height: 40, top: 16 }} type="vertical" />
                <dl>
                  <dt>压缩机状态</dt>
                  <dd>
                    <Tooltip placement="top" title={`${roundNumbers(item.compressorStatus)}℃`}>
                      {roundNumbers(item.compressorStatus)}℃
                    </Tooltip>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 电池簇概览
const renderClusterOverview = (clusterOverview: any, subStationId: string) => {
  return (
    <div className={styles.inverterWrap}>
      {clusterOverview.map((item: any) => {
        return (
          <div className={styles.clusterModule} key={item.id}>
            <div className={styles.clusterModuleHead}>
              <div className={styles.moduleIcon}>
                {handleInverterStatus_cluster(item.status) === '运行' ? (
                  <i
                    className="iconfont"
                    style={{
                      color:
                        handleInverterStatus_cluster(item.status) === '运行'
                          ? '#00FF90'
                          : '#FF3838',
                    }}
                  >
                    &#xe662;
                  </i>
                ) : (
                  <i
                    className="iconfont"
                    style={{
                      color:
                        handleInverterStatus_cluster(item.status) === '运行'
                          ? '#00FF90'
                          : '#FF3838',
                    }}
                  >
                    &#xe661;
                  </i>
                )}
              </div>
              <dl className={styles.moduleText}>
                <dt
                  className={styles.deviceName}
                  onClick={() => navigatorHandle('电池簇概览', item.deviceCode, subStationId)}
                >
                  {item.deviceName}
                </dt>
                <dd className={styles.deviceStatus}>
                  <span
                    style={{
                      borderColor:
                        handleInverterStatus_cluster(item.status) === '运行'
                          ? '#00FF90'
                          : '#FF3838',
                      color:
                        handleInverterStatus_cluster(item.status) === '运行'
                          ? '#00FF90'
                          : '#FF3838',
                    }}
                  >
                    {handleInverterStatus_cluster(item.status)}
                  </span>
                </dd>
              </dl>
            </div>
            <div className={styles.clusterModuleBody}>
              <div className={styles.bodyTop}>
                <dl>
                  <dt>SOC</dt>
                  <dd>
                    <Tooltip placement="top" title={`${roundNumbers(item.soc)}kW`}>
                      {roundNumbers(item.soc)}kW
                    </Tooltip>
                  </dd>
                </dl>
                <Divider style={{ height: 40, top: 16 }} type="vertical" />
                <dl>
                  <dt>SOH</dt>
                  <dd>
                    <Tooltip placement="top" title={`${roundNumbers(item.soh)}%`}>
                      {roundNumbers(item.soh)}%
                    </Tooltip>
                  </dd>
                </dl>
                <Divider style={{ height: 40, top: 16 }} type="vertical" />
                <dl>
                  <dt>可放电量</dt>
                  <dd>
                    <Tooltip placement="top" title={`${roundNumbers(item.dischargeCapacity)}kWh`}>
                      {roundNumbers(item.dischargeCapacity)}kWh
                    </Tooltip>
                  </dd>
                </dl>
                <Divider style={{ height: 40, top: 16 }} type="vertical" />
                <dl>
                  <dt>当前总电压</dt>
                  <dd>
                    <Tooltip placement="top" title={`${roundNumbers(item.voltage)}V`}>
                      {roundNumbers(item.voltage)}V
                    </Tooltip>
                  </dd>
                </dl>
              </div>
              <div className={styles.bodybottom}>
                <dl>
                  <dt>单体最高/低温度</dt>
                  <dd>
                    <Tooltip
                      placement="top"
                      title={`${roundNumbers(item.maxTemperature)}/${roundNumbers(
                        item.minTemperature,
                      )}℃`}
                    >
                      {roundNumbers(item.maxTemperature)}/{roundNumbers(item.minTemperature)}℃
                    </Tooltip>
                  </dd>
                </dl>
                <Divider style={{ height: 40, top: 16 }} type="vertical" />
                <dl>
                  <dt>单体最高/低电压</dt>
                  <dd>
                    <Tooltip
                      placement="top"
                      title={`${roundNumbers(item.maxVoltage)}/${roundNumbers(item.minVoltage)}v`}
                    >
                      {roundNumbers(item.maxVoltage)}/{roundNumbers(item.minVoltage)}v
                    </Tooltip>
                  </dd>
                </dl>
                <Divider style={{ height: 40, top: 16 }} type="vertical" />
                <dl>
                  <dt>可充电量</dt>
                  <dd>
                    <Tooltip placement="top" title={`${roundNumbers(item.chargeCapacity)}kWh`}>
                      {roundNumbers(item.chargeCapacity)}kWh
                    </Tooltip>
                  </dd>
                </dl>
                <Divider style={{ height: 40, top: 16 }} type="vertical" />
                <dl>
                  <dt>当前总电流</dt>
                  <dd>
                    <Tooltip placement="top" title={`${roundNumbers(item.electricity)}A`}>
                      {roundNumbers(item.electricity)}A
                    </Tooltip>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** 逆变器概览 */
export const renderInverter = (moduleStatus: string, dataList: any, subStationId: string) => {
  if (!dataList.length) {
    return (
      <div className={styles.emptyWrap}>
        <Empty />
      </div>
    );
  }

  switch (moduleStatus) {
    case '电池簇概览':
      return renderClusterOverview(dataList, subStationId);
    case '电表概览':
      return renderOnGridOverview(dataList, subStationId);
    case 'PCS概览':
      return renderPcsOverview(dataList, subStationId);
    case '空调概览':
      return renderAirCondition(dataList);
  }
};

// 实时功率
export const realTimePower = () => {
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      show: true,
      y: 'bottom',
      itemWidth: 0,
      textStyle: {
        color: '#FFF',
        fontSize: '21px',
      },
    },
    title: {
      text: '937.32',
      left: 'center',
      x: 'center',
      y: 'center',
      textStyle: {
        color: '#fff',
        fontSize: '21px',
      },
    },

    color: ['#003299', '#f83b5f'],
    center: [171, 200],
    height: 'auto',
    width: 'auto',
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },

        labelLine: {
          show: false,
        },
        data: [
          { value: 10, name: '' },
          {
            value: 90,
            name: '实时功率',
            itemStyle: {
              borderRadius: [20, 20, 20, 20],
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                { offset: 1, color: '#20B76B' },
                { offset: 0, color: '#00FFD8' },
              ]),
            },
          },
        ],
      },
    ],
  };
};

export const batteryPowerOption = (soc: any) => {
  let batteryColor = '#1DCC2E';
  let battery = soc ? soc : 0;

  if (Number(battery) === 0) {
    return false;
  }

  return {
    grid: {
      top: 40,
      bottom: 36,
    },
    tooltip: {
      trigger: 'none',
    },
    xAxis: {
      data: ['百分比'],
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
        textStyle: {
          color: '#e54035',
        },
      },
    },
    yAxis: {
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    series: [
      {
        name: '最上层立体圆',
        type: 'pictorialBar',
        symbolSize: [80, 30],
        symbolOffset: [0, -18],
        z: 10,
        itemStyle: {
          normal: {
            color: '#00CCFF',
            opacity: 0.7,
          },
        },
        data: [
          {
            value: 100,
            symbolPosition: 'end',
          },
        ],
      },
      {
        name: '中间立体圆',
        type: 'pictorialBar',
        symbolSize: [80, 30],
        symbolOffset: [0, -18],
        z: 12,
        itemStyle: {
          normal: {
            color: batteryColor,
          },
        },
        data: [
          {
            value: battery, // data,
            symbolPosition: 'end',
          },
        ],
      },
      {
        name: '最底部立体圆',
        type: 'pictorialBar',
        symbolSize: [80, 30],
        symbolOffset: [0, 18],
        z: 10,
        itemStyle: {
          normal: {
            color: batteryColor,
          },
        },
        data: [100 - battery], // [100 - data],
      },
      {
        // 底部立体柱
        stack: '1',
        type: 'bar',
        itemStyle: {
          normal: {
            color: batteryColor,
            opacity: 1,
          },
        },
        label: {
          show: true,
          position: battery > 58 ? 'inside' : 'top',
          distance: 15,
          color: '#fff',
          fontSize: 20,
          formatter: '{c}' + '%',
        },

        silent: true,
        barWidth: 80,
        barGap: '-100%', // Make series be overlap
        data: [battery],
      },
      {
        // 上部立体柱
        stack: '1',
        type: 'bar',
        itemStyle: {
          normal: {
            color: '#36405E',
            opacity: 0.7,
          },
        },
        silent: true,
        barWidth: 100,
        barGap: '-100%', // Make series be overlap
        data: [100 - battery],
      },
    ],
  };
};

// 功率趋势
export const powerCountOptions = (powerTrendData: any, isToday: boolean) => {
  let xAxisData: string[] = [];
  let chargeCapacity: any[]; // 充电量
  let dischargeCapacity: any[] = []; // 放电量

  if (powerTrendData) {
    const xAxis = Object.keys(powerTrendData.todayChargeMap)
      .map((item) => item.split(' ')[1])
      .map((item) => `${item.split(':')[0]}:${item.split(':')[1]}`);
    xAxisData.push(...xAxis);
    dischargeCapacity = [...Object.values(powerTrendData.todayDischargeMap)];
    chargeCapacity = [...Object.values(powerTrendData.todayChargeMap)];
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
    legend: {
      data: ['充电功率', '放电功率'],
      x: 'center',
      textStyle: {
        color: '#fff',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    color: ['#39FFC5', '#FF7E30'],
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
      name: '电量/kWh',
      type: 'value',
    },
    series: [
      {
        // @ts-ignore
        data: isToday ? chargeCapacity.slice(0, handleDiffMins() + 1) : chargeCapacity,
        type: 'line',
        barWidth: 16,
        smooth: true,
        name: '充电功率',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: 'rgba(204, 139, 255, 0.02)' },
            { offset: 1, color: 'rgba(203, 140, 255, 0.4)' },
          ]),
        },
      },
      {
        // @ts-ignore
        data: isToday ? dischargeCapacity.slice(0, handleDiffMins() + 1) : dischargeCapacity,
        type: 'line',
        name: '放电功率',
        barWidth: 16,
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: 'rgba(255, 126, 48, 0.02)' },
            { offset: 1, color: 'rgba(255, 126, 48, 0.4)' },
          ]),
        },
      },
    ],
  };
};

// SOC趋势
export const soCountOptions = (socTrendData: any, isToday: boolean) => {
  let xAxisData: string[] = [];
  let todaySOCMap: any[]; // 今日

  if (socTrendData) {
    const xAxis = Object.keys(socTrendData.todaySOCMap)
      .map((item) => item.split(' ')[1])
      .map((item) => `${item.split(':')[0]}:${item.split(':')[1]}`);
    xAxisData.push(...xAxis);
    todaySOCMap = [...Object.values(socTrendData.todaySOCMap)];
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
    legend: {
      data: ['今日', '昨日'],
      x: 'center',
      textStyle: {
        color: '#fff',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    color: ['#C2FF31', '#CC8BFF'],
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
      // @ts-ignore
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
      name: '电量/kWh',
      type: 'value',
    },
    series: [
      {
        // @ts-ignore
        data: isToday ? todaySOCMap.slice(0, handleDiffMins() + 1) : todaySOCMap,
        type: 'line',
        barWidth: 16,
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: 'rgba(204, 139, 255, 0.02)' },
            { offset: 1, color: 'rgba(203, 140, 255, 0.4)' },
          ]),
        },
      },
    ],
  };
};

// 告警详情 告警等级
export const ALARMLEVEL = ['全部告警', '一级告警', '二级告警', '三级告警'];

//测点类型
const measurementType = ['遥信', '遥测', '电度'];

// 测点表格 columns
export const measurePointColumns = [
  {
    title: '测点名称',
    dataIndex: 'dataName',
    key: 'dataName',
    align: 'center' as any,
  },
  {
    title: '测点类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center' as any,
    render: (text: number) => {
      return <span>{measurementType[text - 1]}</span>;
    },
  },
  {
    title: '测点值',
    dataIndex: 'data',
    key: 'data',
    align: 'center' as any,
  },
  {
    title: '测点描述',
    dataIndex: 'dataDesc',
    key: 'dataDesc',
    align: 'center' as any,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
    align: 'center' as any,
  },
];

// 充放电量统计
export const electricityStatisticsOptions = (pcsQuantity: any) => {
  let xAxisData: string[] = [];
  let timeChargeMap: any[] = []; // 充电
  let timeDischargeMap: any[] = []; // 放电
  if (pcsQuantity) {
    const xAxis = Object.keys(pcsQuantity?.timeChargeMap)
      .map((item) => item.split(' ')[0])
      .map((item) => `${item.split('-')[1]}:${item.split('-')[2]}`);
    xAxisData.push(...xAxis);
    timeChargeMap = [...Object.values(pcsQuantity?.timeChargeMap)];
    timeDischargeMap = [...Object.values(pcsQuantity?.timeDischargeMap)];
  }

  return {
    grid: {
      top: '14%',
      left: '3%',
      right: '4%',
      bottom: '1%',
      containLabel: true,
    },
    legend: {
      data: ['充电', '放电'],
      x: 'center',
      textStyle: {
        color: '#fff',
        fontSize: '12px',
        fontWeight: 400,
      },
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
      // @ts-ignore
      data: xAxisData,
    },
    yAxis: {
      splitLine: {
        show: false,
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
      name: '电量/kWh',
      type: 'value',
    },
    series: [
      {
        // @ts-ignore
        data: timeChargeMap,
        type: 'bar',
        barWidth: 10,
        name: '充电',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: '#00A19F' },
            { offset: 1, color: '#00E290' },
          ]),
        },
      },
      {
        // @ts-ignore
        data: timeDischargeMap,
        type: 'bar',
        barWidth: 10,
        name: '放电',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: '#5D4FEC' },
            { offset: 1, color: '#648CFF' },
          ]),
        },
      },
    ],
  };
};

// 功率曲线
export const powerOptions = (powerCurve: any) => {
  let xAxisData: string[] = [];
  let timeChargeMap: any[] = []; // 充电
  let timeDischargeMap: any[] = []; // 放电
  if (powerCurve) {
    const xAxis = Object.keys(powerCurve?.dayChargeMap)
      .map((item) => item.split(' ')[1])
      .map((item) => `${item.split(':')[0]}:${item.split(':')[1]}`);
    xAxisData.push(...xAxis);
    timeChargeMap = [...Object.values(powerCurve?.dayChargeMap)];
    timeDischargeMap = [...Object.values(powerCurve?.dayDisChargeMap)];
  }

  return {
    grid: {
      top: '14%',
      left: '3%',
      right: '4%',
      bottom: '1%',
      containLabel: true,
    },
    legend: {
      data: ['充电', '放电'],
      x: 'center',
      textStyle: {
        color: '#fff',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    color: ['#39FFC5', '#FF7E30'],
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
      name: '功率/kW',
      type: 'value',
    },
    series: [
      {
        // @ts-ignore
        data: timeChargeMap,
        type: 'line',
        barWidth: 16,
        name: '充电',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: 'rgba(204, 139, 255, 0.02)' },
            { offset: 1, color: 'rgba(203, 140, 255, 0.4)' },
          ]),
        },
      },
      {
        // @ts-ignore
        data: timeDischargeMap,
        type: 'line',
        barWidth: 16,
        name: '放电',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: 'rgba(204, 139, 255, 0.02)' },
            { offset: 1, color: 'rgba(203, 140, 255, 0.4)' },
          ]),
        },
      },
    ],
  };
};
