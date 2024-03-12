import { ConfigProvider, Segmented } from "antd"
import { useState } from "react";


interface Tprops {
  getSelectedValue?: (value: string) => void | undefined;
  options: any; // 参照ant design 中的分段控制器的参数
  block?: boolean;
  size?: 'large' | 'middle' | 'small';
  defaultValue?: string
}

const SegmentedTheme = (props: Tprops) => {


  // @ts-ignore
  const [value, setValue] = useState();
  // 获取选中值
  const { getSelectedValue } = props;
  const handleChange = (value: any) => {
    setValue(value);
    if (getSelectedValue) {
      getSelectedValue(value);
    }
  }

  return <ConfigProvider
    theme={{
      token: {
        borderRadius: 2
      },
      components: {
        Segmented: {
          itemActiveBg: '#1292ff',
          itemColor: '#fff',
          itemSelectedBg: '#1292ff',
          itemHoverColor: '#FFF',
          itemHoverBg: 'rgba(87, 193, 255, 0.3)'
        },
      }
    }}
  >
    <Segmented  value={value} {...props} onChange={handleChange} />
  </ConfigProvider>
}
export default SegmentedTheme
