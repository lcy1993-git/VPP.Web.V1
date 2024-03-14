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

export const exportExcel = (data: any[], title: string) => {
  /* create a new blank workbook */
  let wb = XLSX.utils.book_new();
  let sheet1 = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, sheet1, title);
  const workbookBlob = workbook2blob(wb);
  openDownloadDialog(workbookBlob, `${title}.xlsx`);
};
