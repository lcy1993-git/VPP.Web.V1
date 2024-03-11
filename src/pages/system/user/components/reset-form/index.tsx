import CustomItem from '@/components/custom-Item';
import { Input } from 'antd';

const ResetForm = () => {
  return (
    <>
      <CustomItem
        label="原密码"
        name="oldPwd"
        required
        rules={[
          { required: true, message: '请输入原密码' },
          { pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d$@$!%*#?&]{6,}$/, message: '至少六位，包含数字、字母、特殊字符!@#$%^&*' }
        ]}
      >
        <Input type="password" autoComplete="new-password" placeholder="请输入密码" />
      </CustomItem>

      <CustomItem
        label="新密码"
        name="newPwd"
        required
        rules={[
          { required: true, message: '请输入新密码' },
          { pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d$@$!%*#?&]{6,}$/, message: '至少六位，包含数字、字母、特殊字符!@#$%^&*' }
        ]}
      >
        <Input type="password" autoComplete="new-password" placeholder="请输入密码" />
      </CustomItem>

      <CustomItem
        label="确认密码"
        name="confirmPwd"
        required
        dependencies={['newPwd']}
        rules={[
          {
            required: true,
            message: '请确认密码',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPwd') === value) {
                return Promise.resolve();
              }
              return Promise.reject('两次密码输入不一致，请确认');
            },
          }),
        ]}
      >
        <Input type="password" autoComplete="off" placeholder="请确认密码" />
      </CustomItem>
    </>
  );
};

export default ResetForm;
