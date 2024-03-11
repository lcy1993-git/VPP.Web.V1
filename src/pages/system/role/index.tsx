import ContentComponent from '@/components/content-component';
import ContentPage from '@/components/content-page';
import CustomItem from '@/components/custom-Item';
import GeneralTable from '@/components/general-table';

import { addRole, deleteRole, updateRole } from '@/services/system/role';
import { PlusCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Space } from 'antd';
import { useRef, useState } from 'react';
import AddRoleForm from './components/add-form';

import type { FormInstance } from 'antd/es/form';

const SystemRole = () => {
  // 控制添加角色modal是否展示
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  // 控制编辑角色modal是否展示
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  // 当前编辑的角色项id
  const [currentEditId, setCurrentEditId] = useState<any[]>([]);
  // 添加编辑角色时选择的菜单数组
  const [chooseKeys, setChooseKeys] = useState<string[] | undefined>([]);

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
  //编辑 角色项
  const editEvent = (record: any) => {
    editForm.setFieldsValue(record);
    setCurrentEditId(record.id);
    setChooseKeys(record?.menuIds);
    setEditModalVisible(true);
  };

  //删除角色项
  const deleteEvent = async (id: string) => {
    await deleteRole(id)
      .then((res: any) => {
        if (res.code === 10000) {
          message.error(res.message);
          return;
        }
        message.success('删除成功');
        refresh();
      })
      .catch(() => { });
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'description',
      key: 'description',
      align: 'center' as any,
      render: (text: any, record: any, index: any) => {
        return <span>{index + 1}</span>;
      },
    },

    {
      title: '权限ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center' as any,
    },
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as any,
    },
    {
      title: '权限描述',
      dataIndex: 'nickName',
      key: 'nickName',
      align: 'center' as any,
    },

    // {
    //   title: '更新时间',
    //   dataIndex: 'updateTime',
    //   key: 'updateTime',
    //   align: 'center' as any,
    // },
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
              title="删除角色"
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

  // 角色数据查询按钮点击事件
  const searchEvent = () => {
    searchForm.validateFields().then(async (values) => {
      if (tableRef && tableRef.current) {
        //@ts-ignore
        tableRef.current.searchByParams({ ...values, userId }, true);
      }
    });
  };
  // 角色数据重置按钮点击事件
  const resetEvent = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.searchByParams({ userId }, true);
      searchForm.resetFields();
    }
  };

  //添加角色项
  const sureAddRole = () => {
    // 接口要求菜单权限项为必填，在此校验
    if (chooseKeys?.length === 0) {
      message.warning('请选择菜单权限！');
      return;
    }
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
        { menuIds: chooseKeys },
      );

      await addRole(submitInfo);
      message.success('添加成功');
      refresh();
      setAddModalVisible(false);
      addForm.resetFields();
    });
  };
  //编辑角色项
  const sureEditRole = async () => {
    // 接口要求菜单权限项为必填，在此校验
    if (chooseKeys?.length === 0) {
      message.warning('请选择菜单权限！');
      return;
    }
    editForm.validateFields().then(async (values: any) => {
      const menuIds = chooseKeys?.filter(item => item)
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
        { menuIds: menuIds },
      );

      await updateRole(submitInfo);
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
            {/* <Col>
              <CustomItem label="权限ID" align="right" labelWidth={90} name="id">
                <Input placeholder="请输入权限ID" />
              </CustomItem>
            </Col> */}
            <Col>
              <CustomItem label="权限描述" labelWidth={80} name="nickName">
                <Input placeholder="请输入权限描述" autoComplete="off" />
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
                <Button
                  onClick={() => {
                    setAddModalVisible(true);
                    setChooseKeys([]);
                  }}
                >
                  <PlusCircleOutlined />
                  新增
                </Button>
                {/* <Button onClick={() => console.log('down')}>
                  <PlusCircleOutlined />
                  下载
                </Button> */}
              </Space>
            </Col>
          </Row>
        </Form>
      </>
    );
  };
  return (
    <ContentPage>
      <ContentComponent title="角色管理" renderSearch={searchArea}>
        <GeneralTable
          url="/sysApi/sysrole/getSysRolePageList"
          ref={tableRef}
          columns={columns}
          rowKey="id"
          hideSelect
          size="middle"
          bordered={false}
          requestType="post"
          filterParams={{ userId }}
          hasPage={true}
        />
        <Modal
          width={800}
          destroyOnClose
          centered
          maskClosable={false}
          title="添加角色"
          open={addModalVisible}
          onCancel={() => setAddModalVisible(false)}
          onOk={() => sureAddRole()}
        >
          <Form form={addForm}>
            <AddRoleForm form={addForm} chooseKeys={chooseKeys} setChooseKeys={setChooseKeys} />
          </Form>
        </Modal>

        <Modal
          width={800}
          destroyOnClose
          centered
          maskClosable={false}
          title="编辑角色"
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            addForm.resetFields();
          }}
          onOk={() => sureEditRole()}
        >
          <Form form={editForm}>
            <AddRoleForm form={editForm} chooseKeys={chooseKeys} setChooseKeys={setChooseKeys} />
          </Form>
        </Modal>
      </ContentComponent>
    </ContentPage>
  );
};
export default SystemRole;
