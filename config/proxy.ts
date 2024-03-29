/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 * 10.6.1.167
 */
export default {
  // 登录、系统管理
  '/sysApi': {
    target: 'http://10.6.1.167:18181',
    changeOrigin: true,
    // logLevel: 'debug',
    pathRewrite: { '^/sysApi': '/' },
  },
  '/api': {
    // target: 'http://10.6.10.28:18181',
    target: 'http://10.6.1.167:18181',
    changeOrigin: true,
    // logLevel: 'debug',
    pathRewrite: { '^/api': '/' },
  },
};
