import { handleInverterStatus, roundNumbers } from '@/utils/common';
import { history } from '@umijs/max';
import { Divider, Tooltip } from 'antd';
import styles from './index.less';
import Unit from './unit';

// header数据
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

// 充电桩运行状态
export const renderList = (data: any, subStationCode: string) => {
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
                        devicetype: item.type === 41 ? 'DC' : 'AC',
                        deviceCode: item.deviceCode,
                        siteType: 'charge',
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
