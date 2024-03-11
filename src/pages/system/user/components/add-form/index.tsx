import CustomItem from '@/components/custom-Item';
import { getRoleList } from '@/services/system/role';
import { useRequest } from 'ahooks';
import { Col, DatePicker, Input, Radio, Row, Select } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const { TextArea } = Input;

interface FormParams {
  type?: 'add' | 'edit';
  form: FormInstance;
}

const AddUserForm: React.FC<FormParams> = (props) => {
  const { type = 'add' } = props;
  const userId = localStorage.getItem('userId');
  let { data } = useRequest(() => getRoleList(Object.assign({ userId })));

  const handleData = useMemo(() => {
    if (data?.data) {
      return data?.data.dataList.map((item: any) => {
        return {
          label: item.nickName,
          value: item.id,
        };
      });
    }
  }, [data]);

  // const subStationList = useMemo(() => {
  //   if (substations?.data) {
  //     return substations?.data;
  //   }
  // }, [substations]);

  // eslint-disable-next-line arrow-body-style
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <CustomItem
            label="用户账号"
            required
            name="name"
            rules={[{ required: true, message: '请输入用户账号' }]}
          >
            <Input autoComplete="off" placeholder="请输入用户账号" style={{ width: '250px' }} />
          </CustomItem>
        </Col>
        <Col span={12}>
          <CustomItem
            label="用户昵称"
            required
            name="nickName"
            rules={[{ required: true, message: '请输入用户昵称' }]}
          >
            <Input autoComplete="off" placeholder="请输入用户昵称" style={{ width: '250px' }} />
          </CustomItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <CustomItem label="公司" name="company">
            <Input autoComplete="off" placeholder="请输入公司" style={{ width: '250px' }} />
          </CustomItem>
        </Col>
        <Col span={12}>
          <CustomItem label="部门" name="department">
            <Input autoComplete="off" placeholder="请输入部门" style={{ width: '250px' }} />
          </CustomItem>
        </Col>
      </Row>

      {type === 'add' && (
        <Row>
          <Col span={12}>
            <CustomItem
              label="登录密码"
              name="password"
              required
              rules={[
                { required: true, message: '请输入授权密码' },
                { pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d$@$!%*#?&]{6,}$/, message: '至少六位，包含数字、字母、特殊字符!@#$%^&*' }
              ]}
            >
              <Input
                type="password"
                placeholder="请输入密码"
                style={{ width: '250px' }}
                autoComplete="new-password"
              />
            </CustomItem>
          </Col>
          <Col span={12}>
            <CustomItem
              label="确认密码"
              name="confirmPwd"
              required
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: '请确认密码',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('两次密码输入不一致，请确认');
                  },
                }),
              ]}
            >
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="请确认密码"
                style={{ width: '250px' }}
              />
            </CustomItem>
          </Col>
        </Row>
      )}
      {type === 'add' && (
        <Row>
          <Col span={12}>
            <CustomItem
              label="授权密码"
              name="authPassword"
              required
              rules={[
                { required: true, message: '请输入授权密码' },
                { pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d$@$!%*#?&]{6,}$/, message: '至少六位，包含数字、字母、特殊字符!@#$%^&*' }
              ]}
            >
              <Input
                type="password"
                placeholder="请输入密码"
                style={{ width: '250px' }}
                autoComplete="new-password"
              />
            </CustomItem>
          </Col>
          <Col span={12}>
            <CustomItem
              label="确认密码"
              name="confirmAuthPassword"
              required
              dependencies={['ppwd']}
              rules={[
                {
                  required: true,
                  message: '请确认密码',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('authPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('两次密码输入不一致，请确认');
                  },
                }),
              ]}
            >
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="请确认密码"
                style={{ width: '250px' }}
              />
            </CustomItem>
          </Col>
        </Row>
      )}

      <Row>
        <Col span={12}>
          <CustomItem
            label="手机号码"
            name="telephone"
            rules={[
              () => ({
                validator(_, value) {
                  if (typeof value === 'string' && !!value.trim()) {
                    if (/^[1][3,4,5,7,8,9][0-9]{9}$/.test(value.trim())) {
                      return Promise.resolve();
                    }
                    return Promise.reject('请输入正确的手机号');
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input autoComplete="off" placeholder="请输入手机号" style={{ width: '250px' }} maxLength={11} />
          </CustomItem>
        </Col>
        <Col span={12}>
          <CustomItem
            label="邮箱"
            name="email"
            rules={[
              () => ({
                validator(_, value) {
                  if (typeof value === 'string' && !!value.trim()) {
                    if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value.trim())) {
                      return Promise.resolve();
                    }
                    return Promise.reject('请输入正确的邮箱');
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input autoComplete="off" placeholder="请输入邮箱" style={{ width: '250px' }} />
          </CustomItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <CustomItem
            label="用户权限"
            required
            name="roleId"
            rules={[{ required: true, message: '请选择用户权限' }]}
          >
            <Select options={handleData} placeholder="请选择权限角色" style={{ width: '250px' }} />
          </CustomItem>
        </Col>
        {/* <Col span={12}>
          <CustomItem label="访问电站" name="substationIds">
            <Select
              options={subStationList}
              fieldNames={{
                label: 'name',
                value: 'id',
              }}
              placeholder="请选择访问电站"
              mode="multiple"
              style={{ width: '250px' }}
            />
          </CustomItem>
        </Col> */}
      </Row>
      <Row>
        <Col span={12}>
          <CustomItem
            label="用户状态"
            required
            name="status"
            rules={[{ required: true, message: '请选择用户状态' }]}
            initialValue={1}
          >
            <Radio.Group>
              <Radio value={1}>正常</Radio>
              <Radio value={0}>停用</Radio>
            </Radio.Group>
          </CustomItem>
        </Col>
        {/* {type === 'add' && (
          <Col span={12}>
            <CustomItem
              label="过期日期"
              required
              name="expiryTime"
              rules={[{ required: true, message: '请选择过期日期' }]}
            >
              <DatePicker style={{ width: '88.8%' }} disabledDate={disabledDate} />
            </CustomItem>
          </Col>
        )} */}
        <Col span={12}>
          <CustomItem
            label="过期日期"
            required
            name="expiryTime"
            rules={[{ required: true, message: '请选择过期日期' }]}
          >
            <DatePicker style={{ width: '250px' }} disabledDate={disabledDate} />
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

export default AddUserForm;
