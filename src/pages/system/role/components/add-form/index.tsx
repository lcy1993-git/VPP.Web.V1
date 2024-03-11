import CustomItem from '@/components/custom-Item';
import { getMenuList } from '@/services/system/menu';
import { useRequest } from 'ahooks';
import { Checkbox, Col, Input, Row, Tree } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import styles from './index.less';

const mapTreeData = (data: any) => {
  return {
    title: data.name,
    key: data.id,
    children:
      data.children.length !== 0 && data.type === 'M' ? data.children?.map(mapTreeData) : [],
  };
};
interface FormParams {
  chooseKeys?: any;
  setChooseKeys?: Dispatch<SetStateAction<any[] | undefined>>;
  form: FormInstance;
}

const AddRoleForm: React.FC<FormParams> = (props) => {
  const { setChooseKeys, chooseKeys } = props;
  const userId = localStorage.getItem('userId');
  const { data } = useRequest(() => getMenuList(userId || ''));
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(chooseKeys);

  const handleData = useMemo(() => {
    if ((data as any)?.data) {
      const treeData = (data as any)?.data.map((item: any) => {
        return mapTreeData(item);
      });

      const copyKeys = [...chooseKeys];

      const parentIds: any[] = [];
      treeData.forEach((item: any) => {
        if (copyKeys.indexOf(item.key) > -1 && item.children.length > 0) {
          parentIds.push(item.key);
        }
      });

      const childKeys = copyKeys.filter((item: any) => {
        return !parentIds.includes(item);
      });
      setCheckedKeys(childKeys);

      // 2、查看每个父节点的子节点是否都被选中，如果没有被选中，则删除父节点

      return treeData;
    }
  }, [data]);

  const onCheck = (checkedKeys: any) => {
    // const { halfCheckedKeys } = result;
    const keys = [...checkedKeys];
    setCheckedKeys(keys);
    setChooseKeys?.(keys);
  };

  const onExpandAll = (e: any) => {
    if (!e.target.checked) {
      setExpandedKeys([]);
      return;
    }
    const copyData = [...handleData];
    const expandKeys = copyData.map((item: any) => item.key);
    setExpandedKeys(expandKeys);
  };

  const onExpand = (value: any) => {
    setExpandedKeys(value);
  };

  const onCheckAll = (e: any) => {
    if (!e.target.checked) {
      setCheckedKeys([]);
      setChooseKeys?.([]);
      return;
    }
    const keys: any[] = [];
    for (let i = 0; i < handleData.length; i++) {
      keys.push(handleData[i]?.key);
      if (handleData[i].children && handleData[i].children.length > 0) {
        for (let j = 0; j < handleData[i].children.length; j++) {
          keys.push(handleData[i].children[j]?.key);
        }
      }
    }
    setCheckedKeys(keys);
    setChooseKeys?.(keys);
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <CustomItem
            label="权限名称"
            required
            name="name"
            rules={[{ required: true, message: '请输入权限名称' }]}
          >
            <Input autoComplete="off" placeholder="请输入权限名称" style={{ width: '250px' }} />
          </CustomItem>
        </Col>
        <Col span={12}>
          <CustomItem
            label="权限描述"
            required
            name="nickName"
            rules={[{ required: true, message: '请输入权限描述' }]}
          >
            <Input autoComplete="off" placeholder="请输入权限描述" style={{ width: '250px' }} />
          </CustomItem>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <CustomItem label="菜单权限" name="menuIds" style={{ width: '610px' }}>
            <div className={styles.treeItem}>
              <div className={styles.fold}>
                <Checkbox onChange={(e) => onExpandAll(e)}>展开/折叠</Checkbox>
                <Checkbox style={{ marginLeft: '15px' }} onChange={(e) => onCheckAll(e)}>
                  全选/全不选
                </Checkbox>
              </div>

              {handleData && handleData.length > 0 && (
                <Tree
                  checkedKeys={checkedKeys}
                  height={425}
                  onExpand={onExpand}
                  expandedKeys={expandedKeys}
                  checkable
                  onCheck={onCheck}
                  treeData={handleData}
                  selectedKeys={chooseKeys}
                />
              )}
            </div>
          </CustomItem>
        </Col>
      </Row>
    </>
  );
};

export default AddRoleForm;
