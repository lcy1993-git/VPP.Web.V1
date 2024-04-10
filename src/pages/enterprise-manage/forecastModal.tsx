import { MinusCircleOutlined, MinusOutlined, PlusOutlined, WalletOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Space, Table } from 'antd';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './index.less';
import Empty from '@/components/empty';
import { ValueType } from 'rc-input/lib/interface';

interface currentInfo {
  setIsForecastModalOpen: Dispatch<SetStateAction<boolean>>; // 修改模态框状态
  isForecastModalOpen: boolean; // 模态框状态
  setForecastList: Dispatch<SetStateAction<any>>; // 操作成功后刷新数据
  substationCode: string;
  forecastList: any;
  modalStatus: 'detail' | 'edit' | 'add' | null; // 该页面是否为编辑、详情
  forecastType: boolean;
}
const monthColums = ['April', 'August', 'December', 'February', 'January', 'July', 'June', 'March', 'May', 'November', 'October', 'September'];

const ForecastModal = (props: currentInfo) => {
  const { isForecastModalOpen, setIsForecastModalOpen, setForecastList, substationCode, forecastList, modalStatus, forecastType } = props;

  const [dataSource, setDataSource] = useState<any>([]);

  useEffect(() => {
    const transformData = (dataList: any[], unit: string | number) => {
      if (dataList && dataList.length !== 0) {
        const result = dataList.map((item) => {
          const { id, substationCode, type, year, forecastJson } = item;
          // 将forecastJson字符串解析为数字数组
          const forecastArray = JSON.parse(forecastJson);
          return {
            id,
            substationCode,
            type,
            year: year + unit,
            January: forecastArray[0],
            February: forecastArray[1],
            March: forecastArray[2],
            April: forecastArray[3],
            May: forecastArray[4],
            June: forecastArray[5],
            July: forecastArray[6],
            August: forecastArray[7],
            September: forecastArray[8],
            October: forecastArray[9],
            November: forecastArray[10],
            December: forecastArray[11],
          };
        });
        setDataSource(result)
      } else {
        if (modalStatus === 'detail') {
          setDataSource([]);
        } else {
          setDataSource([{ year: new Date().getFullYear().toString() + unit, January: '', February: '', March: '', April: '', May: '', June: '', July: '', August: '', September: '', October: '', November: '', December: '' }])
        }
      }
    }
    if (Object.keys(forecastList).length !== 0) {
      // 收入
      if (forecastType) {
        transformData(forecastList.incomeList, '(万元)');
      } else {
        transformData(forecastList.powerList, '(MWh)');
      }
    }
  }, [forecastList, isForecastModalOpen])

  // 输入框变化
  const handleInputChange = (e: any, key: any, columnName: string) => {
    const updatedData = dataSource.map((row: any) => {
      if (row.year === key) {
        return {
          ...row,
          [columnName]: e.target.value,
        };
      }
      return row;
    });

    setDataSource(updatedData);
  };

  // 检查开关机时间是否填写完整
  const isCompleteTable = () => {
    const lastRow = dataSource[dataSource.length - 1];
    for (let key in lastRow) {
      if (key !== 'year' && lastRow[key] === '') {
        lastRow[key] = 0;
      }
    }
  }

  // 保存
  const handleSave = () => {
    isCompleteTable();
    const dataList = dataSource.map((item: any) => {
      const forecastProps = Object.keys(item).filter(prop => prop !== 'id' && prop !== 'substationCode' && prop !== 'type' && prop !== 'year');
      const forecastValues = forecastProps.map(prop => parseFloat(item[prop]));
      const forecastArray = forecastValues.length > 0 ? forecastValues : null;
      return {
        forecastJson: JSON.stringify(forecastArray || []),
        type: forecastType ? 0 : 1, // 根据实际情况设置type
        year: parseInt(item.year), // 根据实际情况设置year
        substationCode
      };
    });

    let res: any = {};
    if (forecastType) res = { incomeList: dataList, powerList: forecastList.powerList };
    else res = { incomeList: forecastList.incomeList, powerList: dataList };
    setForecastList(res);
    setIsForecastModalOpen(false);
  }

  // 增加表格行数
  const addRow = () => {
    // 增加第一行
    if (dataSource.length === 0) {
      setDataSource([{ year: new Date().getFullYear() + '(' + (forecastType ? '万元' : 'MWh') + ')', January: '', February: '', March: '', April: '', May: '', June: '', July: '', August: '', September: '', October: '', November: '', December: '' }]);
      return;
    }
    // 最后一行填写完整
    isCompleteTable();
    const year = Number(dataSource[dataSource.length - 1].year.split('(')[0]) + 1;
    const newRow = { year: year + '(' + (forecastType ? '万元' : 'MWh') + ')', January: '', February: '', March: '', April: '', May: '', June: '', July: '', August: '', September: '', October: '', November: '', December: '' };
    setDataSource([...dataSource, newRow]);
  }

  // 删除行
  const handleDeleteRow = () => {
    const newData = [...dataSource]; // 创建副本，避免直接修改原始数组
    newData.pop(); // 删除最后一个元素
    setDataSource(newData);
  }

  const columns = [
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
      align: 'center' as any,
      width: 130,
      render: (text: ValueType) => (
        <Input
          value={text}
          style={{ textAlign: 'center' }}
          disabled={modalStatus === 'detail'}
        />
      ),
    },
    {
      title: '1月',
      align: 'center' as any,
      dataIndex: 'January',
      key: 'January',
      render: (text: ValueType, record: { year: any; }) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(e, record.year, 'January')}
          style={{ textAlign: 'center' }}
          disabled={modalStatus === 'detail'}
        />
      ),
    },
    {
      title: '2月',
      dataIndex: 'February',
      align: 'center' as any,
      key: 'February',
      render: (text: ValueType, record: { year: any; }) => (
        <Input
          value={text}
          style={{ textAlign: 'center' }}
          disabled={modalStatus === 'detail'}
          onChange={(e) => handleInputChange(e, record.year, 'February')}
        />
      ),
    }, {
      title: '3月',
      dataIndex: 'March',
      align: 'center' as any,
      key: 'March',
      render: (text: ValueType, record: { year: any; }) => (
        <Input
          value={text}
          style={{ textAlign: 'center' }}
          disabled={modalStatus === 'detail'}
          onChange={(e) => handleInputChange(e, record.year, 'March')}
        />
      ),
    }, {
      title: '4月',
      dataIndex: 'April',
      key: 'April',
      align: 'center' as any,
      render: (text: ValueType, record: { year: any; }) => (
        <Input
          value={text}
          style={{ textAlign: 'center' }}
          disabled={modalStatus === 'detail'}
          onChange={(e) => handleInputChange(e, record.year, 'April')}
        />
      ),
    }, {
      title: '5月',
      dataIndex: 'May',
      key: 'May',
      align: 'center' as any,
      render: (text: ValueType, record: { year: any; }) => (
        <Input
          style={{ textAlign: 'center' }}
          value={text}
          disabled={modalStatus === 'detail'}
          onChange={(e) => handleInputChange(e, record.year, 'May')}
        />
      ),
    }, {
      title: '6月',
      dataIndex: 'June',
      key: 'June',
      align: 'center' as any,
      render: (text: ValueType, record: { year: any; }) => (
        <Input
          value={text}
          style={{ textAlign: 'center' }}
          disabled={modalStatus === 'detail'}
          onChange={(e) => handleInputChange(e, record.year, 'June')}
        />
      ),
    }, {
      title: '7月',
      dataIndex: 'July',
      key: 'July',
      align: 'center' as any,
      render: (text: ValueType, record: { year: any; }) => (
        <Input
          value={text}
          style={{ textAlign: 'center' }}
          disabled={modalStatus === 'detail'}
          onChange={(e) => handleInputChange(e, record.year, 'July')}
        />
      ),
    }, {
      title: '8月',
      dataIndex: 'August',
      key: 'August',
      align: 'center' as any,
      render: (text: ValueType, record: { year: any; }) => (
        <Input
          value={text}
          style={{ textAlign: 'center' }}
          disabled={modalStatus === 'detail'}
          onChange={(e) => handleInputChange(e, record.year, 'August')}
        />
      ),
    }, {
      title: '9月',
      dataIndex: 'September',
      key: 'September',
      align: 'center' as any,
      render: (text: ValueType, record: { year: any; }) => (
        <Input
          value={text}
          style={{ textAlign: 'center' }}
          disabled={modalStatus === 'detail'}
          onChange={(e) => handleInputChange(e, record.year, 'September')}
        />
      ),
    }, {
      title: '10月',
      dataIndex: 'October',
      key: 'October',
      align: 'center' as any,
      render: (text: ValueType, record: { year: any; }) => (
        <Input
          value={text}
          style={{ textAlign: 'center' }}
          disabled={modalStatus === 'detail'}
          onChange={(e) => handleInputChange(e, record.year, 'October')}
        />
      ),
    }, {
      title: '11月',
      dataIndex: 'November',
      key: 'November',
      align: 'center' as any,
      render: (text: ValueType, record: { year: any; }) => (
        <Input
          value={text}
          style={{ textAlign: 'center' }}
          disabled={modalStatus === 'detail'}
          onChange={(e) => handleInputChange(e, record.year, 'November')}
        />
      ),
    },
    {
      title: '12月',
      dataIndex: 'December',
      key: 'December',
      align: 'center' as any,
      render: (text: ValueType, record: { year: any; }) => (
        <Input
          value={text}
          style={{ textAlign: 'center' }}
          disabled={modalStatus === 'detail'}
          onChange={(e) => handleInputChange(e, record.year, 'December')}
        />
      ),
    },
    {
      title: '总计',
      dataIndex: 'total',
      key: 'total',
      align: 'center' as any,
      render: (text: any, record: { [x: string]: any; }) => {
        const total = Object.keys(record)
          .filter(key => monthColums.includes(key))
          .reduce((acc, month) => acc + parseFloat(record[month] || 0), 0);
        return (
          <Input
            value={total}
            style={{ textAlign: 'center' }}
            disabled={true}
          />
        );
      }
    },
  ];

  return <>
    <Modal title={forecastType ? '预计收益录入' : '预计电量录入'}
      open={isForecastModalOpen}
      width={1500}
      footer={false}
      centered
      closeIcon={null}
      zIndex={2000}
      onCancel={() => setIsForecastModalOpen(false)}
    >
      <div className={styles.modalContainer}>
      <div className={styles.modalContainerBody}>
        <div style={{overflowY: 'auto'}}>
          <Table
            columns={columns}
            dataSource={dataSource}
            locale={{ emptyText: <div style={{ marginTop: 25 }}><Empty /> </div> }}
            pagination={false}
            scroll={{
              y: 220
            }}
            className="table1"
          />
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            {modalStatus === 'edit' ? <Space>
              <Button
                size="middle"
                onClick={handleDeleteRow}
              >
                <MinusOutlined />
              </Button>
              <Button size="middle" onClick={addRow}>
                <PlusOutlined />
              </Button>
            </Space> : <></>}
          </div>
        </div>
      </div>
      <div className={styles.modalFooter}>
        <Space size={40}>
          {
            modalStatus === 'detail' ? <Button onClick={() => { setIsForecastModalOpen(false); }}>返回</Button> : <>
              <Button icon={<WalletOutlined />} onClick={handleSave}>保存</Button>
              <Button icon={<MinusCircleOutlined />} onClick={() => { setIsForecastModalOpen(false); }}>返回</Button>
            </>
          }
        </Space>
      </div>
      </div>
    </Modal>
  </>;
};

export default ForecastModal;
