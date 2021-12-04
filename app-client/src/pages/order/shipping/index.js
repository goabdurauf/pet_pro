import React, {Component} from 'react';
import {Card, Row, Col, Tabs, Form, Input, Select, Space, Popconfirm, Table, InputNumber, Modal, TreeSelect, Typography, DatePicker} from 'antd';
import {connect} from "react-redux";
import {DeleteOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, Label} from "reactstrap";
import 'moment/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
const { TabPane } = Tabs;
const FormItem = Form.Item;

@connect(({shipping, app}) => ({shipping, app}))
class Shipping extends Component {
  render() {
    const {shipping, dispatch} = this.props;
    const {model, isModalOpen, itemList, currentItem, modalType, managerList, carrierList, currencyList, shipTypeList, selectOrderList,
      modalWidth, createTitle, editTitle, visibleColumns} = shipping;

    const onChange = (key) => {
      if (key !== 'Shipping')
        dispatch({type: 'shipping/pushToPage', payload: {key}});
    }
    const handleSubmit = (name, {values, forms}) => {
      dispatch({
        type: 'shipping/updateState',
        payload: {isModalOpen: false}
      })
      if (modalType !== 'create') {
        values = {...values, id: currentItem.id}
      }

      if (values.loadDate !== undefined && values.loadDate !== '')
        values.loadDate = values.loadDate.format('DD.MM.YYYY HH:mm');

      if (values.loadSendDate !== undefined && values.loadSendDate !== '')
        values.loadSendDate = values.loadSendDate.format('DD.MM.YYYY HH:mm');

      if (values.customArrivalDate !== undefined && values.customArrivalDate !== '')
        values.customArrivalDate = values.customArrivalDate.format('DD.MM.YYYY HH:mm');

      if (values.customSendDate !== undefined && values.customSendDate !== '')
        values.customSendDate = values.customSendDate.format('DD.MM.YYYY HH:mm');

      if (values.unloadArrivalDate !== undefined && values.unloadArrivalDate !== '')
        values.unloadArrivalDate = values.unloadArrivalDate.format('DD.MM.YYYY HH:mm');

      if (values.unloadDate !== undefined && values.unloadDate !== '')
        values.unloadDate = values.unloadDate.format('DD.MM.YYYY HH:mm');

      dispatch({
        type: 'shipping/save' + model,
        payload: {
          ...values
        }
      })
    };
    const openModal = () => {
      dispatch({type: 'shipping/openModal'})
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
      title: modalType === 'create' ? createTitle : editTitle,
      width: modalWidth,
      onCancel() {
        dispatch({
          type: 'shipping/updateState',
          payload: {
            isModalOpen: false
          }
        })
      }
    };
    const handleEdit = (id) => {
      dispatch({
        type: 'shipping/get' + model + 'ById',
        payload: {id}
      })
    };
    const handleDelete = (id) => {
      dispatch({
        type: 'shipping/delete' + model + 'ById',
        payload: {id}
      })
    }
    const TabBody = () => {
      return <div>
        <Row>
          <Col span={4} offset={20}>
            <Button className="float-right" outline color="primary" size="sm"
                    onClick={openModal}><PlusOutlined/> Добавить</Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={itemList} bordered size="middle" rowKey={record => record.id}
               pagination={{position: ["bottomCenter"]}}/>
      </div>;
    }

    const ShippingModal = () => {
      const [form] = Form.useForm();
      const getPrice = (event) => {
        let price = event.target.value;
        let rate = document.getElementById("rate").value;
        form.setFieldsValue({finalPrice: price / rate})
      }
      const getRate = (event) => {
        let price = document.getElementById("price").value;
        form.setFieldsValue({finalPrice: price / event})
      }
      const onOk = () => {
        form.submit();
      };
      return (
        <Modal {...modalProps} onOk={onOk} okText={"Добавить"} cancelText={"Отмена"}>
          <Form form={form} initialValues={currentItem !== null ? currentItem : ''}>
            <Row>
              <Col span={8}><Label>Менеджер</Label>
                <FormItem key={'managerId'} name={'managerId'} rules={[{required: true, message: 'Выберите менеджера'}]}>
                  <Select placeholder='менеджер'>
                    {managerList.map(manager => <Select.Option key={manager.id} value={manager.id}>{manager.fullName}</Select.Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}><Label>Перевозчик</Label>
                <FormItem key={'carrierId'} name={'carrierId'} rules={[{required: true, message: 'Выберите перевозчика'}]}>
                  <Select placeholder='перевозчик'>
                    {carrierList.map(carrier => <Select.Option key={carrier.id} value={carrier.id}>{carrier.name}</Select.Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}><Label>Тип транспорта</Label>
                <FormItem key={'shippingTypeId'} name={'shippingTypeId'} rules={[{required: true, message: 'Выберите тип транспорта'}]}>
                  <Select placeholder='тип транспорта'>
                    {shipTypeList.map(type => <Select.Option key={type.id} value={type.id}>{type.nameRu}</Select.Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span={6}><Label>Цена</Label>
                <FormItem key={'price'} name={'price'} rules={[{required: true, message: 'Введите цену'}]}>
                  <Input placeholder='цена' onChange={getPrice} />
                </FormItem>
              </Col>
              <Col span={6}><Label>Валюта</Label>
                <FormItem key={'currencyId'} name={'currencyId'} rules={[{required: true, message: 'Выберите валюту'}]}>
                  <Select placeholder='валюта'>
                    {currencyList.map(currency => <Select.Option key={currency.id} value={currency.id}>{currency.nameRu}</Select.Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span={6}><Label>Курс</Label>
                <FormItem key={'rate'} name={'rate'} rules={[{required: true, message: 'Введите курса'}]} >
                  <InputNumber placeholder='курс' onChange={getRate} precision={4} />
                </FormItem>
              </Col>
              <Col span={6}><Label>Конечное цена (USD)</Label>
                <FormItem key={'finalPrice'} name={'finalPrice'} rules={[{required: true, message: 'Введите конечную цену'}]}>
                  <InputNumber placeholder='конечное цена' precision={2} />
                </FormItem>
              </Col>
              <Col span={8}><Label>Номер транспорта</Label>
                <FormItem key={'shippingNum'} name={'shippingNum'} rules={[{required: true, message: 'Введите номер транспорта'}]}>
                  <Input placeholder='номер транспорта' />
                </FormItem>
              </Col>
              <Col span={16}><Label>Грузы</Label>
                <FormItem key={'cargoList'} name={'cargoList'} rules={[{required: true, message: 'Выберите грузы'}]}>
                  <TreeSelect treeData={selectOrderList} treeCheckable={true} />
                  {/*<Select placeholder='гурзы'>
                    {selectOrderList.map(order => <Select.Option key={order.id} value={order.id}>{order.num}</Select.Option>)}
                  </Select>*/}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8} key={'load'} className={'sides'}>
                <Typography.Title level={5}>Место загрузки</Typography.Title>
                <Label>Дата и время загрузки</Label>
                <Form.Item key={'loadDate'} name={'loadDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
                <Label>Станция отправления</Label>
                <Form.Item key={'loadStation'} name={'loadStation'}><Input placeholder='станция'/></Form.Item>
                <Label>Дата и время отправления</Label>
                <Form.Item key={'loadSendDate'} name={'loadSendDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
              </Col>
              <Col span={8} key={'custom'} className={'sides'}>
                <Typography.Title level={5}>Пограничный переход</Typography.Title>
                <Label>Дата и время прибытия</Label>
                <Form.Item key={'customArrivalDate'} name={'customArrivalDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
                <Label>Станция погран перехода</Label>
                <Form.Item key={'customStation'} name={'customStation'}><Input placeholder='станция'/></Form.Item>
                <Label>Дата и время отправления</Label>
                <Form.Item key={'customSendDate'} name={'customSendDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
              </Col>
              <Col span={8} key={'unload'} className={'sides-l'}>
                <Typography.Title level={5}>Место разгрузки</Typography.Title>
                <Label>Дата и время прибытия</Label>
                <Form.Item key={'unloadArrivalDate'} name={'unloadArrivalDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
                <Label>Станция прибытия</Label>
                <Form.Item key={'unloadStation'} name={'unloadStation'}><Input placeholder='станция'/></Form.Item>
                <Label>Дата и время разгрузки</Label>
                <Form.Item key={'unloadDate'} name={'unloadDate'}><DatePicker showTime format={'DD.MM.YYYY HH:mm'} locale={locale} placeholder='дата и время'/></Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    };
    return (
      <div className="order-page">
        <Card style={{width: '100%'}} bordered={false}>
          <Tabs onChange={onChange} defaultActiveKey="Shipping">
            <TabPane tab="Заказы" key="/order">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Грузы" key="/order/cargo">Подождите пожалуйста ...</TabPane>
            <TabPane tab="Рейсы" key="Shipping"><TabBody /></TabPane>
          </Tabs>
          <Form.Provider onFormFinish={handleSubmit}><ShippingModal/></Form.Provider>
        </Card>
      </div>
    );
  }
}

export default Shipping;
