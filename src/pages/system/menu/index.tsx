import ContentComponent from '@/components/content-component';
import ContentPage from '@/components/content-page';
import CustomItem from '@/components/custom-Item';
import GeneralTable from '@/components/general-table';
import { addMenu, deleteMenu, updateMenu } from '@/services/system/menu';
import {
  ColumnHeightOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Popconfirm, Row, Select, Space, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { useRef, useState } from 'react';
import AddMenuForm from './components/add-menu';
// import IconSymbol from './components/IconSymbol';

const SystemMenu: React.FC = () => {
  // 控制添加菜单modal是否展示
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  // 控制编辑菜单modal是否展示
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  // 当前编辑的菜单项id
  const [currentEditId, setCurrentEditId] = useState<any[]>([]);
  // 是否展开
  const [isExpand, setIsExpand] = useState<boolean>(false);

  // 表格Ref
  const tableRef = useRef(null);
  // 搜索form
  const [searchForm] = Form.useForm<FormInstance>();
  // 添加form
  const [addForm] = Form.useForm<FormInstance>();
  // 编辑form
  const [editForm] = Form.useForm<FormInstance>();
  const userId = localStorage.getItem('userId');

  // 刷新table数据
  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.refresh();
    }
  };
  //编辑 菜单项
  const editEvent = (record: any) => {
    editForm.setFieldsValue({ ...record, parentId: record.parentId ? record.parentId : '0' });
    setCurrentEditId(record.id);

    setEditModalVisible(true);
  };

  //删除菜单项
  const deleteEvent = async (id: string) => {
    await deleteMenu(id)
      .then((res: any) => {
        if (res.code === 10000) {
          message.error(res.message);
          return;
        }
        message.success('删除成功');
        refresh();
      })
      .catch(() => {});
  };
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as any,
      width: 320,
    },
    {
      title: '菜单路由',
      dataIndex: 'path',
      key: 'path',
      align: 'center' as any,
      width: 320,
    },
    {
      title: '权限代码',
      dataIndex: 'params',
      key: 'params',
      align: 'center' as any,
    },
    {
      title: '菜单图标',
      dataIndex: 'icon',
      key: 'icon',
      align: 'center' as any,
      render: (text: any) => {
        return <i className={`iconfont ${text}`}></i>;
      },
    },
    {
      title: '菜单状态',
      dataIndex: 'status',
      key: 'path',
      align: 'center' as any,
      render: (text: any, record: any) => {
        return <span>{record.status === 0 ? '停用' : '正常'}</span>;
      },
    },
    {
      title: '显示排序',
      dataIndex: 'indexNumber',
      key: 'indexNumber',
      align: 'center' as any,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center' as any,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center' as any,
      render: (text: any, record: any) => {
        return (
          <Space>
            <Button onClick={() => editEvent(record)} size="small">
              修改
            </Button>
            <Popconfirm
              title="删除菜单"
              description="是否确定删除？"
              onConfirm={() => deleteEvent(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button size="small">删除</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // 菜单数据查询按钮点击事件
  const searchEvent = () => {
    searchForm.validateFields().then(async (values) => {
      if (tableRef && tableRef.current) {
        //@ts-ignore
        tableRef.current.searchByParams(
          { name: values.menuName, status: values.menuStatus, userId },
          false,
        );
      }
    });
  };
  // 菜单数据重置按钮点击事件
  const resetEvent = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.searchByParams({ userId }, false);
      searchForm.resetFields();
    }
  };
  // 菜单数据展开/折叠按钮点击事件
  const expandOrFold = () => {
    setIsExpand(!isExpand);
    if (isExpand) {
      if (tableRef && tableRef.current) {
        //@ts-ignore
        tableRef.current.foldTable();
      }
    } else {
      if (tableRef && tableRef.current) {
        //@ts-ignore
        tableRef.current.expandTable();
      }
    }
  };

  //添加菜单项
  const sureAddMenu = () => {
    addForm.validateFields().then(async (value: any) => {
      const submitInfo = Object.assign(
        {
          parentId: '',
          indexNumber: '',
          type: '',
          status: 0,
          name: '',
          path: '',
          remark: '',
          createBy: localStorage.getItem('userName'),
          ...value,
        },
        {
          parentId: value?.parentId === '0' ? null : value?.parentId,
        },
      );

      await addMenu(submitInfo);
      message.success('添加成功');
      refresh();
      setAddModalVisible(false);
      addForm.resetFields();
    });
  };
  //编辑菜单项
  const sureEditMenu = async () => {
    editForm.validateFields().then(async (values: any) => {
      const submitInfo = Object.assign(
        {
          id: currentEditId,
          parentId: '',
          indexNumber: '',
          type: '',
          status: 0,
          name: '',
          path: '',
          remark: '',
          ...values,
        },
        {
          parentId: values?.parentId === '0' ? null : values?.parentId,
        },
      );
      await updateMenu(submitInfo);
      refresh();
      message.success('修改成功');
      addForm.resetFields();
      setEditModalVisible(false);
    });
  };
  // 搜索栏tsx
  const searchArea = () => {
    return (
      <>
        <Form form={searchForm}>
          <Row gutter={48}>
            <Col>
              <CustomItem label="菜单名称" align="right" labelWidth={90} name="menuName">
                <Input placeholder="请输入菜单名称" autoComplete="off" />
              </CustomItem>
            </Col>
            <Col>
              <CustomItem label="菜单状态" labelWidth={80} name="menuStatus">
                <Select
                  placeholder="请选择菜单状态"
                  allowClear
                  options={[
                    { label: '正常', value: 1 },
                    { label: '停用', value: 0 },
                  ]}
                />
              </CustomItem>
            </Col>
            <Col>
              <Space size={20} align="baseline">
                <Button onClick={searchEvent}>
                  <SearchOutlined />
                  查询
                </Button>
                <Button onClick={resetEvent}>
                  <ReloadOutlined />
                  重置
                </Button>
                <Button onClick={() => setAddModalVisible(true)}>
                  <PlusCircleOutlined />
                  新增
                </Button>
                <Button onClick={expandOrFold}>
                  <ColumnHeightOutlined />
                  展开/折叠
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </>
    );
  };
  return (
    <ContentPage>
      <ContentComponent title="菜单管理" renderSearch={searchArea}>
        <GeneralTable
          url="/api/sysmenu/getAllMenus"
          ref={tableRef}
          columns={columns}
          rowKey="id"
          hideSelect
          size="middle"
          bordered={false}
          requestType="get"
          filterParams={{ userId }}
          hasPage={false}
        />
        <Modal
          width={800}
          destroyOnClose
          centered
          maskClosable={false}
          title="添加菜单"
          open={addModalVisible}
          onCancel={() => setAddModalVisible(false)}
          onOk={() => sureAddMenu()}
        >
          <Form form={addForm}>
            <AddMenuForm form={addForm} />
          </Form>
        </Modal>

        <Modal
          width={800}
          destroyOnClose
          centered
          maskClosable={false}
          title="编辑菜单"
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            addForm.resetFields();
          }}
          onOk={() => sureEditMenu()}
        >
          <Form form={editForm}>
            <AddMenuForm form={editForm} />
          </Form>
        </Modal>
      </ContentComponent>
    </ContentPage>
  );
};
export default SystemMenu;
