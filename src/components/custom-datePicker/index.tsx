import { judgmentIsToday } from '@/utils/common';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import SegmentedTheme from '../segmented-theme';

/**
 * 通用日期segmented+日历datePicker组件
 * @datePickerType 日历类型（day、month、year）,为空''代表可切换日期类型segmented
 * @setIsToday 修改父组件勾选日期是否当天
 * @onChange change回调函数
 * @setDate 修改父组件日期
 * @setUnit 修改父组件勾选日期类型
 * */
interface propsType {
  datePickerType: string;
  onChange?: any;
  setIsToday?: Dispatch<SetStateAction<any>>;
  setDate?: Dispatch<SetStateAction<any>>;
  setUnit?: Dispatch<SetStateAction<any>>;
  disabled?: boolean;
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
  const { datePickerType, onChange, setIsToday, setDate, setUnit, disabled = false } = props;
  // 默认当天
  const defaultDate = dayjs(`${new Date()}`);
  // 日期类型
  const [type, setType] = useState<string>(datePickerType || 'day');
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
    setType(value === '日' ? 'day' : value === '月' ? 'month' : 'year');
    // 设置日期为默认日期
    setDatePickerValue(defaultDate);
  };

  // 改变父组件日期和日期类型
  useEffect(() => {
    if (setUnit) setUnit(type);
    if (setDate) setDate(dayjs(datePickerValue).format(datePickerEnum[type].dayType));
  }, [datePickerValue, type]);

  // 日期改变回调
  const handleDateChange = (value: any) => {
    if (onChange) onChange(value);
    if (setIsToday) setIsToday(judgmentIsToday(value));
    setDatePickerValue(value);
  };

  return (
    <>
      <Space size={15}>
        {!datePickerType && (
          <SegmentedTheme options={['日', '月', '年']} getSelectedValue={handleSegmentChange} />
        )}
        <DatePicker
          picker={datePickerEnum[type].type}
          value={dayjs(datePickerValue, datePickerEnum[type].dayType)}
          onChange={handleDateChange}
          allowClear={false}
          disabledDate={disableDate}
          disabled={disabled}
        />
      </Space>
    </>
  );
};
export default CustomDatePicker;
