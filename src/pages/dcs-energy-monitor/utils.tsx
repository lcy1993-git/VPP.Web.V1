import Empty from '@/components/empty';
import {
  formatXAxis,
  handleInverterStatus,
  handleInverterStatus_psc,
  roundNumbers,
} from '@/utils/common';
import { history } from '@umijs/max';
import { Divider, Tooltip } from 'antd';
import * as echarts from 'echarts';
import styles from './index.less';
import Unit from './unit';

// 分布式能源总览-光伏
export const handleSolarData = (data: any) => {
  const { power, powerConversion, powerGeneration, powerGenerationConversion } = Unit;
  return [
    {
      label: '实时功率',
      unit: power,
      id: 1,
      value: parseInt(data?.realTimePower) / powerConversion,
      icon: 'icon-gongshuai',
    },
    {
      label: '日发电量',
      unit: powerGeneration,
      id: 2,
      value: parseInt(data?.dayGenerated) / powerGenerationConversion,
      icon: '',
    },
    {
      label: '累计发电量',
      unit: powerGeneration,
      id: 3,
      value: parseInt(data?.totalGenerated) / powerGenerationConversion,
      icon: '',
    },
  ];
};

// 分布式能源总览-储能
export const handleEssData = (data: any) => {
  const { power, powerConversion, powerGeneration, powerGenerationConversion } = Unit;
  return [
    {
      label: '实时功率',
      unit: power,
      id: 1,
      value: parseInt(data?.realTimePower) / powerConversion,
      icon: 'icon-gongshuai',
    },
    {
      label: '日充电量',
      unit: powerGeneration,
      id: 2,
      value: parseInt(data?.dayCharge) / powerGenerationConversion,
      icon: '',
    },
    {
      label: '日放电量',
      unit: powerGeneration,
      id: 3,
      value: parseInt(data?.dayDischarge) / powerGenerationConversion,
      icon: '',
    },
  ];
};

// 分布式能源总览-充电
export const handleChargeData = (data: any) => {
  const { powerGeneration, powerGenerationConversion } = Unit;
  return [
    {
      label: '日充电量',
      unit: powerGeneration,
      id: 1,
      value: parseInt(data?.dayCharge) / powerGenerationConversion,
      icon: '',
    },
    {
      label: '累计充电量',
      unit: powerGeneration,
      id: 2,
      value: parseInt(data?.totalCharge) / powerGenerationConversion,
      icon: '',
    },
  ];
};

// 分布式能源总览-光伏-曲线
export const solarOverviewChart = (powerMap: any, irradianceMap: any) => {
  if (!powerMap || !irradianceMap) return false;
  const powerKeys = Object.keys(powerMap);
  const irradianceKeys = Object.keys(irradianceMap);

  return {
    grid: {
      top: '15%',
      left: '4%',
      right: '4%',
      bottom: '5%',
      containLabel: true,
    },
    legend: {
      data: ['有功', '辐照'],
      x: 'center',
      textStyle: {
        color: '#E7FAFF',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    color: ['#39FFC5', '#FF7E30'],
    xAxis: {
      boundaryGap: false,
      type: 'category',
      data: formatXAxis(powerKeys || irradianceKeys, 'day'),
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.1)', // 设置 x 轴线颜色
        },
      },
      axisLabel: {
        textStyle: {
          fontSize: '10px',
          fontWeight: 400,
          color: 'rgba(231, 250, 255, 0.6)', // 设置 x 轴刻度文字颜色
        },
      },
    },
    yAxis: [
      {
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(231, 250, 255, 0.1)',
          },
        },
        axisLine: {
          lineStyle: {
            fontSize: '10px',
            fontWeight: 400,
            color: 'rgba(231, 250, 255, 0.6)', // 设置 y 轴文字颜色
          },
        },
        type: 'value',
        name: '有功/kW',
      },
      {
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(231, 250, 255, 0.1)',
          },
        },
        axisLine: {
          lineStyle: {
            fontSize: '10px',
            fontWeight: 400,
            color: 'rgba(231, 250, 255, 0.6)', // 设置 y 轴文字颜色
          },
        },
        type: 'value',
        name: '辐照/W',
      },
    ],
    series: [
      {
        name: '有功',
        type: 'line',
        data: powerKeys ? Object.values(powerMap) : [],
        yAxisIndex: 0, // 指定使用第一个 y 轴
        smooth: true, // 设置为 true，使折线变得平滑
        showSymbol: false, // 设置为 false，隐藏数据点
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(57, 255, 197, 0.03)' },
            { offset: 1, color: 'rgba(57, 255, 197, 0.3)' },
          ]),
        },
      },
      {
        name: '辐照',
        type: 'line',
        data: irradianceKeys ? Object.values(irradianceMap) : [],
        yAxisIndex: 1, // 指定使用第二个 y 轴
        smooth: true, // 设置为 true，使折线变得平滑
        showSymbol: false, // 设置为 false，隐藏数据点
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 126, 48, 0.05)' },
            { offset: 1, color: 'rgba(255, 126, 48, 0.3)' },
          ]),
        },
      },
    ],
  };
};

