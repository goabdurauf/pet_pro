import React, {Component} from 'react';
import {Card, Row, Col, Tabs, Form, Input, Select, Space, Popconfirm, Table, DatePicker, Modal} from 'antd';
import {connect} from "react-redux";
import {DeleteOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, Label} from "reactstrap";
import SearchModal from './modal'
const { TabPane } = Tabs;
const FormItem = Form.Item;

@connect(({order, app}) => ({order, app}))
class Order extends Component {
  render() {
    const {order, dispatch} = this.props;
    const {model, isModalOpen, itemList, currentItem, modalType, managerList, clientList, orderStatusList,
      modalWidth, createTitle, editTitle, visibleColumns} = order;

    const orderItems = [
      {
        label: "Клиент",
        name: 'clientId',
        width: 12,
        rules: [{required: true, message: 'Выберите клиента',},],
        obj: <Select placeholder='клиент'>
          {clientList.map(client => <Select.Option key={client.id} value={client.id}>{client.name}</Select.Option>)}
        </Select>
      },{
        label: "Дата",
        name: 'date',
        width: 12,
        rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
        obj: <DatePicker format={'DD.MM.YYYY'}/>
      }, {
        label: "Менеджер",
        name: 'managerId',
        width: 12,
        rules: [{required: true, message: 'Выберите менеджера',},],
        obj: <Select placeholder='менеджер'>
          {managerList.map(manager => <Select.Option key={manager.id} value={manager.id}>{manager.fullName}</Select.Option>)}
        </Select>
      }, {
        label: "Статус",
        name: 'statusId',
        width: 12,
        rules: [{required: true, message: 'Выберите статус заказа',},],
        obj: <Select placeholder='статус'>
          {orderStatusList.map(status => <Select.Option key={status.id} value={status.id}>{status.nameRu}</Select.Option>)}
        </Select>
      }
    ];
    const searchItems =  [
      {
        label: "Клиент",
        name: 'clientId',
        width: 12,
        rules: [{required: true, message: 'Выберите клиента',},],
        obj: <Input  />
      },
    ];

    const onChange = (key) => {
      if (key !== 'Order')
        dispatch({type: 'order/pushToPage', payload: {key}});
    }
    const handleSubmit = (name, {values, forms}) => {
      dispatch({
        type: 'order/updateState',
        payload: {isModalOpen: false}
      })
      if (modalType !== 'create')
        values = {...values, id: currentItem.id}

      let date = values.date;
      if (date !== undefined)
        values.date = date.format('DD.MM.YYYY HH:mm:ss');

      dispatch({
        type: 'order/save' + model,
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
          currentItem: model === 'Shipping' ? {rate:1} : null,
          modalType: 'create',
          isBtnDisabled: false
        }
      })
    };
    /*
    const openSearchModal = () => {
      dispatch({
        type: 'order/updateState',
        payload: {
          isModalOpen: !isModalOpen,
          modalType: 'search',
        }
      })
    };
    */
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
      title: modalType === 'create' ? createTitle : editTitle,
      width: modalWidth,
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
        type: 'order/get' + model + 'ById',
        payload: {id}
      })
    };
    const handleDelete = (id) => {
      dispatch({
        type: 'order/delete' + model + 'ById',
        payload: {id}
      })
    }
    const TabBody = () => {
      return <div>
        <Row>
          <Col span={4} offset={20}>
            {/*<Button className="float-left" outline color="primary" size="sm" onClick={openSearchModal}><SearchOutlined/></Button>*/}
            <Button className="float-right" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
               pagination={{position: ["bottomCenter"]}}/>
      </div>;
    }

    const ModalForm = () => {
      const [form] = Form.useForm();
      const onOk = () => {
        form.submit();
      };
      return (
        <Modal {...modalProps} onOk={onOk} okText={"Добавить"} cancelText={"Отмена"}>
          <Form form={form} initialValues={currentItem !== null ? currentItem : ''}>
            <Row> {orderItems.map((item) =>
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
      <div className="order-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={onChange} defaultActiveKey="Order">
            <TabPane tab="Запросы" key="/order/request">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Заказы" key="Order"><TabBody /></TabPane>
            <TabPane tab="Грузы" key="/order/cargo">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Рейсы" key="/order/shipping">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Отслеживание" key="/order/tracking">Подождите пожалуйста ...</TabPane>
          </Tabs>
          {isModalOpen && modalType !== 'search' &&
            <Form.Provider onFormFinish={handleSubmit}><ModalForm/></Form.Provider>}
          {isModalOpen && modalType === 'search' &&
            <SearchModal {...modalProps} formItems={searchItems} />
          }
        </Card>
      </div>
    );
  }
}

export default Order;
