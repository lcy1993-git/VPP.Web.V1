import { getDevices, getMeasurePoint } from '@/services/runtime-monitor/history';
import { getDevicesName } from '@/services/runtime-monitor/realtime';
import { groupData } from '@/utils/common';
import {
  InsertRowAboveOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import {
  Button,
  Cascader,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Row,
  Select,
  Space,
  message,
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from './index.less';

interface Option {
  value?: string | null;
  label: React.ReactNode;
  children?: any[];
  isLeaf?: boolean;
  onValuesChange: any;
}

const { RangePicker } = DatePicker;
export const RenderSearch = (props: any) => {
  const { form, searchHistoryData, setTableQuery, setPointOption, pointOption, onValuesChange } =
    props;
  // 设备 options
  const [deviceOptions, setDeviceOptions] = useState<Option[]>([]);
  // number inpit
  const [numberValue, setNumberValue] = useState<number>(5);
  // 监听设备的变化
  const deviceCode = Form.useWatch('deviceCode', form);

  const [messageApi, contextHolder] = message.useMessage();

  /**
   * 1、首先获取当前用户能访问的电站
   * 2、根据电站在查询设备
   * 3、根据设备查询测点
   * */
  const { run: fetchDevice } = useRequest(getDevicesName, {
    manual: true,
    onSuccess: (res) => {
      const stationData = res?.map((item: any) => {
        return {
          deviceCode: item.deviceCode,
          name: item.name,
          isLeaf: false,
        };
      });
      setDeviceOptions(stationData || []);
    },
  });

  // 级联选择器改变
  // const onChange = (value: (string | number)[], selectedOptions: Option[]) => {
  //   console.log(value, selectedOptions);
  // };

  // 级联选择器，选择上级后请求下一级
  const loadData = async (selectedOptions: any[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const result = await getDevices(targetOption.deviceCode);
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
      setDeviceOptions([...deviceOptions]);
    } else {
      targetOption.isLeaf = true;
      setDeviceOptions([...deviceOptions]);
    }
  };

  // 获取测点数据
  const { run: getPoints } = useRequest(getMeasurePoint, {
    manual: true,
    onSuccess: (result) => {
      setPointOption(result);
    },
  });

  useEffect(() => {
    fetchDevice('');
  }, []);

  useEffect(() => {
    if (deviceCode) {
      getPoints(deviceCode[deviceCode.length - 1]);
      form.setFieldValue('measurementId', undefined);
      return;
    }
  }, [deviceCode]);

  // const downloadData = () => {
  //   if (!tableSelectRows.length) {
  //     messageApi.warning('请勾选数据');
  //     return;
  //   }
  //   exportExcel(tableSelectRows, '历史数据查询');
  // };

  // 日期组件设置为前一天
  const setPreviousDay = () => {
    const { date } = form.getFieldsValue();
    const previousDay = date.map((item: any) => {
      // @ts-ignore
      return dayjs(moment(item.subtract(1, 'days').format('YYYY-MM-DD HH:mm')));
    });
    form.setFieldsValue({
      date: previousDay,
    });
  };
  // 日期组件设置为当天
  const setDateToDay = () => {
    form.setFieldsValue({
      date: [
        dayjs(
          `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 06:00`,
        ),
        dayjs(
          `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 18:00`,
        ),
      ],
    });
  };
  // 日期组件设置为后一天
  const setNextDay = () => {
    const { date } = form.getFieldsValue();
    const nextDay = date.map((item: any) => {
      // @ts-ignore
      return dayjs(moment(item.subtract(-1, 'days').format('YYYY-MM-DD HH:mm')));
    });
    form.setFieldsValue({
      date: nextDay,
    });
  };

  // 曲线查询点击
  const curveClick = () => {
    setTableQuery(false);
    form.submit();
  };

  // 表格查询点击
  const tableClick = () => {
    setTableQuery(true);
    form.submit();
  };

  return (
    <div className={styles.searchBar}>
      <Form
        form={form}
        style={{ width: 1500 }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 20 }}
        onFinish={(values) => searchHistoryData(values, pointOption)}
        initialValues={{
          date: [
            dayjs(
              `${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${new Date().getDate()} 06:00`,
            ),
            dayjs(
              `${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${new Date().getDate()} 18:00`,
            ),
          ],
          step: 5,
        }}
      >
        <Row>
          <Col span={8} offset={0} pull={0}>
            <Form.Item
              label="设备"
              name="deviceCode"
              rules={[{ required: true, message: '请选择设备' }]}
            >
              <Cascader
                options={deviceOptions}
                loadData={loadData}
                style={{ width: 300 }}
                placeholder="请选择设备"
                fieldNames={{
                  label: 'name',
                  value: 'deviceCode',
                }}
                changeOnSelect
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              label="测点"
              name="measurementId"
              wrapperCol={{ span: 20 }}
              labelCol={{ span: 4 }}
              rules={[{ required: true, message: '请选择测点' }]}
            >
              <Select
                options={groupData(pointOption, true)}
                allowClear
                mode="multiple"
                fieldNames={{
                  label: 'dataDesc',
                  value: 'measurementId',
                }}
                placeholder="请选择测点"
                onChange={onValuesChange}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8} style={{ width: 500, position: 'relative' }}>
            <Form.Item label="时段" name="date">
              <RangePicker
                showTime={true}
                format="YYYY-MM-DD HH:mm"
                placeholder={['查询开始时间', '查询结束时间']}
                style={{ width: 300 }}
                allowClear={false}
              />
            </Form.Item>
            <Space style={{ position: 'absolute', left: 420, top: 0 }}>
              <Button onClick={setPreviousDay}>
                <LeftOutlined />
              </Button>
              <Button onClick={setDateToDay}>
                <InsertRowAboveOutlined />
              </Button>
              <Button onClick={setNextDay}>
                <RightOutlined />
              </Button>
            </Space>
          </Col>
          <Col span={4} offset={2}>
            <Form.Item name="step">
              <Space>
                <InputNumber
                  style={{ width: 220 }}
                  value={numberValue}
                  min={0}
                  keyboard={false}
                  onChange={(value) => {
                    form.setFieldValue('step', value);
                    setNumberValue(value || 5);
                  }}
                  onBlur={(value) => {
                    const currValue = value.target.value;
                    if (parseFloat(currValue)) {
                      let newValue = Math.ceil(parseFloat(currValue) / 5) * 5; // 将输入值向上取整到最接近的5的倍数
                      form.setFieldValue('step', newValue);
                      setNumberValue(newValue);
                    } else {
                      form.setFieldValue('step', 5);
                      setNumberValue(5);
                    }
                  }}
                  addonBefore={<span>* 步长：</span>}
                  addonAfter={<span>分钟</span>}
                />
              </Space>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Space>
              <Button onClick={curveClick}>
                <SearchOutlined />
                曲线查询
              </Button>
              <Button onClick={tableClick}>
                <SearchOutlined />
                表格查询
              </Button>
              {/* <Button onClick={downloadData}>
                <DownloadOutlined />
                下载表格
              </Button> */}
            </Space>
          </Col>
        </Row>
      </Form>
      {contextHolder}
    </div>
  );
};