// 分布式能源总览-储能-曲线
export const essOverviewChart = (chargePower: any, disChargePower: any) => {
  if (!chargePower || !disChargePower) return false;
  const chargeKeys = Object.keys(chargePower);
  const dischargeKeys = Object.keys(disChargePower);

  return {
    grid: {
      top: '15%',
      left: '4%',
      right: '4%',
      bottom: '5%',
      containLabel: true,
    },
    legend: {
      data: ['充电', '放电'],
      x: 'center',
      textStyle: {
        color: '#E7FAFF',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    color: ['#3C8BE2', '#FF7E30'],
    xAxis: {
      boundaryGap: false,
      type: 'category',
      data: formatXAxis(chargeKeys || dischargeKeys, 'day'),
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.1)', // 设置 x 轴线颜色
        },
      },
      axisLabel: {
        textStyle: {
          fontSize: '10px',
          fontWeight: 400,
          color: 'rgba(231, 250, 255, 0.6)', // 设置 x 轴刻度文字颜色
        },
      },
    },
    yAxis: [
      {
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(231, 250, 255, 0.1)',
          },
        },
        axisLine: {
          lineStyle: {
            fontSize: '10px',
            fontWeight: 400,
            color: 'rgba(231, 250, 255, 0.6)', // 设置 y 轴文字颜色
          },
        },
        type: 'value',
        name: '充电/kWh',
      },
      {
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(231, 250, 255, 0.1)',
          },
        },
        axisLine: {
          lineStyle: {
            fontSize: '10px',
            fontWeight: 400,
            color: 'rgba(231, 250, 255, 0.6)', // 设置 y 轴文字颜色
          },
        },
        type: 'value',
        name: '放电/kWh',
      },
    ],
    series: [
      {
        name: '充电',
        type: 'line',
        data: chargeKeys ? Object.values(chargePower) : [],
        yAxisIndex: 0, // 指定使用第一个 y 轴
        smooth: true, // 设置为 true，使折线变得平滑
        showSymbol: false, // 设置为 false，隐藏数据点
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(60, 139, 226, 0.03)' },
            { offset: 1, color: 'rgba(60, 139, 226, 0.3)' },
          ]),
        },
      },
      {
        name: '放电',
        type: 'line',
        data: dischargeKeys ? Object.values(disChargePower) : [],
        yAxisIndex: 1, // 指定使用第二个 y 轴
        smooth: true, // 设置为 true，使折线变得平滑
        showSymbol: false, // 设置为 false，隐藏数据点
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 126, 48, 0.05)' },
            { offset: 1, color: 'rgba(255, 126, 48, 0.3)' },
          ]),
        },
      },
    ],
  };
};

// 分布式能源总览-充电-曲线
export const chargeOverviewChart = (powerMap: any) => {
  if (!powerMap) return false;
  const powerKeys = Object.keys(powerMap);
  if (powerKeys.length === 0) return false;
  return {
    grid: {
      top: '15%',
      left: '4%',
      right: '4%',
      bottom: '5%',
      containLabel: true,
    },
    legend: {
      data: ['充电桩总功率'],
      x: 'center',
      textStyle: {
        color: '#E7FAFF',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    color: ['#3C8BE2', '#FF7E30'],
    xAxis: {
      boundaryGap: false,
      type: 'category',
      data: formatXAxis(powerKeys, 'day'),
      axisLine: {
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.1)', // 设置 x 轴线颜色
        },
      },
      axisLabel: {
        textStyle: {
          fontSize: '10px',
          fontWeight: 400,
          color: 'rgba(231, 250, 255, 0.6)', // 设置 x 轴刻度文字颜色
        },
      },
    },
    yAxis: {
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(231, 250, 255, 0.1)',
        },
      },
      axisLine: {
        lineStyle: {
          fontSize: '10px',
          fontWeight: 400,
          color: 'rgba(231, 250, 255, 0.6)', // 设置 y 轴文字颜色
        },
      },
      type: 'value',
      name: '功率/kW',
    },
    series: [
      {
        name: '充电桩总功率',
        type: 'line',
        data: Object.values(powerMap),
        yAxisIndex: 0, // 指定使用第一个 y 轴
        smooth: true, // 设置为 true，使折线变得平滑
        showSymbol: false, // 设置为 false，隐藏数据点
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(60, 139, 226, 0.03)' },
            { offset: 1, color: 'rgba(60, 139, 226, 0.3)' },
          ]),
        },
      },
    ],
  };
};

