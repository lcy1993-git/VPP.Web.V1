import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('没有回应！请重试。');
      } else {
        // 发送请求时出了点问题
        const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
        message.open({
          type: 'error',
          content: reg.test(error) ? error : '服务器内部错误！！！',
        });
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      const url = config?.url;
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2ZjA4ZWFkMmI0ZGU0YzdkOTBmNGM1NjgwMTFjYTQ4NyIsInVzZXIiOiJ7XCJpZFwiOjEsXCJuaWNrTmFtZVwiOlwi566h55CG5ZGYXCIsXCJpc1N1cGVyXCI6dHJ1ZX0iLCJpc3MiOiJhZG1pbiIsImlhdCI6MTcxMDMxNzI2NiwiZXhwIjoxNzEwOTIyMDY2fQ.EIYqMIms81M8-Ribwtm64YE8PZHTfSnpvNLUmUqF64g'
      if (token) {
        return {
          ...config,
          url,
          headers: {
            ...config.headers,
            Authorization: token,
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'x-requested-with',
            'X-Content-Type-Options': 'nosniff',
          },
        };
      }
      return {
        ...config,
        url,
      };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;

      if (data.code === 403) {
        // history.push('/login');
        return Promise.reject('登录超时，请重新登录！！！');
      }
      if (data.code && data.code !== 200) {
        const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
        return reg.test(data.message)
          ? Promise.reject(data.message)
          : Promise.reject('服务器内部异常，请稍后再试');
      }
      return response;
    },
  ],
};
