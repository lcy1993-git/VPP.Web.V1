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
    if (!unit) unit = '-';

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

    data.forEach((item: any) => {
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
    const order = ['KWH', '元', 'T', 'KW', 'V', 'A', 'other'];

    let values: any = [];
    order.forEach(function (key) {
      if (groupedData.hasOwnProperty(key)) {
        values = values.concat(groupedData[key]);
      }
    });
    return values;
  }

  return groupedData;
};
