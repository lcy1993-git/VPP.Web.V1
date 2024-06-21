import CustomItem from '@/components/custom-Item';
import { getMenuList } from '@/services/system/menu';
import { useRequest } from 'ahooks';
import { Col, Input, Radio, Row, TreeSelect } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { useEffect, useMemo, useState } from 'react';
// import IconSymbol from '../IconSymbol';
import styles from './index.less';
const { TextArea } = Input;

/**
 * icons集合
 * */
export const iconData = [
  'icon-tiaodushishi','icon-tesechangjing','icon-chunengdianzhan','icon-xitongpeizhi','icon-yongnengzhenduan','icon-tanpeieguanli','icon-yongnengzonglan1',
  'icon-qiyemianban','icon-shebeixiangqing','icon-shebeiguanli','icon-tanpaifangguankong','icon-tanpaifangfenxi','icon-yonghuguanli','icon-gaojingguanli1',
  'icon-tanzichanguanli', 'icon-qiyefangwen','icon-jiaoseguanli','icon-nenghaofenxi','icon-caidanguanli','icon-tanpaifangjiance','icon-jiaoyiguanli',
  'icon-guangfudianzhan','icon-baobiaoguanli1','icon-chongdiandianzhan','icon-tanpaifangxiangqing','icon-baobiaobaogao','icon-nenghaojiance1','icon-yunhangjiance1',
  'icon-zonghenengyuankanban','icon-yongnengfenxi', 'icon-tanpaifangzonglan','icon-qiyeguanli','icon-SVGpeizhi','icon-fenbushinengyuanjiance','icon-qingjienengyuan1',
  'icon-danxingfuhexiangying', 'icon-xitongguanli', 'icon-quyuyongnengjiance', 'icon-daping',
].map((item, index) => {
  return {
    id: index + 1,
    icon: item
  }
})



interface Props {
  form: FormInstance;
}

const AddMenuForm: React.FC<Props> = (props) => {
  const { form } = props;
  const { data } = useRequest(() => getMenuList(localStorage.getItem('userId') || ''));
  // icon下拉框是否显示
  const [iconStatus, setIconStatus] = useState<boolean>(false);

  const mapData = (data: any) => {
    return {
      title: data.name,
      value: data.id,
    };
  };
  const handleData = useMemo(() => {
    if (data?.data) {
      const selectData = data?.data.map((item: any) => {
        return mapData(item);
      });
      return [{ label: '主菜单', value: '0', children: selectData }];
    }
  }, [data]);

  const modifyStatus = () => {
    setIconStatus(false);
  };
  // 选择上级目录后改变菜单类型 主菜单对应目录
  const handleParentMenuChange = (value: any) => {
    if (value === '0') {
      form.setFieldsValue({
        type: 'M',
      });
    } else {
      form.setFieldsValue({
        type: 'C',
      });
    }
  };
  // 选择菜单类型后更新上级目录  主菜单对应目录
  const handleMenuTypeChange = (value: any) => {
    if (value?.target?.value === 'M') {
      form.setFieldsValue({
        parentId: '0',
      });
    } else {
      form.setFieldsValue({
        parentId: null,
      });
    }
  };
  useEffect(() => {
    window.addEventListener('click', modifyStatus, false);
    return () => {
      window.removeEventListener('click', modifyStatus);
    };
  }, []);

  return (
    <>
      <Row>
        <Col span={12}>
          <CustomItem
            label="上级菜单"
            required
            name="parentId"
            rules={[{ required: true, message: '请选择上级菜单' }]}
            initialValue="0"
          >
            <TreeSelect
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={handleData}
              placeholder="请选择"
              treeDefaultExpandAll
              onChange={handleParentMenuChange}
              style={{ width: '250px' }}
            />
          </CustomItem>
        </Col>
        <Col span={12}>
          <CustomItem
            label="显示排序"
            required
            name="indexNumber"
            rules={[
              { required: true, message: '请输入显示排序' },
              { pattern: /^[1-9]\d*$/, message: `请输入正确的显示排序`, }
            ]}
          >
            <Input autoComplete="off" style={{ width: '250px' }} />
          </CustomItem>
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <CustomItem
            label="菜单类型"
            name="type"
            required
            initialValue="M"
            rules={[{ required: true, message: '请选择菜单类型' }]}
          >
            <Radio.Group onChange={handleMenuTypeChange}>
              <Radio value="M">目录</Radio>
              <Radio value="C">菜单</Radio>
            </Radio.Group>
          </CustomItem>
        </Col>
        <Col span={12}>
          <CustomItem
            label="菜单状态"
            required
            name="status"
            initialValue={1}
            rules={[{ required: true, message: '请选择菜单状态' }]}
          >
            <Radio.Group>
              <Radio value={1}>正常</Radio>
              <Radio value={0}>停用</Radio>
            </Radio.Group>
          </CustomItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <CustomItem
            label="菜单图标"
            name="icon"
            style={{ position: 'relative' }}
            shouldUpdate={(pre: any, cur: any) => pre.icon !== cur.icon}
          >
            <Input style={{ display: 'none' }} placeholder={'请点击选择图标'} />
            <div
              className={styles.customInput}
              onClick={(e) => {
                e.stopPropagation();
                setIconStatus(true);
              }}
            >
              {/* <IconSymbol name={form.getFieldValue('icon')} className={styles.bigScreen} /> */}
              <i className={`iconfont ${form.getFieldValue('icon')}`}></i>
              <span className={styles.iconfont}>{form.getFieldValue('icon')}</span>
            </div>
          </CustomItem>
          {iconStatus ? (
            <div className={styles.iconBlock}>
              {iconData.map((s) => (
                <div
                  key={s.id}
                  className={styles.iconItem}
                  onClick={(e) => {
                    form.setFieldsValue({
                      icon: s.icon,
                    });
                    setIconStatus(false);
                    e.stopPropagation();
                  }}
                >
                  {/* <IconSymbol key={`${s.id}-symbol`} className={styles.bigScreen} name={s.icon} /> */}
                  <i style={{fontSize: 26}} className={`iconfont ${s.icon}`}></i>
                </div>
              ))}
            </div>
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <CustomItem
            label="菜单名称"
            required
            name="name"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input autoComplete="off" placeholder="请输入菜单名称" style={{ width: '250px' }} />
          </CustomItem>
        </Col>
        <Col span={12}>
          <CustomItem
            label="菜单路由"
            required
            name="path"
            rules={[{ required: true, message: '请输入菜单路由' }]}
          >
            <Input autoComplete="off" placeholder="请输入菜单路由" style={{ width: '250px' }} />
          </CustomItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <CustomItem label="用户备注" name="remark">
            <TextArea maxLength={200} rows={3} showCount style={{ width: '610px' }} />
          </CustomItem>
        </Col>
      </Row>
    </>
  );
};

export default AddMenuForm;
