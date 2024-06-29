import ContainerPage from '@/components/container-page';
import ContentComponent from '@/components/content-component';
import CustomCharts from '@/components/custom-charts';
import CustomDatePicker from '@/components/custom-datePicker';
import GeneralTable from '@/components/general-table';
import { getSubstationList } from '@/services/energy-analysis';
import { getSubstationElectricity, getSubstationPower } from '@/services/enterprise-panel';
import { SearchOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Form, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { chartOptions, electricityOption, tableColumns } from './utils';

const EnterprisePanel = () => {
  // 搜索form
  const [searchForm] = Form.useForm();
  // table
  const tableRef = useRef(null);
  // 实时负荷modal状态
  const [powerVisible, setPowerVisible] = useState<boolean>(false);
  // 用量趋势modal状态
  const [electricityVisible, setElectricityVisible] = useState<boolean>(false);
  // 日期类型
  const [unit, setUnit] = useState<string>('day');
  // 日期
  const [date, setDate] = useState<string>(dayjs(new Date()).format('YYYY-MM-DD'));
  // 图表查询电站code
  const [substationCode, setSubstationCode] = useState<string>('');

  // 实时负荷趋势
  const { run: fetchSubstationPower, data: substationPower } = useRequest(getSubstationPower, {
    manual: true,
  });

  // 用量趋势
  const { run: fetchSubstationElectricity, data: substationElectricity } = useRequest(
    getSubstationElectricity,
    {
      manual: true,
    },
  );

  // 企业数据
  const { data: substationList } = useRequest(getSubstationList, {
    manual: false,
  });

  // 查询按钮
  const handleSearchClick = (values: any) => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.searchByParams({ ...values, unit, date });
    }
  };

  /** 搜索区域 */
  const renderSearch = () => {
    return (
      <>
        <Form
          name="basic"
          style={{ marginBottom: 20 }}
          layout="inline"
          autoComplete="off"
          form={searchForm}
          onFinish={handleSearchClick}
        >
          <Form.Item label="统计周期" name="date">
            <CustomDatePicker datePickerType="" setDate={setDate} setUnit={setUnit} />
          </Form.Item>
          <Form.Item label="企业名称" name="substationCode">
            <Select
              placeholder="请选择企业"
              options={substationList}
              allowClear
              style={{ width: 250, marginRight: '15px' }}
              fieldNames={{ label: 'name', value: 'substationCode' }}
            />
          </Form.Item>
          <Form.Item>
            <Button icon={<SearchOutlined />} htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  };

  // 实时负荷趋势
  useEffect(() => {
    if (powerVisible) {
      fetchSubstationPower(date, substationCode);
    }
  }, [powerVisible]);

  // 用量趋势趋势
  useEffect(() => {
    if (electricityVisible) {
      fetchSubstationElectricity(date, substationCode, unit);
    }
  }, [electricityVisible]);

  return (
    <ContainerPage>
      <ContentComponent title="企业看板" renderSearch={renderSearch}>
        <GeneralTable
          url="/api/enterprise/panel/overview/list"
          ref={tableRef}
          columns={tableColumns(unit, setPowerVisible, setElectricityVisible, setSubstationCode)}
          rowKey="substationCode"
          hideSelect={true}
          bordered={false}
          hasPage={true}
          requestType="get"
          filterParams={{ unit, date }}
        />
        <Modal
          title={<span className={styles.modalTitle}>负荷趋势</span>}
          centered
          width={1000}
          open={powerVisible}
          footer={false}
          onCancel={() => setPowerVisible(false)}
        >
          <div className={styles.modalBody}>
            <CustomCharts
              options={chartOptions(substationPower?.powerOrElectricityMap)}
              loading={false}
              width={952}
              height={380}
            />
          </div>
        </Modal>
        <Modal
          title={<span className={styles.modalTitle}>用量趋势</span>}
          centered
          width={1000}
          open={electricityVisible}
          footer={false}
          onCancel={() => setElectricityVisible(false)}
        >
          <div className={styles.modalBody}>
            <CustomCharts
              options={electricityOption(substationElectricity?.powerOrElectricityMap, unit)}
              loading={false}
              width={952}
              height={380}
            />
          </div>
        </Modal>
      </ContentComponent>
    </ContainerPage>
  );
};
export default EnterprisePanel;
