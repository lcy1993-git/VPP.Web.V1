import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import SegmentedTheme from '../segmented-theme';
/**
 * 通用日期segmented+日历datePicker组件
 * @params datePickerType 日历类型（day、month、year）,为空''代表可切换日期类型segmented
 * @params defaultDate 选择器默认日期，不传值默认当天/月/年
 * @params disabledDate 禁用日期选择，默认禁用当天/月/年
 * @params isChangeType 是否有segmented来切换日历类型，默认true
 * */
interface propsType {
  datePickerType: string;
  defaultDate?: string;
  disabledDate?: any;
  onChange?: any;
  getTypeAndDate?: (type: string, date: string) => void | undefined;
}

// 日历枚举值
const datePickerEnum: any = {
  year: {
    type: 'year',
    dayType: 'YYYY',
    analysisType: 'YYYY年',
  },
  month: {
    type: 'month',
    dayType: 'YYYY-MM',
    analysisType: 'YYYY年MM月',
  },
  day: {
    type: 'date',
    dayType: 'YYYY-MM-DD',
    analysisType: 'YYYY年MM月DD日',
  },
};

const CustomDatePicker = (props: propsType) => {
  const {
    datePickerType,
    defaultDate = dayjs(`${new Date()}`),
    onChange,
    disabledDate,
    getTypeAndDate,
  } = props;
  // 日期类型 默认日
  const [type, setType] = useState<string>('day');
  // 日历选中值
  const [datePickerValue, setDatePickerValue] = useState<any>(defaultDate);

  // 限制日期选择，默认当天/月/年之后不允许选择
  const disableDate = (current: any) => {
    // 获取当前日期
    const today = dayjs().startOf('day');
    // 将被选中的日期也转换为日期对象
    const selectedDate = dayjs(current).startOf('day');
    // 当前日期及之后的日期将被禁用
    return selectedDate.isAfter(today);
  };

  // SegmentedTheme改变回调
  const handleSegmentChange = (value: string) => {
    // 改变日期类型
    const typeRes = value === '日' ? 'day' : value === '月' ? 'month' : 'year';
    setType(typeRes);
    // 设置日期为默认日期
    setDatePickerValue(defaultDate);
  };

  useEffect(() => {
    if (getTypeAndDate)
      getTypeAndDate(type, dayjs(datePickerValue).format(datePickerEnum[type].dayType));
  }, [datePickerValue, type]);

  return (
    <>
      {!datePickerType ? (
        <Space size={15}>
          <SegmentedTheme options={['日', '月', '年']} getSelectedValue={handleSegmentChange} />
          <DatePicker
            picker={datePickerEnum[type].type}
            value={dayjs(datePickerValue, datePickerEnum[type].dayType)}
            onChange={(value) => setDatePickerValue(value)}
            allowClear={false}
            disabledDate={disabledDate ? disabledDate : disableDate}
          />
        </Space>
      ) : (
        <DatePicker
          picker={datePickerEnum[datePickerType].type}
          defaultValue={dayjs(defaultDate, datePickerEnum[datePickerType])}
          onChange={onChange}
          allowClear={false}
          disabledDate={disabledDate ? disabledDate : disableDate}
        />
      )}
    </>
  );
};
export default CustomDatePicker;
