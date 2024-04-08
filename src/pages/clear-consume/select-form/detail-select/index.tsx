import { getAreaList, getIndustryList, getSubstationList } from '@/services/energy-analysis';
import { useRequest } from '@umijs/max';
import { Form, Select } from 'antd';
import { Dispatch, SetStateAction, useEffect } from 'react';
/**
 * 碳排放详情分类表单组件
 * @setType 修改父组件选择类别
 * @setArea 修改父组件选择区域id
 * @setSubstationCode 修改父组件选择企业code
 * @setIndustryCode 修改父组件选择行业code
 * */
interface propsType {
  setType: Dispatch<SetStateAction<any>>;
  setArea: Dispatch<SetStateAction<any>>;
  setSubstationCode: Dispatch<SetStateAction<any>>;
  setIndustryCode: Dispatch<SetStateAction<any>>;
}

const SelectForm = (props: propsType) => {
  const { setType, setSubstationCode, setIndustryCode, setArea } = props;
  // 搜素表单实例
  const [searchForm] = Form.useForm();
  // 选择区域类型
  const type = Form.useWatch('type', searchForm);

  // 企业数据
  const { data: substationList } = useRequest(getSubstationList, {
    manual: false,
  });

  // 行业数据
  const { data: industryList } = useRequest(getIndustryList, {
    manual: false,
  });

  // 区域数据
  const { data: areaList } = useRequest(getAreaList, {
    manual: false,
  });

  useEffect(() => {
    // 默认第一个区域/行业/企业
    if (type === 0) {
      const code = areaList[0].id;
      searchForm.setFieldValue('area', code);
      setArea(code);
    } else if (type === 1) {
      const code = substationList[0].substationCode;
      searchForm.setFieldValue('substationCode', code);
      setSubstationCode(code);
    } else if (type === 2) {
      const code = industryList[0].id;
      searchForm.setFieldValue('industry', code);
      setIndustryCode(code);
    }
  }, [type]);

  return (
    <Form style={{ display: 'flex' }} form={searchForm}>
      <Form.Item
        label="分类："
        name="type"
        initialValue={-1}
        rules={[{ required: true, message: '请选择名称' }]}
      >
        <Select
          placeholder="请选择名称"
          style={{ width: 260, marginRight: '15px' }}
          allowClear={false}
          options={[
            { label: '全选', value: -1 },
            { label: '区域', value: 0 },
            { label: '企业', value: 1 },
            { label: '行业', value: 2 },
          ]}
          onChange={(value) => setType(value)}
        />
      </Form.Item>
      {type === 0 && (
        <Form.Item label="区域名称" name="area" rules={[{ required: true, message: '请选择区域' }]}>
          <Select
            placeholder="请选择区域"
            allowClear={false}
            onChange={(value) => setArea(value)}
            options={areaList}
            style={{ width: 260, marginRight: '15px' }}
            fieldNames={{ label: 'name', value: 'id' }}
          />
        </Form.Item>
      )}
      {type === 1 && (
        <Form.Item
          label="企业名称"
          name="substationCode"
          rules={[{ required: true, message: '请选择企业' }]}
        >
          <Select
            placeholder="请选择企业"
            allowClear={false}
            onChange={(value) => setSubstationCode(value)}
            options={substationList}
            style={{ width: 260, marginRight: '15px' }}
            fieldNames={{ label: 'name', value: 'substationCode' }}
          />
        </Form.Item>
      )}
      {type === 2 && (
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
            style={{ width: 260, marginRight: '15px' }}
            fieldNames={{ label: 'name', value: 'id' }}
          />
        </Form.Item>
      )}
    </Form>
  );
};

export default SelectForm;
