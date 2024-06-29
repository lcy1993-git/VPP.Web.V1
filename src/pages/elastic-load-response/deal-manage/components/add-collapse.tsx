import { addDeclaration, getUserTableData } from "@/services/elastic-load-response/deal-manage";
import { PlusOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import { Button, Collapse, Form, Input, Select, Table, message } from "antd"
import { forwardRef, useEffect, useRef, useState } from "react"
import styles from '../index.less';
import AddCollapseChildren from "./add-collapse-children";
import { MyProvider } from "./context";

import CollapseLabelRow from './formItem'




const AddCollapse = (props: any) => {

  const { identificationNum } = props;

  const [messageApi, contextHolder] = message.useMessage(); 

  // 面板每项数据
  const [collapseItemData, setCollapseItemDate] = useState<any>({
    collapse1: {
      userId: '',
      capacity: '',
      tableData: []
    }
  })

  // 表格保存后，不能在编辑
  const [tableInputDisable, setTableInputDisable] = useState({
    collapse1: false
  });

  // 面板数据
  const [collapseItems, setCollapseItems] = useState([
    {
      key: '1',
      label: <CollapseLabelRow
        label={`collapse1`}
      />,
      children: <AddCollapseChildren  label={`collapse1`}/>,
    },
  ])


  // 面板head点击曲线，控制面板Children的内容
  const [collapseChildrenStatus, setCollapseChildrenStatus] = useState({
    collapse1: true
  })

  // 新增面板内容
  const addCollapseLableHandle = () => {
    const isAllSave = Object.values(tableInputDisable).every(item => item);
    if (!isAllSave) {
      messageApi.warning('请对上一条数据进行保存')
      return;
    }

    // 处理展示曲线还是表格
      
    setCollapseChildrenStatus({
      ...collapseChildrenStatus,
      [`collapse${Number(collapseItems[collapseItems.length - 1].key) + 1}`]: true
    })

    setCollapseItems(
      [
        ...collapseItems,
        {
          key: Number(collapseItems[collapseItems.length - 1].key) + 1 + '',
          label: <CollapseLabelRow
            label={`collapse${Number(collapseItems[collapseItems.length - 1].key) + 1}`}
          />,
          children: <AddCollapseChildren  label={`collapse${Number(collapseItems[collapseItems.length - 1].key) + 1}`}/>,
        }
      ]
    )
    // 表格保存后，不能在编辑
    setTableInputDisable({
      ...tableInputDisable,
      [`collapse${Number(collapseItems[collapseItems.length - 1].key) + 1}`]: false
    })
  }

  // 保存
  const { run: fetchAddDeclaration } = useRequest(addDeclaration, {
    manual: true,
  });

  // 单个面板点击保存
  const saveData = (currentIndex: any) => {
    const tableData = collapseItemData[currentIndex].tableData;
    const substationCode = collapseItemData[currentIndex].userId;

    if (!substationCode) {
      return messageApi.warning('请选择用户')
    }
    
     // 确保所有输入都有值
     const allFilled = tableData.every(
      (item: any) => item.declaredCapacity && item.declaredPrice,
    );
    if (allFilled) {
      // 处理表格编辑状态
      setTableInputDisable({
        ...tableInputDisable,
        [currentIndex]: true
      });
      
      const capacities = tableData.map((item: any) => item.declaredCapacity);
      const prices = tableData.map((item: any) => item.declaredPrice);
      fetchAddDeclaration({
        substationCode: substationCode,
        declaredPriceList: prices,
        declaredCapacityList: capacities,
      });

    } else {
      messageApi.warning('请确保所有申报容量和申报价格都已填写！');
    }
  }


  return <div className={styles.addDeclarePanel}>
    <MyProvider value={{
      identificationNum: identificationNum,
      saveData: saveData, // 每行保存按钮点击的方法
      collapseItemData: collapseItemData,
      setCollapseItemDate: setCollapseItemDate,
      tableInputDisable: tableInputDisable,
      collapseChildrenStatus: collapseChildrenStatus,
      setCollapseChildrenStatus: setCollapseChildrenStatus
    }}>

      <div className={styles.addDeclarePanelMain}>
        <Collapse
          items={collapseItems}
          collapsible="icon"
          defaultActiveKey={'1'}
        />

      </div>
      <div className={styles.addDeclarePanelFooter}>
        <Button onClick={addCollapseLableHandle}>
          <PlusOutlined />
        </Button>
      </div>
    </MyProvider>
      {contextHolder}
  </div>
}
export default AddCollapse
