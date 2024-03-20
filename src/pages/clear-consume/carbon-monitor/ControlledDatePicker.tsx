import { DatePicker, Segmented, Space } from "antd"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import React from "react";
dayjs.locale('zh-cn');


const enumDate = {
  date: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  year: 'YYYY'
}


interface propsT {
  setSelectDate: Dispatch<SetStateAction<any>>, // 修改 父组件中 当前时间的存储状态
  defaultPicker?: 'date' | 'month' | 'year' // 分段控制器默认值
}

const ControlledDatePicker = (props: propsT) => {

  const {setSelectDate, defaultPicker = 'date'} = props;
  // date picker类型
  const [pickerType, setPickerType] = useState<'date' | 'month' | 'year'>(defaultPicker)
  // 当前选中的时间
  const [currentDate, setCurrentDate] = useState<any>('')
  // 用于缓存当前选中的时间，解决分段控制器处理年月日的问题
  const dateValue = useRef<any>()
  // 日期组件 change
  const datePickerChange = (date:  Dayjs | null) => {
    const dateFormat = dayjs(date).format(enumDate[pickerType])
    dateValue.current = dayjs(date).format("YYYY-MM-DD")
    setCurrentDate(dateFormat)
  }
  // 分段控制器change
  const segmentedChange = (value: 'date' | 'month' | 'year') => {
    setPickerType(value)
    setCurrentDate(dayjs(dateValue.current).format(enumDate[value]))
  }
  useEffect(() => {
    if (!currentDate) {
      const defaultDate = dayjs(new Date()).format(enumDate[defaultPicker])
      dateValue.current = defaultDate
      setCurrentDate(defaultDate)
    } else {
      setSelectDate(currentDate)
    }
  }, [currentDate])

  return <Space>
    <Segmented
      defaultValue={defaultPicker}
      options={[
        {label: '日', value: 'date'},
        {label: '月', value: 'month'},
        {label: '年', value: 'year'},
      ]}
      onChange={segmentedChange}
    />
    <DatePicker
      defaultValue={dayjs(new Date())}
      picker={pickerType}
      allowClear={false}
      onChange={datePickerChange}
    />
  </Space>
}
export default React.memo(ControlledDatePicker)
