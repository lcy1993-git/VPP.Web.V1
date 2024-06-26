import { getUserCapacity, getUserTableData } from '@/services/elastic-load-response/deal-manage';
import { LineChartOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Input, Row, Select } from 'antd';
import { useState } from 'react';
import styles from '../index.less';

// 初始化label
const InitLabel = (props: any) => {
  const { data, setCurve } = props;

  // 获取可调容量
  const { run: fetchUserCapacity } = useRequest(getUserCapacity, {
    manual: true,
  });

  // 获取表格数据
  const { run: fetchUserTableData } = useRequest(getUserTableData, {
    manual: true,
  });

  const [capacity, setCapacity] = useState<string>('');

  return (
    <div className={styles.header}>
      <Row>
        用户：
        <Select
          style={{ width: 220 }}
          options={data}
          fieldNames={{ label: 'name', value: 'substationCode' }}
          onChange={(value) => {
            fetchUserCapacity(value).then((res) => {
              setCapacity(res);
              // item.capacity = res;
            });
          }}
        />
        容量：
        <Input style={{ width: 220 }} disabled value={capacity} />
      </Row>
      <Button onClick={() => setCurve(true)}>
        <LineChartOutlined />
        曲线
      </Button>
    </div>
  );
};

export default InitLabel;
