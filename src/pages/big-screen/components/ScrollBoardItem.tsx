import { Tooltip } from 'antd';
import styles from './index.less'
import { useEffect, useRef, useState } from 'react';
import Empty from '@/components/empty';

interface CurrentFileInfo {
  dataList: any;// 数据
  height: number;// 列表高度
  visibleRows?: number;// 可视行数(默认5行)
  interval?: number;// 滚动速度(默认2500ms)
  columns: any[]
}

// 典型响应分析---目前计划名称枚举
const emunName = ['调峰', '填谷']

// 电站概览
const ScrollBoardItem = (props: CurrentFileInfo) => {
  const { dataList, height, visibleRows = 5, interval = 2500, columns } = props;
  const containerRef = useRef(null);
  // 定时器
  const timerRef = useRef();
  // 鼠标是否移上
  const [isHovered, setIsHovered] = useState(false);
  // 滚动位置
  const [scrollTop, setScrollTop] = useState(0);
  // 计算每行数据的高度
  const calculatedRowHeight = (height - 44) / visibleRows;
  // 设置定时器进行自动滚动
  useEffect(() => {


    const scroll = () => {
      if (containerRef.current && !isHovered) {
        let nextScrollTop = scrollTop + calculatedRowHeight;
        // 滚动到底部跳转第一条
        // @ts-ignore
        if (nextScrollTop > containerRef.current.scrollHeight - visibleRows * calculatedRowHeight) {
          nextScrollTop = 0;
        }
        // @ts-ignore
        containerRef.current.scrollTop = nextScrollTop;
        setScrollTop(nextScrollTop);
      }
    }

    // @ts-ignore
    timerRef.current = setInterval(scroll, interval);

    return () => clearInterval(timerRef.current);
  }, [calculatedRowHeight, interval, isHovered, scrollTop]);

  // 鼠标悬停事件处理，停止滚动
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // 调整滚动位置，使其刚好是行高的倍数
  const adjustScrollPosition = () => {
    // @ts-ignore
    const newScrollTop = Math.round(containerRef.current.scrollTop / calculatedRowHeight) * calculatedRowHeight;
    // @ts-ignore
    containerRef.current.scrollTop = newScrollTop;
    setScrollTop(newScrollTop);
  };

  // 鼠标离开事件处理，恢复滚动并调整滚动位置
  const handleMouseLeave = () => {
    // 恢复滚动
    setIsHovered(false);
    // 调整滚动位置为行数倍数
    adjustScrollPosition();
  }

  // 处理手动滚动事件的高度
  const handleScroll = () => {
    if (containerRef.current) {
      // @ts-ignore
      setScrollTop(containerRef.current!.scrollTop);
    }
  };

  return (dataList && dataList.length) ? <div className={styles.scrollableTable}>
    <table className={styles.theadContainer}>
      <thead>
        <tr>
          {
            columns?.map(item => {
              return <th key={item.key} style={{width: item.width}}
              >{item.name}</th>
            })
          }
        </tr>
      </thead>
    </table>
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onScroll={handleScroll}
      style={{
        overflowY: 'auto',
        maxHeight: `${visibleRows * calculatedRowHeight}px`,
        position: 'relative',
        width: '100%',
      }}
    >
      <table className={styles.tbodyContainer} >
        <colgroup>
        {
            columns?.map(item => {
              return <col key={item.key} className={styles.colContainer} style={{width: item.width}}/>
            })
          }

        </colgroup>
        <tbody>
          {dataList &&
            dataList.map((item: any, index: number) => (
              <tr key={item.planId} style={{ height: `${calculatedRowHeight}px` }}>
                {
                  columns?.map(col => {
                    return col.render(item, col, index)
                  })
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  </div >
    : <Empty />
}
export default ScrollBoardItem;
