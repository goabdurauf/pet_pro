import React, {Component} from 'react';
import {
  Card, Row, Col, Tabs, Form, Input, Select, Space, Popconfirm, Table, DatePicker, Modal, Tooltip
} from 'antd';
import {connect} from "react-redux";
import {DeleteOutlined, FormOutlined, PlusOutlined, SearchOutlined, DownloadOutlined} from "@ant-design/icons";
import {Button, Label} from "reactstrap";
import SearchModal from './modals/searchModal'
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import moment from "moment";
const { TabPane } = Tabs;
const FormItem = Form.Item;

@connect(({order, app}) => ({order, app}))
class Order extends Component {
  render() {
    const {order, dispatch} = this.props;
    const {model, isModalOpen, itemList, currentItem, searchParams, modalType, managerList, clientList, orderStatusList, pagination,
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
      }, {
        label: "Дата",
        name: 'date',
        width: 12,
        rules: [{required: true, message: 'Этот поля не должно быть пустое',},],
        obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
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
        label: "Номер заказа",
        name: 'num',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <Input allowClear placeholder='Введите номер заказа' />
      },
      {
        label: "Клиент",
        name: 'clientId',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <Select allowClear placeholder='клиент'>
          {clientList.map(client => <Select.Option key={client.id} value={client.id}>{client.name}</Select.Option>)}
        </Select>
      },
      {
        label: "Менеджер",
        name: 'managerId',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <Select allowClear placeholder='менеджер'>
          {managerList.map(manager => <Select.Option key={manager.id} value={manager.id}>{manager.fullName}</Select.Option>)}
        </Select>
      },
      {
        label: "Статус",
        name: 'statusId',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <Select allowClear placeholder='статус'>
          {orderStatusList.map(status => <Select.Option key={status.id} value={status.id}>{status.nameRu}</Select.Option>)}
        </Select>
      },
      {
        label: "Начальная дата",
        name: 'start',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
      },
      {
        label: "Конечная дата",
        name: 'end',
        width: 12,
        rules: [{required: false, message: ''}],
        obj: <DatePicker format={'DD.MM.YYYY'} locale={locale}/>
      }
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
      if (date !== undefined && date !== null)
        values.date = date.format('DD.MM.YYYY HH:mm:ss');

      dispatch({
        type: 'order/save' + model,
        payload: {
          ...values
        }
      })
    };
    const handleSearch = (values) => {
      dispatch({
        type: 'order/updateState',
        payload: {isModalOpen: false}
      })

      let start = values.start;
      if (start !== undefined && start !== null)
        values.start = start.format('DD.MM.YYYY HH:mm:ss');

      let end = values.end;
      if (end !== undefined && end !== null)
        values.end = end.format('DD.MM.YYYY HH:mm:ss');

      dispatch({
        type: 'order/searchOrder',
        payload: {
          ...searchParams,
          ...values,
          page: 0,
        }
      })
    }
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
    const openSearchModal = () => {
      if (searchParams !== null) {
        if (searchParams.start !== null && searchParams.start !== undefined)
          searchParams.start = moment(searchParams.start, 'DD.MM.YYYY HH:mm:ss');
        if (searchParams.end !== null && searchParams.end !== undefined)
          searchParams.end = moment(searchParams.end, 'DD.MM.YYYY HH:mm:ss');
      }
      dispatch({
        type: 'order/updateState',
        payload: {
          isModalOpen: !isModalOpen,
          modalType: 'search',
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
            <Tooltip title="Редактировать" placement={"bottom"} color={"#1f75a8"}>
              <FormOutlined onClick={() => handleEdit(record.id)}/>
            </Tooltip>
            <Popconfirm title="Удалить?" onConfirm={() => handleDelete(record.id)} okText="Да" cancelText="Нет">
              <Tooltip title="Удалить" placement={"bottom"} color={"red"}>
                <DeleteOutlined style={{color: 'red'}}/>
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      }
    ];
    const modalProps = {
      visible: isModalOpen,
      title: modalType === 'search' ? 'Поиск' : modalType === 'create' ? createTitle : editTitle,
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
    const handleTableChange = (pagination, filters, sorter) => {
      dispatch({
        type: 'order/searchOrder',
        payload: {
          ...searchParams,
          page: pagination.current - 1
        }
      })
    }

    const handleDownload = () => {
      const itemListTotal = order.pagination.total
      searchParams.size = itemListTotal

      dispatch({
        type: 'order/download',
        payload: searchParams
      })
    }

    const TabBody = () => {
      return <div>
        <Row>
          <Col span={4} offset={20}>
            <Button className='float-right' size='sm' outline color='success' onClick={handleDownload}><DownloadOutlined className='mr-1' /> Скачать</Button>
            <Button className="float-right mx-4" outline color="primary" size="sm" onClick={openModal}><PlusOutlined/> Добавить</Button>
            <Button className="float-right" outline color="primary" size="sm" onClick={openSearchModal}><SearchOutlined/></Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
               pagination={pagination} onChange={handleTableChange} scroll={{ y: 600 }}/>
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
        </Card>
        {isModalOpen && modalType !== 'search' &&
          <Form.Provider onFormFinish={handleSubmit}><ModalForm/></Form.Provider>}
        {isModalOpen && modalType === 'search' &&
          <SearchModal {...modalProps} formItems={searchItems} searchParams={searchParams} handleSubmit={handleSearch}/>
        }
      </div>
    );
  }
}

export default Order;
