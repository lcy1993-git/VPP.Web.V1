import { LinkOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { PageLoading, Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import React from 'react';
import { ConfigProvider, Space } from 'antd';
import LayoutHeader from './components/layout-header';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  loading?: boolean;
  collapsed: boolean,
  fetchUserInfo?: () => Promise<any | undefined>;
}> {
  const fetchUserInfo = async () => {

  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      collapsed: false,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    collapsed: false,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {

  const onCollapse = (): void => {
    setInitialState({
      ...initialState,
      collapsed: !initialState?.collapsed,
    }).then();
  };


  return {
    avatarProps: {
      render: () => {
        return <span>test</span>
      },
    },
    footerRender: () => null,
    headerRender: () => <LayoutHeader />,
    onPageChange: () => {
      const { location } = history;
      if (!initialState?.currentUser && location.pathname !== loginPath) { }
    },
    contentStyle: { padding: '0 20px 0 20px' },
    siderWidth: 208,
    breakpoint: false,
    onCollapse: onCollapse, // 自定义折叠事件
    collapsed: initialState?.collapsed, // 侧边导航栏折叠状态
    collapsedButtonRender: false, // 取消默认折叠按钮
    menuHeaderRender: () => (
      // 自定义导航栏折叠按钮
      <div style={{ width: '100%', paddingLeft: '7px' }} onClick={onCollapse}>
          <i className="iconfont" style={{ fontSize: 12 }}>
          &#xe63c;
          </i>
      </div>
    ),
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      return (
        <>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#0084ff', // Seed Token，影响范围大
                borderRadius: 2,
                colorText: '#fff',
                colorBorder: '#023999',
                colorPrimaryHover: '#10a2fa',
                colorTextPlaceholder: '#0143cc',
                controlOutline: 'transparent', // 输入组件 激活边框颜色
                colorBgBase: '#032566', // 所有组件的基础背景色
                colorBgContainer: 'transparent',
                colorError: '#ff0000',
                colorBgElevated: ' #001d51', // 模态框、悬浮框背景色
                controlItemBgActiveHover: 'rgba(0, 84, 255, 0.2)', // 控制组件项在鼠标悬浮且激活状态下的背景颜色
                controlItemBgHover: 'rgba(0, 84, 255, 0.2)', // 下拉框，手鼠hover背景色
                controlItemBgActive: 'rgba(0, 84, 255, 0.3)', // 控制组件项在激活状态下的背景颜色
              },
            }}
          >
            {children}
          </ConfigProvider>
        </>
      );
    },
    iconfontUrl: require('./assets/iconfont/iconfont'), // 页面中使用iconfont 路由
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
