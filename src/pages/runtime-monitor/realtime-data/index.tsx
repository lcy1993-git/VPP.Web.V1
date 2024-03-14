import ContentPage from '@/components/content-page';
import CustomCard from '@/components/custom-card';
import Empty from '@/components/empty';
import SegmentedTheme from '@/components/segmented-theme';
import { getDevicesInfo, getDevicesName } from '@/services/runtime-monitor/realtime';
import { groupData } from '@/utils/common';
import { useRequest } from '@umijs/max';
import { Cascader, Form, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

const RealtimeData = () => {
  const [form] = Form.useForm();
  // 设备名称数据
  const [deviceNameSelect, setDeviceNameSelect] = useState<any[]>([]);
  // 遥测
  const [telemetry, setTelemetry] = useState([]);

  // 获取设备名称
  const { run: fetchDevice } = useRequest(getDevicesName, {
    manual: true,
    onSuccess: async (res) => {
      const stationData = res?.map((item: any) => {
        return {
          deviceCode: item.deviceCode,
          name: item.name,
          isLeaf: false,
        };
      });
      if (stationData?.length) {
        form.setFieldValue('deviceCode', [stationData[0].deviceCode]);
        setDeviceNameSelect(stationData || []);
        const { code, data } = await getDevicesInfo({
          deviceCode: stationData[0].deviceCode,
        });
        if (code === 200 && data) {
          setTelemetry(data.ycDataList || []);
        }
      }
    },
  });
  // 加载下拉框数据  selectedOptions当前选中的选项数据
  const loadData = async (selectedOptions: any[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const result = await getDevicesName({ deviceCode: targetOption.deviceCode });
    const { code, data } = result;

    if (code === 200 && data) {
      const deviceChild = data.map((item: any) => {
        return {
          ...item,
          isLeaf: false,
        };
      });
      if (!deviceChild.length) {
        delete targetOption.isLeaf;
      }

      targetOption.children = deviceChild;
    } else {
      delete targetOption.isLeaf;
    }
    setDeviceNameSelect([...deviceNameSelect]);
  };

  // 遥测
  const renderTelemetry = () => {
    if (!telemetry || !telemetry.length) {
      return (
        <div className={styles.emptyflexCenter}>
          <Empty />
        </div>
      );
    }
    const groupedData = groupData(telemetry);
    // 卡片布局
    const renderTelemetryGroup = (groupData: any) => (
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        {groupData?.map((item: any) => {
          return (
            <div className={styles.card} key={item.measurementId}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <Tooltip title={item.dataDesc}>
                    <span>{item.dataDesc}</span>
                  </Tooltip>
                  <span>{item.unit}</span>
                </div>
                <div className={styles.cardUnit}>{item.measurementUnit || ''}</div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardCon}>
                  {item.data === 'NaN' || !item.data ? '-' : item.data}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
    // 渲染每一组遥测数据
    return (
      <>
        {groupedData['KWH']?.length !== 0 && renderTelemetryGroup(groupedData['KWH'])}
        {groupedData['元']?.length !== 0 && renderTelemetryGroup(groupedData['元'])}
        {groupedData['元/度']?.length !== 0 && renderTelemetryGroup(groupedData['元/度'])}
        {groupedData['T']?.length !== 0 && renderTelemetryGroup(groupedData['T'])}
        {groupedData['KW']?.length !== 0 && renderTelemetryGroup(groupedData['KW'])}
        {groupedData['V']?.length !== 0 && renderTelemetryGroup(groupedData['V'])}
        {groupedData['A']?.length !== 0 && renderTelemetryGroup(groupedData['A'])}
        {groupedData['other']?.length !== 0 && renderTelemetryGroup(groupedData['other'])}
      </>
    );
  };

  useEffect(() => {
    fetchDevice('');
  }, []);

  // 选择设备变化回调
  const handleChange = async (value: any) => {
    if (value) {
      const selectCode = value.filter((item: any) => item);
      if (selectCode.length) {
        const { code, data } = await getDevicesInfo({
          deviceCode: selectCode[selectCode.length - 1],
        });
        if (code === 200 && data) {
          setTelemetry(data.ycDataList || []);
        }
      }
    } else {
      message.warning('请选择设备');
    }
  };

  return (
    <ContentPage>
      <CustomCard>
        <div className={styles.container}>
          <div className={styles.formCondition}>
            <Form form={form}>
              <Form.Item name="deviceCode" label="设备名称">
                <Cascader
                  options={deviceNameSelect}
                  placeholder="请选择设备名称"
                  loadData={loadData}
                  changeOnSelect
                  fieldNames={{
                    label: 'name',
                    value: 'deviceCode',
                  }}
                  style={{ width: 300 }}
                  onChange={handleChange}
                />
              </Form.Item>
            </Form>
          </div>
          <div className={styles.segmentedTheme}>
            <SegmentedTheme options={['色块', '表格']} />
          </div>
        </div>
        {/* 遥测 */}
        <div className={styles.cardWrap}>{renderTelemetry()}</div>
      </CustomCard>
    </ContentPage>
  );
};
export default RealtimeData;
