import { getAdjustable } from '@/services/elastic-load-response/deal-manage';
import { LineChartOutlined, SaveOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Input, Row, Select, Space, message } from 'antd';
import styles from '../index.less';

const Label1 = (props) => {
  const { data, setSubstationCode, substationCode, capacity, setCurve, getCurveData, getCurve } =
    props;

  const { run: fetchAdjustable } = useRequest(getAdjustable, {
    manual: true,
    onSuccess: (res) => getCurveData(res),
  });

  return (
    <div className={styles.header}>
      <Row>
        用户：
        <Select
          style={{ width: 220 }}
          options={data}
          fieldNames={{ label: 'name', value: 'substationCode' }}
          onChange={(value) => setSubstationCode(value)}
          value={substationCode}
        />
        容量：
        <Input style={{ width: 220 }} disabled value={capacity} />
      </Row>
      <Space>
        <Button
          onClick={async () => {
            if (substationCode) {
              await fetchAdjustable(substationCode);
              setCurve(true);
              getCurve(true);
            } else {
              message.info('请选择用户后在进行查看');
            }
          }}
        >
          <LineChartOutlined />
          曲线
        </Button>
        <Button>
          <SaveOutlined />
          保存
        </Button>
      </Space>
    </div>
  );
};

export default Label1;
