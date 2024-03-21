//

export const columns = [
  {
    title: '序号',
    dataIndex: '',
    key: 'index',
    width: 60,
    align: 'center' as any,
    render: (_text: any, _record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: '站点名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    align: 'center' as any,
  },
  {
    title: '所属客户',
    dataIndex: 'customer',
    key: 'customer',
    ellipsis: true,
    align: 'center' as any,
  },
  {
    title: '所属省区',
    dataIndex: 'regionName',
    key: 'regionName',
    ellipsis: true,
    align: 'center' as any,
  },
  {
    title: '详细地址',
    dataIndex: 'address',
    key: 'address',
    ellipsis: true,
    align: 'center' as any,
  },
  {
    title: '投运时间',
    dataIndex: 'startUpTime',
    key: 'startUpTime',
    ellipsis: true,
    align: 'center' as any,
  },
  {
    title: '联系人',
    dataIndex: 'contact1',
    key: 'contact1',
    ellipsis: true,
    align: 'center' as any,
  },
  {
    title: '联系电话',
    dataIndex: 'contactPhone1',
    key: 'contactPhone1',
    ellipsis: true,
    align: 'center' as any,
  }
];
