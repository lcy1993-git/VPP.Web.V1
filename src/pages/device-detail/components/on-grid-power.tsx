import { useEffect } from "react";
import styles from '../index.less'
import { useRequest } from "@umijs/max";
import CircleRingChart from "@/components/circle-ring-chart";
import { getImportantDetails } from "@/services/energy-station";

// middle 并网表统计
const OnGridPower = (props:any) => {
  const { deviceCode } = props;
  const normalColor = '#17cc8a';
  const abnormalColor = '#FF0000';
  const noDataText = '无';
  // 电量概览
  const { run: fetchImportantDetails, data: inverterData } = useRequest(getImportantDetails, {
    manual: true,
  })
  useEffect(() => {
    if (deviceCode) {
      fetchImportantDetails(deviceCode)
    }
  }, [deviceCode])

  return <>
    <div className={styles.echartsModule}>
      <div className={styles.echartTitle}>
        电量概览
      </div>
      <div className={styles.electryWrap} style={{paddingTop: 30}}>
        <div className={styles.electryModule} >
          <div className={styles.echartMain}>
            <CircleRingChart
              textName=''
              pathColor={inverterData?.peekDemandPositiveElectricity ? normalColor : abnormalColor}
              value='尖期正向有功电量'
              size={12}
              circleRingChartRatio={(1 * 100).toFixed(2)}
              subTitle={inverterData?.peekDemandPositiveElectricity ? inverterData?.peekDemandPositiveElectricity : noDataText + "kW"}
              breadth='160px'
            />
          </div>
        </div>

        <div className={styles.electryModule}>
          <div className={styles.echartMain}>
            <CircleRingChart
              textName=''
              pathColor={inverterData?.peekDemandNegativeElectricity ? normalColor : abnormalColor}
              value='尖期反向有功电量'
              size={12}
              circleRingChartRatio={(1 * 100).toFixed(2)}
              subTitle={inverterData?.peekDemandNegativeElectricity ? inverterData?.peekDemandNegativeElectricity : noDataText + "kW"}
              breadth='160px'
            />
          </div>
        </div>

        <div className={styles.electryModule}>
          <div className={styles.echartMain}>
            <CircleRingChart
              textName=''
              pathColor={inverterData?.peekPositiveElectricity ? normalColor : abnormalColor}
              value='峰期正向有功电量'
              size={12}
              circleRingChartRatio={(1 * 100).toFixed(2)}
              subTitle={inverterData?.peekPositiveElectricity ? inverterData?.peekPositiveElectricity : noDataText + "kW"}
              breadth='160px'
            />
          </div>
        </div>

        <div className={styles.electryModule}>
          <div className={styles.echartMain}>
            <CircleRingChart
              textName=''
              pathColor={inverterData?.peekNegativeElectricity ? normalColor : abnormalColor}
              value='峰期反向有功电量'
              size={12}
              circleRingChartRatio={(1 * 100).toFixed(2)}
              subTitle={inverterData?.peekNegativeElectricity ? inverterData?.peekNegativeElectricity : noDataText + "kW"}
              breadth='160px'
            />
          </div>
        </div>

        <div className={styles.electryModule}>
          <div className={styles.echartMain}>
            <CircleRingChart
              textName=''
              pathColor={inverterData?.normalPositiveElectricity ? normalColor : abnormalColor}
              value='平期正向有功电量'
              size={12}
              circleRingChartRatio={(1 * 100).toFixed(2)}
              subTitle={inverterData?.normalPositiveElectricity ? inverterData?.normalPositiveElectricity : noDataText + "kW"}
              breadth='160px'
            />
          </div>
        </div>

        <div className={styles.electryModule}>
          <div className={styles.echartMain}>
            <CircleRingChart
              textName=''
              pathColor={inverterData?.normalNegativeElectricity ? normalColor : abnormalColor}
              value='平期反向有功电量'
              size={12}
              circleRingChartRatio={(1 * 100).toFixed(2)}
              subTitle={inverterData?.normalNegativeElectricity ? inverterData?.normalNegativeElectricity : noDataText + "kW"}
              breadth='160px'
            />
          </div>
        </div>

        <div className={styles.electryModule}>
          <div className={styles.echartMain}>
            <CircleRingChart
              textName=''
              pathColor={inverterData?.valleyPositiveElectricity ? normalColor : abnormalColor}
              value='谷期正向有功电量'
              size={12}
              circleRingChartRatio={(1 * 100).toFixed(2)}
              subTitle={inverterData?.valleyPositiveElectricity ? inverterData?.valleyPositiveElectricity : noDataText + "kW"}
              breadth='160px'
            />
          </div>
        </div>

        <div className={styles.electryModule}>
          <div className={styles.echartMain}>
            <CircleRingChart
              textName=''
              pathColor={inverterData?.valleyNegativeElectricity ? normalColor : abnormalColor}
              value='谷期反向有功电量'
              size={12}
              circleRingChartRatio={(1 * 100).toFixed(2)}
              subTitle={inverterData?.valleyNegativeElectricity ? inverterData?.valleyNegativeElectricity : noDataText + "kW"}
              breadth='160px'
            />
          </div>
        </div>
      </div>
    </div>
  </>
}
export default OnGridPower



