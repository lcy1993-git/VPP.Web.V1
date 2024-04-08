import { getAreaList, getIndustryList } from '@/services/energy-analysis';
import { useRequest } from '@umijs/max';
import { Form, Select } from 'antd';
import { Dispatch, SetStateAction, useEffect } from 'react';
/**
 * 碳排放详情分类表单组件
 * @setType 修改父组件选择类别
 * @setArea 修改父组件选择区域id
 * @setIndustryCode 修改父组件选择行业code
 * @setEnterpriseCategory 修改企业类别
 * */

interface propsType {
  setType: Dispatch<SetStateAction<any>>;
  setArea: Dispatch<SetStateAction<any>>;
  setEnterpriseCategory: Dispatch<SetStateAction<any>>;
  setIndustryCode: Dispatch<SetStateAction<any>>;
}

const SelectForm = (props: propsType) => {
  const { setType, setIndustryCode, setArea, setEnterpriseCategory } = props;
  // 搜素表单实例
  const [searchForm] = Form.useForm();
  // 选择区域类型
  const type = Form.useWatch('type', searchForm);
  // 选择企业类别
  const enterpriseCategory = Form.useWatch('enterpriseCategory', searchForm);

  // 行业数据
  const { data: industryList } = useRequest(getIndustryList, {
    manual: false,
  });

  // 区域数据
  const { data: areaList } = useRequest(getAreaList, {
    manual: false,
  });

  useEffect(() => {
    // 默认第一个区域/行业
    if (enterpriseCategory === 1) {
      const code = areaList.map((item: any) => item.id);
      searchForm.setFieldValue('area', code);
      setArea(code);
    } else if (enterpriseCategory === 2) {
      const code = industryList.map((item: any) => item.id);
      searchForm.setFieldValue('industry', code);
      setIndustryCode(code);
    }
  }, [enterpriseCategory]);

  return (
    <Form style={{ display: 'flex' }} form={searchForm}>
      <Form.Item
        label="分类："
        name="type"
        initialValue={0}
        rules={[{ required: true, message: '请选择名称' }]}
      >
        <Select
          placeholder="请选择名称"
          style={{ width: 200, marginRight: '15px' }}
          allowClear={false}
          options={[
            { label: '区域', value: 0 },
            { label: '企业', value: 1 },
            { label: '行业', value: 2 },
          ]}
          onChange={(value) => setType(value)}
        />
      </Form.Item>
      {type === 1 && (
        <Form.Item
          label="企业类别"
          name="enterpriseCategory"
          rules={[{ required: true, message: '请选择企业类别' }]}
          initialValue={0}
        >
          <Select
            placeholder="请选择企业类别"
            allowClear={false}
            onChange={(value) => setEnterpriseCategory(value)}
            options={[
              { label: '全选', value: 0 },
              { label: '区域', value: 1 },
              { label: '行业', value: 2 },
            ]}
            style={{ width: 100, marginRight: '15px' }}
          />
        </Form.Item>
      )}
      {enterpriseCategory === 1 && (
        <Form.Item label="区域名称" name="area" rules={[{ required: true, message: '请选择区域' }]}>
          <Select
            placeholder="请选择区域"
            allowClear={false}
            onChange={(value) => setArea(value)}
            options={areaList}
            style={{ width: 250, marginRight: '15px' }}
            fieldNames={{ label: 'name', value: 'id' }}
            mode="multiple"
            maxTagCount={1} // 设置最多显示 2 个选项
          />
        </Form.Item>
      )}
      {enterpriseCategory === 2 && (
        <Form.Item
          label="行业名称"
          name="industry"
          rules={[{ required: true, message: '请选择行业' }]}
        >
          <Select
            placeholder="请选择行业"
            allowClear={false}
            options={industryList}
            onChange={(value) => setIndustryCode(value)}
            style={{ width: 250, marginRight: '15px' }}
            fieldNames={{ label: 'name', value: 'id' }}
            mode="multiple"
            maxTagCount={1} // 设置最多显示 2 个选项
          />
        </Form.Item>
      )}
    </Form>
  );
};

export default SelectForm;
