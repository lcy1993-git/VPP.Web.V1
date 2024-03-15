import ColorCircleScript from '@/components/color-circle-script';
import { ALARMCOLORANDSCRIPT, EVENTSTATUSCOLORANDSCRIPT } from '@/utils/enum';
import { Tooltip } from 'antd';

export const fetchColumns = (handleViewClick: any) => {
  return [
    {
      title: '发生时间',
      dataIndex: 'date',
      key: 'date',
      align: 'center' as any,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="right" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '企业名称',
      dataIndex: 'subStationName',
      key: 'subStationName',
      align: 'center' as any,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="right" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      align: 'center' as any,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="right" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '事项名称',
      dataIndex: 'eventName',
      key: 'eventName',
      align: 'center' as any,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="right" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '事项状态',
      dataIndex: 'eventStatus',
      key: 'eventStatus',
      align: 'center' as any,
      render: (text: any) => {
        const color = EVENTSTATUSCOLORANDSCRIPT[text].color;
        const script = EVENTSTATUSCOLORANDSCRIPT[text].script;
        return (
          <div>
            <ColorCircleScript color={color} script={script} />
          </div>
        );
      },
    },
    {
      title: '告警等级',
      dataIndex: 'eventLevel',
      key: 'eventLevel',
      align: 'center' as any,
      render: (text: any) => {
        const color = ALARMCOLORANDSCRIPT?.[text]?.color;
        const script = ALARMCOLORANDSCRIPT?.[text]?.script;
        return (
          <div>
            <ColorCircleScript color={color} script={script} />
          </div>
        );
      },
    },
    {
      title: '处理方式',
      dataIndex: 'adviceList',
      key: 'adviceList',
      align: 'center' as any,
      ellipsis: true,
      width: 120,
      render: (text: string) => {
        if (text === 'undefined') {
          return <span></span>;
        }
        return (
          <Tooltip placement="left" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '处理人',
      dataIndex: 'dealPeople',
      key: 'dealPeople',
      align: 'center' as any,
    },
    {
      title: '处理图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      align: 'center' as any,
      render: (text: any, record: any) => {
        return record?.imageUrl ? (
          <div
            key={record.id}
            style={{ color: '#0190FF', cursor: 'pointer' }}
            onClick={() => {
              handleViewClick(record?.imageUrl);
            }}
          >
            查看
          </div>
        ) : (
          <span>暂无图片</span>
        );
      },
    },
    {
      title: '处理时间',
      dataIndex: 'dealTime',
      key: 'dealTime',
      align: 'center' as any,
      ellipsis: true,
      render: (text: string) => {
        return (
          <Tooltip placement="left" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
  ];
};
