import { request } from '@umijs/max';
import { message } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
interface RequestDataType<T> {
  code: number;
  msg?: string;
  data?: any;
  content: T;
}

export const getDataByUrl = (
  url: string,
  params: object,
  requestSource: 'api' | 'sysApi',
  requestType = 'get',
  postType = 'body',
) => {
  if (requestType === 'get') {
    return request(`/${requestSource}${url}`, { method: requestType, params });
  }
  if (postType === 'body') {
    return request(`/${requestSource}${url}`, { method: requestType, data: params });
  }
  return request(`/${requestSource}${url}`, { method: requestType, params });
};

/**文件上传 */
export const uploadFile = (files: any[]) => {
  const formData = new FormData();
  files.forEach((item) => {
    formData.append('files', item);
  });

  return request(`/sysApi/file/upload/getUrl`, {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
};

export const cRequest = <T extends object>(func: () => Promise<RequestDataType<T>>): Promise<T> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<T>(async (resolve, reject) => {
    const res = await func();
    if (!res) {
      reject(null);
      return;
    }
    const { code, data, msg } = res;

    if (code && code === 200) {
      resolve(data);
    } else {
      message.error(msg);
    }
  });
};

// 获取当前小时数
export const currentHour = () => {
  // 获取当前小时数
  const currentDate = new Date();
  return currentDate.getHours();
};

// 获取开始时间-结束时间有几个五分钟数据
export const handleDiffMins = (
  endTime: any = new Date(),
  startTime: any = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate()),
  step = 5,
) => {
  // 计算从开始时间到结束时间经过了多少毫秒
  const diffMs: any = endTime - startTime;

  // 计算这段时间经过了多少个step
  const diffMins = Math.floor(diffMs / 1000 / 60 / step);

  return diffMins;
};

// 判断用户选择的日期是否是当天
export const judgmentIsToday = (date: any) => {
  // 获取当前日期的 dayjs 对象
  const today = dayjs();
  // 判断是否是当天
  return date.isSame(today, 'day');
};

// 限制日期选择
export const disableDate = (current: any) => {
  // 获取当前日期
  const today = moment().startOf('day');
  // 将被选中的日期也转换为日期对象
  const selectedDate = moment(current).startOf('day');
  // 当前日期及之后的日期将被禁用
  return selectedDate > today;
};

// psc状态
export const handleInverterStatus_psc = (status: any) => {
  const inverterStatus = parseInt(status);
  if (inverterStatus === 1) {
    return '运行';
  } else {
    return '停止';
  }
};

// 电池簇状态
export const handleInverterStatus_cluster = (status: any) => {
  const inverterStatus = parseInt(status);
  if (inverterStatus === 0) {
    return '运行';
  } else if (inverterStatus === 1) {
    return '禁冲';
  } else if (inverterStatus === 2) {
    return '禁放';
  } else if (inverterStatus === 3) {
    return '待机';
  } else {
    return '停机';
  }
};

// 空调状态
export const handleInverterStatus_air = (status: any) => {
  const inverterStatus = parseInt(status);
  if (inverterStatus === 0) {
    return '停止';
  } else if (inverterStatus === 1) {
    return '制冷';
  } else if (inverterStatus === 2) {
    return '制冷';
  } else if (inverterStatus === 3) {
    return '制热';
  } else if (inverterStatus === 4) {
    return '自动';
  }else if (inverterStatus === 5) {
    return '-';
  }else if (inverterStatus === 6) {
    return '通风';
  }else if (inverterStatus === 7) {
    return '除湿';
  }else if (inverterStatus === 8) {
    return '待机';
  }else if (inverterStatus === 9) {
    return '运行';
  }else if (inverterStatus === 10) {
    return '故障';
  }else {
    return '停机';
  }
};

// 逆变器状态
export const handleInverterStatus = (status: any) => {
  const inverterStatus = parseInt(status);
  if (inverterStatus === 2) {
    return '运行';
  } else if (inverterStatus === 0 || 1 || 6) {
    return '停机';
  } else if (inverterStatus === 4 || 5) {
    return '故障';
  } else {
    return '异常';
  }
};

// 遥测分组
export const groupData = (data: any, isTable = false) => {
  // 根据单位进行分组
  const groupedData = data.reduce((groups: any, item: any) => {
    let unit = item.unit?.toUpperCase();
    if(!unit) unit = '-';
    // if (
    //   unit === 'KWH' ||
    //   unit === '元' ||
    //   unit === '元/度' ||
    //   unit === 'T' ||
    //   unit === 'KW' ||
    //   unit === 'MV' ||
    //   unit === 'V' ||
    //   unit === 'A'
    // ) {
    //   if (!groups.hasOwnProperty(unit)) {
    //     groups[unit] = [];
    //   }
    //   groups[unit].push(item);
    // } else {
    //   if (!groups.hasOwnProperty('other')) {
    //     groups['other'] = [];
    //   }
    //   // 处理运行状态数据
    //   if (item.dataDesc === '运行状态') {
    //     const numbers = item.data?.match(/\d+/g); // 使用正则表达式匹配字符串中的数字
    //     if (numbers) {
    //       // 如果字符串中包含数字
    //       item.data = handleInverterStatus(parseInt(item.data));
    //     }
    //   }
    //   groups['other'].push(item);
    // }

    if (!groups.hasOwnProperty(unit)) {
      groups[unit] = [];
    }
    if (item.dataDesc === '运行状态') {
      const numbers = item.data?.match(/\d+/g); // 使用正则表达式匹配字符串中的数字
      if (numbers) {
        // 如果字符串中包含数字
        item.data = handleInverterStatus(parseInt(item.data));
      }
    }
    groups[unit].push(item);
    return groups;
  }, {});

  // 日、月、年排序
  const sortDateType = (data: any) => {
    let dayData: any = [];
    let monthData: any = [];
    let yearData: any = [];
    let otherData: any = [];

    data.forEach(function (item: any) {
      if (item.dataDesc.startsWith('日')) {
        dayData.push(item);
      } else if (item.dataDesc.startsWith('月')) {
        monthData.push(item);
      } else if (item.dataDesc.startsWith('年')) {
        yearData.push(item);
      } else {
        otherData.push(item);
      }
    });

    return [...dayData, ...monthData, ...yearData, ...otherData];
  };

  if (groupedData.hasOwnProperty('KWH')) {
    groupedData['KWH'] = sortDateType(groupedData['KWH']);
  }

  if (groupedData.hasOwnProperty('元')) {
    groupedData['元'] = sortDateType(groupedData['元']);
  }

  if (groupedData.hasOwnProperty('T')) {
    groupedData['T'] = sortDateType(groupedData['T']);
  }

  // 处理表格展示
  if (isTable) {
    // const order = ['KWH', '元', 'T', 'KW', 'V', 'A', 'other'];

    // let values = [];
    // order.forEach(function (key) {
    //   if (groupedData.hasOwnProperty(key)) {
    //     values = values.concat(groupedData[key]);
    //   }
    // });



    const values = Object.keys(groupedData).map((item:any) => {
      return groupedData[item]
    })

    let data:any = []
    values.forEach((value)=>{
      data = [...data, ...value]
    })

    return data;
  }

  return groupedData;
};

// 数据格式化小数位数
export const FormatData = (data: any, digit: number) => {
  return Number(data) ? Number(data).toFixed(digit) : '0.00';
};

// 收益数据格式化
export const FormatIncomeData = (data: any, digit: number) => {
  return FormatData(data / 10000, digit);
};

// 收益数据格式化
export const FormatGeneratedData = (data: any, digit: number) => {
  return FormatData(data / 1000, digit);
};
