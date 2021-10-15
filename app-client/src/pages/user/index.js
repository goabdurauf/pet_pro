import React, {Component} from 'react';
import {Button, Label} from "reactstrap";
import {Card, Table, Space, Popconfirm, Row, Col, Typography, Form, Input, Modal} from 'antd';
import {connect} from "react-redux";
import {FormOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons'

const FormItem = Form.Item;

@connect(({users, app}) => ({users, app}))
class Users extends Component {
  render() {
    const {users, app, dispatch} = this.props;
    const {userList, currentUser, roleList, isModalOpen, modalType, visibleColumns, formItems} = users;

    const handleSubmit = (name, { values, forms }) => {
      if (currentUser !== null)
        values = {...values, id: currentUser.id}

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
          currentUser: null
        }
      })
    };

    const tableData = [
      {
        num: '1',
        fullName: 'John Brown',
        login: 'admin',
        phone: '+998132',
        key: 1
      },
      {
        num: '2',
        fullName: 'Teodor Nathan',
        login: 'teo',
        phone: '+998332458899',
        key: 2
      },

    ];
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
            <a onClick={() => handleEdit(record.id)}><FormOutlined /></a>
            <Popconfirm title="Удалить?" onConfirm={() => handleDelete(record.id)}
                        okText="Да" cancelText="Нет">
              <a><DeleteOutlined style={{color: 'red'}}/></a>
            </Popconfirm>
          </Space>
        )
      }
    ];


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
//  initialValues={{fullName:'Bobur', login:'bobur'}}
      return (
        <Modal {...modalProps} onOk={onOk}>
          <Form form={form} layout="vertical" name="userForm" initialValues={currentUser !== null ? currentUser : ''}>
            <Row>
              <Col span={12}>
                <Label>Фамилия и имя</Label>
                <FormItem key='fullName' name= 'fullName'
                          rules = {[{required: true, message: 'Этот поля не должно быть пустое'}]}>
                  <Input placeholder='Фамилия и имя'/>
                </FormItem>
              </Col>
              <Col span={12}>
                <Label>Телефон номер</Label>
                <FormItem key='phone' name= 'phone'
                          rules = {[{required: true, message: 'Этот поля не должно быть пустое'}]}>
                  <Input placeholder='Телефон номер'/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Label>Логин</Label>
                <FormItem key='login' name= 'login'
                          rules = {[{required: true, message: 'Этот поля не должно быть пустое'}]}>
                  <Input placeholder='Логин'/>
                </FormItem>
              </Col>
              <Col span={12}>
                <Label>Пароль</Label>
                <FormItem key='password' name= 'password'
                          rules = {[{required: modalType === 'create', message: 'Этот поля не должно быть пустое'}]}>
                  <Input type="password" placeholder='Пароль'/>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    };



    return (
      <div className="users-page">
        <Card style={{ width: '100%' }} bordered={false}>
          <Row>
            <Col span={4}><Typography.Title level={4}>Пользователи</Typography.Title></Col>
            <Col span={4} offset={16}>
              <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined /> Добавить</Button>
            </Col>
          </Row>
          <Table columns={columns} dataSource={userList} bordered
                 size="middle" rowKey={record => record.id}
                 pagination={{ position: ["bottomCenter"] }} />
        </Card>

        <Form.Provider onFormFinish={handleSubmit}>
          <ModalForm />
        </Form.Provider>

        {/*
        <section className="course-section">

          <div className="container">
            <div className="row">
              <div className="col-md-3 my-md-3">
                <Button className="kassa-btn" color="danger" onClick={openModal}>User qo'shish</Button>
              </div>

              <div className="col-md-3 search-col offset-md-6">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <SearchOutlined />
                  </div>
                  <input type="text" className="form-control" placeholder="Search"/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 table-list">
                <Table size="sm" bordered striped>
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Пользователь</th>
                    <th>Логин</th>
                    <th>Тел. номер</th>
                    <th>Роль</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  {userList.map((item, i) => {
                    return <tr key={item.id}>
                      <td><b>{i + 1}</b></td>
                      <td>{item.fullName}</td>
                      <td>{item.login}</td>
                      <td>{item.phone !== null ? item.phone : ''}</td>
                      <td>{item.roles[0].description}</td>
                      <td>
                        <button className="edit-btn" onClick={() => handleEdit(item.id)}>
                          <FormOutlined />
                        </button>
                        <button className="edit-btn" onClick={() => handleEdit(item.id)}>
                          <CloseCircleOutlined style={{color: 'red'}} />
                        </button>
                      </td>
                    </tr>
                  })}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>

          <div className="kassa-modal">
            <Modal isOpen={isModalOpen} toggle={toggle} className={this.className + 'modal-dialog modal-lg'}
                   external={externalCloseBtn}>
              <div className="modal-header pt-5 px-5  border-0">
                <div className="d-flex w-100">
                  <div className="modal-ht w-75">
                    Foydalanuvchini qo’shish
                  </div>
                </div>
              </div>
              <AvForm onSubmit={handleSubmit}>
                <ModalBody className="kass-md-body px-5">
                  <div className="row">
                    <div className="col-md-6">
                      <AvGroup>
                        <Label for="example">Ismi</Label>
                        <AvInput name="firstName" id="firstName"
                                 value={currentUser !== null ? currentUser.firstName : ''} required/>
                        <AvFeedback>Foydalanuvchi ismi kiritilishi shart!</AvFeedback>
                      </AvGroup>
                    </div>
                    <div className="col-md-6">
                      <AvGroup>
                        <Label for="example">Familiyasi</Label>
                        <AvInput name="lastName" id="lastName"
                                 value={currentUser !== null ? currentUser.lastName : ''} required/>
                        <AvFeedback>Foydalanuvchi familiyasi kiritilishi shart!</AvFeedback>
                      </AvGroup>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <AvGroup>
                        <Label for="example">Login</Label>
                        <AvInput name="phone" id="phone"
                                 value={currentUser !== null ? currentUser.phone : ''} required/>
                        <AvFeedback>Foydalanuvchi logini kiritilishi shart!</AvFeedback>
                      </AvGroup>
                    </div>
                    <div className="col-md-4">
                      <AvGroup>
                        <Label for="example">Parol</Label>
                        <AvInput name="password" type="password" id="password" required/>
                        <AvFeedback>Foydalanuvchi paroli kiritilishi shart!</AvFeedback>
                      </AvGroup>
                    </div>
                    <div className="col-md-4">
                      <AvGroup>
                        <Label for="example">Telefon nomer</Label>
                        <AvInput name="mobile" id="mobile" type="text" placeholder="998 99 403 00 30"
                                 value={currentUser !== null && currentUser.mobile !== null ? currentUser.mobile : ''} required/>
                        <AvFeedback>Foydalanuvchi nomerini kiritilishi shart!</AvFeedback>
                      </AvGroup>
                    </div>
                  </div>
                  {currentUser && currentUser.roles.length > 1 ? '' :
                    <div className="row">
                      <div className="col-md-6">
                        {currentActiveUser !== null && currentActiveUser.roles.length <= 1 ?
                          // eslint-disable-next-line array-callback-return
                          currentActiveUser.roles.map(item => {
                            if (item.id === 10) {
                              return (
                                <AvGroup>
                                  <Label for="example">Roli</Label>
                                  <button disabled={true}
                                          className="btn btn-block btn-info">{roleList.length ? roleList[1].description : ''}</button>
                                  <AvInput style={{display: 'none'}} disabled name="role" id="role"
                                           // value={roleList && roleList[1].id}
                                  />
                                </AvGroup>
                              )
                            }
                            if (item.id === 30) {
                              return (
                                <AvGroup>
                                  <Label for="example">Roli</Label>
                                  <button disabled={true}
                                          className="btn btn-block btn-info">{roleList && roleList[3].description}</button>
                                  <AvInput style={{display: 'none'}} disabled name="role" id="role"
                                           value={roleList && roleList[3].id}/>
                                </AvGroup>
                              )
                            }
                            if (item.id === 40) {
                              return (
                                <AvGroup>
                                  <Label for="example">Roli</Label>
                                  <button disabled={true}
                                          className="btn btn-block btn-info">{roleList.length ? roleList[0].description : ''}</button>
                                  <AvInput style={{display: 'none'}} disabled name="role" id="role"
                                           value={roleList.length ? roleList[0].id : ''}/>
                                </AvGroup>
                              )
                            }
                          })
                          : <AvGroup>
                            <AvField type="select" id="role"
                                     name="role" label="Roli"
                                     value={currentUser !== null ? currentUser.roles[0].id : ''}>
                              <option value="">
                                Rolni tanlang
                              </option>
                              {roleList.map(item => {
                                return <option key={item.id} value={item.id}>{item.description}</option>
                              })}
                            </AvField>
                            <AvFeedback>Foydalanuvchi roli tanlanishi shart!</AvFeedback>
                          </AvGroup>}
                      </div>
                    </div>
                  }
                </ModalBody>
                <ModalFooter>
                  <FormGroup>
                    <Button className="modal-cancel-btn" color="primary mr-3" onClick={toggle}>Bekor qilish</Button>
                    <Button className="modal-save-btn" color="secondary">Tasdiqlash</Button>
                  </FormGroup>
                </ModalFooter>
              </AvForm>
            </Modal>
          </div>

        </section>
        */}
      </div>
    );
  }
}

export default Users;
