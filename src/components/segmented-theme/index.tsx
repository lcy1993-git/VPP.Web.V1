import { ConfigProvider, Segmented } from 'antd';
import { Ref, forwardRef, useImperativeHandle, useState } from 'react';

interface Props {
  getSelectedValue?: (value: string) => void | undefined;
  options: any; // 参照ant design 中的分段控制器的参数
  block?: boolean;
  size?: 'large' | 'middle' | 'small';
  defaultValue?: string;
}

const SegmentedTheme = (props: Props, ref: Ref<any>) => {
  // @ts-ignore
  const [value, setValue] = useState();
  // 获取选中值
  const { getSelectedValue, ...restProps } = props;

  const handleChange = (value: any) => {
    setValue(value);
    if (getSelectedValue) {
      getSelectedValue(value);
    }
  };

  useImperativeHandle(ref, () => ({
    /** 重置选中项 */
    reset: (selectedValue: any) => {
      setValue(selectedValue);
    },
  }));

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 2,
        },
        components: {
          Segmented: {
            itemActiveBg: '#1292ff',
            itemColor: '#fff',
            itemSelectedBg: '#1292ff',
            itemHoverColor: '#FFF',
            itemHoverBg: 'rgba(87, 193, 255, 0.3)',
          },
        },
      }}
    >
      <Segmented value={value} {...restProps} onChange={handleChange} />
    </ConfigProvider>
  );
};
export default forwardRef(SegmentedTheme);
