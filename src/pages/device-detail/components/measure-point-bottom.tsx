import Empty from '@/components/empty';
import SegmentedTheme from '@/components/segmented-theme';
import { getMeasurePoint } from '@/services/energy-station';
import { groupData } from '@/utils/common';
import { useRequest } from '@umijs/max';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import RemoteSignalCard from './remote-signal-card';
import TelemetryCard from './telemetry-card';
import { measurePointColumns } from './utils';

const MeasurePointBottom = (props: any) => {
  const { deviceCode, deviceType } = props;

  // 测点分段显示器数据
  const [segmentedOptions, setSegmentedOptions] = useState<string[]>([]);

  // 色块显示或者表格显示 true: 色块显示； false：表格展示
  const [blockOrTable, setBlockOrTable] = useState<boolean>(true);

  // 测点表格数据
  const [measurePointTable, setMeasurePointTable] = useState<any[]>([]);

  // 功率曲线 -- 分段器切换状态
  const [selectedValue, setSelectedValue] = useState<string>('遥测值');

  // PCS 测点
  const { run: fetchMeasurePoint, data: measurePoint } = useRequest(getMeasurePoint, {
    manual: true,
  });

  // 遥测分组
  const handleYcDataList = (data: any) => {
    // 定义排序顺序
    const order: any = { KWH: 1, 元: 2, '元/度': 3, T: 4, KW: 5, MV: 6, V: 7, A: 8 };
    const groupedData_ = groupData(data);

    // 将 '-' 移除
    const minusData = groupedData_['-'];
    delete groupedData_['-'];

    // 根据排序顺序对键进行排序
    const sortedKeys = Object.keys(groupedData_).sort((a, b) => {
      if (a === '-') return 1; // '-' 排在最后
      if (b === '-') return -1; // '-' 排在最后
      return (order[a] || Infinity) - (order[b] || Infinity);
    });
    // 将 '-' 放到排序后的末尾
    sortedKeys.push('-');

    // 重新构造排序后的对象
    const groupedData: any = {};
    sortedKeys.forEach((key) => {
      groupedData[key] = groupedData_[key];
    });

    // 将 '-' 数据添加到末尾
    groupedData['-'] = minusData;

    // 卡片布局
    const renderTelemetryGroup = (groupData: any) => (
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        {groupData?.map((item: any) => (
          <TelemetryCard
            key={item.measurementId}
            dataType={item.dataDesc || '-'}
            value={item.data || '0'}
            dataUnit={item.unit || '-'}
            isDisplay={selectedValue === '遥测值'}
          />
        ))}
      </div>
    );

    console.log(groupedData);

    // 渲染每一组遥测数据
    return (
      <>
        {
          Object.keys(groupedData).map((item) => {
            return groupedData[item].length !== 0 ? renderTelemetryGroup(groupedData[item]) : '';
          })
          // groupedData.map(item => {
          //   return item.length !== 0 ? renderTelemetryGroup(item) : ''
          // })
        }
        {/* {groupedData['KWH']?.length !== 0 && renderTelemetryGroup(groupedData['KWH'])}
        {groupedData['元']?.length !== 0 && renderTelemetryGroup(groupedData['元'])}
        {groupedData['元/度']?.length !== 0 && renderTelemetryGroup(groupedData['元/度'])}
        {groupedData['T']?.length !== 0 && renderTelemetryGroup(groupedData['T'])}
        {groupedData['KW']?.length !== 0 && renderTelemetryGroup(groupedData['KW'])}
        {groupedData['V']?.length !== 0 && renderTelemetryGroup(groupedData['V'])}
        {groupedData['A']?.length !== 0 && renderTelemetryGroup(groupedData['A'])}
        {groupedData['MV']?.length !== 0 && renderTelemetryGroup(groupedData['MV'])}
        {groupedData['other']?.length !== 0 && renderTelemetryGroup(groupedData['other'])} */}
      </>
    );
  };

  // 测点 展示数据
  const renderMeasure = () => {
    switch (selectedValue) {
      case '遥测值':
        return measurePoint?.ycDataList.length ? (
          handleYcDataList(measurePoint?.ycDataList)
        ) : (
          <div className={styles.flex_center} style={{ width: '100%', height: '100%' }}>
            <Empty />
          </div>
        );
      case '遥信值':
        return measurePoint?.yxDataList.length ? (
          measurePoint?.yxDataList.map((item: any) => {
            return (
              <RemoteSignalCard
                key={item.measurementId}
                title={item.dataDesc || '-'}
                isDisplay={selectedValue === '遥信值'}
                isNormal={parseInt(item.data) === 0}
              />
            );
          })
        ) : (
          <div className={styles.flex_center} style={{ width: '100%', height: '100%' }}>
            <Empty />
          </div>
        );
      case '电度值':
        return measurePoint?.ymDataList.length ? (
          measurePoint?.ymDataList.map((item: any) => {
            return (
              <TelemetryCard
                key={item.measurementId}
                dataType={item.dataDesc}
                value={item.data}
                cardBackgroundValue="linear-gradient(270deg, #0083B3 0%, #00C7B2 100%)"
                isDisplay={selectedValue === '电度值'}
              />
            );
          })
        ) : (
          <div className={styles.flex_center} style={{ width: '100%', height: '100%' }}>
            <Empty />
          </div>
        );
    }
  };

  // 当数据展示方式为表格的时候，切换测点数据对应变化
  const changePointType = (value: string) => {
    setSelectedValue(value);
    if (!blockOrTable) {
      switch (value) {
        case '遥测值':
          setMeasurePointTable(groupData(measurePoint.ycDataList, true) || []);
          break;
        case '遥信值':
          setMeasurePointTable(measurePoint.yxDataList || []);
          break;
        case '电度值':
          setMeasurePointTable(measurePoint.ymDataList || []);
          break;
      }
    }
  };

  useEffect(() => {
    if (measurePoint) {
      const { yxDataList, ymDataList, ycDataList } = measurePoint;
      let tableData: any[] = [];
      switch (selectedValue) {
        case '遥测值':
          tableData = groupData(ycDataList, true);
          break;
        case '遥信值':
          tableData = [...yxDataList];
          break;
        case '电度值':
          tableData = [...ymDataList];
          break;
      }
      setMeasurePointTable(tableData);
    }
  }, [measurePoint]);

  useEffect(() => {
    if (deviceType) {
      switch (deviceType) {
        case 'PCS':
          setSegmentedOptions(['遥测值', '遥信值', '电度值']);
        case 'onGrid': // 并网表
          return setSegmentedOptions(['遥测值']);
        case 'cluster': // 电池簇
          return setSegmentedOptions(['遥测值', '遥信值']);
        case 'inverter': // 逆变器
          return setSegmentedOptions(['遥测值', '遥信值']);
      }
    }
  }, [deviceType]);

  useEffect(() => {
    if (deviceCode) {
      fetchMeasurePoint(deviceCode);
    }
  }, [deviceCode]);

  return (
    <div className={styles.powerCurve}>
      <div className={styles.powerCurveHead}>
        <div className={styles.headleft}>测点</div>
        <div className={styles.headMiddle}>
          <SegmentedTheme
            options={segmentedOptions}
            defaultValue="遥测值"
            getSelectedValue={changePointType}
          />
        </div>
        <div className={styles.headRight}>
          <SegmentedTheme
            options={['色块测量', '表格数据']}
            getSelectedValue={(value: any) => setBlockOrTable(value === '色块测量')}
          />
        </div>
      </div>
      <div className={styles.powerCurveBody}>
        {blockOrTable ? (
          <div className={styles.powerList}>{renderMeasure()}</div>
        ) : (
          <Table
            rowKey="measurementId"
            dataSource={measurePointTable}
            columns={measurePointColumns}
            pagination={false}
            scroll={{ y: 280 }}
            locale={{
              emptyText: (
                <div style={{ marginTop: 25 }}>
                  <Empty />{' '}
                </div>
              ),
            }}
            bordered={false}
          />
        )}
      </div>
    </div>
  );
};
export default MeasurePointBottom;
