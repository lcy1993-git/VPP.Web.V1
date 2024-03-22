
export const getTableColumns = (devicesType: any) => [
  {
    title: '站点名称',
    dataIndex: 'belongSubstation',
    key: 'belongSubstation',
    align: 'center' as any,
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center' as any,
  },
  {
    title: '设备类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center' as any,
    render: (text: any) => {
      const device = devicesType.find((item: { typeId: any; }) => item.typeId === text);
      return <span>{device?.description || ''}</span>;
    },
  },
  {
    title: '设备厂商',
    dataIndex: 'manufacturer',
    key: 'manufacturer',
    align: 'center' as any,
  },
  {
    title: '设备型号',
    dataIndex: 'deviceModel',
    key: 'deviceModel',
    align: 'center' as any,
  },
  {
    title: '投运日期',
    dataIndex: 'operationDate',
    key: 'operationDate',
    align: 'center' as any,
  },
  {
    title: '质保状态',
    dataIndex: 'isBeforePeriod',
    key: 'isBeforePeriod',
    align: 'center' as any,
    render: (text: any) => {
      const status = ['质保外', '质保内'];
      return <span>{status[text] ? status[text] : ''}</span>;
    },
  },
  {
    title: '设备编码',
    dataIndex: 'deviceNumber',
    key: 'deviceNumber',
    align: 'center' as any,
  },
];
