import logo from '@/assets/image/base/logo.png';
import title from '@/assets/image/base/title.png';
import { getRealtimeAlarm } from '@/services/devices-manage';
import { BellFilled, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { history, useRequest } from '@umijs/max';
import { useInterval } from 'ahooks';
import { Badge, Button, Divider } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styles from './index.less';

const LayoutHeader = () => {
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY年MM月DD日 HH:MM:ss'));
  // 告警数量
  const [alarmNum, setAlarmNum] = useState<number | string>(0);

  // 请求告警信息
  const { run: fetchRealtimeAlarm } = useRequest(getRealtimeAlarm, {
    manual: true,
    onSuccess: (result: any) => {
      if (result && parseInt(result.totalCount)) {
        localStorage.setItem('whetherPlay', '1');
        setAlarmNum(parseInt(result.totalCount));
      } else {
        setAlarmNum(0);
      }
    },
  });

  useInterval(() => {
    setCurrentTime(dayjs().format('YYYY年MM月DD日 HH:mm:ss'));
  }, 1000);

  const clear = useInterval(
    () => {
      if (localStorage.getItem('token')) {
        fetchRealtimeAlarm({
          pageNum: 1,
          pageSize: 10,
          beginTime: dayjs(dayjs(new Date().getFullYear())).format('YYYY-MM-DD'),
          endTime: dayjs(
            dayjs(
              `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
            ),
          ).format('YYYY-MM-DD'),
        });
      }
    },
    1000 * 60 * 5,
    { immediate: true },
  );

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

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
        <span className={`${styles.currentTime} ${styles.textStyle}`}>{currentTime}</span>
        <Divider type="vertical" className={styles.divider} />
        <Badge count={alarmNum} size="small" offset={[-5, 5]} style={{ color: '#fff' }}>
          <Button
            type="text"
            className={styles.textStyle}
            icon={<BellFilled />}
            onClick={() => history.push('/alarm-manage/realtime-alarm')}
          />
        </Badge>
        <Divider type="vertical" className={styles.divider} />
        <Button size="small" type="text" icon={<UserOutlined />} className={styles.textStyle}>
          {localStorage.getItem('userName') || '暂无身份'}
        </Button>
        <Divider type="vertical" className={styles.divider} />
        <Button
          size="small"
          type="text"
          icon={<LogoutOutlined />}
          onClick={logout}
          className={styles.textStyle}
        >
          退出
        </Button>
      </div>
    </div>
  );
};
export default LayoutHeader;
