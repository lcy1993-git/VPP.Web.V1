import QRCode from 'qrcode';
import * as XLSX from 'xlsx';

// 二维码地址生成
export async function getQRCode(data: string, name: any) {
  const _myQRCode = await QRCode.toDataURL(data, {
    errorCorrectionLevel: 'H', //容错级别
    type: 'image/png', //生成的二维码类型
    quality: 0.3, //二维码质量
    margin: 1, //二维码留白边距
    width: 280, //宽
    height: 280, //高
  });
  return {
    codeUrl: _myQRCode,
    name,
  };
}

// 下载图片到本地
export function downloadFile(base64URL: any, fileName = '') {
  const a = document.createElement('a');
  a.download = fileName || '设备二维码';
  // 创建 Blob 对象，并获取 base64 数据的 MIME 类型
  const mimeType = base64URL.match(/:(.*?);/)[1];
  // 将 base64 数据转换为字节数组
  const byteCharacters = atob(base64URL.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  // 将字节数组填充到 Uint8Array 中
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  // 创建 Blob 对象
  const blob = new Blob([byteArray], { type: mimeType });
  // 将 Blob 对象的 URL 赋值给 a 标签的 href 属性
  a.href = URL.createObjectURL(blob);
  // 将a标签暂时添加到 body 中，触发下载
  document.body.appendChild(a);
  a.click();
  // 下载完成后，将 a 标签从 body 中移除
  document.body.removeChild(a);
}

// 排序
export const compare = (property: string | number) => {
  return function (a: { [x: string]: any; }, b: { [x: string]: any; }) {
    const value1 = a[property];
    const value2 = b[property];
    return value1 - value2;
  };
};

//echart阈值问题处理方法
/**
 * @param span series 中最大值与最小值的差值
 * @param splitNumber 坐标轴分割段数
 * @param round 折线图中需要传 true
 * @returns {number} 处理后 max 的最后结果
 */
export const nice = (span: any, splitNumber: any, round: any) => {
  let val = span / splitNumber;
  const exponent = Math.floor(Math.log(val) / Math.LN10);
  const exp10 = Math.pow(10, exponent);
  const f = val / exp10; // 1 <= f < 10

  let nf;

  if (round) {
    if (f < 1.5) {
      nf = 1;
    } else if (f < 2.5) {
      nf = 2;
    } else if (f < 4) {
      nf = 3;
    } else if (f < 7) {
      nf = 5;
    } else {
      nf = 10;
    }
  } else {
    if (f < 1) {
      nf = 1;
    } else if (f < 2) {
      nf = 2;
    } else if (f < 3) {
      nf = 3;
    } else if (f < 5) {
      nf = 5;
    } else {
      nf = 10;
    }
  }

  val = nf * exp10; // Fix 3 * 0.1 === 0.30000000000000004 issue (see IEEE 754).
  // 20 is the uppper bound of toFixed.

  const step = exponent >= -20 ? +val.toFixed(exponent < 0 ? -exponent : 0) : val;

  let result;
  for (let i = splitNumber - 3; i < splitNumber + 3; i++) {
    result = step * i;
    if (result > span) break;
  }

  return result;
};

/**
 * 去掉小数点
 * */
export const roundNumbers = (value: string) => {
  if (!value) return 0;
  return parseFloat(value).toFixed(2);
};

/**
 * @param value 传入的值
 * @param isUnit 是否需要返回单位
 * 获取单位MW
 */
export const getUnitValue = (value: any, isUnit = false, isMw = true) => {
  const unit = isMw ? 'MW' : 'MWh';
  if(/^-?\d+(\.\d+)?$/.test(value)){ // 正则表达式来检查传入的值是否为整数或小数
    const reslut = value ? (value / 1000).toFixed(2) : 0;
    return isUnit ? reslut + unit : reslut;
  } else {
    return isUnit ? '-'+unit : '-';
  }
}

/**
 *
 * @returns 返回单位
 */
export const getUnit = (isMw = true) => {
  return  isMw ? 'MW' : 'MWh';
}


// /**
//  *  @param value 传入的值
//  *  @param isUnit 是否需要返回单位
//  * 获取单位mWh
//  */
// export const getMwhValue = (value, isUnit = false) => {
//   if(/^-?\d+(\.\d+)?$/.test(value)){ // 正则表达式来检查传入的值是否为整数或小数
//     const reslut = value ? (value / 1000).toFixed(2) : 0;
//     return isUnit ? reslut + 'mWh' : reslut;
//   } else {
//     return isUnit ? '-mWh' : '-';
//   }
// }

/**
 * 轮询时间间隔
 * */
export const INTERVALTIME = 1000 * 60 * 1;

