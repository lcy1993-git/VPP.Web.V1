import normalAlarm from '@/assets/audio/normalAlarm.wav';
import { Outlet } from '@umijs/max';
import { useInterval } from 'ahooks';
import { ConfigProvider } from 'antd';
import locale from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { useRef, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import styles from './index.less';
import { MyWorkProvider } from './myContext';

const Layout = () => {
  // 音频对象
  const audioRef = useRef(null);
  // 是否播放音频
  const [audioTimer, setAudioTimer] = useState<any>(null);
  // 改变音频播放状态
  const [audioMuted, setAudioMuted] = useState(true);

  // 播放声音
  const audioPlay = () => {
    if (!audioRef) return;
    if (audioTimer) return;

    setAudioMuted(false);
    const timer = setInterval(() => {
      // @ts-ignore
      if (!audioRef?.current?.audioEl) {
        clearInterval(timer);
        setAudioTimer(null);
      }
      let autoplay = true;
      // @ts-ignore
      audioRef?.current?.audioEl?.current
        .play()
        .then(() => {
          // 支持自动播放
          autoplay = true;
        })
        .catch(() => {
          // 不支持自动播放
          autoplay = false;
        })
        .finally(() => {
          // @ts-ignore
          audioRef?.current?.audioEl?.current.remove();
        });
    }, 1500);
    setAudioTimer(timer);
  };
  // 关闭声音
  const audioStop = () => {
    if (audioTimer) {
      clearInterval(audioTimer);
      setAudioTimer(null);
    }
  };

  useInterval(() => {
    // 是否播放音频whetherPlay 1：播放；  0： 为暂停； closeAudio用于全局关闭
    if (
      localStorage.getItem('whetherPlay') === '1' &&
      localStorage.getItem('closeAudio') === 'true'
    ) {
      audioPlay();
    } else {
      audioStop();
    }
  }, 1000);


  return (
    <>
      <ConfigProvider
        locale={locale}
        theme={{
          token: {
            borderRadius: 2,
            colorPrimaryHover: '#10a2fa',
            colorTextPlaceholder: '#0143cc',
            controlOutline: 'transparent', // 输入组件 激活边框颜色
            colorBorder: '#16489f', // checkout 边框
            colorBgBase: '#032566', // 所有组件的基础背景色
            colorBgContainer: 'transparent',
            colorPrimary: '#1292ff', // 主色调
            colorError: '#ff0000',
            colorBgElevated: ' #001d51', // 模态框、悬浮框背景色
            controlItemBgActiveHover: 'rgba(0, 84, 255, 0.2)', // 控制组件项在鼠标悬浮且激活状态下的背景颜色
            controlItemBgHover: 'rgba(0, 84, 255, 0.2)', // 下拉框，手鼠hover背景色
            controlItemBgActive: 'rgba(0, 84, 255, 0.3)', // 控制组件项在激活状态下的背景颜色
          },
        }}
      >
        <MyWorkProvider
          value={{
            audioPlay: audioPlay,
            audioStop: audioStop,
          }}
        >
          <div className={styles.layout}>
            <div className={styles.outlet} id="outlet">
              <ReactAudioPlayer
                src={normalAlarm}
                autoPlay={false}
                ref={audioRef}
                muted={audioMuted}
                controls={false}
              />
              <Outlet />
            </div>
          </div>
        </MyWorkProvider>
      </ConfigProvider>
    </>
  );
};

export default Layout;
