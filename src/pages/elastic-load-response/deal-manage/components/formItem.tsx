import { forwardRef, useEffect, useState } from "react";
import { Button, Form, Input, Select, Space, message } from "antd";
import { useRequest } from "ahooks";
import { getUserList, getUserCapacity, getUserTableData } from "@/services/elastic-load-response/deal-manage";
import { useMyContext } from "./context";
import styles from '../index.less';
import { LineChartOutlined } from "@ant-design/icons";

/**
 * 单独将collapse中的label抽出来，这样每次新增都会初始化一个form实例
 * */
const CollapseLabelRow = (props: any) => {
  const {  label } = props;

  const { 
    identificationNum, 
    saveData, 
    collapseItemData, 
    setCollapseItemDate,
    collapseChildrenStatus,
    setCollapseChildrenStatus

    } = useMyContext();

  const [form] = Form.useForm();
  // 监听用户下拉框的数据选择
  const userId = Form.useWatch('userId', { form, preserve: true });

  // 下拉框数据
  const [selectData, setSelectData] = useState([]);

  // 请求下拉框中数据，每次添加该组件，都会请求下拉框中的数据，所以下拉框中的数据就无需单独处理
  const { run: fetchAddDeclaration } = useRequest(getUserList, {
    manual: true,
    onSuccess: (result) => {
      if (result.code === 200 && result.data) {
        const selectListData = result.data.filter((item: any) => item.select)
        setSelectData(selectListData)
      }
    }
  });

    
  // 获取可调容量
  const { run: fetchUserCapacity } = useRequest(getUserCapacity, {
    manual: true,
    onSuccess: async (result: any) => {
      if (result.code === 200 && result.data) {
        form.setFieldValue('capacity', result.data)
        const tableData = await getUserTableData(identificationNum, userId)
        if (tableData.code === 200) {
          // 监听下拉框中的值发生变化的时候，将userID、容量、对应的表格数据保存到面板每项数据中
           setCollapseItemDate({
            ...collapseItemData,
            [label]: {
              userId: userId,
              capacity: result.data,
              tableData: tableData.data
            }
          })
        }
      }
    }
  });

  // 点击曲线
  const showChartLineHand = () => {
    if (!userId) {
      message.info('请选择用户后在进行查看');
      return;
    }
    setCollapseChildrenStatus({
      ...collapseChildrenStatus,
      [label]: !collapseChildrenStatus[label]
    })
  }

  useEffect(() => {
    // 获取用户下拉框数据
    fetchAddDeclaration(identificationNum)
  }, [])

  useEffect(() => {
    if (userId) {
      // 请求容量
      fetchUserCapacity(userId)
    }
  }, [userId])

  return <div className={styles.addDeclarePanelHead}>
    <Form form={form} layout="inline">
      <Form.Item
        label="用户"
        name="userId"
        rules={[{ required: true, message: '请选择邀约计划' }]}
      >
        <Select
          style={{ width: 220 }}
          options={selectData || []}
          fieldNames={{ label: 'name', value: 'substationCode' }}
        />
      </Form.Item>
      <Form.Item
        label="容量"
        name="capacity"
        rules={[{ required: true, message: '请选择邀约计划' }]}
      >
        <Input style={{ width: 220 }} disabled />
      </Form.Item>
    </Form>
    <Space>
      <Button onClick={() => showChartLineHand()} icon={ <LineChartOutlined />}>曲线</Button>
      {collapseChildrenStatus[label] && <Button onClick={() => saveData(label)}>保存</Button>}
    </Space>
  </div>;
};

export default CollapseLabelRow
