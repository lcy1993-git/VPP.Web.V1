import ContentComponent from '@/components/content-component';
import ContentPage from '@/components/content-page';
import CustomItem from '@/components/custom-Item';
import GeneralTable from '@/components/general-table';
import { addUser, deleteUser, resetAuthPasswordByAdmin, updateUser } from '@/services/system/user';
import { PlusCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import md5 from 'js-md5';
import moment from 'moment';
import { useRef, useState } from 'react';
import AddMenuForm from './components/add-form';
import ResetForm from './components/reset-form';
const SystemUser = () => {
  // 控制添加用户modal是否展示
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  // 控制编辑用户modal是否展示
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  // 控制重置密码modal是否展示
  const [resetFormVisible, setResetFormVisible] = useState<boolean>(false);
  // 控制重置审批密码modal是否展示
  const [resetApprovalFormVisible, setResetApprovalFormVisible] = useState<boolean>(false);

  // 当前编辑的用户项id
  const [currentEditId, setCurrentEditId] = useState<any[]>([]);

  // 表格Ref
  const tableRef = useRef(null);
  // 搜索form
  const [searchForm] = Form.useForm<FormInstance>();
  // 添加form
  const [addForm] = Form.useForm<FormInstance>();
  // 编辑form
  const [editForm] = Form.useForm<FormInstance>();
  // 重置密码form
  const [resetForm] = Form.useForm<FormInstance>();
  // 重置审批密码form
  const [resetApprovalForm] = Form.useForm<FormInstance>();
  const userId = localStorage.getItem('userId');

  // 刷新table数据
  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.refresh();
    }
  };
  //编辑 用户项
  const editEvent = (record: any) => {
    editForm.setFieldsValue({ ...record, expiryTime: dayjs(record?.expiryTime) });
    setCurrentEditId(record.id);
    setEditModalVisible(true);
  };

  //删除用户项
  const deleteEvent = async (id: string) => {
    await deleteUser(id)
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
  //重置密码
  const resetPwdEvent = async (id: any) => {
    setCurrentEditId(id);
    setResetFormVisible(true);
  };


  const columns = [
    {
      title: '用户账号',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as any,
    },
    {
      title: '用户名称',
      dataIndex: 'nickName',
      key: 'nickName',
      align: 'center' as any,
    },
    {
      title: '手机号',
      dataIndex: 'telephone',
      key: 'telephone',
      align: 'center' as any,
    },
    {
      title: '截止日期',
      dataIndex: 'expiryTime',
      key: 'expiryTime',
      align: 'center' as any,
      render: (text: any, record: any) => {
        return (
          <>{record.expiryTime ? moment(record.expiryTime).format('YYYY-MM-DD HH:mm') : '-'}</>
        );
      },
    },
    {
      title: '剩余天数',
      dataIndex: 'expiryDays',
      key: 'expiryDays',
      align: 'center' as any,
      render: (text: any, record: any) => {
        const time =
          parseInt(new Date(record?.expiryTime).getTime() + '') / 1000 -
          parseInt(new Date().getTime() / 1000 + '');
        const days = parseInt(time / 60 / 60 / 24 + '') + 1;
        return <>{days > 0 ? days : <span style={{ color: '#FF1717' }}>过期</span>}</>;
      },
    },
    {
      title: '访问权限',
      dataIndex: 'roleNickName',
      key: 'roleNickName',
      align: 'center' as any,
      // render: (text: any, record: any) => {
      //   console.log(record);

      //   return <span>{record?.role?.name}</span>;
      // },
    },
    // {
    //   title: '审批授权密码',
    //   dataIndex: 'authPassword',
    //   key: 'authPassword',
    //   align: 'center' as any
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
              title="删除用户"
              description="是否确定删除？"
              onConfirm={() => deleteEvent(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button size="small">删除</Button>
            </Popconfirm>
            <Button onClick={() => resetPwdEvent(record.id)} size="small">
              重置密码
            </Button>
          </Space>
        );
      },
    },
  ];

  // 用户数据查询按钮点击事件
  const searchEvent = () => {
    searchForm.validateFields().then(async (values) => {

      if (tableRef && tableRef.current) {
        //@ts-ignore
        tableRef.current.searchByParams({ ...values, userId }, true);
      }
    });
  };
  // 用户数据重置按钮点击事件
  const resetEvent = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.searchByParams({ userId }, true);
      searchForm.resetFields();
    }
  };

  //添加用户项
  const sureAddUser = () => {
    addForm
      .validateFields()
      .then(async (value: any) => {

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
            // @ts-ignore
            password: md5(value.password),
            expiryTime: dayjs(value.expiryTime).format('YYYY-MM-DD HH:mm:ss'),
            // @ts-ignore
            authPassword: md5(value.authPassword),
          },
        );
        await addUser(submitInfo);
        message.success('添加成功');
        refresh();
        setAddModalVisible(false);
        addForm.resetFields();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //编辑用户项
  const sureEditUser = async () => {
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
          // 只更新用户
          isModifySubstation: false,
          ...values,
        },
        { expiryTime: dayjs(values.expiryTime).format('YYYY-MM-DD HH:mm:ss') },
      );
      await updateUser(submitInfo);
      refresh();
      message.success('修改成功');
      addForm.resetFields();
      setEditModalVisible(false);
    });
  };
  // 修改密码
  const sureResetEvent = () => {
    resetForm.validateFields().then(async (value: any) => {
      const submitInfo = Object.assign(
        {
          id: currentEditId,
          //@ts-ignore
          oldPwd: md5(value.oldPwd),
          //@ts-ignore
          newPwd: md5(value.newPwd),
        }
      );

      await resetAuthPasswordByAdmin(submitInfo)
        .then((res: any) => {
          if (res.code === 10000) {
            message.error(res.message);
            return;
          }
          message.success('修改密码成功');
          refresh();
          setResetFormVisible(false);
          resetForm.resetFields();
        })
        .catch(() => { });
    });
  };
  // 修改审批密码
  const sureResetApprovalEvent = () => {
    resetApprovalForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          id: currentEditId,
          //@ts-ignore
          authPassword: md5(value.newPwd),
        }
      );

      await resetAuthPasswordByAdmin(submitInfo)
        .then((res: any) => {
          if (res.code === 10000) {
            message.error(res.message);
            return;
          }
          message.success('修改审批密码成功');
          refresh();
          setResetApprovalFormVisible(false);
          resetApprovalForm.resetFields();
        })
        .catch(() => { });
    });
  };

  // 搜索栏tsx
  const searchArea = () => {
    return (
      <>
        <Form form={searchForm}>
          <Row gutter={48}>
            <Col>
              <CustomItem label="用户账号" align="right" labelWidth={75} name="name">
                <Input placeholder="请输入用户账号" autoComplete="off" />
              </CustomItem>
            </Col>
            <Col>
              <CustomItem label="用户名称" align="right" labelWidth={75} name="nickName">
                <Input placeholder="请输入用户名称" autoComplete="off" />
              </CustomItem>
            </Col>
            <Col>
              <CustomItem label="手机号" align="right" labelWidth={75} name="telephone"
                rules={[
                  {
                    pattern: /^[1-9]\d*$/,
                    message: '请输入正确手机号',
                  },
                ]}>
                <Input placeholder="请输入手机号" autoComplete="off" maxLength={11} />
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
                {/* <Button onClick={() => console.log('down')}>
                  <PlusCircleOutlined />
                  下载
                </Button> */}
              </Space>
            </Col>
          </Row>
        </Form >
      </>
    );
  };
  return (
    <ContentPage>
      <ContentComponent title="用户管理" renderSearch={searchArea}>
        <GeneralTable
          url="/sysApi/sysuser/getSysUserListPage"
          ref={tableRef}
          columns={columns}
          rowKey="id"
          hideSelect
          size="middle"
          bordered={false}
          requestType='post'
          filterParams={{ userId }}
          hasPage={true}
        />

        <Modal
          width={800}
          destroyOnClose
          centered
          maskClosable={false}
          title="添加用户"
          open={addModalVisible}
          onCancel={() => setAddModalVisible(false)}
          onOk={() => sureAddUser()}
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
          title="编辑用户"
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            addForm.resetFields();
          }}
          onOk={() => sureEditUser()}
        >
          <Form form={editForm}>
            <AddMenuForm form={editForm} type="edit" />
          </Form>
        </Modal>
        <Modal
          width={450}
          destroyOnClose
          maskClosable={false}
          centered
          title="重置密码"
          open={resetFormVisible}
          onCancel={() => {
            setResetFormVisible(false);
            resetForm.resetFields();
          }}
          onOk={() => sureResetEvent()}
        >
          <Form form={resetForm}>
            <ResetForm />
          </Form>
        </Modal>
        <Modal
          width={450}
          destroyOnClose
          maskClosable={false}
          centered
          title="重置审批密码"
          open={resetApprovalFormVisible}
          onCancel={() => {
            setResetApprovalFormVisible(false);
            resetApprovalForm.resetFields();
          }}
          onOk={() => sureResetApprovalEvent()}
        >
          <Form form={resetApprovalForm}>
            <ResetForm />
          </Form>
        </Modal>
      </ContentComponent>
    </ContentPage>
  );
};
export default SystemUser;
