import ContentPage from '@/components/content-page';
import CustomCard from '@/components/custom-card';
import React, { useState } from 'react';
import ContractManage from './components/contract-Manage';
import DealControlManager from './components/deal-control-manager';
import DealDeclaration from './components/deal-declaration';
import ExecutionTracking from './components/execution-tracking';
import LoadManage from './components/load-manage';
import Notice from './components/notice';
import SettlementManage from './components/settlement-manage';
import styles from './index.less';

// 交易管理
const DealManage = () => {
  // 菜单
  const btnComponents: any = {
    交易公告披露: Notice,
    基线负荷管理: LoadManage,
    交易申报: DealDeclaration,
    交易调控计划管理: DealControlManager,
    执行跟踪: ExecutionTracking,
    结算管理: SettlementManage,
    合同管理: ContractManage,
  };
  // 被点击的
  const [activeComponentKey, setActiveComponentKey] = useState<any>(Object.keys(btnComponents)[0]);

  return (
    <ContentPage>
      <CustomCard>
        <div className={styles.dealPage}>
          <div className={styles.buttons}>
            {Object.entries(btnComponents).map(([text], index) => (
              <div
                key={text}
                onClick={() => setActiveComponentKey(text)}
                className={`${styles.btn} ${index === 0 ? styles.firstBtn : ''}
                            ${index === Object.keys(btnComponents).length - 1 ? styles.lastBtn : ''}
                            ${
                              activeComponentKey === text
                                ? styles.selectedStyle
                                : styles.unSelectedStyle
                            }`}
              >
                {text}
              </div>
            ))}
          </div>
          <div className={styles.dealContainer}>
            {React.createElement(btnComponents[activeComponentKey])}
          </div>
        </div>
      </CustomCard>
    </ContentPage>
  );
};

export default DealManage;
