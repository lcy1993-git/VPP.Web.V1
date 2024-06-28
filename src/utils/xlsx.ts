import * as XLSX from 'xlsx';
//导出
function workbook2blob(workbook: any) {
  // 生成excel的配置项
  let wopts = {
    // 要生成的文件类型
    bookType: 'xlsx',
    // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    bookSST: false,
    type: 'binary',
  };
  let wbout = XLSX.write(workbook, wopts as any);
  // 将字符串转ArrayBuffer
  function s2ab(s: any) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  let blob = new Blob([s2ab(wbout)], {
    type: 'application/octet-stream',
  });
  return blob;
}

// 将blob对象创建bloburl，然后用a标签实现弹出下载框
function openDownloadDialog(blob: any, fileName: any) {
  let aLink = document.createElement('a');
  if (typeof blob === 'object' && blob instanceof Blob) {
    // blob = URL.createObjectURL(blob); // 创建blob地址
    aLink.href = URL.createObjectURL(blob); // 创建blob地址
  }

  // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，有时候 file:///模式下不会生效
  aLink.download = fileName || '';
  let event;
  if (window.MouseEvent) event = new MouseEvent('click');
  //   移动端
  else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null,
    );
  }
  aLink.dispatchEvent(event);
}

// staticInfoRows可在数据数组前添加其他行信息
export const exportExcel = (data: any[], title: string, staticInfoRows: any[] = []) => {
  let sheetDataFromJson = XLSX.utils.json_to_sheet(data, { header: [] });
  // 合并静态信息行和动态数据到一个新的数组
  let combinedData = staticInfoRows.concat(
    XLSX.utils.sheet_to_json(sheetDataFromJson, { header: 1 }),
  );
  // 使用合并后的数据创建一个新的工作表
  let combinedSheet = XLSX.utils.aoa_to_sheet(combinedData);
  let wb = XLSX.utils.book_new();
  // 将合并后的工作表添加到工作簿
  XLSX.utils.book_append_sheet(wb, combinedSheet, title);
  const workbookBlob = workbook2blob(wb);
  openDownloadDialog(workbookBlob, `${title}.xlsx`);
};
