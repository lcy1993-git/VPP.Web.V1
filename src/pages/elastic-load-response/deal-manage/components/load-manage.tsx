import CustomCharts from '@/components/custom-charts';
import SegmentedTheme from '@/components/segmented-theme';
import {
  getUserList,
  getUserLoadDetails,
  getVPPLoadDetails,
} from '@/services/elastic-load-response/deal-manage';
import { exportExcel } from '@/utils/xlsx';
import { DownloadOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, DatePicker, Table } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import { loadDetailColumns, loadOptions } from '../utils';
import OptionList from './option-list';

// 基线负荷管理
const LoadManage = () => {
  // 虚拟电厂or代理用户
  const [VPPOrUser, setVPPOrUser] = useState<boolean>(true);
  // 曲线or表格
  const [curveOrTable, setCurveOrTable] = useState<boolean>(true);
  // 日期
  const [date, setDate] = useState<any>(dayjs());
  // 列表选项
  const [options, setOptions] = useState<any>([]);
  const [selectedValue, setSelectedValue] = useState<string>('');

  const transformedData = (data: any) => {
    return data?.xaxis.map((timePeriod: string, index: number) => ({
      key: index,
      timePeriod,
      baseline: data?.valueList[index],
    }));
  };

  // 代理用户厂家列表
  const { data: userList } = useRequest(getUserList, {
    manual: false,
    onSuccess: (res) =>
      setOptions([
        {
          title: '厂家列表',
          options: res.map((item: any) => item.name),
        },
      ]),
  });

  // 虚拟电厂
  const { run: fetchVPPLoadDetails, data: VPPLoadDetails } = useRequest(getVPPLoadDetails, {
    manual: true,
  });

  // 代理用户
  const { run: fetchUserLoadDetails, data: userLoadDetails } = useRequest(getUserLoadDetails, {
    manual: true,
  });

  // 下载文件
  const handleDownLoad = () => {
    const tableData = transformedData(VPPOrUser ? VPPLoadDetails : userLoadDetails);
    const res = tableData.map((item: any, index: number) => {
      return { 序号: index + 1, 时段: item.timePeriod, '基线(kW)': item.baseline };
    });
    exportExcel(res, '基线负荷');
  };

  useEffect(() => {
    const dateString = date ? moment(date).format('YYYY-MM-DD') : date;
    if (VPPOrUser) {
      fetchVPPLoadDetails(dateString);
    } else {
      if (selectedValue) {
        fetchUserLoadDetails(dateString, selectedValue);
      }
    }
  }, [VPPOrUser, date, selectedValue]);

  return (
    <div className={styles.loadManagePage}>
      <div className={styles.header}>
        日期：
        <DatePicker onChange={(value) => setDate(value)} value={date} allowClear={false} />
        <Button style={{ marginLeft: '20px' }} onClick={handleDownLoad}>
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
              categories={options}
              setSelectedValue={setSelectedValue}
              value={userList.map((item: any) => item.substationCode) || []}
              width={190}
            />
          )}
          <div className={styles.curveOrTable}>
            {curveOrTable ? (
              <CustomCharts options={loadOptions(VPPOrUser ? VPPLoadDetails : userLoadDetails)} />
            ) : (
              <Table
                columns={loadDetailColumns}
                dataSource={transformedData(VPPOrUser ? VPPLoadDetails : userLoadDetails)}
                scroll={{ y: 490 }}
                bordered
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
