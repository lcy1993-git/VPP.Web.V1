/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/login',
    layout: false,
    component: './login',
  },
  {
    path: '/big-screen/feature',
    name: '特色场景',
    layout: false,
    component: './big-screen/Feature',
  },
  {
    path: '/big-screen/bulletin-board',
    name: '能源综和看板',
    layout: false,
    component: './big-screen/BulletinBoard',
  },
  {
    path: '/energy-monitor',
    name: '能耗监测',
    component: './energy-monitor',
  },
  {
    path: '/energy-analysis',
    name: '能耗分析',
    component: './energy-analysis',
  },
  {
    path: '/enterprise-panel',
    name: '企业面板',
    component: './enterprise-panel',
  },
  {
    path: '/dcs-energy-monitor',
    name: '分布式能源监测',
    component: './dcs-energy-monitor',
  },
  {
    path: '/report-forms',
    name: '报表报告',
    component: './report-forms',
  },
  {
    path: '/clear-consume',
    name: '清洁能源消费管理',
    routes: [
      {
        path: '/clear-consume/carbon-overview',
        name: '碳排放总览',
        component: './clear-consume/carbon-overview',
      },
      {
        path: '/clear-consume/carbon-monitor',
        name: '碳排放监测',
        component: './clear-consume/carbon-monitor',
      },
      {
        path: '/clear-consume/carbon-detail',
        name: '碳排放详情',
        component: './clear-consume/carbon-detail',
      },
      {
        path: '/clear-consume/carbon-analysis',
        name: '碳排放分析',
        component: './clear-consume/carbon-analysis',
      },
    ],
  },
  {
    path: '/enterprise-manage',
    name: '企业管理',
    component: './enterprise-manage',
  },
  {
    path: '/devices-manage',
    name: '设备管理',
    component: './devices-manage',
  },
  {
    path: '/energy-overview',
    name: '用能总览',
    component: './energy-overview',
  },
  {
    path: '/runtime-monitor',
    name: '运行监测',
    routes: [
      {
        path: '/runtime-monitor/realtime-data',
        name: '实时数据',
        component: './runtime-monitor/realtime-data',
      },
      {
        path: '/runtime-monitor/history-data',
        name: '历史数据',
        component: './runtime-monitor/history-data',
      },
    ],
  },
  {
    path: '/power-station',
    name: '光伏电站',
    component: './power-station',
  },
  {
    path: '/energy-station',
    name: '储能电站',
    component: './energy-station',
  },
  {
    path: '/charging-station',
    name: '充电电站',
    component: './charging-station',
  },
  {
    path: '/device-detail',
    name: '设备详情',
    component: './device-detail',
  },
  {
    path: '/alarm-manage',
    name: '告警管理',
    routes: [
      {
        path: '/alarm-manage/realtime-alarm',
        name: '实时告警',
        component: './alarm-manage/realtime-alarm',
      },
      {
        path: '/alarm-manage/history-event',
        name: '历史事件',
        component: './alarm-manage/history-event',
      },
    ],
  },
  {
    path: '/report-manage',
    name: '报表管理',
    component: './report-manage',
  },
  {
    path: '/system',
    name: '系统管理',
    routes: [
      {
        path: '/system/menu',
        name: '菜单管理',
        component: './system/menu',
      },
      {
        path: '/system/role',
        name: '角色管理',
        component: './system/role',
      },
      {
        path: '/system/user',
        name: '用户管理',
        component: './system/user',
      },
      {
        path: '/system/site',
        name: '访问管理',
        component: './system/site',
      },
    ],
  },
  {
    path: '/elastic-load-response',
    name: '弹性负荷响应',
    routes: [
      {
        path: '/elastic-load-response/dispatch-implementation',
        name: '调度实施',
        component: './elastic-load-response/dispatch-implementation',
      },
      {
        path: '/elastic-load-response/deal-manage',
        name: '交易管理',
        component: './elastic-load-response/deal-manage',
      },
    ],
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
