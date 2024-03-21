import ImageUpload from '@/components/image-upload';
import { useRequest } from '@umijs/max';
import {
  Button,
  Cascader,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  UploadFile,
} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { getSiteById, postUpDateSiteInfo, updatePriceTime } from '@/services/enterprise-manage';
import { uploadFile } from '@/services/common';
import { MinusCircleOutlined, WalletOutlined } from '@ant-design/icons';
import { MessageInstance } from 'antd/es/message/interface';
import ElectricityPriceTime from './ElectricityPriceTime';
import ForecastModal from './forecastModal';
import styles from './index.less';

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
};

const { TextArea } = Input;

interface propsType {
  provinceData: any[]; // 省市县数据
  currentSiteInfo: any; // 当前站点ID
  setIsModalOpen: Dispatch<SetStateAction<boolean>>; // 修改模态框状态
  isModalOpen: boolean; // 模态框状态
  modalStatus: 'detail' | 'edit' | 'add' | null; // 该页面是否为编辑、详情
  messageApi: MessageInstance; // 信息提示框
  tableRef: any; // 表格组件，用于编辑后刷新表格
}

const SiteModal = (props: propsType) => {
  const {
    provinceData,
    isModalOpen,
    setIsModalOpen,
    currentSiteInfo,
    modalStatus,
    messageApi,
    tableRef,
  } = props;

  // FORM
  const [basisForm] = Form.useForm();
  // 图片列表
  const [imageList, setImageList] = useState<UploadFile[]>([]);
  // 图片详情
  const [detailImage, setDetailImage] = useState<{ id: number; url: string }[]>([]);
  // 编辑loading
  const [loading, setLoading] = useState<boolean>(false);
  // 选择的电站类别
  const [stationType, setStationType] = useState<number>();
  // 预估弹框
  const [isForecastModalOpen, setIsForecastModalOpen] = useState<boolean>(false);
  // 预估
  const [forecastList, setForecastList] = useState<any>({});
  // 预估类型
  const [forecastType, setForecastType] = useState<boolean>(true);
  // 电价时段设置ref
  const priceRef = useRef(null)
  // 展示自动电价or电价时段设置二者选其一
  const [customPowerPrice, setCustomPowerPrice] = useState<boolean>(false);

  /** 标题修改 */
  const getTitle = () => {
    switch (modalStatus) {
      case 'detail':
        return '站点详情';
      case 'edit':
        return '编辑站点';
      default:
        return '新增站点';
    }
  };

  /** 根据ID获取站点信息 */
  const { run: fetchSiteById } = useRequest(getSiteById, {
    manual: true,
    onSuccess: (result: any) => {
      if (result) {
        const formData = {
          ...result,
          startUpTime: result.startUpTime ? dayjs(result.startUpTime, 'YYYY-MM-DD HH:mm:ss') : '',
          region: result.region
            ? result.region.split(',').map((item: any) => Number(item))
            : result.regionName,
        };

        basisForm.setFieldsValue({
          ...formData,
        });
        setCustomPowerPrice(formData.calcPowerFlag);
        setStationType(formData.type);
        setForecastList({ incomeList: formData.incomeList, powerList: formData.powerList });
        let substationImgUrl = result.substationImgUrl && result.substationImgUrl?.split(',');

        if (substationImgUrl) {
          substationImgUrl = substationImgUrl.map((item: any) => {
            return {
              uid: Math.random().toString(),
              url: item,
              status: 'done',
              type: 'image/*',
            };
          });
        }
        setDetailImage(substationImgUrl ? substationImgUrl : []);
      }
    },
  });

  /** 上传电站电价信息 */
  const postElectricityPrice = async () => {
    if(priceRef.current === null) return;
    // 提交编辑电站电价信息
    const { form, monthAllData, selectMonthData } = priceRef.current!;

    const formData = (form as any).getFieldsValue()
    const timeEnum: any = {
      spikeTime: 1,
      peakTime: 2,
      peacetime: 3,
      valleyTime: 4
    }

    const year = dayjs(formData.year).format('YYYY');
    const substationPriceTimeList: any[] = [];
    const timeSoltEnum: string[] = ['spikeTime', 'peakTime', 'peacetime', 'valleyTime'];
    (monthAllData as []).forEach((item: any, index) => {
      const month = (selectMonthData[`item-${index}`] as []).map((mon: string) => mon.substring(0, mon.length - 1)).join(',')
      timeSoltEnum.forEach(timeName => {
        substationPriceTimeList.push({
          discount: formData[`${timeName}Ratio-${index}`],
          hour: item.timePeriod[timeName]?.filter((time: string) => time).join(',') || '',
          price: formData[`${timeName}Price-${index}`],
          substationCode: currentSiteInfo?.substationCode,
          type: timeEnum[timeName],
          month,
          year
        })
      })
    })
    const params = {
      year,
      substationCode: currentSiteInfo?.substationCode,
      substationPriceTimeList
    }
    await updatePriceTime(params)
  }


  /** 模态框确认 编辑  */
  const submitModalHandle = async () => {
    const isValidate = await basisForm.validateFields();
    if (!isValidate) {
      return;
    }
    if(priceRef.current !== null){
      const { form, formValidate, selectMonthData } = priceRef.current!;
      const isPriceValidate = await (form as any).validateFields();
      // 判断电站电价、折扣系数是否填写
      if (!isPriceValidate) {
        return;
      }
      // @ts-ignore
      if (!formValidate()) {
        return;
      }
      if (Object.values(selectMonthData).flat().length !== 12) {
        message.warning('当年所有月份电价未全部设置')
        return;
    }

    }


    const value = basisForm.getFieldsValue();
    setLoading(true);
    let region = '';
    if (Object.prototype.toString.call(value.region) === '[object Array]') {
      region = value.region.join(',');
    } else {
      region = value.region;
    }

    // 未上传图片
    const toBeUploadFile = imageList.filter(
      (item) => Object.prototype.toString.call(item) === '[object File]',
    );

    // 上传
    const res = toBeUploadFile.length > 0 && (await uploadFile(toBeUploadFile));
    // 已上传图片
    const uploadedFiles = imageList
      .filter((item) => Object.prototype.toString.call(item) === '[object Object]')
      .map((item) => item.url);
    // 上传图片替换
    const imagePaths = res.data ? [...res.data, ...uploadedFiles] : [...uploadedFiles];

    const params = {
      ...value,
      startUpTime: value.startUpTime ? dayjs(value.startUpTime).format('YYYY-MM-DD HH:mm:ss') : '',
      substationCode: currentSiteInfo?.substationCode,
      customerId: currentSiteInfo?.customerId,
      substationImgUrl: imagePaths.join(','),
      region,
      incomeList: forecastList.incomeList,
      powerList: forecastList.powerList,
    };

    if (modalStatus === 'edit') {
      // 编辑
      const result = await postUpDateSiteInfo(params);
      // 上传电站电价信息
      await postElectricityPrice()

      if (result.code !== 200) {
        messageApi.error('操作失败');
        setLoading(false);
        return;
      } else {
        messageApi.success('修改成功');
        tableRef?.current?.searchByParams({
          userId: localStorage.getItem('userId'),
        });
        basisForm.resetFields();
        // @ts-ignore 清空表单数据
        priceRef.current?.form.resetFields();
        // @ts-ignore
        priceRef.current?.resultMonthAllDataHandle();
        // @ts-ignore
        priceRef.current?.resultSelectMonthData();
      }
    }
    setLoading(false);
    setIsModalOpen(false);
  };

  // 处理运行信息第四排FormItem输入框
  const handleTitle = (isFirst = true) => {
    const res: any = {};
    // 第一个item
    if (isFirst) {
      //光伏、储能类别
      if (stationType === 52 || stationType === 53) {
        res.title = '并网电压等级';
      } else {
        //变、配电站
        res.title = '进线电压等级';
      }
    } else {
      //光伏、储能类别
      if (stationType === 52 || stationType === 53) {
        res.title = '电站容量';
        stationType === 52 ? (res.unit = '(kW)') : (res.unit = '(kWh)');
      } else if (stationType === 59) {
        //变电站
        res.title = '变压器台数';
        res.unit = '(个)';
      } else {
        //配电站
        res.title = '回路个数';
        res.unit = '(个)';
      }
    }
    return res;
  };

  useEffect(() => {
    if (currentSiteInfo?.substationCode && isModalOpen) {
      // 详情、编辑重置form表单
      fetchSiteById({ substationCode: currentSiteInfo?.substationCode });
    }
  }, [currentSiteInfo, isModalOpen]);



  return (
    <>
      <Modal
        title={getTitle()}
        open={isModalOpen}
        width={2000}
        footer={false}
        destroyOnClose
        centered
        onCancel={() => setIsModalOpen(false)}
      >
        <div className={styles.modalBody}>
          <div className={styles.container}>
            <Form {...layout} name="control-hooks" form={basisForm}>
              <div className={styles.basisInfo}>
                <div className={styles.title}>
                  <span>基础信息</span>
                  <Space>
                    <Button
                      onClick={() => {
                        setIsForecastModalOpen(true);
                        setForecastType(true);
                      }}
                    >
                      预计收益录入
                    </Button>
                    {stationType === 52 && (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                          onClick={() => {
                            setIsForecastModalOpen(true);
                            setForecastType(false);
                          }}
                        >
                          预计电量录入
                        </Button>
                      </div>
                    )}
                  </Space>
                </div>
                <Row>
                  <Col span={6}>
                    <Form.Item
                      label="站点名称"
                      name="name"
                      required
                      rules={[{ required: true, message: '请输入站点名称' }]}
                    >
                      <Input
                        autoComplete="off"
                        disabled={modalStatus === 'detail'}
                        style={{ width: '100%' }}
                        placeholder="请输入站点名称"
                      />
                    </Form.Item>
                    <Form.Item
                      label="电站类型"
                      name="type"
                      required
                      rules={[{ required: true, message: '请选择电站类型' }]}
                    >
                      <Select
                        disabled={modalStatus === 'detail'}
                        placeholder="请选择电站类型"
                        onChange={(value) => setStationType(value)}
                      >
                        <Select.Option value={52}>光伏</Select.Option>
                        <Select.Option value={53}>储能</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="所属客户"
                      name="customer"
                      required
                      rules={[{ required: true, message: '请输入所属客户' }]}
                    >
                      <Input
                        disabled={modalStatus === 'detail'}
                        style={{ width: '100%' }}
                        placeholder="请输入所属客户"
                      />
                    </Form.Item>
                    <Form.Item
                      label="经度"
                      name="longitude"
                      required
                      rules={[
                        { required: true, message: '请输入经度' },
                        {
                          // eslint-disable-next-line no-useless-escape
                          pattern:
                            /^(-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,15})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,15}|180)$/,
                          message: '请输入正确经度',
                        },
                      ]}
                    >
                      <Input
                        disabled={modalStatus === 'detail'}
                        style={{ width: '100%' }}
                        placeholder="请输入经度"
                      />
                    </Form.Item>
                    <Form.Item
                      label="纬度"
                      name="latitude"
                      required
                      rules={[
                        { required: true, message: '请输入纬度' },
                        {
                          // eslint-disable-next-line no-useless-escape
                          pattern: /^(\-|\+)?([0-8]?\d{1}\.\d{0,15}|90\.0{0,15}|[0-8]?\d{1}|90)$/,
                          message: '请输入正确经度',
                        },
                      ]}
                    >
                      <Input
                        disabled={modalStatus === 'detail'}
                        style={{ width: '100%' }}
                        placeholder="请输入纬度"
                      />
                    </Form.Item>


                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="所属省区"
                      name="region"
                      required
                      rules={[{ required: true, message: '请输入所属省区' }]}
                    >
                      <Cascader
                        options={provinceData}
                        style={{ width: '100%' }}
                        disabled={modalStatus === 'detail'}
                        fieldNames={{
                          label: 'name',
                          value: 'code',
                          children: 'childrens',
                        }}
                        placeholder="请选择所属省区"
                      />
                    </Form.Item>
                    <Form.Item
                      label="详细地址"
                      name="address"
                      required
                      rules={[{ required: true, message: '请输入详细地址' }]}
                    >
                      <Input
                        disabled={modalStatus === 'detail'}
                        style={{ width: '100%' }}
                        placeholder="请输入详细地址"
                      />
                    </Form.Item>
                    <Form.Item label="站点备注" name="remark">
                      <TextArea
                        autoSize={{ minRows: 4, maxRows: 12 }}
                        disabled={modalStatus === 'detail'}
                        placeholder="请输入站点备注"
                        style={{ height: '90px', width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="站点图片" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                      {modalStatus === 'detail' ? (
                        <Image.PreviewGroup
                          preview={{
                            onChange: (current, prev) =>
                              console.log(`current index: ${current}, prev index: ${prev}`),
                          }}
                        >
                          <Space wrap>
                            {detailImage && detailImage.length ? (
                              detailImage.map((item) => {
                                return (
                                  <Image
                                    key={item.url}
                                    src={item.url}
                                    className={styles.image}
                                    width={110}
                                    height={70}
                                  />
                                );
                              })
                            ) : (
                              <span>暂无图片</span>
                            )}
                          </Space>
                        </Image.PreviewGroup>
                      ) : (
                        <ImageUpload
                          getImageList={setImageList}
                          imageList={imageList}
                          uploadedImage={detailImage}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <div className={styles.bodyBottom}>
                <div className={styles.runInfo}>
                  <div className={styles.title}>运行信息</div>
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label="费用联系人"
                        name="contact1"
                        required
                        rules={[{ required: true, message: '请输入姓名' }]}
                      >
                        <Input
                          disabled={modalStatus === 'detail'}
                          style={{ width: '100%' }}
                          placeholder="请输入姓名"
                        />
                      </Form.Item>
                      <Form.Item label="运维联系人" name="contact2">
                        <Input
                          disabled={modalStatus === 'detail'}
                          style={{ width: '100%' }}
                          placeholder="请输入姓名"
                        />
                      </Form.Item>
                      <Form.Item label="永清负责人" name="contact3">
                        <Input
                          disabled={modalStatus === 'detail'}
                          style={{ width: '100%' }}
                          placeholder="请输入姓名"
                        />
                      </Form.Item>
                      <Form.Item
                        label={handleTitle().title + '(kV)'}
                        name="gridVoltageLevel"
                        rules={[
                          {
                            pattern: /^\d*\.?\d+$/,
                            message: `请输入正确的${handleTitle().title}`,
                          },
                        ]}
                      >
                        <Input
                          disabled={modalStatus === 'detail'}
                          style={{ width: '100%' }}
                          placeholder={'请输入' + handleTitle().title}
                        />
                      </Form.Item>
                      <Form.Item label="投运时间" name="startUpTime">
                        <DatePicker
                          style={{ width: '100%' }}
                          disabled={modalStatus === 'detail'}
                          showTime
                        />
                      </Form.Item>
                      <Form.Item
                        label="SOC上限(％)"
                        name="socUpper"
                        hidden={stationType !== 53}
                        rules={[
                          {
                            pattern: /^\d*\.?\d+$/,
                            message: `请输入正确的SOC上限`,
                          },
                        ]}
                      >
                        <Input
                          disabled={modalStatus === 'detail'}
                          style={{ width: '100%' }}
                          placeholder="请输入SOC上限"
                        />
                      </Form.Item>

                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="光伏倾角(°)"
                        name="photovoltaicTiltAngle"
                        hidden={stationType !== 52}
                        rules={[
                          {
                            pattern: /^\d*\.?\d+$/,
                            message: `请输入正确的光伏倾角`,
                          },
                        ]}
                      >
                        <Input
                          disabled={modalStatus === 'detail'}
                          style={{ width: '100%' }}
                          placeholder="请输入光伏倾角度数"
                        />
                      </Form.Item>
                      <Form.Item
                        label="联系电话"
                        name="contactPhone1"
                        required
                        rules={[
                          { required: true, message: '请输入站点联系人电话' },
                          {
                            pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
                            message: '请输入正确手机号',
                          },
                        ]}
                      >
                        <Input
                          disabled={modalStatus === 'detail'}
                          style={{ width: '100%' }}
                          placeholder="请输入联系电话"
                          maxLength={11}
                        />
                      </Form.Item>
                      <Form.Item
                        label="联系电话2"
                        name="contactPhone2"
                        rules={[
                          {
                            pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
                            message: '请输入正确手机号',
                          },
                        ]}
                      >
                        <Input
                          disabled={modalStatus === 'detail'}
                          style={{ width: '100%' }}
                          maxLength={11}
                          placeholder="请输入联系电话"
                        />
                      </Form.Item>
                      <Form.Item
                        label="联系电话3"
                        name="contactPhone3"
                        rules={[
                          {
                            pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
                            message: '请输入正确手机号',
                          },
                        ]}
                      >
                        <Input
                          disabled={modalStatus === 'detail'}
                          style={{ width: '100%' }}
                          placeholder="请输入联系电话"
                          maxLength={11}
                        />
                      </Form.Item>
                      <Form.Item
                        label={handleTitle(false).title + handleTitle(false).unit}
                        name="capacity"
                        rules={[
                          { required: true, message: '请输入' + handleTitle(false).title },
                          {
                            pattern: /^\d*\.?\d+$/,
                            message: `请输入正确的${handleTitle(false).title}`,
                          },
                        ]}
                      >
                        <Input
                          disabled={modalStatus === 'detail'}
                          style={{ width: '100%' }}
                          placeholder={'请输入' + handleTitle(false).title}
                        />
                      </Form.Item>

                      <Form.Item
                        label="额定功率(kW)"
                        name="ratedPower"
                        hidden={stationType !== 53}
                        rules={[
                          {
                            pattern: /^\d*\.?\d+$/,
                            message: `请输入正确的额定功率`,
                          },
                        ]}
                      >
                        <Input
                          disabled={modalStatus === 'detail'}
                          style={{ width: '100%' }}
                          placeholder="请输入额定功率"
                        />
                      </Form.Item>
                      <Form.Item
                        label="SOC下限(％)"
                        name="socLower"
                        hidden={stationType !== 53}
                        rules={[
                          {
                            pattern: /^\d*\.?\d+$/,
                            message: `请输入正确的SOC下限`,
                          },
                        ]}
                      >
                        <Input
                          disabled={modalStatus === 'detail'}
                          style={{ width: '100%' }}
                          placeholder="请输入SOC下限"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                {
                  customPowerPrice ? null : (
                    <div className={styles.formItemW}>
                      <div className={`${styles.price} ${styles.runInfo}`}>
                        <div className={styles.title}>自用电价</div>
                        <Row>
                          <Col span={12}>
                            <Form.Item
                              label="尖峰电价(元)"
                              name="peakPrice"
                              required
                              rules={[
                                { required: true, message: '请输入尖峰电价' },
                                {
                                  pattern: /^\d*\.?\d+$/,
                                  message: `请输入正确的尖峰电价`,
                                },
                              ]}
                            >
                              <Input
                                disabled={modalStatus === 'detail'}
                                style={{ width: '100%' }}
                                autoComplete="off"
                                placeholder="请输入尖峰电价"
                              />
                            </Form.Item>
                            <Form.Item
                              label="峰期电价(元)"
                              name="highPrice"
                              required
                              rules={[
                                { required: true, message: '请输入峰期电价' },
                                {
                                  pattern: /^\d*\.?\d+$/,
                                  message: `请输入正确的峰期电价`,
                                },
                              ]}
                            >
                              <Input
                                disabled={modalStatus === 'detail'}
                                style={{ width: '100%' }}
                                autoComplete="off"
                                placeholder="请输入峰期电价"
                              />
                            </Form.Item>
                            <Form.Item
                              label="平期电价(元)"
                              name="normalPrice"
                              required
                              rules={[
                                { required: true, message: '请输入平期电价' },
                                {
                                  pattern: /^\d*\.?\d+$/,
                                  message: `请输入正确的平期电价`,
                                },
                              ]}
                            >
                              <Input
                                disabled={modalStatus === 'detail'}
                                style={{ width: '100%' }}
                                autoComplete="off"
                                placeholder="请输入平期电价"
                              />
                            </Form.Item>
                            <Form.Item
                              label="谷期电价(元)"
                              name="valleyPrice"
                              required
                              rules={[
                                { required: true, message: '请输入谷期电价' },
                                {
                                  pattern: /^\d*\.?\d+$/,
                                  message: `请输入正确的谷期电价`,
                                },
                              ]}
                            >
                              <Input
                                disabled={modalStatus === 'detail'}
                                style={{ width: '100%' }}
                                placeholder="请输入谷期电价"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="折扣系数"
                              name="peakPriceDiscount"
                              required
                              rules={[
                                { required: true, message: '请输入折扣系数' },
                                {
                                  pattern: /^\d*\.?\d+$/,
                                  message: `请输入正确的折扣系数`,
                                },
                              ]}
                            >
                              <Input
                                disabled={modalStatus === 'detail'}
                                style={{ width: '100%' }}
                                autoComplete="off"
                                placeholder="请输入折扣系数"
                              />
                            </Form.Item>
                            <Form.Item
                              label="折扣系数"
                              name="highPriceDiscount"
                              required
                              rules={[
                                { required: true, message: '请输入折扣系数' },
                                {
                                  pattern: /^\d*\.?\d+$/,
                                  message: `请输入正确的折扣系数`,
                                },
                              ]}
                            >
                              <Input
                                disabled={modalStatus === 'detail'}
                                style={{ width: '100%' }}
                                autoComplete="off"
                                placeholder="请输入折扣系数"
                              />
                            </Form.Item>
                            <Form.Item
                              label="折扣系数"
                              name="normalPriceDiscount"
                              required
                              rules={[
                                { required: true, message: '请输入折扣系数' },
                                {
                                  pattern: /^\d*\.?\d+$/,
                                  message: `请输入正确的折扣系数`,
                                },
                              ]}
                            >
                              <Input
                                disabled={modalStatus === 'detail'}
                                style={{ width: '100%' }}
                                autoComplete="off"
                                placeholder="请输入折扣系数"
                              />
                            </Form.Item>
                            <Form.Item
                              label="折扣系数"
                              name="valleyPriceDiscount"
                              required
                              rules={[
                                { required: true, message: '请输入折扣系数' },
                                {
                                  pattern: /^\d*\.?\d+$/,
                                  message: `请输入正确的折扣系数`,
                                },
                              ]}
                            >
                              <Input
                                disabled={modalStatus === 'detail'}
                                style={{ width: '100%' }}
                                placeholder="请输入折扣系数"
                              />
                            </Form.Item>

                          </Col>
                        </Row>
                      </div>
                    </div>
                  )
                }
                <div className={styles.priceItem} style={{flex: !customPowerPrice ? 'none' : 1}}>
                  <div className={styles.price}>
                    <div className={styles.title}>上网电价</div>
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          label="脱硫煤电价(元)"
                          name="coalPrice"
                          required
                          rules={[
                            { required: true, message: '请输入脱硫煤电价' },
                            {
                              pattern: /^\d*\.?\d+$/,
                              message: `请输入正确的脱硫煤电价`,
                            },
                          ]}
                        >
                          <Input
                            disabled={modalStatus === 'detail'}
                            style={{ width: '100%' }}
                            autoComplete="off"
                            placeholder="请输入脱硫煤电价"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </Form>
            {
              customPowerPrice ? (
                <div className={`${styles.basisInfo} ${styles.electriPrice}`}>
                  <div className={styles.title}>电价时段设置</div>
                  <Row gutter={[8, 8]}>
                    <Col span={24}>
                      <ElectricityPriceTime
                        ref={priceRef}
                        substationCode={currentSiteInfo?.substationCode}
                        modalStatus={modalStatus}
                        isModalOpen={isModalOpen}
                      />
                    </Col>
                  </Row>
                </div>
              ) : null
            }

          </div>

          <div className={styles.modalFooter}>
            <Space size={40}>
              {modalStatus === 'detail' ? (
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  返回
                </Button>
              ) : (
                <>
                  <Button
                    icon={<MinusCircleOutlined />}
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                  >
                    取消
                  </Button>
                  <Button icon={<WalletOutlined />} loading={loading} onClick={submitModalHandle}>
                    保存
                  </Button>
                </>
              )}
            </Space>
          </div>
        </div>
      </Modal>

      <ForecastModal
        isForecastModalOpen={isForecastModalOpen}
        setIsForecastModalOpen={setIsForecastModalOpen}
        setForecastList={setForecastList}
        substationCode={currentSiteInfo?.substationCode}
        forecastList={forecastList}
        modalStatus={modalStatus}
        forecastType={forecastType}
      />
    </>
  );
};
export default SiteModal;
