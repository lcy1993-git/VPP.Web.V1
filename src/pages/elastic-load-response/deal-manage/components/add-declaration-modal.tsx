import {
  getIdentificationNum,
  getPlanInfo,
  getUserCapacity,
  getUserList,
  getUserTableData,
} from '@/services/elastic-load-response/deal-manage';
import { PlusOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Col, Collapse, Form, Input, Modal, Row, Select, Table } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from '../index.less';
import { addDeclarationColumns } from '../utils';
import InitLabel from './label';

interface PropsType {
  open: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>; // 修改派单模态框状态
}

const AddDeclarationModal = (props: PropsType) => {
  const { open, setModalOpen } = props;
  // 邀约计划
  const [form] = Form.useForm();
  // 计划
  const identificationNum = Form.useWatch('identificationNum', form);
  const [curve, setCurve] = useState<boolean>(false);

  // 邀约计划option
  const { data: planOptions } = useRequest(getIdentificationNum, {
    manual: false,
  });

  // 获取计划信息
  const { run: fetchPlanInfo } = useRequest(getPlanInfo, {
    manual: true,
    onSuccess: (res) => form.setFieldsValue(res),
  });

  // 获取可调容量
  const { run: fetchUserCapacity } = useRequest(getUserCapacity, {
    manual: true,
  });

  // 获取表格数据
  const { run: fetchUserTableData } = useRequest(getUserTableData, {
    manual: true,
  });

  const [itemsData, setItemsData] = useState<any>([]);
  const [items, setItems] = useState<any>([]);

  // 初始化label
  // const InitLabel = (data: any, key: string) => {
  //   return (
  //     <div className={styles.header}>
  //       <Row>
  //         用户：
  //         <Select
  //           style={{ width: 220 }}
  //           options={data}
  //           fieldNames={{ label: 'name', value: 'substationCode' }}
  //           onChange={(value) => {
  //             fetchUserCapacity(value).then((res) => {
  //               setItemsData((prevItems: any) =>
  //                 prevItems.map((item: any) =>
  //                   item.key === key ? { ...item, capacity: res } : item,
  //                 ),
  //               );
  //               // item.capacity = res;
  //             });
  //             fetchUserTableData(identificationNum, value).then((res) => {
  //               // item.dataSource = res;
  //               setItemsData((prevItems: any) =>
  //                 prevItems.map((item: any) =>
  //                   item.key === key ? { ...item, dataSource: res } : item,
  //                 ),
  //               );
  //             });
  //             // setItems((prevItems: any) =>
  //             //   prevItems.map((item: any) =>
  //             //     item.key === key
  //             //       ? { ...prevItems, dataSource: item.dataSource, capacity: item.capacity }
  //             //       : item,
  //             //   ),
  //             // );
  //           }}
  //         />
  //         容量：
  //         <Input style={{ width: 220 }} disabled value={itemsData[key]?.capacity} />
  //       </Row>
  //       <Button>
  //         <LineChartOutlined />
  //         曲线
  //       </Button>
  //     </div>
  //   );
  // };

  // 初始化children
  const initChildren = (key: string) => {
    return (
      <Table
        dataSource={itemsData[key]?.dataSource}
        columns={addDeclarationColumns}
        pagination={false}
        size="small"
      />
    );
  };

  const basicItemData = { capacity: '', dataSource: [] };

  // 用户列表
  const { data: userList } = useRequest(getUserList, {
    manual: false,
    onSuccess: (res) => {
      setItems([
        {
          key: '1',
          label: <InitLabel setCurve={setCurve} data={res} />,
          children: initChildren('1'),
        },
      ]);
    },
  });

  // 新增新的面板
  const addItem = () => {
    const newKey = items.length + 1;
    const newData = { ...basicItemData, key: newKey };
    const newItem = {
      key: newKey,
      label: <InitLabel data={userList} setCurve={setCurve} />,
      children: initChildren(newKey), // 或者其他动态生成的children内容
    };
    setItems([...items, newItem]);
    setItemsData([...itemsData, newData]);
  };

  useEffect(() => {
    setItems(items);
  }, [itemsData]);

  // useEffect(() => {
  //   if (identificationNum && userList) {
  //     setItems([
  //       {
  //         key: '1',
  //         label: InitLabel(userList, '1'),
  //         children: initChildren('1'),
  //       },
  //     ]);
  //     setItemsData([{ ...basicItemData, key: '1' }]);
  //   }
  // }, [identificationNum, userList]);

  // useEffect(() => {
  //   if (substationCode && identificationNum) {
  //     fetchUserTableData(identificationNum, substationCode);
  //   }
  // }, [identificationNum, substationCode]);

  // const items: CollapseProps['items'] = [
  //   {
  //     key: '1',
  //     label: (
  //       <div className={styles.header}>
  //         <Form autoComplete="off" form={userForm}>
  //           <Row>
  //             <Form.Item
  //               label="用户"
  //               name="substationCode"
  //               rules={[{ required: true, message: '请选择用户' }]}
  //             >
  //               <Select
  //                 style={{ width: 220 }}
  //                 options={userList}
  //                 fieldNames={{ label: 'name', value: 'substationCode' }}
  //                 onChange={(value) => fetchUserCapacity(value)}
  //               />
  //             </Form.Item>
  //             <Form.Item label="可调容量(MW)" name="capacity" style={{ marginLeft: '40px' }}>
  //               <Input style={{ width: 220 }} disabled />
  //             </Form.Item>
  //           </Row>
  //         </Form>
  //         <Button>
  //           <LineChartOutlined />
  //           曲线
  //         </Button>
  //       </div>
  //     ),
  //     children: renderItemText(),
  //   },
  // ];

  return (
    <Modal
      open={open}
      footer={null}
      width={1200}
      title="交易申报新增"
      onCancel={() => setModalOpen(false)}
      destroyOnClose
      centered
    >
      <div className={styles.addDeclarationModal}>
        <Form autoComplete="off" labelCol={{ span: 6 }} form={form}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="邀约计划信息："
                name="identificationNum"
                rules={[{ required: true, message: '请选择邀约计划' }]}
              >
                <Select
                  style={{ width: 360 }}
                  options={planOptions?.map((item: any) => ({
                    label: item,
                    value: item,
                  }))}
                  onChange={(value) => fetchPlanInfo(value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="运行日" name="operatingDay">
                <Input style={{ width: 360 }} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="响应类型" name="responseType">
                <Select
                  style={{ width: 360 }}
                  disabled
                  options={[
                    { label: '削峰响应', value: 0 },
                    { label: '填谷响应', value: 1 },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="需求时段" name="demandPeriod">
                <Input style={{ width: 360 }} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="需求地区" name="demandArea">
                <Input style={{ width: 360 }} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="申报价格上限" name="maximumBidPrice">
                <Input style={{ width: 360 }} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="申报价格下限" name="minimumBidPrice">
                <Input style={{ width: 360 }} disabled />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className={styles.bottomContainer}>
          {curve ? (
            <>1</>
          ) : (
            <>
              <Collapse accordion items={items} defaultActiveKey={['1']} collapsible="icon" />
              <Button onClick={addItem}>
                <PlusOutlined />
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddDeclarationModal;
