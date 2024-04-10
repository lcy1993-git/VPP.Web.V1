import { Form } from 'antd';
import React from 'react';
import styles from './index.less';

interface CustomFormItemProps {
  label?: string | React.ReactNode;
  labelSlot?: () => React.ReactNode;
  required?: boolean;
  className?: string;
  align?: 'left' | 'right'; //label对齐方式
  labelWidth?: number; //label宽度
  overflow?: boolean;
  flexStart?: boolean; //label特殊跨行对齐处理
  symbol?: string; // 连接符号 ':'
}

/** 重定义Form.Item组件样式  */
const withCustomFormItemProps =
  <P extends object>(WrapperComponent: React.ComponentType<P>) =>
  (props: P & CustomFormItemProps & { children?: React.ReactNode }) => {
    const {
      className = '',
      labelWidth = 90,
      overflow = false,
      label = '',
      align = 'left',
      required,
      labelSlot,
      flexStart = false,
      symbol = ':',
      ...rest
    } = props;

    const isRequiredClassName = required ? styles.required : '';
    const labelAlign = align === 'right' ? styles.right : '';
    const alignStart = flexStart ? styles.alignStart : '';

    return (
      <div className={`${styles.customItem} ${className} ${alignStart}`}>
        <div
          className={`${styles.customItemLabel} ${labelAlign}`}
          style={{ width: `${labelWidth}px` }}
        >
          <span className={`${styles.customItemLabelWord} ${isRequiredClassName}`}>
            {label} {symbol}
            {labelSlot?.()}
          </span>
        </div>
        <div
          className={styles.customItemContent}
          style={{
            overflow: overflow ? 'visible' : 'hidden',
          }}
        >
          <WrapperComponent {...(rest as P)}>{props.children}</WrapperComponent>
        </div>
      </div>
    );
  };

export default withCustomFormItemProps(Form.Item);
