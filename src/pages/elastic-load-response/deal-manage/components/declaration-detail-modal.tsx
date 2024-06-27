import CustomCharts from '@/components/custom-charts';
import SegmentedTheme from '@/components/segmented-theme';
import { getUserCurve } from '@/services/elastic-load-response/deal-manage';
import { useRequest } from '@umijs/max';
import { Modal, Table } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { capacityColumns, capacityOptions, priceOptions } from '../utils';
interface PropsType {
  open: boolean;
  setOpen: Dispatch<SetStateAction<any>>;
  info: any;
}

// 申报详情容量/价格曲线弹框
const DeclarationDetailModal = (props: PropsType) => {
  const { open, setOpen, info } = props;
  // 曲线/表格
  const [curveOrTable, setCurveOrTable] = useState<boolean>(true);
  // 弹框数据
  const [modalInfo, setModalInfo] = useState<any>(null);

  // 获取表格/曲线数据
  const { run: fetchUserCurve } = useRequest(getUserCurve, {
    manual: true,
    onSuccess: (res) => {
      const dataSource = res?.xaxis.map((timePeriod: string, index: number) => ({
        key: index,
        timePeriod,
        value: res?.valueList[index],
      }));
      if (info.type === 1) {
        setModalInfo({
          title: '申报容量',
          columns: capacityColumns(true),
          options: capacityOptions(res),
          dataSource,
        });
      } else {
        setModalInfo({
          title: '申报价格',
          columns: capacityColumns(false),
          options: priceOptions(res),
          dataSource,
        });
      }
    },
  });

  useEffect(() => {
    if (info) {
      const { type, substationCode, identificationNum } = info;
      fetchUserCurve(identificationNum, substationCode, type);
    }
  }, [info]);

  const handleCancel = () => {
    setOpen(false);
    setCurveOrTable(true);
  };

  return (
    <Modal
      title={modalInfo?.title}
      centered
      width={1000}
      open={open}
      footer={false}
      destroyOnClose
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
        <CustomCharts options={modalInfo?.options} width={952} height={380} />
      ) : (
        <Table
          columns={modalInfo?.columns}
          dataSource={modalInfo?.dataSource}
          rowKey="index"
          size="middle"
          bordered={true}
          scroll={{ y: 340 }}
          pagination={false}
          style={{ height: '380px', paddingTop: '15px' }}
        />
      )}
    </Modal>
  );
};

export default DeclarationDetailModal;
