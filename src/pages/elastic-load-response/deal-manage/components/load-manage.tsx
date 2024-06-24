import CustomCharts from '@/components/custom-charts';
import SegmentedTheme from '@/components/segmented-theme';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Table } from 'antd';
import { useState } from 'react';
import styles from '../index.less';
import { loadDetailColumns, loadOptions } from '../utils';
import OptionList from './option-list';

// 基线负荷管理
const LoadManage = () => {
  // 虚拟电厂or代理用户
  const [VPPOrUser, setVPPOrUser] = useState<boolean>(true);
  // 曲线or表格
  const [curveOrTable, setCurveOrTable] = useState<boolean>(true);
  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 3', 'Option 3'];
  const [tableData, setTableData] = useState<any>([
    { timePeriod: '00:00:00', demandCapacity: '1200' },
    { timePeriod: '01:00:00', demandCapacity: '1200' },
    { timePeriod: '02:00:00', demandCapacity: '1200' },
    { timePeriod: '03:00:00', demandCapacity: '1000' },
    { timePeriod: '03:00:00', demandCapacity: '1000' },
    { timePeriod: '03:00:00', demandCapacity: '1000' },
    { timePeriod: '03:00:00', demandCapacity: '1000' },
    { timePeriod: '03:00:00', demandCapacity: '1000' },
    { timePeriod: '03:00:00', demandCapacity: '1000' },
    { timePeriod: '03:00:00', demandCapacity: '1000' },
  ]);
  const [selectedValue, setSelectedValue] = useState<string>('');

  return (
    <div className={styles.loadManagePage}>
      <div className={styles.header}>
        日期：
        <DatePicker />
        <Button style={{ marginLeft: '20px' }}>
          <DownloadOutlined />
          下载
        </Button>
      </div>
      <div className={styles.container}>
        <div className={styles.check}>
          <SegmentedTheme
            options={['虚拟电厂', '代理用户']}
            getSelectedValue={(value) => setVPPOrUser(value === '虚拟电厂')}
          />
          <div className={styles.blueTitle}>基线负荷</div>
          <SegmentedTheme
            options={[
              { label: '曲线', value: '曲线', icon: <i className="iconfont">&#xe63a;</i> },
              { label: '表格', value: '表格', icon: <i className="iconfont">&#xe639;</i> },
            ]}
            getSelectedValue={(value) => setCurveOrTable(value === '曲线')}
          />
        </div>
        <div className={styles.loadDetail}>
          {!VPPOrUser && (
            <OptionList
              categories={[
                {
                  title: '厂家列表', // 分类标题
                  options: options || [], // 该分类下的选项列表
                },
              ]}
              setSelectedValue={setSelectedValue}
              width={160}
            />
          )}
          <div className={styles.curveOrTable}>
            {curveOrTable ? (
              <CustomCharts options={loadOptions([5, 20, 36, 10, 10])} />
            ) : (
              <Table
                columns={loadDetailColumns}
                dataSource={tableData}
                scroll={{ y: 490 }}
                pagination={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadManage;
