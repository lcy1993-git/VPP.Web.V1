import { addDeclaration } from '@/services/elastic-load-response/deal-manage';
import { useRequest } from '@umijs/max';
import { Input, Table, message } from 'antd';
import { useEffect, useState } from 'react';

// // 新增交易申报
// const addDeclarationColumns = (handleInputChange: any) => {
//   return [
//     {
//       title: '序号',
//       dataIndex: 'index',
//       key: 'index',
//       width: 60,
//       align: 'center' as any,
//       render: (_text: any, _record: any, index: number) => {
//         return index + 1;
//       },
//     },
//     {
//       title: '响应时段起点',
//       dataIndex: 'startTime',
//       align: 'center' as any,
//       key: 'startTime',
//     },
//     {
//       title: '响应时段终点',
//       dataIndex: 'endTime',
//       align: 'center' as any,
//       key: 'endTime',
//     },
//     {
//       title: '基线负荷(MW)',
//       dataIndex: 'baselineLoad',
//       align: 'center' as any,
//       key: 'baselineLoad',
//     },
//     {
//       title: '申报容量(MW)',
//       align: 'center',
//       render: (_, record, index) => (
//         <Input
//           value={record.declaredCapacity || ''}
//           onChange={(e) => handleInputChange(index, 'declaredCapacity', e.target.value)}
//         />
//       ),
//       key: 'declaredCapacity',
//     },
//     {
//       title: '申报价格(元/MWh)',
//       align: 'center',
//       render: (_, record, index) => (
//         <Input
//           value={record.declaredPrice || ''}
//           onChange={(e) => handleInputChange(index, 'declaredPrice', e.target.value)}
//         />
//       ),
//       key: 'declaredPrice',
//     },
//   ];
// };

const CollapseChildren = (props) => {
  //   const [dataSource, setDataSource] = useState<any>([]);
  const { dataSource, saveSubstaionCode } = props;
  // 初始化申报数据数组
  const [declarationData, setDeclarationData] = useState<any>([]);

  useEffect(() => {
    if (dataSource) {
      setDeclarationData(
        dataSource.startTimeList.map((_, index) => ({
          startTime: dataSource.startTimeList[index],
          endTime: dataSource.endTimeList[index],
          baselineLoad: dataSource.baselineLoadList[index],
          declaredCapacity: '',
          declaredPrice: '',
        })),
      );
    }
  }, [dataSource]);

  const { run: fetchAddDeclaration } = useRequest(addDeclaration, {
    manual: true,
  });

  // 处理输入改变
  const handleInputChange = (
    index: number,
    field: keyof (typeof declarationData)[0],
    value: string,
  ) => {
    setDeclarationData((prevData) =>
      prevData.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  // 保存处理函数
  const handleSave = () => {
    // 确保所有输入都有值
    const allFilled = declarationData.every((item) => item.declaredCapacity && item.declaredPrice);
    if (allFilled) {
      const capacities = declarationData.map((item) => item.declaredCapacity);
      const prices = declarationData.map((item) => item.declaredPrice);
      fetchAddDeclaration({
        substationCode: saveSubstaionCode,
        declaredPriceList: prices,
        declaredCapacityList: capacities,
      });
    } else {
      message.error('请确保所有申报容量和申报价格都已填写！');
    }
  };

  useEffect(() => {
    if (saveSubstaionCode) handleSave();
  }, [saveSubstaionCode]);

  const addDeclarationColumns = [
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '基线负荷',
      dataIndex: 'baselineLoad',
      key: 'baselineLoad',
    },
    {
      title: '申报容量',
      render: (_, record, index) => (
        <Input
          value={record.declaredCapacity}
          type="number"
          onChange={(e) => handleInputChange(index, 'declaredCapacity', e.target.value)}
        />
      ),
      key: 'declaredCapacity',
    },
    {
      title: '申报价格',
      render: (_, record, index) => (
        <Input
          value={record.declaredPrice}
          type="number"
          onChange={(e) => handleInputChange(index, 'declaredPrice', e.target.value)}
        />
      ),
      key: 'declaredPrice',
    },
  ];

  return (
    <>
      <Table dataSource={declarationData} columns={addDeclarationColumns} pagination={false} />
      {/* <Button type="primary" onClick={handleSave}>
        保存
      </Button> */}
    </>
  );
};

export default CollapseChildren;
