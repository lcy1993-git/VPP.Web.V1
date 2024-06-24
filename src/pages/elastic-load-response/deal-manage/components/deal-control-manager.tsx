import CustomCharts from '@/components/custom-charts';
import GeneralTable from '@/components/general-table';
import SegmentedTheme from '@/components/segmented-theme';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Button, Collapse, Input, Select, Space, Table } from 'antd';
import { useState } from 'react';
import styles from '../index.less';
import { VPPDetailColumns, declarationOptions, planDetailColumns } from '../utils';
// 交易调控计划管理
const DealControlManager = () => {
  // 曲线or表格
  const [curveOrTable, setCurveOrTable] = useState<boolean>(true);

  const text = `
A dog is a type of domesticated animal.
Known for its loyalty and faithfulness,
it can be found as a welcome guest in many households across the world.
`;

  const renderItemText = () => {
    return (
      <div className={styles.collapseItem}>
        <div className={styles.list}>
          <div className={styles.item}>
            <span className={styles.label}>计划开始时间：</span>
            <span className={styles.value}>2024-05-09</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>计划开始时间：</span>
            <span className={styles.value}>2024-05-09</span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>计划开始时间：</span>
            <span className={styles.value}>2024-05-09</span>
          </div>
        </div>
        <div className={styles.line} />
        <div className={styles.planCard}>
          <div className={styles.cardItem}>
            <div className={styles.cardIcon}>
              <i className="iconfont">&#xe677;</i>
            </div>
            <div className={styles.cardContent}>
              <span className={styles.label}>实时功率（MW）</span>
              <span className={styles.value}>1006.56</span>
            </div>
          </div>
          <div className={styles.cardItem}>
            <div className={styles.cardIcon}>
              <i className="iconfont">&#xe675;</i>
            </div>
            <div className={styles.cardContent}>
              <span className={styles.label}>最大功率（MW）</span>
              <span className={styles.value}>1006.56</span>
            </div>
          </div>
          <div className={styles.cardItem}>
            <div className={styles.cardIcon}>
              <i className="iconfont">&#xe66a;</i>
            </div>
            <div className={styles.cardContent}>
              <span className={styles.label}>最小功率（MW）</span>
              <span className={styles.value}>1006.56</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'This is panel header 1',
      children: renderItemText(),
    },
    {
      key: '2',
      label: 'This is panel header 2',
      children: renderItemText(),
    },
    {
      key: '3',
      label: 'This is panel header 3',
      children: renderItemText(),
    },
  ];

  return (
    <div className={styles.controlManagerPage}>
      <Select
        style={{ width: 300 }}
        allowClear={false}
        options={[
          { label: '目前邀约计划', value: 0 },
          { label: '实时调度计划', value: 1 },
        ]}
        defaultValue={0}
      />
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <div className={styles.planList}>
            <Collapse accordion items={items} defaultActiveKey={['1']} />
          </div>
          <div className={styles.planChart}>
            <div style={{ textAlign: 'end' }}>
              <SegmentedTheme
                options={[
                  {
                    label: '曲线',
                    value: '曲线',
                    icon: <i className="iconfont">&#xe63a;</i>,
                  },
                  {
                    label: '表格',
                    value: '表格',
                    icon: <i className="iconfont">&#xe639;</i>,
                  },
                ]}
                getSelectedValue={(value) => setCurveOrTable(value === '曲线')}
              />
            </div>
            <div className={styles.chart}>
              {curveOrTable ? (
                <CustomCharts options={declarationOptions([5, 20, 36, 10, 10])} />
              ) : (
                <GeneralTable
                  columns={VPPDetailColumns}
                  dataSource={[{}]}
                  rowKey="id"
                  size="middle"
                  hideSelect
                  bordered={false}
                  scroll={{ y: 170 }}
                  style={{ paddingTop: '15px' }}
                  hasPage={false}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.bottomContainer}>
          <div className={styles.searchHeader}>
            <div className={styles.titleText}>计划分解详情</div>
            <Space size={15}>
              <Input placeholder="请输入内容查询" style={{ width: '280px' }} />
              <Button>
                <SearchOutlined />
                查询
              </Button>
              <Button>
                <ReloadOutlined />
                重置
              </Button>
            </Space>
          </div>
          <Table
            columns={planDetailColumns()}
            dataSource={[{}]}
            rowKey="id"
            size="middle"
            bordered={false}
            style={{ paddingTop: '15px', width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default DealControlManager;
