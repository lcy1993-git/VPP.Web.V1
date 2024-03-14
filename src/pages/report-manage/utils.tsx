const reportType: any = { day: '日报', month: '月报', year: '年报' };
export const columns = [
  {
    title: '序号',
    dataIndex: '',
    key: 'index',
    width: 100,
    align: 'center' as any,
    render: (_text: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '报表类型',
    ellipsis: true,
    align: 'center' as any,
    render: (text: any) => reportType[text.timeType],
  },
  {
    title: '报表名称',
    dataIndex: 'templateName',
    key: 'templateName',
    ellipsis: true,
    align: 'center' as any,
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
    key: 'createBy',
    ellipsis: true,
    align: 'center' as any,
  },
  {
    title: '创建时间',
    ellipsis: true,
    align: 'center' as any,
    render: (text: any) => text.createTime.split(' ')[0],
  },
];

export // 处理表头和表格数据
const handleTable = (data: any) => {
  // 获取所有时间点
  let timeDataMap = data[0].timeDataMap;
  if (Object.keys(timeDataMap).length === 0) {
    // 如果timeDataMap为空，则使用data中第一个非空对象的timeDataMap
    for (let i = 1; i < data.length; i++) {
      if (Object.keys(data[i].timeDataMap).length > 0) {
        timeDataMap = data[i].timeDataMap;
        break;
      }
    }
  }
  const dates = Object.keys(timeDataMap);
  // 构建表头数据
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      align: 'center',
    },
    ...data.map(({ fieldDesc, fieldUnit }: { fieldDesc: string; fieldUnit: string }) => ({
      title: (
        <>
          <span>
            {fieldDesc} {fieldUnit ? `(${fieldUnit})` : ''}
          </span>
        </>
      ),
      dataIndex: fieldDesc + '(' + fieldUnit + ')',
      key: fieldDesc + '(' + fieldUnit + ')',
      align: 'center',
      width: 150,
      render: (value: any) => (
        <div>
          {!isNaN(value)
            ? fieldUnit === '%'
              ? (parseFloat(value) * 100)?.toFixed(2) + '%'
              : parseFloat(value)?.toFixed(2)
            : ''}
        </div>
      ),
    })),
  ];
  // 构建表格数据
  const dataSource = dates.map((date) => {
    const rowData = { date };
    data.forEach(
      ({
        timeDataMap,
        fieldDesc,
        fieldUnit,
      }: {
        timeDataMap: any;
        fieldDesc: string;
        fieldUnit: string;
      }) => {
        rowData[fieldDesc + '(' + fieldUnit + ')'] = timeDataMap[date];
      },
    );
    console.log(rowData);

    return rowData;
  });
  return { columns, dataSource };
};
