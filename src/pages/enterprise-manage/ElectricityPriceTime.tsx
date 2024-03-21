import { useRequest } from "ahooks";
import { Button, DatePicker, Form, Input, message } from "antd";
import { forwardRef, JSXElementConstructor, Key, ReactElement, ReactNode, Ref, useEffect, useImperativeHandle, useState } from "react";
import dayjs from 'dayjs';
import styles from './index.less';
import { getStationPriceInfo } from "@/services/enterprise-manage";

let monthDataInit: string[] = [], timeDataInit: any[] = [];
for (let i = 0; i < 24; i++) {
  timeDataInit.push({
    id: `${i}`,
    name: `${i}-${i + 1}点`
  })
  if (i < 12) {
    monthDataInit.push(`${i + 1}月`)
    continue;
  }
}

/** props type
 * @params substationCode电站code
 * @params modalStatus模态框状态，编辑或者详情
 * @params isModalOpen模态框状态，用于模态框开启请求电价数据
 * */
const ElectricityPriceTime = (props: any, ref: Ref<any>) => {
  const { substationCode, modalStatus, isModalOpen } = props;
  const [form] = Form.useForm();

  // 选中的月份存储数据,所有新增的月份不能重复
  const [selectMonthData, setSelectMonthData] = useState<any>({});

  // 月份是同一份数据，时间，新增项的时间段，每项使用同一时间段，
  const [monthAllData, setMonthAllData] = useState([
    {
      monthData: monthDataInit,
      timePeriod: {}, // 选中的时间段
      spikeTime: timeDataInit,
      peakTime: timeDataInit,
      peacetime: timeDataInit,
      valleyTime: timeDataInit,
    }
  ])

  // 重置所有数据
  const resultMonthAllDataHandle = () => {
    setMonthAllData([
      {
        monthData: monthDataInit,
        timePeriod: {}, // 选中的时间段
        spikeTime: timeDataInit,
        peakTime: timeDataInit,
        peacetime: timeDataInit,
        valleyTime: timeDataInit,
      }
    ])
  }
  // 重置已选月份数据
  const resultSelectMonthData = () => {
    setSelectMonthData({})
  }


  // 选择月份
  const selectMonthHandle = (currentMonth: any, currentName: string) => {
    const exist = selectMonthData[currentName] && selectMonthData[currentName].find((item: any) => item === currentMonth);
    if (exist) {
      const data = selectMonthData[currentName].filter((item: any) => item !== exist);
      setSelectMonthData({
        ...selectMonthData,
        [currentName]: data
      });
      return;
    }
    // 当前选中的月份在之前选中的月份中是否存在，如果存在则不能再次选择
    const isBeforeSelected = Object.values(selectMonthData).some((item: any) => item.includes(currentMonth));
    if (isBeforeSelected) {
      message.warning('当前月份已经选中，不能再次勾选')
      return;
    }

    const oldData = selectMonthData[currentName] ? selectMonthData[currentName] : []
    oldData.push(currentMonth)
    const newData = {
      ...selectMonthData,
      [currentName]: oldData
    }
    setSelectMonthData(newData)
  }

  /**
   * 选择时间段
   * @params currentType当前点击的时间段类型
   * @params currentData当前点击项的数据
   * @params currentTime 当前点击的时间项
   * @params index 当前操作的位置
  */
  const selectTimeSlot = (currentType: string, currentData: { timePeriod: any; }, currentTime: any) => {
    const { timePeriod } = currentData;
    // 如果当前选中的时间点。在其他时段中已经选择，则当前时间段不能选择该时间点
    const isOtherExist = Object.keys(timePeriod).some(item => {
      if (item !== currentType) {
        return timePeriod[item]?.includes(currentTime)
      }
      return false;
    })
    if (isOtherExist) {
      message.warning('当前时间点，已在其他时间段选中，不能重复勾选')
      return
    }
    const selected = timePeriod[currentType] || [];
    if (selected.includes(currentTime)) { // 如果时间已经被勾选
      const data = selected.filter((item: any) => item !== currentTime);
      timePeriod[currentType] = data;
    } else { // 未勾选
      selected.push(currentTime)
      timePeriod[currentType] = selected;
    }
    setMonthAllData([...monthAllData])
  }

  // 表单校验
  const formValidate = (): boolean => {
    // 判断新增项是否选在月份未选择情况
    if (!Object.keys(selectMonthData).every(item => selectMonthData[item].length && Object.keys(selectMonthData).length === monthAllData.length)) {
      message.warning('请选择月份')
      return false;
    }
    // 判断勾选的时间是覆盖24小时
    const isSelectTime = monthAllData.every(item => Object.values(item.timePeriod).flat().filter(time => time).length === 24)
    if (!isSelectTime) {
      message.warning('请勾选所有时间段')
      return false;
    }

    return true;
  }



  // 新增月份选项
  const addSelect = async () => {

    const isvalidate = await form.validateFields()
    if (!isvalidate) {
      return;
    }

    if (!formValidate()) {
      return;
    }

    // 所选月份不能超过12个月
    if (Object.values(selectMonthData).flat().length === 12) {
      message.warning('当年所有月份电价全部设置，不能新增新的选项')
      return false;
    }

    const allData = [
      ...monthAllData,
      {
        monthData: monthDataInit,
        timePeriod: {}, // 选中的时间段
        spikeTime: timeDataInit,
        peakTime: timeDataInit,
        peacetime: timeDataInit,
        valleyTime: timeDataInit,
      }
    ]
    setMonthAllData([...allData])

  }

  // 删除月份选项
  const deleteSelect = (index: number) => {
    const timeData = monthAllData.filter((item, childIndex) => childIndex < index)
    setMonthAllData(timeData)
    Object.keys(selectMonthData).forEach(item => {
      const childIndex = Number(item.split('-')[1])
      if (childIndex >= index) {
        delete selectMonthData[`item-${childIndex}`]
      }
    })
    setSelectMonthData({
      ...selectMonthData
    })
  }


  // 详情 获取电站电价信息
  const { run: feachStationPriceInfo } = useRequest(getStationPriceInfo, {
    manual: true,
    onSuccess: (resolve: any) => {
      const { code, data } = resolve;
      if (code === 200) {
        if (data && !data.length) {
          resultMonthAllDataHandle()
          resultSelectMonthData()
          form.resetFields([
            'spikeTimePrice-0',
            'spikeTimeRatio-0',
            'peakTimePrice-0',
            'peakTimeRatio-0',
            'peacetimePrice-0',
            'peacetimeRatio-0',
            'valleyTimePrice-0',
            'valleyTimeRatio-0'
          ])
        } else {
          // 处理月份数据
          let handleData: any = {};
          let selectMonth: any = {};
          // 表单数据
          let formData: any = {};
          data.forEach((item: any) => {
            handleData[item.month] = item.month
          })
          const allData = Object.keys(handleData).map((key, index) => {
            // 处理月份数据
            selectMonth[`item-${index}`] = handleData[key].split(',').map((m: any) => `${m}月`)
            // 处理时间
            const spikeTime = data.find((node: { month: string; type: number; }) => node.month === key && node.type === 1)?.hour.split(',') || []
            const peakTime = data.find((node: { month: string; type: number; }) => node.month === key && node.type === 2)?.hour.split(',') || []
            const peacetime = data.find((node: { month: string; type: number; }) => node.month === key && node.type === 3)?.hour.split(',') || []
            const valleyTime = data.find((node: { month: string; type: number; }) => node.month === key && node.type === 4)?.hour.split(',') || []
            return {
              monthData: monthDataInit,
              timePeriod: { // 选中的时间段
                spikeTime,
                peakTime,
                peacetime,
                valleyTime,
              },
              spikeTime: timeDataInit,
              peakTime: timeDataInit,
              peacetime: timeDataInit,
              valleyTime: timeDataInit,
            }
          })
          // 处理折扣系数、电价
          Object.keys(handleData).forEach((monthData, index) => {
            const currentData = data.filter((item: { month: string; }) => item.month === monthData)
            currentData.forEach((node: { type: number; price: any; discount: any; }) => {
              if (node.type === 1) {
                formData[`spikeTimePrice-${index}`] = node.price;
                formData[`spikeTimeRatio-${index}`] = node.discount
              } else if (node.type === 2) {
                formData[`peakTimePrice-${index}`] = node.price;
                formData[`peakTimeRatio-${index}`] = node.discount
              } else if (node.type === 3) {
                formData[`peacetimePrice-${index}`] = node.price;
                formData[`peacetimeRatio-${index}`] = node.discount
              } else {
                formData[`valleyTimePrice-${index}`] = node.price;
                formData[`valleyTimeRatio-${index}`] = node.discount
              }
            })
          })

          setSelectMonthData(selectMonth)
          setMonthAllData(allData)

          form.setFieldsValue({
            ...formData
          })
        }
      }
    }
  })

  // 切换时间
  const changeDataPicker = (values:any) => {
    feachStationPriceInfo({
      substationCode,
        year: dayjs(values).format('YYYY')
    })
  }

  useEffect(() => {
    if (isModalOpen) {
      // 不论详情还是编辑，form表单中的年份都可以进行选择
      form.setFieldValue('year', dayjs(new Date()))

      feachStationPriceInfo({
        substationCode,
        year: dayjs(new Date()).format('YYYY')
      })

    }
  }, [isModalOpen, substationCode])

   // 暴露给父组件方法或数据
   useImperativeHandle(ref, () => {
    return {
      selectMonthData,
      monthAllData,
      form,
      resultMonthAllDataHandle,
      resultSelectMonthData,
      formValidate,
    }
  })


  return <div className={styles.priceContainer}>
    <Form
      form={form}
    >
      <div className={styles.priceHead}>
        <Form.Item name='year' label="生效年份" required
          rules={[{ required: true, message: '请选择生效年份' }]}
        >
          <DatePicker picker="year" style={{ width: 200, marginLeft: 20 }} onChange={changeDataPicker}/>
        </Form.Item>
        <Button disabled={(modalStatus === 'detail')} onClick={addSelect}>新增</Button>
      </div>
      <div className={styles.priceContent}>
        {
          monthAllData && monthAllData.map((item: any, index) => {
            return (
              <div className={styles.selectItem} key={index}>
                <div className={styles.month}>
                  <div className={styles.monthTitle}>
                    <span className={styles.symbol}>*</span>
                    <span>生效月份：</span>
                  </div>
                  <div className={styles.monthContent}>
                    <div className={styles.monthList}>
                      {
                        item.monthData.map((month: any) => {
                          return <button type='button' key={month}
                            className={styles.monthItem}
                            disabled={(modalStatus === 'detail')}
                            onClick={() => selectMonthHandle(month, `item-${index}`)}
                            style={{
                              background: (selectMonthData[`item-${index}`] && selectMonthData[`item-${index}`]?.includes(month)) ? '#1292ff' : '',
                              color: (selectMonthData[`item-${index}`] && selectMonthData[`item-${index}`]?.includes(month)) ? '#fff' : '',
                            }}
                          >{month}</button>
                        })
                      }
                    </div>
                    {
                      index ? <Button disabled={(modalStatus === 'detail')} onClick={() => deleteSelect(index)}>删除</Button> : null
                    }
                  </div>
                </div>

                <div className={styles.month}>
                  <div className={styles.monthTitle}>
                    <span className={styles.symbol}>*</span>
                    <span>尖峰时间段：</span>
                  </div>
                  <div className={styles.monthContent}>
                    <div className={styles.monthList}>
                      {
                        item.spikeTime?.map((time: any) => {
                          return <button type='button' key={time.id} className={styles.timeItem}
                            disabled={(modalStatus === 'detail')}
                            style={{
                              background: item.timePeriod?.spikeTime?.includes(time.id) ? '#1292ff' : '',
                              color: item.timePeriod?.spikeTime?.includes(time.id) ? '#ffffff' : ''
                            }}
                            onClick={() => selectTimeSlot('spikeTime', item, time.id)}
                          >{time.name}</button>
                        })
                      }
                    </div>
                    <Form.Item label="电价" style={{ marginRight: 16 }}
                      name={`spikeTimePrice-${index}`}
                      rules={[
                        { required: true, message: '请输入电价' },
                        {
                          pattern: /^\d*\.?\d+$/,
                          message: `输正确电价`,
                        },
                      ]}
                    >
                      <Input style={{ width: 80 }} disabled={modalStatus === 'detail'} />
                    </Form.Item>
                    <Form.Item label="折扣系数"
                      name={`spikeTimeRatio-${index}`}
                      rules={[
                        { required: true, message: '请输入系数' },
                        {
                          pattern: /^\d*\.?\d+$/,
                          message: `输正确系数`,
                        },
                      ]}
                    >
                      <Input style={{ width: 80 }} disabled={modalStatus === 'detail'} />
                    </Form.Item>
                  </div>
                </div>

                <div className={styles.month}>
                  <div className={styles.monthTitle}>
                    <span className={styles.symbol}>*</span>
                    <span>峰期时间段：</span>
                  </div>
                  <div className={styles.monthContent}>
                    <div className={styles.monthList}>
                      {
                        item.peakTime?.map((time: any) => {
                          return <button type='button' key={time.id} className={styles.timeItem}
                            style={{
                              background: item.timePeriod?.peakTime?.includes(time.id) ? '#1292ff' : '',
                              color: item.timePeriod?.peakTime?.includes(time.id) ? '#ffffff' : ''
                            }}
                            disabled={(modalStatus === 'detail')}
                            onClick={() => selectTimeSlot('peakTime', item, time.id)}
                          >{time.name}</button>
                        })
                      }
                    </div>
                    <Form.Item label="电价" style={{ marginRight: 16 }}
                      name={`peakTimePrice-${index}`}
                      rules={[
                        { required: true, message: '请输入电价' },
                        {
                          pattern: /^\d*\.?\d+$/,
                          message: `输正确电价`,
                        },
                      ]}
                    >
                      <Input style={{ width: 80 }} disabled={(modalStatus === 'detail')} />
                    </Form.Item>
                    <Form.Item label="折扣系数"
                      name={`peakTimeRatio-${index}`}
                      rules={[
                        { required: true, message: '请输入系数' },
                        {
                          pattern: /^\d*\.?\d+$/,
                          message: `输正确系数`,
                        },
                      ]}
                    >
                      <Input style={{ width: 80 }} disabled={(modalStatus === 'detail')} />
                    </Form.Item>
                  </div>
                </div>

                <div className={styles.month}>
                  <div className={styles.monthTitle}>
                    <span className={styles.symbol}>*</span>
                    <span>平期时间段：</span>
                  </div>
                  <div className={styles.monthContent}>
                    <div className={styles.monthList}>

                      {
                        item.peacetime?.map((time: any) => {
                          return <button type='button' key={time.id} className={styles.timeItem}
                            disabled={(modalStatus === 'detail')}
                            style={{
                              background: item.timePeriod?.peacetime?.includes(time.id) ? '#1292ff' : '',
                              color: item.timePeriod?.peacetime?.includes(time.id) ? '#ffffff' : ''
                            }}
                            onClick={() => selectTimeSlot('peacetime', item, time.id)}
                          >{time.name}</button>
                        })
                      }
                    </div>
                    <Form.Item label="电价" style={{ marginRight: 16 }}
                      name={`peacetimePrice-${index}`}
                      rules={[
                        { required: true, message: '请输入电价' },
                        {
                          pattern: /^\d*\.?\d+$/,
                          message: `输正确电价`,
                        },
                      ]}
                    >
                      <Input style={{ width: 80 }} disabled={(modalStatus === 'detail')} />
                    </Form.Item>
                    <Form.Item label="折扣系数"
                      name={`peacetimeRatio-${index}`}
                      rules={[
                        { required: true, message: '请输入系数' },
                        {
                          pattern: /^\d*\.?\d+$/,
                          message: `输正确系数`,
                        },
                      ]}
                    >
                      <Input style={{ width: 80 }} disabled={(modalStatus === 'detail')} />
                    </Form.Item>
                  </div>
                </div>

                <div className={styles.month}>
                  <div className={styles.monthTitle}>
                    <span className={styles.symbol}>*</span>
                    <span>谷期时间段：</span>
                  </div>
                  <div className={styles.monthContent}>
                    <div className={styles.monthList}>
                      {
                        item.valleyTime?.map((time: any) => {
                          return <button key={time.id} type='button' className={styles.timeItem}
                            disabled={Boolean(modalStatus === 'detail')}
                            style={{
                              background: item.timePeriod?.valleyTime?.includes(time.id) ? '#1292ff' : '',
                              color: item.timePeriod?.valleyTime?.includes(time.id) ? '#ffffff' : ''
                            }}
                            onClick={() => selectTimeSlot('valleyTime', item, time.id)}
                          >{time.name}</button>
                        })
                      }
                    </div>
                    <Form.Item label="电价" style={{ marginRight: 16 }}
                      name={`valleyTimePrice-${index}`}
                      rules={[
                        { required: true, message: '请输入电价' },
                        {
                          pattern: /^\d*\.?\d+$/,
                          message: `输正确电价`,
                        },
                      ]}
                    >
                      <Input style={{ width: 80 }} disabled={(modalStatus === 'detail')} />
                    </Form.Item>
                    <Form.Item label="折扣系数"
                      name={`valleyTimeRatio-${index}`}
                      rules={[
                        { required: true, message: '请输入系数' },
                        {
                          pattern: /^\d*\.?\d+$/,
                          message: `输正确系数`,
                        },
                      ]}
                    >
                      <Input style={{ width: 80 }} disabled={(modalStatus === 'detail')} />
                    </Form.Item>

                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </Form>

  </div>
}
export default forwardRef(ElectricityPriceTime);

