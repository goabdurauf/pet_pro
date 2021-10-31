import React, {Component} from 'react';
import {Card, Row, Col, Tabs, Form, Input, Select, Space, Popconfirm, Modal, Table, DatePicker} from 'antd';
import {connect} from "react-redux";
import {DeleteOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, Label} from "reactstrap";
const { TabPane } = Tabs;
const FormItem = Form.Item;

@connect(({order, app}) => ({order, app}))
class Order extends Component {
  render() {
    const {order, dispatch} = this.props;
    const {isModalOpen, itemList, currentItem, modalType, managerList, clientList, orderStatusList, isBtnDisabled, visibleColumns} = order;

    const formItems = [
      {
        label: 'Номер',
        name: 'num',
        width: 12,
        rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
        obj: <Input placeholder='номер заказа'/>
      }, {
        label: "Дата",
        name: 'date',
        width: 12,
        rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
        obj: <DatePicker format={'DD.MM.YYYY'}/>
      }, {
        label: "Клиент",
        name: 'clientId',
        width: 12,
        rules: [{required: true, message: 'Выберите роль пользователя',},],
        obj: <Select placeholder='клиент'>
          {clientList.map(client => <Select.Option key={client.id} value={client.id}>{client.name}</Select.Option>)}
        </Select>
      }, {
        label: "Менеджер",
        name: 'managerId',
        width: 12,
        rules: [{required: true, message: 'Выберите роль пользователя',},],
        obj: <Select placeholder='менеджер'>
          {managerList.map(manager => <Select.Option key={manager.id} value={manager.id}>{manager.fullName}</Select.Option>)}
        </Select>
      }, {
        label: "Статус",
        name: 'statusId',
        width: 12,
        rules: [{required: true, message: 'Выберите роль пользователя',},],
        obj: <Select placeholder='статус'>
          {orderStatusList.map(status => <Select.Option key={status.id} value={status.id}>{status.nameRu}</Select.Option>)}
        </Select>
      }
    ];

    const onChange = (key) => {console.log(key);}
    const handleSubmit = (name, {values, forms}) => {
      dispatch({
        type: 'order/updateState',
        payload: {isBtnDisabled: true}
      })
      if (currentItem !== null)
        values = {...values, id: currentItem.id}

      let date = values.date;
      values.date = date.format('DD.MM.YYYY HH:mm:ss');
      dispatch({
        type: 'order/save',
        payload: {
          ...values
        }
      })
    };
    const openModal = () => {
      dispatch({
        type: 'order/updateState',
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
    const modalProps = {
      visible: isModalOpen,
      title: modalType === 'create' ? 'Создать заказ' : 'Редактировать заказа',
      onCancel() {
        dispatch({
          type: 'order/updateState',
          payload: {
            isModalOpen: false
          }
        })
      }
    };
    const handleEdit = (id) => {
      dispatch({
        type: 'order/getById',
        payload: {id}
      })
    };
    const handleDelete = (id) => {
      dispatch({
        type: 'order/deleteById',
        payload: {id}
      })
    }
    const ModalForm = () => {
      const [form] = Form.useForm();
      const onOk = () => {
        form.submit();
      };
      return (
        <Modal {...modalProps} onOk={onOk} okText={"Добавить"} cancelText={"Отмена"} okButtonProps={{disabled: isBtnDisabled}}>
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
    const TabBody = () => {
      return (<div>
        <Row>
          <Col span={4} offset={20}>
            <Button className="float-right" outline color="primary" size="sm"
                    onClick={openModal}><PlusOutlined/> Добавить</Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
               pagination={{position: ["bottomCenter"]}}/>
      </div>);
    }

    return (
      <div className="order-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={onChange}>
            <TabPane tab="Заказы" key="Order"><TabBody /></TabPane>
            <TabPane tab="Грузы" key="Cargo"><TabBody /></TabPane>
            <TabPane tab="Рейсы" key="Shipping"><TabBody /></TabPane>
          </Tabs>
          <Form.Provider onFormFinish={handleSubmit}><ModalForm/></Form.Provider>
        </Card>
      </div>
    );
  }
}

export default Order;
