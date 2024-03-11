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
 */
export default {
  // 登录、系统管理
  '/sysApi': {
    target: 'http://10.6.1.164:18189',
    changeOrigin: true,
    // logLevel: 'debug',
    pathRewrite: { '^/sysApi': '/' },
  },
};
