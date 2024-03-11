/**
 * 菜单权限流程：
 * 1、点击登录，获取token
 * 2、调用 initialState.fetchUserInfo 获取用户相关权限数据
 * 3、将用户信息存储在initialState全局对象中
 * 4、在config/routes路由文件中添加权限数据(access: 'canAdmin')
 * 5、当前文件返回用户权限
 *
 * 页面内权限
 * const access = useAccess();
 * <Access accessible={!!access?.isUser}>页面内容</Access>
 * */
export default function access(initialState: { currentUser: any } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    isUser: currentUser && currentUser.access === 'user'
  };
}
