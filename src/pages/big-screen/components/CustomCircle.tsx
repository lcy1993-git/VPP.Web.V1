import { Empty } from 'antd';
import { useEffect, useRef } from 'react';
import styles from './index.less';

interface propsType {
  circleBgColor: string; // canvas背景圈颜色
  circleColor: string; // canvas圈颜色
  circleWidth: number; // 圆圈宽度
  lineWidth?: number; // 圆圈宽度
  value: number | string; // 0~1的小数
}

// 圆圈图表组件
const CustomCircle = (props: propsType) => {
  const {
    circleBgColor = '#1a96ff',
    circleColor = '#33ec9b',
    circleWidth = 170,
    lineWidth = 10,
    value,
  } = props;
  // canvas元素对象
  const canvasRef = useRef(null);

  // 圆环宽高
  // 解决边缘锯齿化问题
  const devicePixelRatio = window.devicePixelRatio || 1;

  const canvasWidth = devicePixelRatio === 1 ? circleWidth - 40 : circleWidth - 80;
  const canvasHeight = devicePixelRatio === 1 ? circleWidth - 40 : circleWidth - 80;

  // 绘制圆圈
  const drawCircle = (eleCanvas: any, angle: number) => {
    const angle1 = 270 + angle;
    const ang = (angle1 / 180) * Math.PI;
    const ctx = eleCanvas.getContext('2d');

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const x0 = canvasWidth / 2; // 原点X坐标
    const y0 = canvasHeight / 2; // 原点Y坐标
    const r = (canvasWidth - (props.lineWidth || 10)) / 2; // 半径

    eleCanvas.width = canvasWidth * devicePixelRatio;
    eleCanvas.height = canvasHeight * devicePixelRatio;

    ctx.scale(devicePixelRatio, devicePixelRatio);

    // 绘制圆圈背景
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = circleBgColor;
    ctx.arc(x0, y0, r, 0, Math.PI * 2);
    ctx.stroke();

    // 绘制圆圈
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = circleColor;
    ctx.arc(x0, y0, r, Math.PI * 1.5, ang);
    ctx.stroke();
  };

  // 创建画布对象
  const createCanvas = (ele: Element, value: number) => {
    let count = 0;
    value = Math.round(value * 360);
    const timer = setInterval(() => {
      drawCircle(ele, count);
      count++;
      if (count === value + 1) {
        clearInterval(timer);
      }
    });
  };

  useEffect(() => {
    if (canvasRef && value) {
      createCanvas(canvasRef.current!, Number(value));
    }
  }, [canvasWidth, canvasHeight, circleBgColor, circleColor, circleWidth, lineWidth, value]);

  return (
    <div
      className={styles.circleWrap}
      style={{ width: circleWidth - 20, height: circleWidth - 20 }}
    >
      {value ? (
        <>
          <div className={styles.circleMiddle}>
            <div className={styles.circleValue}>
              <span className={styles.value} style={{ color: circleColor }}>
                {(Number(value) * 100).toFixed(0)}%
              </span>
              <span className={styles.label}>响应率</span>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className={styles.canvas}
          ></canvas>
        </>
      ) : (
        <Empty />
      )}
    </div>
  );
};
export default CustomCircle;
