import { CloseOutlined } from '@ant-design/icons';
import { Divider, Modal } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import styles from './index.less';

interface PropsType {
  visible: boolean;
  type: number;
  setVisible: Dispatch<SetStateAction<boolean>>; // 修改模态框状态
}

// 报告查询
const ReportModal = (props: PropsType) => {
  const { visible, setVisible, type } = props;
  const reportType = type === 0 ? '区域' : type === 1 ? '企业' : '行业';

  return (
    <Modal
      open={visible}
      width={1000}
      footer={null}
      className={styles.modal}
      bodyStyle={{ background: '#fff' }}
      closeIcon={<CloseOutlined style={{ color: '#000' }} />}
      onCancel={() => setVisible(false)}
    >
      <div className={styles.modalBody}>
        <h2 className={styles.modalTitle}>{reportType}​能源排放分析报告</h2>
        <div className={styles.module}>
          <span className={styles.secondTitle}>一、基础信息</span>
          <Divider type="horizontal" className={styles.divider} />
          <table className={styles.table}>
            <tr>
              <td>{reportType}名称</td>
              <td>龙泉驿区</td>
            </tr>
            <tr>
              <td>报告周期</td>
              <td>2024-02-01</td>
            </tr>
          </table>
        </div>
        <div className={styles.module}>
          <span className={styles.secondTitle}>二、碳排放基本情况说明</span>
          <Divider className={styles.divider} type="horizontal" />
          <p className={styles.text}>
            本{reportType}碳排放总量为：<span className={styles.blue}>5.216 t</span>
            CO2,占比最大的范围为范围二。范围一排放为直接温室气体排放，占比为
            <span className={styles.blue}>0.00%</span>；
            范围二排放为电力产生的间接温室气体排放，占比为
            <span className={styles.blue}>100.00%</span>
            。另外，碳排放同比为<span className={styles.blue}>20%</span>，环比为
            <span className={styles.blue}>20%</span>，相较于前期
            碳排放量有所增长，建议采取一定措施进行控制。
          </p>
          <p className={styles.text}>
            本{reportType}碳排放量占所有{reportType}总碳排放量的
            <span className={styles.blue}>20%</span>
            ，各{reportType}碳排放均值为<span className={styles.blue}>4.2t </span>
            CO2，该{reportType}相较于{reportType}均值高出了<span className={styles.blue}>24%</span>
            ，建议加强能源管理和监测。
          </p>
        </div>
        <div className={styles.module}>
          <span className={styles.secondTitle}>三、碳排放核算</span>
          <Divider className={styles.divider} type="horizontal" />
          <h3>1、范围一：直接温室气体排放一览表</h3>
          <table className={styles.table2}>
            <tr>
              <td>序号</td>
              <td>活动源</td>
              <td>净消费量（t）</td>
              <td>数据源</td>
              <td>排放因子（tCO2/t）</td>
              <td>CO2排放量（t）</td>
              <td>净排放占比（%）</td>
            </tr>
            <tr>
              <td>1</td>
              <td>净购入电力</td>
              <td>7570</td>
              <td>实测值</td>
              <td>0.68900</td>
              <td>5.216</td>
              <td>100.00</td>
            </tr>
          </table>
          <h3>2、范围二：间接温室气体排放一览表</h3>
          <table className={styles.table2}>
            <tr>
              <td>序号</td>
              <td>活动源</td>
              <td>净消费量（t）</td>
              <td>数据源</td>
              <td>排放因子（tCO2/t）</td>
              <td>CO2排放量（t）</td>
              <td>净排放占比（%）</td>
            </tr>
            <tr>
              <td>1</td>
              <td>净购入电力</td>
              <td>7570</td>
              <td>实测值</td>
              <td>0.68900</td>
              <td>5.216</td>
              <td>100.00</td>
            </tr>
          </table>
          <h3>3、绿色能源温室气体一览表</h3>
          <table className={styles.table2}>
            <tr>
              <td>序号</td>
              <td>活动源</td>
              <td>净消费量（t）</td>
              <td>数据源</td>
              <td>排放因子（tCO2/t）</td>
              <td>CO2排放量（t）</td>
              <td>净排放占比（%）</td>
            </tr>
            <tr>
              <td>1</td>
              <td>光伏碳减排</td>
              <td>0</td>
              <td>实测值</td>
              <td>0.68900</td>
              <td>0.000</td>
              <td>-0.00</td>
            </tr>
          </table>
          <h3>4、温室气体排放汇总值</h3>
          <table className={styles.table}>
            <tr>
              <td>总碳排（t）</td>
            </tr>
            <tr>
              <td>5.216</td>
            </tr>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