// 企业概览-充电-数据列表
export const renderChargeList = (data: any) => {
  const { chargingCapacity, tower } = Unit;
  const chargeData = [
    {
      label: '总充电量',
      unit: chargingCapacity,
      id: 1,
      value: data?.totalCharge,
    },
    {
      label: '设备台数',
      unit: tower,
      id: 2,
      value: data?.deviceNum,
    },
    {
      label: '运行数量',
      unit: tower,
      id: 3,
      value: data?.operatingNum,
    },
    {
      label: '停机数量',
      unit: tower,
      id: 4,
      value: data?.shutDownNum,
    },
    {
      label: '故障数量',
      unit: tower,
      id: 5,
      value: data?.failuresNum,
    },
  ];
  return (
    <div className={styles.list}>
      {chargeData.map((item: any) => {
        return (
          <div className={styles.listItem} key={item.id}>
            <dl className={styles.listItemLabel}>
              <dt className={styles.label}>{item.label}</dt>
              <dd>
                <span className={styles.value}>{item.value || '-'}</span>
                <span className={styles.label}>{item.unit}</span>
              </dd>
            </dl>
            {item.id !== 5 && (
              <Divider style={{ height: 40, justifyContent: 'flex-end' }} type="vertical" />
            )}
          </div>
        );
      })}
    </div>
  );
};

