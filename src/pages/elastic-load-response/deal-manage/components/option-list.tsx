import { useState } from 'react';
import styles from '../index.less';

interface PropsType {
  options: any;
  title: string;
  width?: number;
  height?: number;
}
// 列表选择器
const OptionList = (props: PropsType) => {
  const { options, title, width, height } = props;
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const listWidth = width ? width : '296px';
  const listHeight = height ? height : '100%';

  // 列表选项背景颜色
  const handleOptionsItemBg = (index: number) => {
    if (selectedIndex === index) {
      // 选中
      return styles.selectedBg;
    } else {
      // 未选中根据奇偶行
      return index % 2 ? styles.evenBg : styles.oddBg;
    }
  };

  return (
    <div className={styles.list} style={{ width: listWidth, height: listHeight }}>
      <div className={styles.listTitle}>{title}</div>
      <div className={styles.listOption}>
        {/* 循环渲染列表项 */}
        {options.map((item: any, index: number) => (
          <div
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`${styles.option} ${handleOptionsItemBg(index)}`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionList;
