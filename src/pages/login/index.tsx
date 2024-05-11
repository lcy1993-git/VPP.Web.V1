import logo from '@/assets/image/base/logo1.png';
import title from '@/assets/image/base/title.png';
import { getUserAuth, loginRequest } from '@/services/login';
import { history } from '@umijs/max';
import { Button, Col, ConfigProvider, Form, Input, Row, message } from 'antd';
import { md5 } from 'js-md5';
import { useCallback, useEffect, useRef, useState } from 'react';
import Captcha from 'react-captcha-code';
import styles from './index.less';

const Login = () => {
  // 页面forn
  const [form] = Form.useForm();
  // 消息提示框
  const [messageApi, contextHolder] = message.useMessage();
  // 验证码实例
  const captchaRef = useRef(null);
  // 验证码
  const [verificationCode, setVerificationCode] = useState<any>('');

  const handleChange = useCallback((captcha: any) => {
    setVerificationCode(captcha);
  }, []);

  /**
   * 点击登录
   * */
  const onFinish = async (values: any) => {
    if (verificationCode !== values.captcha) {
      messageApi.warning('验证码错误，请重新输入');
      // @ts-ignore
      captchaRef.current?.refresh();
      return;
    }

    const params = {
      name: values.userName,
      password: md5(values.password),
    };
    // @ts-ignore
    captchaRef.current?.refresh();
    const { code, data } = await loginRequest(params);
    if (code === 200 && data) {
      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data?.name);
      localStorage.setItem('userId', data?.id);
      // 播放音频
      localStorage.setItem('closeAudio', 'true');
      // 根据用户权限跳转界面
      await getUserAuth(data?.id).then((res) => {
        history.push(res[0].path);
      });
    }
  };

  // 处理屏幕尺寸变化
  const handleScreenAuto = () => {
    const designDraftWidth = 1920;
    const designDraftHeight = 1065;
    const scaleWidth = document.documentElement.clientWidth / designDraftWidth;
    const scaleHeight = document.documentElement.clientHeight / designDraftHeight;

    (document.querySelector('#root') as any).style.width = '1920px';
    (document.querySelector('#root') as any).style.height = '1080px';
    (
      document.querySelector('#root') as any
    ).style.transform = `scale(${scaleWidth}, ${scaleHeight}) translate(-50%, -50%) translate3d(0, 0, 0)`;
  };

  useEffect(() => {
    // 初始化自适应
    handleScreenAuto();
    // 定义事件处理函数
    const handleResize = () => handleScreenAuto();
    // 添加事件监听器
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize); // 移除事件监听器
    };
  }, []);

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginLogo}>
        <img src={logo} alt="同华" />
      </div>
      <div className={styles.loginPageContent}>
        <div className={styles.formWrap}>
          <div className={styles.title}>
            <img src={title} alt="" />
            <p>欢迎登录</p>
          </div>
          <div className={styles.form}>
            <ConfigProvider
              theme={{
                token: {
                  borderRadius: 2,
                  colorTextPlaceholder: '#7993b0',
                  controlOutline: 'transparent', // 输入组件 激活边框颜色
                  colorBorder: '#16489f', // checkout 边框
                  colorBgBase: '#032566', // 所有组件的基础背景色
                  colorIcon: '#6189dd',
                  colorText: '#FFF',
                  colorPrimaryHover: '#0143cc',
                },
              }}
            >
              <Form onFinish={onFinish} form={form}>
                <Form.Item
                  className={`${styles.formItem} ${styles.user}`}
                  name="userName"
                  rules={[{ required: true, message: '请输入用户名！' }]}
                >
                  <Input
                    placeholder="请输入用户名"
                    variant="borderless"
                    className={styles.formItemInput}
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item
                  className={`${styles.formItem} ${styles.password}`}
                  name="password"
                  style={{ marginTop: '30px', marginBottom: '30px' }}
                  rules={[{ required: true, message: '请输入密码！' }]}
                >
                  <Input.Password
                    placeholder="请输入密码"
                    variant="borderless"
                    className={styles.formItemInput}
                    autoComplete="off"
                  />
                </Form.Item>
                <Row>
                  <Col span={16}>
                    <Form.Item
                      className={`${styles.formItem} ${styles.code}`}
                      name="captcha"
                      rules={[{ required: true, message: '请输入验证码！' }]}
                    >
                      <Input
                        placeholder="请输入验证码"
                        variant="borderless"
                        className={styles.formItemInput}
                        autoComplete="off"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={7} offset={1} className={styles.codeWrap}>
                    <Captcha
                      ref={captchaRef}
                      charNum={4}
                      width={110}
                      height={50}
                      onChange={handleChange}
                      bgColor="#11325e"
                      onClick={() => (captchaRef as any).current.refresh()}
                    />
                  </Col>
                </Row>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block className={styles.submitBtn}>
                    登录
                  </Button>
                </Form.Item>
              </Form>
              {contextHolder}
            </ConfigProvider>
          </div>
        </div>
      </div>
      <div className={styles.loginPageFooter}>
        <p>Powered by ©cdsrth</p>
      </div>
    </div>
  );
};
export default Login;
