import { Tooltip } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from '../index.less';

interface CategoryType {
  title: string;
  options: string[];
}

interface PropsType {
  categories: CategoryType[];
  setSelectedValue: Dispatch<SetStateAction<any>>;
  value?: any;
  width?: number | string;
  height?: number | string;
}

type SelectedOption = {
  categoryIndex: number | null;
  optionIndex: number | null;
};

// 分类选项列表，只能选中一个选项
const OptionList = (props: PropsType) => {
  const { categories, width, height, setSelectedValue, value } = props;
  const [selectedOption, setSelectedOption] = useState<SelectedOption>({
    categoryIndex: null,
    optionIndex: null,
  });

  // 寻找第一个有选项的分类的索引及该分类的第一个选项的索引
  const findFirstAvailableOption = () => {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].options.length > 0) {
        return { categoryIndex: i, optionIndex: 0 };
      }
    }
    return { categoryIndex: null, optionIndex: null }; // 如果所有分类都没有选项
  };

  // 默认选项
  useEffect(() => {
    if (categories && categories.length) {
      const res = findFirstAvailableOption();
      if (res.categoryIndex !== null && res.optionIndex !== null) {
        const { categoryIndex, optionIndex } = res;
        const selectedItem = categories[categoryIndex].options[optionIndex];
        setSelectedValue(value ? value[optionIndex] : selectedItem);
      }
      setSelectedOption(res);
    }
  }, [categories]);

  // 设置选中项分类和index
  const selectOption = (categoryIndex: number, optionIndex: number, item: string) => {
    setSelectedOption({ categoryIndex, optionIndex });
    setSelectedValue(value ? value[optionIndex] : item);
  };

  const listWidth = width || '296px';
  const listHeight = height || '100%';

  return (
    <div className={styles.list} style={{ width: listWidth, height: listHeight }}>
      {categories.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <div className={styles.listTitle}>{category.title}</div>
          <div className={styles.listOption}>
            {category.options.map((item, optionIndex) => (
              <div
                key={optionIndex}
                onClick={() => selectOption(categoryIndex, optionIndex, item)}
                className={[
                  styles.option,
                  selectedOption.categoryIndex === categoryIndex &&
                  selectedOption.optionIndex === optionIndex
                    ? styles.selectedBg
                    : '',
                  optionIndex % 2 ? styles.evenBg : styles.oddBg,
                ].join(' ')}
              >
                {/* <Tooltip title={item} placement="top"> */}
                  <div className={styles.item}> {item}</div>
                {/* </Tooltip> */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OptionList;
