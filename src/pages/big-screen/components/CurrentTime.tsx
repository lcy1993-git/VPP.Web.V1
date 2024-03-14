import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包
dayjs.locale('zh-cn');


const CurrentTime = () => {
  // 当前时间
  const [currentTime, setCurrentTime] = useState<string>(dayjs().format('YYYY年MM月DD日 HH:MM:ss dddd'));
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format('YYYY年MM月DD日 HH:mm:ss dddd'));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return <span>{currentTime}</span>
}
export default CurrentTime
