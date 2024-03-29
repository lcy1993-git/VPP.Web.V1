import ContentPage from '@/components/content-page';
import CustomCard from '@/components/custom-card';
import Empty from '@/components/empty';
import { getClusterBasisData, getPcsBasisData } from '@/services/energy-station';
import { getInverterPower } from '@/services/power-station';
import { getSubstationDevice, getUserStation } from '@/services/runtime-monitor/history';
import { handleInverterStatus } from '@/utils/common';
import { SUBSTASIONDEVICETYPE } from '@/utils/enum';
import { SearchOutlined } from '@ant-design/icons';
import { history, useLocation, useRequest } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { Button, Form, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ClusterMiddleRight from './components/cluster-middle-right';
import ClusterTemperature from './components/cluster-temperature';
import DeviceRunTime from './components/device-run-time';
import InverterMiddleRight from './components/inverter-middle-right';
import InverterPowerCurve from './components/inverter-power-curve';
import MeasurePointBottom from './components/measure-point-bottom';
import CircularChart from './components/pcs-circular-chart';
import PcsMiddleRight from './components/pcs-middle-right';
import PowerStatistics from './components/pcs-power-statistics';
import styles from './index.less';

type currentDevType = 'PCS' | 'BMS' | 'inverter' | 'DC' | 'AC' | null;
type circleDataType = {
  pathColor?: string; // 圆环颜色
  value: string | number; // 值
  textName: string; // 名称
  subTitle: string; // 副标题
  id: string | number;
  chartWidth?: number; // 圆环最外层宽度
  name?: string;
  subName?: string;
  circleRingChartRatio?: string | number; //圆环占比
};

const DeviceDetail = () => {
  const { state }: { state: any } = useLocation();
  // 表单实例
  const [searchForm] = Form.useForm();
  const substationName = Form.useWatch('substationName', searchForm);
  const type = Form.useWatch('type', searchForm);
  // 设备类型
  const [deviceType, setDeviceType] = useState<currentDevType>(null);
  // 当前设备ID
  const [deviceId, setDeviceId] = useState<string | null>(null);
  // 当前用户能访问的电站
  const [currUserSite, setCurrUserSite] = useState<any[]>([]);
  // 站点下面的设备数据
  const [deviceList, setDeviceList] = useState([]);
  // 圆环图数据
  const [circleRingData, setCircleRingData] = useState<circleDataType[]>([]);
  // 设备运行状态数据 页面右上角
  const [runTimeData, setRuntimeData] = useState<any[]>([]);
  // 设备运行状态
  const [deviceRunStatus, setDeviceRunStatus] = useState('');
  // 是否需要清空deviceName
  const isClearRef = useRef<boolean>(true);

  // 获取用户可以访问的站点名称
  const {} = useRequest(getUserStation, {
    manual: false,
    onSuccess: (resolve: any) => {
      const { dataList } = resolve;
      if (dataList) {
        setCurrUserSite(dataList);
      }
    },
  });

  // 或者站点下的设备
  const { run: fetchSubstationDevice } = useRequest(getSubstationDevice, {
    manual: true,
    onSuccess: (resolve: any) => {
      if (resolve) {
        setDeviceList(resolve);
      }
    },
  });

  // PCS设备详情数据 head 圆环数据
  const { run: fetchPcsBasisData } = useRequest(getPcsBasisData, {
    manual: true,
    onSuccess: (result: any) => {
      if (result) {
        const dataList: circleDataType[] = [
          {
            pathColor: '#a76ffe',
            value: result.outPower || 0,
            name: '输出功率',
            subName: '',
            textName: '输出功率',
            subTitle: 'kW',
            id: 1,
            chartWidth: 150,
          },
          {
            pathColor: '#006eff',
            value: result.dcPower || 0,
            name: '直流功率',
            subName: '',
            textName: '直流功率',
            subTitle: 'kW',
            id: 2,
            chartWidth: 150,
          },
          {
            pathColor: '#a76ffe',
            value: result.chargeDischargePower || 0,
            name: '充放电效率',
            subName: '',
            textName: '充放电效率',
            subTitle: '％',
            id: 3,
            chartWidth: 150,
          },
          {
            pathColor: '#0dcad4',
            value: result.dayCharge || 0,
            name: '日充电量',
            subName: '',
            textName: '日充电量',
            subTitle: 'kWh',
            id: 4,
            chartWidth: 150,
          },
          {
            pathColor: '#ecab1d',
            value: result.dayDisCharge || 0,
            name: '日放电量',
            subName: '',
            textName: '日放电量',
            subTitle: 'kWh',
            id: 5,
            chartWidth: 150,
          },
        ];
        const runTime = [
          {
            id: 1,
            title: 'A/B/C相电流',
            icon: <i className="iconfont">&#xe653;</i>,
            value: `${result.termACurrent || 0}/${result.termBCurrent || 0}/${
              result.termCCurrent || 0
            }A`,
            blockBackgroundValue: '#C754C0',
            dataBackgroundValue: '#AB4C84',
          },
          {
            id: 2,
            title: '三相总无功功率',
            icon: <i className="iconfont">&#xe670;</i>,
            value: `${result.threePhaseTotalReactivePower || 0}kVar`,
            blockBackgroundValue: '#54C478',
            dataBackgroundValue: '#449E62',
          },
          {
            id: 3,
            title: '直流电流',
            icon: <i className="iconfont">&#xe653;</i>,
            value: `${result.dcCurrent || 0}A`,
            blockBackgroundValue: '#2B74D4',
            dataBackgroundValue: '#1E5DB0',
          },
          {
            id: 4,
            title: '总功率因数',
            icon: <i className="iconfont">&#xe672;</i>,
            value: `${result.totalPowerFactor || 0}`,
            blockBackgroundValue: '#D34F5C',
            dataBackgroundValue: '#953942',
          },
          {
            id: 5,
            title: '频率',
            icon: <i className="iconfont">&#xe66c;</i>,
            value: `${result.frequency || 0}Hz`,
            blockBackgroundValue: '#11D6D7',
            dataBackgroundValue: '#068C8D',
          },
          {
            id: 6,
            title: '散热器温度',
            icon: <i className="iconfont">&#xe66b;</i>,
            value: `${result.radiatorTemperature || 0}℃`,
            blockBackgroundValue: '#E9B63A',
            dataBackgroundValue: '#C49544',
          },
        ];

        // 后端接口定义运行状态 目前可能返回的值不只 0 1，目前把0当作运行，非0当作停止
        const status = ['运行'];
        setDeviceRunStatus(status[result.status] || '停止');
        setRuntimeData(runTime);
        setCircleRingData(dataList);
      }
    },
  });

  // 电磁簇设备详情 head 圆环\设备运行状态数据
  const { run: fetchClusterBasisData } = useRequest(getClusterBasisData, {
    manual: true,
    onSuccess: (result: any) => {
      if (result) {
        const dataList: circleDataType[] = [
          {
            pathColor: '#006eff',
            value: result.soc || 0,
            textName: 'SOC',
            subTitle: '%',
            id: 1,
            chartWidth: 140,
          },
          {
            pathColor: '#a76ffe',
            value: result.soh || 0,
            textName: 'SOH',
            subTitle: '%',
            id: 2,
            chartWidth: 140,
          },
          {
            pathColor: '#a76ffe',
            value: result.maxChargeElectricity || 0,
            textName: '最大充电电流',
            subTitle: 'A',
            id: 5,
            chartWidth: 140,
          },
          {
            pathColor: '#ecab1d',
            value: result.maxDisChargeElectricity || 0,
            textName: '最大放电电流',
            subTitle: 'A',
            id: 6,
            chartWidth: 140,
          },
        ];
        const runTime = [
          {
            id: 1,
            title: '当前总电压',
            icon: <i className="iconfont">&#xe673;</i>,
            value: `${result?.voltage || 0} V`,
            blockBackgroundValue: '#C754C0',
            dataBackgroundValue: '#AB4C84',
          },
          {
            id: 2,
            title: '当前总电流',
            icon: <i className="iconfont">&#xe671;</i>,
            value: `${result?.electricity || 0} A`,
            blockBackgroundValue: '#54C478',
            dataBackgroundValue: '#449E62',
          },
          {
            id: 3,
            title: '单体最高温度及编号',
            icon: <i className="iconfont">&#xe66b;</i>,
            value: `${result?.maxTemperature || 0} ℃/${parseInt(result.maxTemperaturePosition)}`,
            blockBackgroundValue: '#2B74D4',
            dataBackgroundValue: '#1E5DB0',
          },
          {
            id: 4,
            title: '单体最低温度及编号',
            icon: <i className="iconfont">&#xe66b;</i>,
            value: `${result?.minTemperature || 0} ℃/${parseInt(result.minTemperaturePosition)}`,
            blockBackgroundValue: '#D34F5C',
            dataBackgroundValue: '#953942',
          },
          {
            id: 5,
            title: '单体最高电压及编号',
            icon: <i className="iconfont">&#xe66b;</i>,
            value: `${result?.maxVoltage || 0} V/${parseInt(result.maxVoltagePosition)}`,
            blockBackgroundValue: '#11D6D7',
            dataBackgroundValue: '#068C8D',
          },
          {
            id: 6,
            title: '单体最低电压及编号',
            icon: <i className="iconfont">&#xe66b;</i>,
            value: `${result?.minVoltage || 0} V/${parseInt(result.minVoltagePosition)}`,
            blockBackgroundValue: '#E9B63A',
            dataBackgroundValue: '#C49544',
          },
        ];
        // 后端接口定义运行状态 目前可能返回的值不只 0 1，目前把0当作运行，非0当作停止
        const status = ['运行'];
        setDeviceRunStatus(status[result.status] || '停止');
        setRuntimeData(runTime);
        setCircleRingData(dataList);
      }
    },
  });

  // 逆变器设备详情 head 圆环数据
  const { run: fetchInverterPower } = useRequest(getInverterPower, {
    manual: true,
    onSuccess: (result: any) => {
      if (result) {
        const dataList: circleDataType[] = [
          {
            pathColor: '#1cc078',
            value: result.outputPower || 0,
            textName: '输出功率',
            subTitle: 'kW',
            id: 1,
            chartWidth: 160,
          },
          {
            pathColor: '#9c77fe',
            value:
              parseInt(result.conversionEfficiency) === 0
                ? '-'
                : result.conversionEfficiency || '-',
            textName: '转换效率',
            subTitle: '%',
            id: 2,
            chartWidth: 160,
          },
          {
            pathColor: '#ff7e6f',
            value: result.equivalentHours || 0,
            textName: '等效小时数',
            subTitle: 'h',
            id: 3,
            chartWidth: 160,
            circleRingChartRatio: ((result?.equivalentHours / 6) * 100).toFixed(2),
          },
        ];
        const runTime = [
          {
            id: 1,
            title: '当日发电量',
            icon: <i className="iconfont">&#xe63b;</i>,
            value: `${result.dailyPowerGeneration || 0} kWh`,
            blockBackgroundValue: '#54C478',
            dataBackgroundValue: '#449E62',
          },
          {
            id: 1,
            title: '总发电量',
            icon: <i className="iconfont">&#xe648;</i>,
            value: `${result.totalPowerGeneration || 0} kWh`,
            blockBackgroundValue: '#977EFF',
            dataBackgroundValue: '#6449D5',
          },
        ];
        // 后端接口定义运行状态 目前可能返回的值不只 0 1，目前把0当作运行，非0当作停止
        setDeviceRunStatus(handleInverterStatus(result.status));
        setRuntimeData(runTime);
        setCircleRingData(dataList);
      }
    },
  });

  // middle 左侧
  const renderMiddleLeft = () => {
    if (deviceType) {
      switch (deviceType) {
        case 'PCS':
          return <PowerStatistics deviceCode={deviceId} />;
        case 'BMS':
          return <ClusterTemperature deviceCode={deviceId} />;
        case 'inverter': // 逆变器
          return <InverterPowerCurve deviceCode={deviceId} type="inverter" />;
        case 'AC':
        case 'DC':
          return <InverterPowerCurve deviceCode={deviceId} type="charge" />;
      }
    } else {
      return (
        <div className={styles.flex_center} style={{ width: '100%', height: '100%' }}>
          <Empty />
        </div>
      );
    }
  };

  // middle right
  const renderMiddleRight = () => {
    if (deviceType) {
      switch (deviceType) {
        case 'PCS':
          return <PcsMiddleRight deviceCode={deviceId} />;
        case 'BMS':
          return <ClusterMiddleRight deviceCode={deviceId} />;
        case 'inverter': // 逆变器
          return <InverterMiddleRight deviceCode={deviceId} />;
      }
    } else {
      return (
        <div className={styles.flex_center} style={{ width: '100%', height: '100%' }}>
          <Empty />
        </div>
      );
    }
  };

  // 返回上一级
  const backPage = () => {
    if (state?.siteType === 'energy') {
      // 从储能电站过来的
      history.push('/energy-station', { subStationCode: state?.subStationCode });
    } else if (state?.siteType === 'solar') {
      // 从光伏电站过来的
      history.push('/power-station', { subStationCode: state?.subStationCode });
    } else if (state?.siteType === 'charge') {
      // 从充电电站过来的
      history.push('/charging-station', { subStationCode: state?.subStationCode });
    } else if (state?.siteType === 'dcs') {
      // 从分布式能源
      history.back();
    }
  };

  // 点击查询按钮
  const searchDeviceInfo = (values: any) => {
    const { deviceName, type } = values;
    if (type) {
      setDeviceType(type);
      setDeviceId(deviceName);
    }
  };

  // 请求电站下面的设备信息
  useUpdateEffect(() => {
    const device = SUBSTASIONDEVICETYPE.find((item) => item.value === type);
    if (device) {
      // 路由跳转使得substationName、type改变不请空
      if (isClearRef.current) searchForm.setFieldValue('deviceName', null);
      fetchSubstationDevice(substationName, device.code);
      isClearRef.current = true;
    }
  }, [substationName, type]);

  useEffect(() => {
    if (state) {
      // 如果state存在，表示从其他路由跳转过来， 反之通过菜单进入
      // setSolarOrenergy(state?.siteType);
      setDeviceType(state?.devicetype);
      setDeviceId(state?.deviceCode);
      isClearRef.current = false;
      searchForm.setFieldValue('substationName', state?.subStationCode);
      searchForm.setFieldValue('type', state?.devicetype);
      searchForm.setFieldValue('deviceName', state?.deviceCode);
    }
  }, [state]);

  // 请求数据
  useEffect(() => {
    if (deviceType) {
      // 如果state存在，表示从其他路由跳转过来， 反之通过菜单进入
      switch (deviceType) {
        case 'PCS':
          fetchPcsBasisData(deviceId);
          break;
        case 'BMS': // 电池簇
          fetchClusterBasisData(deviceId);
          break;
        case 'inverter': // 逆变器
          fetchInverterPower(deviceId);
          break;
      }
    }
  }, [deviceType, deviceId]);

  return (
    <ContentPage>
      <div className={styles.detailPage}>
        {/* head */}
        <div className={styles.detailHead}>
          <div className={styles.formWrap}>
            <Form
              style={{ width: 1000 }}
              form={searchForm}
              name="horizontal_login"
              layout="inline"
              onFinish={searchDeviceInfo}
            >
              <Form.Item
                label="站点名称"
                name="substationName"
                required
                rules={[{ required: true, message: '请选择站点' }]}
              >
                <Select
                  options={currUserSite}
                  style={{ width: 200 }}
                  placeholder="请选择站点"
                  fieldNames={{
                    label: 'name',
                    value: 'substationCode',
                  }}
                />
              </Form.Item>
              <Form.Item
                label="设备类型"
                name="type"
                required
                rules={[{ required: true, message: '请选择设备类型' }]}
              >
                <Select
                  options={SUBSTASIONDEVICETYPE}
                  placeholder="请选择设备类型"
                  style={{ width: 200 }}
                />
              </Form.Item>
              <Form.Item
                label="设备名称"
                name="deviceName"
                required
                rules={[{ required: true, message: '请选择设备' }]}
              >
                <Select
                  options={deviceList}
                  fieldNames={{ label: 'name', value: 'deviceCode' }}
                  placeholder="请选择设备"
                  style={{ width: 200 }}
                />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit">
                  <SearchOutlined />
                  查询
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className={styles.backBtn}>
            {state?.siteType ? <Button onClick={backPage}>返回</Button> : null}
          </div>
        </div>

        <div className={styles.detailBody}>
          {/* top */}
          {deviceType === 'AC' || deviceType === 'DC' ? (
            <></>
          ) : (
            <div className={`${styles.echartWrap} ${styles.marginB20}`}>
              <div className={styles.echartWrapLeft}>
                <CustomCard>
                  <CircularChart circleRingData={circleRingData} />
                </CustomCard>
              </div>
              <div className={`${styles.echartWrapRight} ${styles.marginL20}`}>
                <CustomCard>
                  <div className={styles.deviceRunStatus}>
                    {runTimeData.length ? (
                      <div className={styles.statusTitle}>
                        {deviceRunStatus === '运行' ? (
                          <i className={`iconfont ${styles.icon}`} style={{ color: '#00FF90' }}>
                            &#xe662;
                          </i>
                        ) : (
                          <i className={`iconfont ${styles.icon}`} style={{ color: '#FF3838' }}>
                            &#xe661;
                          </i>
                        )}
                        <span style={{ color: deviceRunStatus === '运行' ? '#00FF90' : '#FF3838' }}>
                          {deviceRunStatus}
                        </span>
                      </div>
                    ) : null}

                    <div className={styles.statusMain}>
                      <DeviceRunTime runTimeData={runTimeData} />
                    </div>
                  </div>
                </CustomCard>
              </div>
            </div>
          )}

          {/* middle */}
          <div className={`${styles.echartWrap} ${styles.marginB20}`}>
            <div className={styles.echartWrapLeft}>
              <CustomCard>{renderMiddleLeft()}</CustomCard>
            </div>
            {deviceType === 'AC' || deviceType === 'DC' ? (
              <></>
            ) : (
              <div className={`${styles.echartWrapRight} ${styles.marginL20}`}>
                <CustomCard>{renderMiddleRight()}</CustomCard>
              </div>
            )}
          </div>
          {/* bottom */}
          <div className={`${styles.echartWrap}`} style={{ height: 'auto' }}>
            <div className={styles.echartWrapLeft}>
              <CustomCard>
                <MeasurePointBottom deviceCode={deviceId} deviceType={deviceType} />
              </CustomCard>
            </div>
          </div>
        </div>
      </div>
    </ContentPage>
  );
};
export default DeviceDetail;
