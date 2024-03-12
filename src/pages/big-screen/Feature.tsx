import { ConfigProvider, DatePicker, Space } from 'antd'
import BlockWrap from './components/BlockWrap'
import title from '@/assets/image/big-screen/title.png'
import styles from './index.less'
import SegmentedTheme from '@/components/segmented-theme'
import { useEffect, useRef, useState } from 'react'
import CustomCircle from './components/CustomCircle'
import ScrollBoardItem from './components/ScrollBoardItem'
import ThreeMap from './components/ThreeMap'

/***
 *特色场景
 * */
const Feature = () => {
  // 响应统计 圆环最外层dom 用于获取圆环的宽度
  const canvasWrapRef = useRef(null);
  // 典型响应统计表格
  const tableWrapRef = useRef(null);

  // 响应统计 圆环宽度
  const [circleWidth, setCircleWidth] = useState<number>(0)
  // 计算表格高度
  const [tableHeight, setTableHeight] = useState<number>(0)
  // 区域用能右侧render
  const energyOverviewRender = () => {
    return (
      <Space align="center" >
        <SegmentedTheme
          size="small"
          options={['年', '月', '日']}
        />
        <DatePicker
          size="small"
        />
      </Space>
    )
  }

  // 典型响应分析右侧render
  const resultAnalysisRender = () => {
    return <SegmentedTheme
      size="small"
      options={['负荷', '时长']}
    />
  }

  // 监听页面尺寸变化，重新绘制圆环 ---- 响应统计
  const handleWindowResize = () => {
    if (canvasWrapRef?.current) {
      const offsetWidth = (canvasWrapRef.current! as any).offsetWidth;
      const offsetHeight = (canvasWrapRef.current! as any).offsetHeight;
      const _width = offsetWidth > offsetHeight ? offsetHeight : offsetWidth
      setCircleWidth(_width)

      // 获取表格高度
      const tableOffsetHeight = (tableWrapRef.current! as any).offsetHeight;
      setTableHeight(tableOffsetHeight)
    }
  }

  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize)
    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  // @ts-ignore TODO: 删除表格数据
  const tableDataList = [...Array.apply(null, { length: 12 }).map((_item, index) => {
    return {
      id: index + 1,
      name: '调峰',
      a: '100kWh',
      b: '-5%',
      c: '100kW',
      d: '华为科技'
    }
  })]


  return <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#0084ff', // Seed Token，影响范围大
        borderRadius: 2,
        colorText: '#fff',
        colorBorder: '#023999',
        colorPrimaryHover: '#10a2fa',
        colorTextPlaceholder: '#0143cc',
        controlOutline: 'transparent', // 输入组件 激活边框颜色
        colorBgBase: '#032566', // 所有组件的基础背景色
        colorBgContainer: 'transparent',
        colorError: '#ff0000',
        colorBgElevated: ' #001d51', // 模态框、悬浮框背景色
        controlItemBgActiveHover: 'rgba(0, 84, 255, 0.2)', // 控制组件项在鼠标悬浮且激活状态下的背景颜色
        controlItemBgHover: 'rgba(0, 84, 255, 0.2)', // 下拉框，手鼠hover背景色
        controlItemBgActive: 'rgba(0, 84, 255, 0.3)', // 控制组件项在激活状态下的背景颜色
      },
      components: {
        DatePicker: {
          activeBorderColor: '#023999',
          hoverBorderColor: '#023999',
        }
      }
    }}
  >
    <div className={styles.featurePage}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          2024年2月27日 12:00:00 星期五
        </div>
        <div className={styles.middle}>
          <img src={title} alt="title" />
        </div>
        <div className={styles.headerRight}>
          菜单
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.contentSide}>
          <div className={`${styles.sideItem} ${styles.marginB10}`}>
            <BlockWrap
              title='区域用能概览'
              headerRightRender={energyOverviewRender}
            >
              图表组件
            </BlockWrap>
          </div>
          <div className={styles.sideItem}>
            <BlockWrap
              title='区域弹性负荷概览'
            >
              图表组件
            </BlockWrap>
          </div>
        </div>
        <div className={styles.contentMiddle}>
          <div className={styles.middleTop}>
            <div className={styles.totalCount}>
              <p className={styles.title}>
              总可调节负荷（MW）
              </p>
              <p className={styles.value}>
                <span>2</span>
                <span>6</span>
                <span>7</span>
                <span>3</span>
              </p>
            </div>
            <div className={styles.totalCount}>
              <p className={styles.title}>
              实时可上调功率（MW）
              </p>
              <p className={styles.value}>
                <span>9</span>
                <span>2</span>
                <span>6</span>
                <span>7</span>
                <span>3</span>
              </p>
            </div>
            <div className={styles.totalCount}>
              <p className={styles.title}>
              实时可下调功率（MW）
              </p>
              <p className={styles.value}>
                <span>2</span>
                <span>6</span>
                <span>7</span>
                <span>3</span>
              </p>
            </div>
          </div>
          <div className={styles.three}>
            <ThreeMap />
          </div>
        </div>
        <div className={styles.contentSide}>
          <div className={`${styles.sideItem} ${styles.marginB10}`}>
            <BlockWrap
              title='响应统计'
            >
              <div className={styles.response}>
                <div className={styles.responseLeft}>
                  <div className={styles.chartsWrap} ref={canvasWrapRef}>
                    {
                      circleWidth && <CustomCircle
                        circleBgColor="#1a96ff"
                        circleColor="#33ec9b"
                        circleWidth={circleWidth}
                        value={0.56}
                      />
                    }

                  </div>
                  <div className={styles.chartsDesc}>
                    <p className={styles.desc}>已响应事件(次)：<span>73</span></p>
                    <p className={styles.desc}>未响应事件(次)：<span>73</span></p>
                    <p className={styles.desc}>总受邀事件(次)：<span>100</span></p>
                  </div>
                </div>
                <div className={styles.responseRight}>
                  <div className={styles.chartsWrap}>
                    {
                      circleWidth && <CustomCircle
                        circleBgColor="#1a96ff"
                        circleColor="#95e129"
                        circleWidth={circleWidth}
                        value={0.8}
                      />
                    }
                  </div>
                  <div className={styles.chartsDesc}>
                    <p className={styles.desc}>已响应事件(次)：<span>73</span></p>
                    <p className={styles.desc}>未响应事件(次)：<span>73</span></p>
                    <p className={styles.desc}>总受邀事件(次)：<span>100</span></p>
                  </div>
                </div>
              </div>
            </BlockWrap>
          </div>
          <div className={styles.sideItem}>
            <BlockWrap
              title='典型响应分析'
              headerRightRender={resultAnalysisRender}
            >
              <div style={{ width: '100%', height: '100%', background: 'cyan' }} ref={tableWrapRef}>
                <ScrollBoardItem
                  dataList={tableDataList}
                  height={tableHeight}
                  visibleRows={5}
                />
              </div>
            </BlockWrap>
          </div>
        </div>
      </div>
      <div className={styles.footer}></div>
    </div>
  </ConfigProvider>



}
export default Feature
