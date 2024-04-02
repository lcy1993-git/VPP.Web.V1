import ColorCircleScript from '@/components/color-circle-script';
import { ALARMCOLORANDSCRIPT, EVENTSTATUSCOLORANDSCRIPT } from '@/utils/enum';
import { Tooltip } from 'antd';

export const columns = [
  {
    title: '发生时间',
    dataIndex: 'date',
    key: 'date',
    align: 'center' as any,
    ellipsis: true,
  },
  {
    title: '企业名称',
    dataIndex: 'subStationName',
    key: 'subStationName',
    align: 'center' as any,
    ellipsis: true,
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    key: 'deviceName',
    align: 'center' as any,
    ellipsis: true,
  },
  {
    title: '事项名称',
    dataIndex: 'eventName',
    key: 'eventName',
    align: 'center' as any,
    ellipsis: true,
  },
  {
    title: '事项状态',
    dataIndex: 'eventStatus',
    key: 'eventStatus',
    align: 'center' as any,
    ellipsis: true,
    render: (text: any) => {
      const color = EVENTSTATUSCOLORANDSCRIPT[text]?.color || '';
      const script = EVENTSTATUSCOLORANDSCRIPT[text]?.script || '';
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
    ellipsis: true,
    align: 'center' as any,
    render: (text: any) => {
      const color = ALARMCOLORANDSCRIPT[text]?.color || '';
      const script = ALARMCOLORANDSCRIPT[text]?.script || '';
      return (
        <div>
          <ColorCircleScript color={color} script={script} />
        </div>
      );
    },
  },
  {
    title: '事项类型',
    dataIndex: 'eventType',
    key: 'eventType',
    align: 'center' as any,
  },
  {
    title: '运维建议',
    dataIndex: 'adviceList',
    key: 'adviceList',
    align: 'center' as any,
    ellipsis: true,
    width: 400,
    render: (text: any) => {
      const advice = text
        .map((item: any, index: number) => {
          return item?.dealAdvice ? `${index + 1}.${item?.dealAdvice}` : '';
        })
        .join('、');
      return (
        <Tooltip placement="right" title={advice}>
          <span>{advice}</span>
        </Tooltip>
      );
    },
  },
];
