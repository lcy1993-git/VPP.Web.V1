import logo from '@/assets/image/base/logo.png';
import title from '@/assets/image/base/title.png';
import { BellFilled, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { useInterval } from 'ahooks';
import { Badge, Button, Divider } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import styles from './index.less';

const LayoutHeader = () => {
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY年MM月DD日 HH:MM:ss'));

  useInterval(() => {
    setCurrentTime(dayjs().format('YYYY年MM月DD日 HH:mm:ss'));
  }, 1000);

  // 退出登录
  const logout = () => {
    history.push('/login');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    localStorage.setItem('userName', '');
    localStorage.setItem('userId', '');
    // 关闭音频
    localStorage.setItem('whetherPlay', '0');
    localStorage.setItem('closeAudio', 'false');
  };

  return (
    <div className={styles.pageHeader}>
      <div className={styles.headerLeft}>
        <img src={logo} alt="同华" />
      </div>
      <div className={styles.headerMiddle} onClick={() => history.push('/big-screen/feature')}>
        <img src={title} alt="成都市龙泉驿虚拟电厂管理平台" />
      </div>
      <div className={styles.headerRight}>
        <span className={styles.currentTime}>{currentTime}</span>
        <Divider type="vertical" className={styles.divider} />
        <Badge count={100} size="small">
          <Button size="small" type="text" icon={<BellFilled />} />
        </Badge>
        <Divider type="vertical" className={styles.divider} />
        <Button size="small" type="text" icon={<UserOutlined />}>
          {localStorage.getItem('userName') || '暂无身份'}
        </Button>
        <Divider type="vertical" className={styles.divider} />
        <Button size="small" type="text" icon={<LogoutOutlined />} onClick={logout}>
          退出
        </Button>
      </div>
    </div>
  );
};
export default LayoutHeader;
