import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import styles from './index.less';

/**
 * 自定义进度条
 * 注意：
 *   该组件的宽高取决于css中的宽高，传递的width、height是画布中的宽高，和布局没有关系
 * */
const CustomProgress = (props: any) => {
  const { width, height, progress, color, title, value, hintText } = props;

  // 画布
  const canvasRef = useRef(null);
  // 初始化画布
  const initCanvas = (ctx: any) => {
    // 解决边缘锯齿化问题
    const devicePixelRatio = window.devicePixelRatio || 1;
    ctx.width = width * devicePixelRatio;
    ctx.height = height * devicePixelRatio;
    // 颜色渐变
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    color.forEach((stop: any, index: any) => {
      gradient.addColorStop(index, stop);
    });

    // 进度条背景
    ctx.beginPath();
    ctx.fillStyle = '#022469';
    ctx.fillRect(0, 0, width, height);

    // 进度条
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.roundRect(0, 0, width * progress, height, [0, 10, 10, 0]);
    ctx.fill();
  };

  // 绘制
  useEffect(() => {
    if (canvasRef?.current) {
      const ctx = (canvasRef.current! as any).getContext('2d');
      initCanvas(ctx);
    }
  }, [width, height, progress, color]);

  return (
    <div className={styles.progress}>
      <div className={styles.title}>
        <span>{title}</span>
        <span>{value}</span>
      </div>
      <canvas
        className={styles.canvas}
        width="300px"
        height="20px"
        ref={canvasRef}
        title={hintText} // 添加 title 属性
      >
        您的浏览器不支持 HTML5 canvas 标签。
      </canvas>
    </div>
  );
};

CustomProgress.propTypes = {
  width: PropTypes.number.isRequired, // 宽度
  height: PropTypes.number.isRequired, // 高度
  progress: PropTypes.number.isRequired, // 当前进度
  color: PropTypes.arrayOf(PropTypes.string).isRequired, // 渐变颜色
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  hintText: PropTypes.string.isRequired,
};

export default CustomProgress;
