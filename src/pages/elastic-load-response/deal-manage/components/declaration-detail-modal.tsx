import CustomCharts from '@/components/custom-charts';
import GeneralTable from '@/components/general-table';
import SegmentedTheme from '@/components/segmented-theme';
import { Modal } from 'antd';
import { Dispatch, SetStateAction } from 'react';

interface PropsType {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<any>>;
  options: any;
  curveOrTable: boolean;
  setCurveOrTable: Dispatch<SetStateAction<any>>;
  title: string;
  columns: any;
  dataSource: any;
}

// 申报详情容量/价格曲线弹框
const DeclarationDetailModal = (props: PropsType) => {
  const {
    visible,
    setVisible,
    options,
    setCurveOrTable,
    curveOrTable,
    title,
    columns,
    dataSource,
  } = props;

  const handleCancel = () => {
    setVisible(false);
    // setCurveOrTable(true);
  };

  return (
    <Modal
      title={title}
      centered
      width={1000}
      open={visible}
      footer={false}
      onCancel={handleCancel}
    >
      <div style={{ textAlign: 'end' }}>
        <SegmentedTheme
          options={[
            { label: '曲线', value: '曲线', icon: <i className="iconfont">&#xe63a;</i> },
            { label: '表格', value: '表格', icon: <i className="iconfont">&#xe639;</i> },
          ]}
          getSelectedValue={(value: string) => setCurveOrTable(value === '曲线')}
        />
      </div>
      {curveOrTable ? (
        <CustomCharts options={options} width={952} height={380} />
      ) : (
        <GeneralTable
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          size="middle"
          hideSelect
          bordered={false}
          scroll={{ y: 340 }}
          hasPage={false}
          style={{ height: '380px', paddingTop: '15px' }}
        />
      )}
    </Modal>
  );
};

export default DeclarationDetailModal;