// 设备在线概况
export const onlineChart = (data: any) => {
  if (!data) return false;
  const deviceName = Object.keys(data?.onlineMap);
  if (deviceName.length === 0) return false;
  const deviceValue = Object.values(data?.onlineMap);
  return {
    title: {
      text: [`{a|设备在线率：}{b|${data?.uptime}%}`],
      left: 'center', // 设置标题水平居中
      top: 20, // 设置标题距离顶部的距离
      textStyle: {
        rich: {
          a: {
            fontSize: 20,
            color: '#fff',
          },
          b: {
            fontWeight: 'bold',
            fontSize: 30,
            color: '#0084FF',
          },
        },
      },
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      data: deviceName,
      bottom: '5%',
      left: 'center',
      textStyle: {
        color: '#E7FAFF',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    color: ['#D46B5E', '#00A2FF', '#37E2E7', '#FFC965'],
    series: [
      {
        type: 'pie',
        radius: ['40%', '50%'],
        label: {
          position: 'center',
          formatter: `{a|${data?.uptimeDeviceNum}}\n\n{b|在线设备}\n{b|（台）}`,
          rich: {
            a: {
              fontWeight: 'bold',
              color: '#fff', // 数字颜色白色
              fontSize: 28,
            },
            b: {
              color: '#abadbc', // 在线设备文字颜色
              fontSize: 14,
            },
          },
        },
        avoidLabelOverlap: false,
        padAngle: 3, // 间隙大小
        labelLine: {
          show: false,
        },
        data: deviceName.map((name, index) => ({
          value: deviceValue[index],
          name,
        })),
      },
    ],
    graphic: [
      {
        type: 'image',
        left: '30%',
        top: 'center',
        style: {
          image: require('../../assets/image/dcs-energy-monitor/left-image.png'),
          width: 36,
          height: 151,
        },
      },
      {
        type: 'image',
        id: 'right-image',
        right: '30%',
        top: 'center',
        style: {
          image: require('../../assets/image/dcs-energy-monitor/right-image.png'),
          width: 36,
          height: 151,
        },
      },
    ],
  };
};

// 企业设备概览-逆变器
export const renderInverterList = (data: any, type: string, subStationCode: string) => {
  const { outPower, generateDay } = Unit;
  return (
    <div className={styles.inverterWrap}>
      {data?.map((item: any) => {
        return (
          <div className={styles.moduleItem} key={item.deviceName}>
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
                      type === '光伏'
                        ? history.push('/device-detail', {
                            devicetype: 'inverter',
                            deviceCode: item.deviceCode,
                            siteType: 'dcs',
                            subStationCode: subStationCode,
                          })
                        : history.push('/device-detail', {
                            devicetype: item.type === 40 ? 'AC' : 'DC',
                            deviceCode: item.deviceCode,
                            siteType: 'dcs',
                            subStationCode: subStationCode,
                          })
                    }
                  >
                    #{item.deviceName}
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
                {type === '光伏' && (
                  <div className={styles.value}>
                    <span>额定功率：</span>
                    <span>
                      {roundNumbers(item.ratedPower)} {outPower}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.ItemList}>
              <dl>
                <dt>当前有功</dt>
                <dd>
                  <Tooltip placement="top" title={`${roundNumbers(item.outPower)}${outPower}`}>
                    {roundNumbers(item.outPower)} {outPower}
                  </Tooltip>
                </dd>
              </dl>
              <Divider style={{ height: 40, top: 4 }} type="vertical" />
              <dl>
                <dt>当日电量</dt>
                <dd>
                  <Tooltip
                    placement="top"
                    title={`${roundNumbers(item.generateDay)}${generateDay}`}
                  >
                    {roundNumbers(item.generateDay)} {generateDay}
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

// 企业设备概览-pcs
export const renderPcsList = (data: any, subStationCode: string) => {
  const { outPower, generateDay } = Unit;
  return (
    <div className={styles.inverterWrap}>
      {data?.map((item: any) => {
        return (
          <div className={styles.moduleItem} key={item.deviceCode} style={{ height: '220px' }}>
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
                  <span
                    onClick={() =>
                      history.push('/device-detail', {
                        devicetype: 'PCS',
                        deviceCode: item.deviceCode,
                        siteType: 'dcs',
                        subStationCode: subStationCode,
                      })
                    }
                  >
                    #{item.deviceName}
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
                  <span>
                    {roundNumbers(item.ratedPower)} {outPower}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.ItemList}>
              <dl>
                <dt>有功功率</dt>
                <dd>
                  <Tooltip placement="top" title={`${roundNumbers(item.activePower)}${outPower}`}>
                    {roundNumbers(item.activePower)}
                    {outPower}
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
                  <Tooltip
                    placement="top"
                    title={`${roundNumbers(item.todayChargeCapacity)}${generateDay}`}
                  >
                    {roundNumbers(item.todayChargeCapacity)}
                    {generateDay}
                  </Tooltip>
                </dd>
              </dl>
              <Divider style={{ height: 40, top: 4 }} type="vertical" />
              <dl>
                <dt>当日放电电量</dt>
                <dd>
                  <Tooltip
                    placement="top"
                    title={`${roundNumbers(item.todayDisChargeCapacity)}${generateDay}`}
                  >
                    {roundNumbers(item.todayDisChargeCapacity)}
                    {generateDay}
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

// TODO status
// 企业设备概览-BMS
export const renderBmsList = (data: any, subStationCode: string) => {
  const { outPower, generateDay } = Unit;
  return (
    <div className={styles.inverterWrap}>
      {data?.map((item: any) => {
        return (
          <div className={styles.moduleItem} key={item.deviceName}>
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
                        devicetype: 'BMS',
                        deviceCode: item.deviceCode,
                        siteType: 'dcs',
                        subStationCode: subStationCode,
                      })
                    }
                  >
                    #{item.deviceName}
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
              </div>
            </div>
            <div className={styles.ItemList}>
              <dl>
                <dt>当前放电功率</dt>
                <dd>
                  <Tooltip placement="top" title={`${roundNumbers(item.outPower)}${outPower}`}>
                    {roundNumbers(item.outPower)} {outPower}
                  </Tooltip>
                </dd>
              </dl>
              <Divider style={{ height: 40, top: 4 }} type="vertical" />
              <dl>
                <dt>剩余电量</dt>
                <dd>
                  <Tooltip
                    placement="top"
                    title={`${roundNumbers(item.availableDischargeCapacity)}${generateDay}`}
                  >
                    {roundNumbers(item.availableDischargeCapacity)} {generateDay}
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

// 企业设备概览
export const renderDeviceList = (
  type: string,
  data: any,
  essType: string,
  subStationCode: string,
) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.inverterWrap}>
        <Empty />
      </div>
    );
  }
  if (type === '光伏') {
    return renderInverterList(data, type, subStationCode);
  } else if (type === '储能') {
    if (essType === 'PCS') return renderPcsList(data, subStationCode);
    else return renderBmsList(data, subStationCode);
  } else {
    return renderInverterList(data, type, subStationCode);
  }
};
