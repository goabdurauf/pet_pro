import React, {Component} from 'react';
import {Button, Label} from "reactstrap";
import {Card, Table, Space, Popconfirm, Row, Col, Typography, Form, Input, Modal, Select} from 'antd';
import {connect} from "react-redux";
import {FormOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons'

const FormItem = Form.Item;

@connect(({users, app}) => ({users, app}))
class Users extends Component {
  render() {
    const {users, dispatch} = this.props;
    const {userList, currentItem, roleList, isModalOpen, modalType, visibleColumns} = users;

    const handleSubmit = (name, {values, forms}) => {
      if (currentItem !== null)
        values = {...values, id: currentItem.id}

      dispatch({
        type: 'users/save',
        payload: {
          ...values
        }
      })
    };
    const openModal = () => {
      dispatch({
        type: 'users/updateState',
        payload: {
          isModalOpen: !isModalOpen,
          currentItem: null,
          modalType: 'create'
        }
      })
    };
    const columns = [
      ...visibleColumns,
      {
        title: 'Операции',
        key: 'operation',
        width: 100,
        // fixed: 'right',
        align: 'center',
        render: (text, record) => (
          <Space size="middle">
            <FormOutlined onClick={() => handleEdit(record.id)}/>
            <Popconfirm title="Удалить?" onConfirm={() => handleDelete(record.id)}
                        okText="Да" cancelText="Нет">
              <DeleteOutlined style={{color: 'red'}}/>
            </Popconfirm>
          </Space>
        )
      }
    ];
    const formItems = [
      {
        label: 'Фамилия и имя',
        name: 'fullName',
        width: 12,
        rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
        obj: <Input placeholder='Фамилия и имя'/>
      }, {
        label: "Телефон номер",
        name: 'phone',
        width: 12,
        rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
        obj: <Input placeholder='+998 90 125 05 05'/>
      }, {
        label: "Логин",
        name: 'login',
        width: 12,
        rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
        obj: <Input placeholder='логин'/>
      }, {
        label: "Пароль",
        name: 'password',
        width: 12,
        rules: [{required: modalType === 'create', message: 'Этот поля не должно быть пустое',},],
        obj: <Input type={"password"} placeholder='пароль'/>
      }, {
        label: "Роль",
        name: 'role',
        width: 12,
        rules: [{required: true, message: 'Выберите роль пользователя',},],
        obj: <Select placeholder='роль пользователя'>
          {roleList.map(role => <Select.Option key={role.id} value={role.id}>{role.description}</Select.Option>)}
        </Select>
      }
    ]
    const modalProps = {
      visible: isModalOpen,
      title: modalType === 'create' ? 'Создать пользователь' : 'Редактировать пользователь',
      onCancel() {
        dispatch({
          type: 'users/updateState',
          payload: {
            isModalOpen: false
          }
        })
      }
    };
    const handleEdit = (id) => {
      dispatch({
        type: 'users/getById',
        payload: {
          id
        }
      })
    };
    const handleDelete = (id) => {
      dispatch({
        type: 'users/deleteUser',
        payload: {
          id
        }
      })
    }
    const ModalForm = () => {
      const [form] = Form.useForm();
      const onOk = () => {
        form.submit();
      };
      return (
        <Modal {...modalProps} onOk={onOk} okText={"Добавить"} cancelText={"Отмена"}>
          <Form form={form} name="userForm" initialValues={currentItem !== null ? currentItem : ''}>
            <Row> {formItems.map((item) =>
              <Col span={item.width} key={item.name}>
                <Label>{item.label}</Label>
                <FormItem key={item.name} name={item.name} rules={item.rules}>
                  {item.obj}
                </FormItem>
              </Col>
            )}</Row>
          </Form>
        </Modal>
      );
    };
    return (
      <div className="users-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Row>
            <Col span={4}><Typography.Title level={4}>Пользователи</Typography.Title></Col>
            <Col span={4} offset={16}>
              <Button className="float-right" outline color="primary" size="sm"
                      onClick={openModal}><PlusOutlined/> Добавить</Button>
            </Col>
          </Row>
          <Table columns={columns} dataSource={userList} bordered
                 size="middle" rowKey={record => record.id}
                 pagination={{position: ["bottomCenter"]}}/>
        </Card>

        <Form.Provider onFormFinish={handleSubmit}>
          <ModalForm/>
        </Form.Provider>
      </div>
    );
  }
}

export default Users;
