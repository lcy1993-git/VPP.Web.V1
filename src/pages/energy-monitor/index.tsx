import ContainerPage from '@/components/container-page'
import CustomCard from '@/components/custom-card'
import CustomCharts from '@/components/custom-charts'
import { Button, ConfigProvider, DatePicker, Form, message, Segmented, Select, Space, Spin, Table, Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'
import CustomProgress from './custom-progress'
import styles from './index.less'
import { energyDetail, energyStructureOptions, loadDetail } from './utils'
import ReactECharts from 'echarts-for-react';
import { useRequest } from 'ahooks'
import { getEnergyStructure, getEnterpriseName, getIndustry, getLoadetails, getMonitorDetails, getMonitorOverview, getRanking } from '@/services/energy-monitor'
import SegmentDatepicker from '@/components/segment-datepicker'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
import { useForm } from 'antd/es/form/Form'
dayjs.locale('zh-cn');


const EnergyMonitor = () => {

  // 表格外层容器，用于设置表格滚动高度
  const tableWrapRef = useRef(null);
  // select 名称
  const [selectValue, setSelectValue] = useState<number>(0)
  // 用能详情 日期组件
  const [selectDate, setSelectDate] = useState<string>('')
  // 能源结构 日期组件
  const [structureDate, setStructureDate] = useState<string>('')
  // 企业排名
  const [enterRank, setEnterRank] = useState<string>('')

  const [form] = useForm();

  const type = Form.useWatch('type', form);

  const [messageApi, contextHolder] = message.useMessage();




  const columns = [
    {
      title: '排名',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as any,
      width: 60,
      render: (_text: any, record: any, index: number) => {
        return <span>{index + 1}</span>
      }
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
      align: 'center' as any,
      ellipsis: true,
      key: 'companyName',
      render: (text: any) => {
        return <Tooltip placement="top" title={text}>{text}</Tooltip>
      }
    },
    {
      title: '用电量(kWh)',
      align: 'center' as any,
      dataIndex: 'electricityConsumption',
      key: 'electricityConsumption',
      ellipsis: true
    },
  ];

  // 数据过滤
  const dataFilter = (data: any) => {
    if (data?.code === 200) {
      return data.data;
    }
    return null;
  }

  // 用能详情
  const { data: detailsData, run: fetchMonitorDetails } = useRequest(getMonitorDetails, {
    manual: true,
  });

  // 用能总览
  const { data: overviewData, run: fetchMonitorOverview } = useRequest(getMonitorOverview, {
    manual: true,
  });

  // 能源结构
  const { data: structureData, run: fetchEnergyStructure } = useRequest(getEnergyStructure, {
    manual: true,
  });

  // 负荷详情
  const { data: loadDetailData, run: fetchLoadetails } = useRequest(getLoadetails, {
    manual: true,
  });

  // 企业排名
  const { data: rankingData, run: fetchRanking } = useRequest(getRanking, {
    manual: true,
  });

  // 企业名称
  const { data: enterpriseNameData } = useRequest(getEnterpriseName);
  // 行业
  const { data: industryData } = useRequest(getIndustry);

  // 获取企业、行业名称
  const selectOptions = () => {
    if (selectValue === 2) { // 行业
      return dataFilter(industryData)?.map((item: any) => {
        return {
          label: item.name,
          value: item.id
        }
      })
    } else if (selectValue === 1) { // 企业
      return dataFilter(enterpriseNameData)?.map((item: any) => {
        return {
          label: item.name,
          value: item.substationCode
        }
      })
    } else {
      return []
    }
  }

  // 负荷详情 时间组件变化
  const loadDetailDateChange = (date: any) => {
    const formatDate = dayjs(date).format('YYYY-MM-DD')
    fetchLoadetails({
      date: formatDate,
      industry: '',
      substationCode: '',
      type: selectValue,
    })
  }

  // 企业排名
  useEffect(() => {
    if (enterRank) {
      fetchRanking({
        date: dayjs(new Date()).format('YYYY-MM-DD'),
        unit: ['year', 'month', 'day'][selectDate.split('-').length - 1],
      })
    }
  }, [enterRank])


  useEffect(() => {
    // 用能总览
    fetchMonitorOverview({
      type: 0,
    })
    // 负荷详情
    fetchLoadetails({
      date: dayjs(new Date).format('YYYY-MM-DD'),
      type: 0,
    })
  }, [])

  // 能源结构
  useEffect(() => {
    if (structureDate) {
      fetchEnergyStructure({
        date: structureDate,
        type: 0,
        unit: ['year', 'month', 'day'][selectDate.split('-').length - 1],
      })
    }
  }, [structureDate])


  // 用能详情数据请求
  useEffect(() => {
    if (selectDate) {
      fetchMonitorDetails({
        date: selectDate,
        type: 0,
        unit: ['year', 'month', 'day'][selectDate.split('-').length - 1],
      })
    }
  }, [selectDate])

  // 保存名称选择，解决数据同步异步问题
  useEffect(() => {
    setSelectValue(type)
    form.setFieldsValue({
      industry: null,
      substationCode: null
    })
  }, [type])

  // 点击查询
  const searchPageData = () => {
    if (type === 1 && !form.getFieldsValue()?.substationCode) {
      messageApi.info('请选择企业')
      return false;
    }

    if (type === 2 && !form.getFieldsValue()?.industry) {
      messageApi.info('请选择行业')
      return false;
    }



    const params = {
      type: type,
      industry: type === 2 ? form.getFieldsValue()?.industry : '',
      substationCode: type === 1 ? form.getFieldsValue()?.substationCode : '',
    }
    // 用能详情数据请求
    fetchMonitorDetails({
      ...params,
      date: structureDate,
      unit: ['year', 'month', 'day'][selectDate.split('-').length - 1],
    })
    // 能源结构
    fetchEnergyStructure({
      ...params,
      date: structureDate,
      unit: ['year', 'month', 'day'][selectDate.split('-').length - 1],
    })
    // 用能总览
    fetchMonitorOverview({ ...params })
    // 负荷详情
    fetchLoadetails({
      ...params,
      date: dayjs(new Date).format('YYYY-MM-DD')
    })
  }


  return <ContainerPage>
    <div className={styles.monitorPage}>
      <div className={styles.pageLeft}>
        <CustomCard
          style={{ borderLeft: 'none', borderRight: 'none' }}
        >
          <div className={styles.pageLeftSide}>
            <div className={styles.title}>
              企业排名
            </div>
            <div className={styles.content}>
              <div className={styles.search}>
                <SegmentDatepicker
                  setSelectDate={setEnterRank}
                />
              </div>
              <div className={styles.table} ref={tableWrapRef}>
                <Table
                  size="middle"
                  dataSource={dataFilter(rankingData) || []}
                  columns={columns}
                  pagination={false}
                  rowKey="companyName"
                />
              </div>
            </div>
          </div>
        </CustomCard>
      </div>
      <div className={styles.pageRight}>
      {/* <Spin /> */}
        <CustomCard
          style={{ borderLeft: 'none', borderRight: 'none' }}
        >
          <div className={styles.content}>
            <div className={styles.contentTitle}>
              <Form
                layout='inline'
                form={form}
                initialValues={{ type: 0 }}
              >
                <Form.Item
                  label="名称"
                  name="type"
                >
                  <Select
                    placeholder="请选择区域"
                    allowClear
                    options={[
                      { label: '全区域', value: 0 },
                      { label: '行业', value: 2 },
                      { label: '企业', value: 1 },
                    ]}
                    style={{ width: 260 }}
                  />
                </Form.Item>
                {
                  selectValue === 2 && <Form.Item
                    label="行业名称"
                    name="industry"
                  >
                    <Select
                      placeholder='请选择行业'
                      allowClear
                      options={selectOptions()}
                      style={{ width: 260 }}
                    />
                  </Form.Item>
                }
                {
                  selectValue === 1 && <Form.Item
                    label="企业名称"
                    name="substationCode"
                  >
                    <Select
                      placeholder='请选择企业'
                      allowClear
                      options={selectOptions()}
                      style={{ width: 260 }}
                    />
                  </Form.Item>
                }
                <Form.Item>
                  <Button onClick={searchPageData}>查询</Button>
                </Form.Item>
              </Form>
            </div>
            <div className={styles.contentMain}>
              <div className={styles.mainBody}>
                <div className={styles.mainBodyLeft}>
                  <div className={styles.areaHead}>
                    <div className={styles.areaHeadTitle}>能耗总览</div>
                  </div>
                  <div className={`${styles.areaBody} ${styles.overview}`} style={{}}>
                    <CustomProgress
                      width={300}
                      height={20}
                      progress={0.3}
                      color={['#5A49FF', '#A49BFF']}
                      title='实时负荷'
                      value={`${dataFilter(overviewData)?.realPower || 0}kW`}
                    />
                    <CustomProgress
                      width={300}
                      height={20}
                      progress={0.1}
                      color={['#5A49FF', '#A49BFF']}
                      title='日用电量'
                      value={`${dataFilter(overviewData)?.dayElectricity || 0}kWh`}
                    />
                    <CustomProgress
                      width={300}
                      height={20}
                      progress={0.5}
                      color={['#5A49FF', '#A49BFF']}
                      title='月用电量'
                      value={`${dataFilter(overviewData)?.monthElectricity || 0}kWh`}
                    />
                    <CustomProgress
                      width={300}
                      height={20}
                      progress={0.8}
                      color={['#5A49FF', '#A49BFF']}
                      title='年用电量'
                      value={`${dataFilter(overviewData)?.yearElectricity || 0}kWh`}
                    />
                  </div>
                </div>
                <div className={styles.mainBodyRight}>
                  <div className={styles.areaHead}>
                    <div className={styles.areaHeadTitle}>用能详情</div>
                    <SegmentDatepicker
                      setSelectDate={setSelectDate}
                    />
                  </div>
                  <div className={styles.areaBody}>
                    <CustomCharts
                      options={energyDetail(dataFilter(detailsData), selectDate)}
                      loading={false}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.mainBody}>
                <div className={styles.mainBodyLeft}>
                  <div className={styles.areaHead}>
                    <div className={styles.areaHeadTitle}>能源结构</div>
                    <SegmentDatepicker
                      setSelectDate={setStructureDate}
                    />
                  </div>
                  <div className={styles.areaBody}>
                    <div className={styles.structure}>
                      <div className={styles.structureHead}>
                        <div className={styles.listTtem}>
                          <div className={styles.itemHead}>
                            <p>{dataFilter(structureData)?.totalEnergyElectricity}</p>
                            <p>kWh</p>
                          </div>
                          <div className={styles.itemTitle}>总用电量</div>
                        </div>
                        <div className={styles.listTtem}>
                          <div className={styles.itemHead}>
                            <p>{dataFilter(structureData)?.conventionalEnergyElectricity}</p>
                            <p>kWh</p>
                          </div>
                          <div className={styles.itemTitle}>传统能源用电量</div>
                        </div>
                        <div className={styles.listTtem}>
                          <div className={styles.itemHead}>
                            <p>{dataFilter(structureData)?.cleanEnergyElectricity}</p>
                            <p>kWh</p>
                          </div>
                          <div className={styles.itemTitle}>清洁能源用电量</div>
                        </div>
                      </div>
                      <div className={styles.structureChart}>
                        <ReactECharts
                          option={energyStructureOptions(dataFilter(structureData))}
                          notMerge={true}
                          style={{ height: '100%', width: '100%' }}
                          lazyUpdate={false}
                          theme={'theme_name'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.mainBodyRight}>
                  <div className={styles.areaHead}>
                    <div className={styles.areaHeadTitle}>负荷详情</div>
                    <DatePicker
                      defaultValue={dayjs(new Date())}
                      onChange={loadDetailDateChange}
                      allowClear={false}
                    />
                  </div>
                  <div className={styles.areaBody}>
                    <CustomCharts
                      options={loadDetail(dataFilter(loadDetailData))}
                      loading={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CustomCard>
      </div>
    </div>
    {contextHolder}
  </ContainerPage>
}
export default EnergyMonitor
