import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: "realDark",
  // 拂晓蓝
  colorPrimary: '#0190ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Ant Design Pro',
  pwa: true,
  iconfontUrl: '',
  token: {
    // https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    header: {
      // 修改布局组件header的高度
      heightLayoutHeader: 80,
      // header的背景颜色
      colorBgHeader: 'transparent',
    },
    pageContainer: {
      colorBgPageContainer: 'transparent',
    },
    sider: {
      colorMenuBackground: 'RGBA(0, 29, 94, .5)',
      colorMenuItemDivider: 'transparent',
    },

  },
};

export default Settings;
